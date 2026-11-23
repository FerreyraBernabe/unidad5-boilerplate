import { useState } from 'react';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import ConfirmModal from '../../shared/components/ConfirmModal';
import TablePagination from '../../shared/components/TablePagination';
import { parseApiError } from '../../shared/api/apiError';
import { getInitials } from '../../shared/helpers/getInitials';
import AddAvailabilityModal from '../../availabilities/components/AddAvailabilityModal';
import { useSpecialties } from '../../specialties/hooks/useSpecialties';
import AddDoctorModal from '../components/AddDoctorModal';
import { useDoctors } from '../hooks/useDoctors';

function DoctorsPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const {
    doctors,
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
    refetch,
  } = useDoctors({ initialPageSize: 10 });

  const {
    specialties,
    loading: loadingSpecialties,
    error: specialtiesError,
  } = useSpecialties({ initialPageSize: 100 });

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) {
      return;
    }

    setIsDeleting(true);
    setActionError(null);

    try {
      await remove({ doctorId: doctorToDelete.id });
      setDoctorToDelete(null);
    } catch (err) {
      setActionError(
        parseApiError(err, 'No se pudo eliminar el doctor seleccionado.')
      );
      setDoctorToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Directorio de Doctores
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Gestione el personal médico, especialidades asignadas y
            disponibilidad horaria.
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
              placeholder="Buscar doctor por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-med-border bg-white py-2 pl-9 pr-3 text-xs text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            onClick={() => setActiveModal('availability')}
            className="flex items-center gap-2 bg-med-primary-900 text-white hover:bg-med-primary-800"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Agregar Disponibilidad Horaria</span>
          </Button>

          <Button
            onClick={() => setActiveModal('create')}
            className="flex items-center gap-1.5 bg-med-primary-700 font-medium text-white hover:bg-med-primary-800"
          >
            <span>+</span>
            <span>Nuevo Doctor</span>
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
            Registros de Doctores
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
              <tr>
                <th className="px-6 py-3.5">Nombre del Doctor</th>
                <th className="px-6 py-3.5">Especialidad</th>
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
                    Cargando doctores...
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-med-text-muted"
                  >
                    No se encontraron doctores.
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => {
                  const specialtyName =
                    doc.specialty?.name ??
                    doc.speciality?.name ??
                    'Sin especialidad';

                  return (
                    <tr
                      key={doc.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-med-primary-100 text-xs font-bold text-med-primary-700">
                            {getInitials(doc.name)}
                          </div>
                          <div>
                            <p className="font-semibold leading-tight text-med-primary-900">
                              {doc.name}
                            </p>
                            {doc.licenseNumber && (
                              <p className="mt-0.5 text-xs text-med-text-muted">
                                Matrícula: {doc.licenseNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-med-primary-100 px-3 py-1 text-xs font-semibold text-med-primary-700">
                          {specialtyName}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {!doc.deleted ? (
                          <span className="inline-block rounded-full bg-med-active-bg px-3 py-1 text-xs font-semibold text-med-active-text">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                            Inactivo
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-med-text-muted">
                          <button
                            type="button"
                            title="Editar doctor"
                            aria-label={`Editar doctor ${doc.name}`}
                            className="rounded-lg p-1.5 text-med-text-muted transition hover:bg-med-primary-50 hover:text-med-primary-900"
                            onClick={() => setEditingDoctor(doc)}
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
                            title="Eliminar doctor"
                            aria-label={`Eliminar doctor ${doc.name}`}
                            className="rounded-lg p-1.5 text-med-text-muted transition hover:bg-red-50 hover:text-med-danger-text"
                            onClick={() => setDoctorToDelete(doc)}
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
                  );
                })
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

      {activeModal === 'create' && (
        <AddDoctorModal
          onCancel={() => setActiveModal(null)}
          onSubmitDoctor={create}
          specialties={specialties}
          loadingSpecialties={loadingSpecialties}
          specialtiesError={specialtiesError}
        />
      )}

      {editingDoctor && (
        <AddDoctorModal
          initialDoctor={editingDoctor}
          onCancel={() => setEditingDoctor(null)}
          onSubmitDoctor={(payload) => update(editingDoctor.id, payload)}
          specialties={specialties}
          loadingSpecialties={loadingSpecialties}
          specialtiesError={specialtiesError}
        />
      )}

      {activeModal === 'availability' && (
        <AddAvailabilityModal
          onClose={() => setActiveModal(null)}
          doctors={doctors}
          onSaved={refetch}
        />
      )}

      {doctorToDelete && (
        <ConfirmModal
          title="Eliminar doctor"
          confirmLabel="Sí, eliminar"
          loadingLabel="Eliminando..."
          isLoading={isDeleting}
          onCancel={() => setDoctorToDelete(null)}
          onConfirm={handleConfirmDelete}
        >
          ¿Seguro que desea dar de baja al profesional{' '}
          <strong className="text-med-text-main">{doctorToDelete.name}</strong>?
        </ConfirmModal>
      )}
    </div>
  );
}

export default DoctorsPage;
