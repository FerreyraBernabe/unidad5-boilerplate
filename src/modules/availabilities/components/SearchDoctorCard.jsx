export default function SearchDoctorCard({
  doctors = [],
  selectedDoctorId,
  onSelect,
  loading = false,
  error = null,
  disabled = false,
}) {
  const selectedDoctor = doctors.find((doc) => doc.id === selectedDoctorId);
  const specialtyName =
    selectedDoctor?.specialty?.name ?? selectedDoctor?.speciality?.name;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="availability-doctor"
          className="text-xs font-semibold text-med-text-main"
        >
          Seleccionar profesional
        </label>
        <select
          id="availability-doctor"
          value={selectedDoctorId}
          disabled={loading || disabled}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full text-sm"
        >
          <option value="">
            {loading ? 'Cargando doctores...' : 'Seleccione un doctor'}
          </option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
        {error && (
          <p role="alert" className="text-xs font-medium text-red-500">
            {error.message}
          </p>
        )}
      </div>

      {selectedDoctor && (
        <section className="flex items-center gap-3 rounded-lg bg-med-primary-50 p-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-med-primary-100 text-xs font-bold text-med-primary-700"
          >
            {selectedDoctor.name
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')
              .toUpperCase()}
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-sm font-semibold text-med-primary-900">
              {selectedDoctor.name}
            </p>
            {specialtyName && (
              <p className="text-xs text-med-text-sub">{specialtyName}</p>
            )}
            {selectedDoctor.licenseNumber && (
              <p className="text-xs text-med-text-muted">
                Matrícula: {selectedDoctor.licenseNumber}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
