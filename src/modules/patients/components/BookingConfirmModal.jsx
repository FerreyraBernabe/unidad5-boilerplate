import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import { parseApiError } from '../../shared/api/apiError';
import { createAppointment } from '../../appointments/services/getAppointments';

// El backend manda los detalles de validación en distintos formatos: se arma un texto por cada uno.
function detailToText(detail) {
  if (typeof detail === 'string') {
    return detail;
  }

  if (detail && typeof detail === 'object') {
    return (
      detail.message ??
      detail.description ??
      detail.item2 ??
      Object.values(detail)
        .filter((value) => typeof value === 'string')
        .join(': ')
    );
  }

  return '';
}

// Paso final de la reserva: pide el motivo, confirma con el backend y muestra el resultado.
function BookingConfirmModal({
  doctor,
  slot,
  dni,
  onClose,
  onBooked,
  onConflict,
  onGoToAppointments,
}) {
  const [apiError, setApiError] = useState(null);
  const [booked, setBooked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { reason: '' } });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  const onSubmit = async ({ reason }) => {
    setApiError(null);

    try {
      await createAppointment({
        doctorId: doctor.id,
        availabilitySlotId: slot.id,
        dni,
        reason,
      });
      setBooked(true);
      onBooked();
    } catch (err) {
      const parsed = parseApiError(err, 'No se pudo reservar el turno.');

      setApiError(parsed);

      // Otro paciente se quedó con el horario: se refresca la grilla.
      if (
        parsed.status === 409 ||
        parsed.errorCode === 'APPOINTMENT_CONFLICT'
      ) {
        onConflict();
      }
    }
  };

  const errorLines = apiError
    ? [apiError.message, ...apiError.details.map(detailToText)].filter(Boolean)
    : [];

  return (
    <div
      onClick={(e) => {
        if (!isSubmitting && e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        {booked ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-med-primary-900">
              ¡Turno Confirmado con Éxito!
            </h3>
            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              Tu turno con{' '}
              <strong className="text-med-text-main">{doctor.name}</strong> ha
              sido reservado para el{' '}
              <strong className="text-med-text-main">
                {slot.fullDate} a las {slot.time} hs
              </strong>
              .
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              {doctor.specialtyName && (
                <p>
                  <strong>Especialidad:</strong> {doctor.specialtyName}
                </p>
              )}
              <p>
                <strong>Paciente (DNI):</strong> {dni}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="w-full text-xs py-2.5"
                onClick={onGoToAppointments}
              >
                Ver Mis Turnos
              </Button>
              <Button
                variant="secondary"
                className="w-full text-xs py-2.5"
                onClick={onClose}
              >
                Reservar Otro
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h3 className="text-xl font-bold text-med-primary-900">
              Confirmar turno
            </h3>
            <p className="text-xs text-med-text-sub mt-1 leading-relaxed">
              {doctor.name} · {slot.fullDate}, {slot.time} hs
            </p>

            <div className="mt-5 flex flex-col gap-1.5">
              <label
                htmlFor="booking-reason"
                className="text-xs font-semibold text-med-text-main"
              >
                Motivo de la consulta
              </label>
              <textarea
                id="booking-reason"
                rows={3}
                placeholder="Ej: Control anual, dolor de cabeza frecuente..."
                disabled={isSubmitting}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
                  errors.reason ? 'border-red-400' : 'border-med-border'
                }`}
                {...register('reason', {
                  required: 'Ingresá el motivo de la consulta.',
                  validate: (value) =>
                    value.trim().length >= 5 ||
                    'El motivo debe tener al menos 5 caracteres.',
                  maxLength: {
                    value: 300,
                    message: 'El motivo no puede superar los 300 caracteres.',
                  },
                })}
              />
              {errors.reason && (
                <p role="alert" className="text-xs font-medium text-red-500">
                  {errors.reason.message}
                </p>
              )}
            </div>

            {!dni && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
              >
                No encontramos tu DNI en la sesión. Cerrá sesión y volvé a
                ingresar.
              </p>
            )}

            {errorLines.length > 0 && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 space-y-1"
              >
                {errorLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="outline"
                className="w-full text-xs py-2.5 disabled:opacity-50"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {apiError ? 'Cerrar' : 'Cancelar'}
              </Button>
              <Button
                type="submit"
                className="w-full text-xs py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting || !dni}
              >
                {isSubmitting ? 'Reservando...' : 'Confirmar Turno'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookingConfirmModal;
