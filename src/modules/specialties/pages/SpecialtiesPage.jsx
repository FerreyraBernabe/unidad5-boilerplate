import { useState } from 'react';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import ConfirmModal from '../../shared/components/ConfirmModal';
import TablePagination from '../../shared/components/TablePagination';
import { parseApiError } from '../../shared/api/apiError';
import AddSpecialityModal from '../components/AddSpecialityModal';
import SpecialtyIcon from '../components/SpecialtyIcon';
import { useSpecialties } from '../hooks/useSpecialties';

function SpecialtiesPage() {
  const [isNewSpecialityModalOpen, setIsNewSpecialityModalOpen] =
    useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [specialtyToDelete, setSpecialtyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const {
    specialties,
    create,
    update,
    remove,
    total,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    pageIndex,
    pageSize,
    totalPages,
    goToPage,
  } = useSpecialties({ initialPageSize: 10 });

  const handleConfirmDelete = async () => {
    if (!specialtyToDelete) {
      return;
    }

    setIsDeleting(true);
    setActionError(null);

    try {
      await remove({ specialtyId: specialtyToDelete.id });
      setSpecialtyToDelete(null);
    } catch (err) {
      setActionError(
        parseApiError(err, 'No se pudo eliminar la especialidad seleccionada.')
      );
      setSpecialtyToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Directorio de Especialidades
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Administre las categorías médicas, servicios y disponibilidad del
            personal especializado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-med-border bg-white py-2 pl-9 pr-3 text-xs text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            onClick={() => setIsNewSpecialityModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      {error && <Alert variant="error" message={error.message} />}

      {actionError && (
        <Alert
          variant="error"
          message={actionError.message}
          details={actionError.details}
          onClose={() => setActionError(null)}
        />
      )}

      <Card className="overflow-hidden border-med-border p-0">
        <div className="border-b border-med-border p-5">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
              <tr>
                <th className="px-6 py-3.5">Nombre de la Especialidad</th>
                <th className="px-6 py-3.5">Descripción</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-med-text-muted"
                  >
                    Cargando especialidades...
                  </td>
                </tr>
              ) : specialties.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-med-text-muted"
                  >
                    No se encontraron especialidades.
                  </td>
                </tr>
              ) : (
                specialties.map((spec) => (
                  <tr
                    key={spec.id}
                    className="transition-colors hover:bg-gray-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-med-primary-100 text-xs font-bold text-med-primary-700">
                          <SpecialtyIcon name={spec.name} />
                        </div>
                        <span className="font-semibold text-med-primary-900">
                          {spec.name}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-md px-6 py-4 text-med-text-sub">
                      {spec.description}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {spec.isActive !== false ? (
                        <span className="inline-block rounded-full bg-med-active-bg px-3 py-1 text-xs font-semibold text-med-active-text">
                          Activa
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                          Inactiva
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-med-text-muted">
                        <button
                          type="button"
                          title="Editar especialidad"
                          aria-label={`Editar especialidad ${spec.name}`}
                          className="rounded-lg p-1.5 text-med-text-muted transition hover:bg-med-primary-50 hover:text-med-primary-900"
                          onClick={() => setEditingSpecialty(spec)}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          title="Eliminar especialidad"
                          aria-label={`Eliminar especialidad ${spec.name}`}
                          className="rounded-lg p-1.5 text-med-text-muted transition hover:bg-red-50 hover:text-med-danger-text"
                          onClick={() => setSpecialtyToDelete(spec)}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={pageIndex}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={goToPage}
        />
      </Card>

      {isNewSpecialityModalOpen && (
        <AddSpecialityModal
          onCancel={() => setIsNewSpecialityModalOpen(false)}
          onSubmitSpecialty={create}
        />
      )}

      {editingSpecialty && (
        <AddSpecialityModal
          initialSpecialty={editingSpecialty}
          onCancel={() => setEditingSpecialty(null)}
          onSubmitSpecialty={(payload) => update(editingSpecialty.id, payload)}
        />
      )}

      {specialtyToDelete && (
        <ConfirmModal
          title="Eliminar especialidad"
          confirmLabel="Sí, eliminar"
          loadingLabel="Eliminando..."
          isLoading={isDeleting}
          onCancel={() => setSpecialtyToDelete(null)}
          onConfirm={handleConfirmDelete}
        >
          ¿Seguro que desea eliminar la especialidad{' '}
          <strong className="text-med-text-main">
            {specialtyToDelete.name}
          </strong>
          ?
        </ConfirmModal>
      )}
    </div>
  );
}

export default SpecialtiesPage;
