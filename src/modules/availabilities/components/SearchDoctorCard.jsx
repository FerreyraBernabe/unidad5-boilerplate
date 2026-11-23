import { useEffect } from 'react';
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
          className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
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
        <section className="flex flex-row items-center bg-sky-100/80 p-3 rounded-lg gap-3">
          <div className="w-10 h-10 rounded-xl bg-med-primary-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
            DR
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-med-primary-900">
              {selectedDoctor.name}
            </p>
            <p className="text-xs text-med-text-sub">
              Matrícula: {selectedDoctor.licenseNumber ?? 'S/N'}
            </p>
            <p className="text-xs text-med-primary-700 font-medium">
              {selectedDoctor.specialty?.name}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
