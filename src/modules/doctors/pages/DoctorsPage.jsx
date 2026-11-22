import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import AddAvailabilityModal from '../../availabilities/components/AddAvailabilityModal';
import { useSpecialties } from '../../specialties/hooks/useSpecialties';
import AddDoctorModal from '../components/AddDoctorModal';
import { useDoctors } from '../hooks/useDoctors';

const getInitials = (firstName = '', lastName = '') => {
  const fullName = `${firstName} ${lastName}`.trim();
  if (!fullName) return 'DR';

  const parts = fullName.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

function DoctorsPage() {
  const [activeModal, setActiveModal] = useState(null);

  const {
    doctors,
    create,
    total,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    pageIndex,
    pageSize,
    totalPages,
    goToPage,
  } = useDoctors({ initialPageSize: 10 });

  const {
    specialties,
    loading: loadingSpecialties,
    error: specialtiesError,
  } = useSpecialties({ initialPageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera con Título, Buscador y Acciones */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico, especialidades asignadas y
            disponibilidad horaria.
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
              placeholder="Buscar doctor por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            onClick={() => setActiveModal('availability')}
            className="flex items-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Agregar Disponibilidad Horaria</span>
          </Button>

          <Button
            onClick={() => setActiveModal('create')}
            className="flex items-center gap-1.5 bg-med-primary-700 hover:bg-med-primary-800 text-white font-medium"
          >
            <span>+</span>
            <span>Nuevo Doctor</span>
          </Button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error.message}
        </div>
      )}

      {/* Tabla Principal de Doctores */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
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
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {getInitials(doc.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-med-primary-900 leading-tight">
                              {doc.name}
                            </p>
                            {doc.licenseNumber && (
                              <p className="text-xs text-med-text-muted mt-0.5">
                                Matrícula: {doc.licenseNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                          {specialtyName}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {!doc.deleted ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                            Inactivo
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          title="Eliminar doctor"
                          aria-label={`Eliminar doctor ${doc.name}`}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-med-text-muted hover:text-med-danger-text transition"
                          onClick={() => alert(`Eliminar doctor ${doc.name}`)}
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

      {activeModal === 'availability' && (
        <AddAvailabilityModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}

export default DoctorsPage;
