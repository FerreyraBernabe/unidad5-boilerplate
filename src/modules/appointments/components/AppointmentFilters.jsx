import { useState } from 'react';
import Button from '../../shared/components/Button';
import { doctorsOfSpecialty, isValidDni } from '../helpers/appointments';

const EMPTY_FILTERS = { dni: '', specialtyId: '', doctorId: '', date: '' };

const fieldClass =
  'w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600';

// El formulario guarda un borrador: recién se busca al apretar "Buscar".
export default function AppointmentFilters({
  specialties,
  doctors,
  onSearch,
  disabled = false,
}) {
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [dniError, setDniError] = useState('');

  const visibleDoctors = doctorsOfSpecialty(doctors, draft.specialtyId);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));

    if (field === 'dni') {
      setDniError('');
    }
  };

  const handleSpecialtyChange = (value) => {
    // Al cambiar de especialidad se limpia el doctor elegido.
    setDraft((prev) => ({ ...prev, specialtyId: value, doctorId: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (draft.dni.trim() && !isValidDni(draft.dni)) {
      setDniError('El DNI debe tener 7 u 8 dígitos, sin puntos.');

      return;
    }

    onSearch({ ...draft, dni: draft.dni.trim() });
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    setDniError('');
    onSearch(EMPTY_FILTERS);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mt-4 grid grid-cols-1 items-start gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-dni"
            className="text-xs font-semibold text-med-text-sub"
          >
            DNI del Paciente
          </label>
          <input
            id="filter-dni"
            type="text"
            inputMode="numeric"
            value={draft.dni}
            onChange={(e) => handleChange('dni', e.target.value)}
            placeholder="Ej: 40123456"
            className={`${fieldClass} ${dniError ? 'border-red-400' : ''}`}
          />
          {dniError && (
            <p role="alert" className="text-xs font-medium text-red-500">
              {dniError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-specialty"
            className="text-xs font-semibold text-med-text-sub"
          >
            Especialidad
          </label>
          <select
            id="filter-specialty"
            value={draft.specialtyId}
            onChange={(e) => handleSpecialtyChange(e.target.value)}
            className={fieldClass}
          >
            <option value="">Todas las especialidades</option>
            {specialties.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-doctor"
            className="text-xs font-semibold text-med-text-sub"
          >
            Doctor
          </label>
          <select
            id="filter-doctor"
            value={draft.doctorId}
            onChange={(e) => handleChange('doctorId', e.target.value)}
            className={fieldClass}
          >
            <option value="">Todos los doctores</option>
            {visibleDoctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-date"
            className="text-xs font-semibold text-med-text-sub"
          >
            Fecha
          </label>
          <input
            id="filter-date"
            type="date"
            value={draft.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={disabled}
        >
          Limpiar
        </Button>
        <Button
          type="submit"
          disabled={disabled}
          className="bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buscar
        </Button>
      </div>
    </form>
  );
}
