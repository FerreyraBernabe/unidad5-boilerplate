import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import { useSpecialties } from '../../specialties/hooks/useSpecialties';
import { useDoctors } from '../../doctors/hooks/useDoctors';
import { useAppointments } from '../hooks/useAppointments';
import { formatDate, formatTime } from '../helpers/appointments';
import AppointmentFilters from '../components/AppointmentFilters';
import AppointmentDetailModal from '../components/AppointmentDetailModal';
import StatusBadge from '../components/StatusBadge';

function AppointmentsSearchPage() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { specialties } = useSpecialties({ initialPageSize: 100 });
  const { doctors } = useDoctors({ initialPageSize: 100 });

  const {
    appointments,
    total,
    loading,
    error,
    filters,
    pageIndex,
    pageSize,
    totalPages,
    goToPage,
    applyFilters,
  } = useAppointments({ initialPageSize: 10 });

  // Chips de los filtros que están aplicados en este momento.
  const activeFilters = [
    filters.dni && { key: 'dni', label: `DNI: ${filters.dni}` },
    filters.specialtyId && {
      key: 'specialtyId',
      label: `Especialidad: ${
        specialties.find((item) => item.id === filters.specialtyId)?.name ?? ''
      }`,
    },
    filters.doctorId && {
      key: 'doctorId',
      label: `Doctor: ${
        doctors.find((item) => item.id === filters.doctorId)?.name ?? ''
      }`,
    },
    filters.date && {
      key: 'date',
      label: `Fecha: ${formatDate(filters.date)}`,
    },
  ].filter(Boolean);

  const removeFilter = (key) => {
    applyFilters({ [key]: '' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Combine los filtros que necesite para encontrar turnos.
        </p>
      </div>

      <Card className="p-6">
        <div className="pb-4 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de Búsqueda
          </h2>
        </div>

        <AppointmentFilters
          specialties={specialties}
          doctors={doctors}
          onSearch={applyFilters}
          disabled={loading}
        />

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
            <span className="text-xs text-med-text-muted">
              Filtros activos:
            </span>
            {activeFilters.map((item) => (
              <span
                key={item.key}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800"
              >
                {item.label}
                <button
                  type="button"
                  onClick={() => removeFilter(item.key)}
                  aria-label={`Quitar filtro ${item.label}`}
                  className="text-sky-800/70 hover:text-sky-900"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error.message}
            <Button
              variant="outline"
              className="ml-3 text-xs"
              onClick={() => applyFilters({})}
            >
              Reintentar
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5">Paciente</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-med-text-muted"
                  >
                    Buscando citas...
                  </td>
                </tr>
              )}

              {!loading && !error && appointments.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-med-text-muted"
                  >
                    No se encontraron citas con esos criterios.
                  </td>
                </tr>
              )}

              {!loading &&
                appointments.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-med-primary-900 text-sm">
                        {formatDate(item.date)}
                      </p>
                      <p className="text-xs text-med-text-muted mt-0.5">
                        {formatTime(item.startTime)} HS
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-med-primary-900">
                        {item.doctor.specialty.name}
                      </p>
                      <p className="text-xs text-med-text-muted">
                        {item.doctor.name}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-med-text-main">
                        {item.patientName}
                      </p>
                      <p className="text-xs text-med-text-muted mt-0.5">
                        DNI: {item.patient.dni}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={item.appointmentStatus} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(item)}
                        className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900 transition hover:underline"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
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

      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}

export default AppointmentsSearchPage;
