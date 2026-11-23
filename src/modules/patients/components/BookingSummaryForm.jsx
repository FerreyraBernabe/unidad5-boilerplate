import { useForm } from 'react-hook-form';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';

export default function BookingSummaryForm({
  selectedSlot,
  selectedDayLabel,
  currentDoctor,
  bookingError,
  onClearError,
  onConfirm,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { reason: '' },
    mode: 'onBlur',
  });

  const onValid = async (formData) => {
    const succeeded = await onConfirm(formData.reason);

    if (succeeded) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col gap-4 rounded-2xl border border-med-primary-200/70 bg-med-primary-50 p-5 sm:p-6"
      noValidate
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="border-l-4 border-med-primary-900 pl-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
            Resumen de Selección
          </span>
          {selectedSlot ? (
            <>
              <p className="mt-0.5 text-base font-bold text-med-primary-900 sm:text-lg">
                {selectedDayLabel}, {selectedSlot.startTime} hs
              </p>
              <p className="mt-0.5 text-xs text-med-text-sub">
                {currentDoctor?.name} • {currentDoctor?.specialty?.name} •
                Duración: 30 min
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-med-text-sub">
              Seleccioná un horario disponible en el calendario para reservar tu
              turno.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!selectedSlot || isSubmitting}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Confirmando...' : 'Confirmar Turno'}</span>
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="appointment-reason"
          className="text-xs font-semibold text-med-primary-900"
        >
          Motivo de la consulta (obligatorio, mínimo 5 caracteres)
        </label>
        <textarea
          id="appointment-reason"
          rows={2}
          placeholder="Ej: Control anual de presión arterial y revisión de estudios"
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-med-text-main placeholder-med-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
            errors.reason ? 'border-red-400 bg-red-50/20' : 'border-med-border'
          }`}
          {...register('reason', {
            required: 'El motivo de la consulta es obligatorio',
            validate: (value) => {
              const len = value.trim().length;

              if (len < 5) {
                return 'El motivo debe tener al menos 5 caracteres';
              }

              if (len > 300) {
                return 'El motivo no puede superar los 300 caracteres';
              }

              return true;
            },
          })}
        />
        {errors.reason && (
          <p className="text-xs font-medium text-red-500">
            {errors.reason.message}
          </p>
        )}
      </div>

      {bookingError && (
        <Alert
          variant="error"
          message={bookingError.message}
          details={bookingError.details}
          onClose={onClearError}
        />
      )}
    </form>
  );
}
