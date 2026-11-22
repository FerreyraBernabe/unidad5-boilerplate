import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useSpecialties } from '../../specialties/hooks/useSpecialties';
import { useDoctors } from '../../doctors/hooks/useDoctors';
import { useAppointments } from '../hooks/useAppointments';
import TablePagination from '../../shared/components/TablePagination';

function AppointmentsSearchPage() {
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const { specialties } = useSpecialties({
    initialPageSize: 100,
  });
  const { doctors } = useDoctors({
    initialPageSize: 100,
  });
  const {
    appointments,
    total,
    loading,
    pageIndex,
    pageSize,
    totalPages,
    goToPage,
    applyFilters,
  } = useAppointments({ initialPageSize: 10 });
  const [patientQuery, setPatientQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  return (
    <div className="flex flex-col gap-6">
      {/* Título de la página */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      {/* Card Superior: Criterios de Búsqueda */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de Búsqueda
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-med-text-muted">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Última actualización: hace un momento</span>
          </div>
        </div>

        {/* Inputs de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end">
          {/* Nombre o DNI */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Nombre o DNI del Paciente
            </label>
            <div className="relative">
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
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder="Nombre o DNI..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
              />
            </div>
          </div>

          {/* Especialidad */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Especialidad
            </label>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="">Seleccione una especialidad</option>
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Doctor
            </label>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="Todos">Todos los Doctores</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Fecha
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          {/* Botón Aplicar Filtros */}
          <div>
            <Button
              onClick={() =>
                applyFilters({
                  dni: patientQuery,
                  specialtyId: specialtyFilter,
                  doctorId: doctorFilter,
                  date: dateFilter,
                })
              }
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2 rounded-lg"
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Aplicar Filtros</span>
            </Button>
          </div>
        </div>

        {/* Chips de Filtros Activos */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
            Paciente: Johnathan Doe
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
            DNI: 40.123.456
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Filtro Activo: Próximos 7 Días
          </span>
        </div>
      </Card>

      {/* Card Inferior: Registros de Citas */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>

        {/* Tabla de Citas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5">Departamento</th>
                <th className="px-6 py-3.5">Paciente</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {appointments.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {/* Fecha y Hora */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-med-primary-900 text-sm">
                      {item.date}
                    </p>
                    <p className="text-xs text-med-text-muted mt-0.5">
                      {item.startTime}
                    </p>
                  </td>

                  {/* Departamento / Especialidad con Icono */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
                        :D
                      </div>
                      <div>
                        <p className="font-semibold text-med-primary-900">
                          {item.specialityName}
                        </p>
                        <p className="text-xs text-med-text-muted">
                          {item.doctorName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Paciente y DNI */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-med-text-main">
                      {item.patientName}
                    </p>
                    <p className="text-xs text-med-text-muted mt-0.5">
                      DNI: {item.patientDni}
                    </p>
                  </td>

                  {/* Estado (CONFIRMADO, COMPLETADO, CANCELADO) */}
                  <td className="px-6 py-4 text-center">
                    {item.status === 'BOOKED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                        <span className="w-1.5 h-1.5 rounded-full bg-med-active-text" />
                        Agendado
                      </span>
                    )}
                    {item.status === 'ATTENDED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        Completado
                      </span>
                    )}
                    {item.status === 'CANCELLED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-danger-bg text-med-danger-text">
                        <span className="w-1.5 h-1.5 rounded-full bg-med-danger-text" />
                        Cancelado
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        alert(`Ver detalle de cita de ${item.patient}`)
                      }
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

        {/* Paginador inferior normalizado */}
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

export default AppointmentsSearchPage;
