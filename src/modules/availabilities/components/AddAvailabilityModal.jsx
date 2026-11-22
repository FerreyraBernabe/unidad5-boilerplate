import { useEffect, useState } from 'react';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { parseApiError } from '../../shared/api/apiError';
import { useDoctors } from '../../doctors/hooks/useDoctors';
import { useAvailabilities } from '../hooks/useAvailabilities';
import { hasValidationErrors, validateSchedules } from '../helpers/schedules';
import AvailabilityTable from './AvailabilityTable';
import SearchDoctorCard from './SearchDoctorCard';
import ExtraInfoCard from './ExtraInfoCard';

const NO_ERRORS = { byDay: {}, general: null };

export default function AddAvailabilityModal({ onClose }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [validation, setValidation] = useState(NO_ERRORS);
  const [apiError, setApiError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    doctors,
    loading: loadingDoctors,
    error: doctorsError,
  } = useDoctors({ initialPageSize: 100 });

  const {
    schedules,
    setSchedules,
    loading: loadingSchedules,
    error: schedulesError,
    save,
  } = useAvailabilities(selectedDoctorId);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSaving && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSaving, onClose]);

  const handleSelectDoctor = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setValidation(NO_ERRORS);
    setApiError(null);
  };

  const handleSchedulesChange = (nextSchedules) => {
    setSchedules(nextSchedules);
    setValidation(NO_ERRORS);
    setApiError(null);
  };

  const handleSave = async () => {
    if (!selectedDoctorId) {
      setValidation({ byDay: {}, general: 'Seleccione un profesional.' });

      return;
    }

    const result = validateSchedules(schedules);

    if (hasValidationErrors(result)) {
      setValidation(result);

      return;
    }

    setIsSaving(true);
    setApiError(null);

    try {
      await save();
      onClose();
    } catch (err) {
      setApiError(parseApiError(err, 'No se pudo guardar la disponibilidad.'));
      setIsSaving(false);
    }
  };

  const visibleError = apiError ?? schedulesError;
  const busy = isSaving || loadingSchedules;

  return (
    <div
      onClick={(e) => {
        if (!isSaving && e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="availability-modal-title"
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-med-bg shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-med-border-subtle bg-white px-5 py-5 sm:px-7">
          <div>
            <h2
              id="availability-modal-title"
              className="text-xl font-bold tracking-tight text-med-primary-900 sm:text-2xl"
            >
              Gestionar Disponibilidad Horaria
            </h2>
            <p className="mt-1 text-sm leading-6 text-med-text-sub">
              Defina los días y rangos horarios de atención para el profesional
              seleccionado.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Cerrar modal"
            className="shrink-0 rounded-lg p-2 text-med-text-muted transition hover:bg-med-primary-50 hover:text-med-primary-900 disabled:opacity-40"
          >
            ✕
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:flex-row sm:p-6">
          <div className="flex flex-col gap-4 md:w-72 md:shrink-0">
            <Card>
              <SearchDoctorCard
                doctors={doctors}
                selectedDoctorId={selectedDoctorId}
                onSelect={handleSelectDoctor}
                loading={loadingDoctors}
                error={doctorsError}
                disabled={isSaving}
              />
            </Card>
            <Card>
              <ExtraInfoCard />
            </Card>
          </div>

          <section className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-med-text-main">
                Configuración de Horarios
              </span>
              <span className="text-xs text-med-text-muted">
                Intervalos de 30 minutos
              </span>
            </div>

            {(validation.general || visibleError) && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {validation.general ?? visibleError.message}
              </div>
            )}

            {loadingSchedules ? (
              <p className="py-8 text-center text-sm text-med-text-muted">
                Cargando disponibilidad...
              </p>
            ) : (
              <AvailabilityTable
                schedules={schedules}
                onChange={handleSchedulesChange}
                errors={validation.byDay}
                disabled={isSaving}
              />
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-med-border pt-4 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="disabled:opacity-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={busy || !selectedDoctorId}
                className="disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Guardar Disponibilidad'}
              </Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
