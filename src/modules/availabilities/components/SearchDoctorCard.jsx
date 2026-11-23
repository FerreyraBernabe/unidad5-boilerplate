import { getInitials } from '../../shared/helpers/getInitials';

export default function SearchDoctorCard({
  doctors = [],
  selectedDoctorId,
  onSelectDoctor,
}) {
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="doctor-select"
          className="text-xs font-semibold text-med-text-main"
        >
          Seleccionar profesional
        </label>
        <select
          id="doctor-select"
          value={selectedDoctorId}
          onChange={(e) => onSelectDoctor(e.target.value)}
          className="w-full rounded-lg border border-med-border bg-white px-3 py-2 text-xs text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
        >
          <option value="">Seleccione un doctor...</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </div>
      {selectedDoctor && (
        <section className="flex flex-row items-center gap-3 rounded-lg bg-sky-100/80 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-med-primary-700 text-xs font-bold text-white">
            {getInitials(selectedDoctor.name)}
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-med-primary-900">
              {selectedDoctor.name}
            </p>
            <p className="text-xs text-med-text-sub">
              Matrícula: {selectedDoctor.licenseNumber ?? 'S/N'}
            </p>
            <p className="text-xs font-medium text-med-primary-700">
              {selectedDoctor.specialty?.name ??
                selectedDoctor.speciality?.name}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
