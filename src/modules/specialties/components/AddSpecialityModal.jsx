import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Modal from '../../shared/components/Modal';
import { parseApiError } from '../../shared/api/apiError';

export default function AddSpecialityModal({
  onCancel,
  onSubmitSpecialty,
  initialSpecialty = null,
}) {
  const [apiError, setApiError] = useState(null);
  const isEditMode = Boolean(initialSpecialty);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialSpecialty?.name ?? '',
      description: initialSpecialty?.description ?? '',
    },
    mode: 'onBlur',
  });

  const onValid = async (formData) => {
    setApiError(null);

    try {
      await onSubmitSpecialty({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      onCancel();
    } catch (err) {
      setApiError(
        parseApiError(
          err,
          isEditMode
            ? 'No se pudo actualizar la especialidad.'
            : 'No se pudo registrar la especialidad.'
        )
      );
    }
  };

  return (
    <Modal
      titleId="speciality-modal-title"
      title={
        isEditMode ? 'Editar Especialidad' : 'Registrar Nueva Especialidad'
      }
      subtitle="Complete la información para configurar la especialidad médica en el sistema."
      onClose={onCancel}
      disableClose={isSubmitting}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" form="specialty-form" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Especialidad'}
          </Button>
        </>
      }
    >
      <form
        id="specialty-form"
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          id="specialty-name"
          label="Nombre de la Especialidad"
          type="text"
          placeholder="Ej. Cardiología Intervencionista"
          error={errors.name?.message}
          {...register('name', {
            required: 'El nombre es obligatorio.',
            validate: (value) => {
              const len = value.trim().length;

              if (len < 3) {
                return 'El nombre debe tener al menos 3 caracteres.';
              }

              if (len > 100) {
                return 'El nombre no puede superar los 100 caracteres.';
              }

              return true;
            },
          })}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="specialty-description"
            className="text-xs font-semibold text-med-text-main"
          >
            Descripción
          </label>
          <textarea
            id="specialty-description"
            rows={4}
            placeholder="Detalle el alcance de la especialidad y los procedimientos principales..."
            className={`w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-med-text-main placeholder-med-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
              errors.description
                ? 'border-red-400 bg-red-50/20'
                : 'border-med-border'
            }`}
            {...register('description', {
              required: 'La descripción es obligatoria.',
              validate: (value) => {
                const len = value.trim().length;

                if (len < 10) {
                  return 'La descripción debe tener al menos 10 caracteres.';
                }

                if (len > 100) {
                  return 'La descripción no puede superar los 100 caracteres.';
                }

                return true;
              },
            })}
          />
          {errors.description && (
            <p className="text-xs font-medium text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {apiError && (
          <Alert
            variant="error"
            message={apiError.message}
            details={apiError.details}
            onClose={() => setApiError(null)}
          />
        )}
      </form>
    </Modal>
  );
}
