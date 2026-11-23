import { useState } from 'react';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import TablePagination from '../../shared/components/TablePagination';
import { useDoctors } from '../../doctors/hooks/useDoctors';
import SpecialtyIcon from '../../specialties/components/SpecialtyIcon';
import { useSpecialties } from '../../specialties/hooks/useSpecialties';
import AppointmentDetailModal from '../components/AppointmentDetailModal';
import AppointmentFilters from '../components/AppointmentFilters';
import StatusBadge from '../components/StatusBadge';
import { formatDate, formatTime } from '../helpers/appointments';
import { useAppointments } from '../hooks/useAppointments';

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
        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="mt-1 text-sm text-med-text-sub">
          Combine los filtros que necesite para encontrar turnos.
        </p>
      </div>

      <Card className="p-6">
        <div className="border-b border-med-border-subtle pb-4">
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
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-med-border-subtle pt-3">
            <span className="text-xs text-med-text-muted">
              Filtros activos:
            </span>
            {activeFilters.map((item) => (
              <span
                key={item.key}
                className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/70 px-3 py-1 text-xs font-medium text-sky-800"
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

      <Card className="overflow-hidden border-med-border p-0">
        <div className="border-b border-med-border p-5">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>

        {error && (
          <div className="m-5">
            <Alert variant="error" message={error.message}>
              <Button
                variant="outline"
                className="mt-2 text-xs"
                onClick={() => applyFilters({})}
              >
                Reintentar
              </Button>
            </Alert>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
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
                appointments.map((item) => {
                  const id = item.appointmentId ?? item.id;
                  const specialtyName =
                    item.doctor?.specialty?.name ??
                    item.specialityName ??
                    'Sin especialidad';
                  const doctorName =
                    item.doctor?.name ?? item.doctorName ?? '-';
                  const patientName =
                    item.patient?.name ||
                    item.patientName ||
                    'Paciente registrado';
                  const patientDni =
                    item.patient?.dni ?? item.patientDni ?? '-';
                  const status = item.appointmentStatus ?? item.status;

                  return (
                    <tr
                      key={id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-med-primary-900">
                          {formatDate(item.date)}
                        </p>
                        <p className="mt-0.5 text-xs text-med-text-muted">
                          {formatTime(item.startTime)} HS
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-med-primary-100 text-med-primary-700">
                            <SpecialtyIcon name={specialtyName} />
                          </div>
                          <div>
                            <p className="font-semibold text-med-primary-900">
                              {specialtyName}
                            </p>
                            <p className="text-xs text-med-text-muted">
                              {doctorName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-med-text-main">
                          {patientName}
                        </p>
                        <p className="mt-0.5 text-xs text-med-text-muted">
                          DNI: {patientDni}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedAppointment(item)}
                          className="px-2.5 py-1 text-xs font-semibold text-med-primary-700 hover:text-med-primary-900"
                        >
                          Ver Detalle
                        </Button>
                      </td>
                    </tr>
                  );
                })}
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
