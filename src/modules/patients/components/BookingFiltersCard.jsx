import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';

export default function BookingFiltersCard({
  specialties,
  doctors,
  selectedSpecialtyId,
  onSelectSpecialty,
  selectedDoctorId,
  onSelectDoctor,
  loadingSpecialties,
  loadingDoctors,
  loadingSlots,
  onRefreshSlots,
}) {
  return (
    <Card className="p-5 sm:p-7">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-med-primary-900 sm:text-3xl">
          Reservar Turno Médico
        </h1>
        <p className="mt-1 text-xs text-med-text-sub sm:text-sm">
          Seleccione la especialidad y el profesional para consultar horarios
          disponibles.
        </p>
      </div>

      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
        <div className="flex flex-col gap-1.5 md:col-span-5">
          <label
            htmlFor="booking-specialty"
            className="text-xs font-semibold text-med-text-sub"
          >
            Seleccionar Especialidad
          </label>
          <select
            id="booking-specialty"
            value={selectedSpecialtyId}
            disabled={loadingSpecialties}
            onChange={(event) => onSelectSpecialty(event.target.value)}
            className="w-full cursor-pointer rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-50"
          >
            {loadingSpecialties ? (
              <option value="">Cargando especialidades...</option>
            ) : specialties.length === 0 ? (
              <option value="">Sin especialidades activas</option>
            ) : (
              specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-4">
          <label
            htmlFor="booking-doctor"
            className="text-xs font-semibold text-med-text-sub"
          >
            Seleccionar Doctor
          </label>
          <select
            id="booking-doctor"
            value={selectedDoctorId}
            disabled={loadingDoctors || doctors.length === 0}
            onChange={(event) => onSelectDoctor(event.target.value)}
            className="w-full cursor-pointer rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-50"
          >
            {loadingDoctors ? (
              <option value="">Cargando doctores...</option>
            ) : doctors.length === 0 ? (
              <option value="">Sin doctores disponibles</option>
            ) : (
              doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="md:col-span-3">
          <Button
            type="button"
            disabled={!selectedDoctorId || loadingSlots}
            className="flex w-full items-center justify-center gap-2 py-2.5 disabled:opacity-60"
            onClick={onRefreshSlots}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>
              {loadingSlots ? 'Buscando...' : 'Buscar Disponibilidad'}
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
