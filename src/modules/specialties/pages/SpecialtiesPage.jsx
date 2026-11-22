import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import AddSpecialityModal from '../components/AddSpecialityModal';
import { useSpecialties } from '../hooks/useSpecialties';
import TablePagination from '../../shared/components/TablePagination';
function SpecialtiesPage() {
  const [isNewSpecialityModalOpen, setIsNewSpecialityModalOpen] =
    useState(false);
  const {
    specialties,
    create,
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
  const handleOpenNewSpecialityModal = () => setIsNewSpecialityModalOpen(true);
  const handleCloseNewSpecialityModal = () =>
    setIsNewSpecialityModalOpen(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera con Título, Buscador y Botón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas, servicios y disponibilidad del
            personal especializado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
              <svg
                className="w-4 h-4"
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
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          {/* Botón Nueva Especialidad */}
          <Button
            onClick={handleOpenNewSpecialityModal}
            className="flex items-center gap-1.5 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium"
          >
            <span>+</span>
            <span>Nueva Especialidad</span>
          </Button>
        </div>
        {isNewSpecialityModalOpen && (
          <AddSpecialityModal
            onCancel={handleCloseNewSpecialityModal}
            onSubmitSpecialty={create}
          />
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error.message}
        </div>
      )}

      {/* Tabla Principal de Especialidades */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
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
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Nombre con icono en caja celeste */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {''}
                        </div>
                        <span className="font-semibold text-med-primary-900">
                          {spec.name}
                        </span>
                      </div>
                    </td>

                    {/* Descripción */}
                    <td className="px-6 py-4 text-med-text-sub max-w-md">
                      {spec.description}
                    </td>

                    {/* Estado (Activa / Inactiva) */}
                    <td className="px-6 py-4 text-center">
                      {spec.isActive ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                          Activa
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                          Inactiva
                        </span>
                      )}
                    </td>

                    {/* Acciones: Editar y Eliminar */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-med-text-muted">
                        <button
                          title="Editar especialidad"
                          className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-text-muted hover:text-med-primary-900 transition"
                          onClick={() =>
                            alert(`Editar especialidad ${spec.name}`)
                          }
                        >
                          <svg
                            className="w-4 h-4"
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
                          title="Eliminar especialidad"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-med-text-muted hover:text-med-danger-text transition"
                          onClick={() => remove({ specialtyId: spec.id })}
                        >
                          <svg
                            className="w-4 h-4"
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

        {/* Paginador normalizado idéntico a Búsqueda y Filtrado de Citas */}
        <TablePagination
          currentPage={pageIndex}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={goToPage}
        />
      </Card>
    </div>
  );
}

export default SpecialtiesPage;
