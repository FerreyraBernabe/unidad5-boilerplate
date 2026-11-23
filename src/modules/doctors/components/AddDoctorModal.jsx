import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Modal from '../../shared/components/Modal';
import { parseApiError } from '../../shared/api/apiError';

export default function AddDoctorModal({
  onCancel,
  onSubmitDoctor,
  specialties = [],
  loadingSpecialties = false,
  specialtiesError = null,
  initialDoctor = null,
}) {
  const [apiError, setApiError] = useState(null);
  const isEditMode = Boolean(initialDoctor);
  const initialSpecialtyId =
    initialDoctor?.specialty?.id ??
    initialDoctor?.specialty?.specialtyId ??
    initialDoctor?.speciality?.id ??
    '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialDoctor?.name ?? '',
      specialtyId: initialSpecialtyId,
      licenseNumber: initialDoctor?.licenseNumber ?? '',
    },
    mode: 'onBlur',
  });

  const onValid = async (formData) => {
    setApiError(null);

    try {
      await onSubmitDoctor({
        name: formData.name.trim(),
        specialtyId: formData.specialtyId,
        licenseNumber: formData.licenseNumber.trim(),
      });
      onCancel();
    } catch (err) {
      setApiError(
        parseApiError(
          err,
          isEditMode
            ? 'No se pudo actualizar el doctor.'
            : 'No se pudo registrar el doctor.'
        )
      );
    }
  };

  return (
    <Modal
      titleId="doctor-modal-title"
      title={isEditMode ? 'Editar Doctor' : 'Registrar Nuevo Doctor'}
      subtitle="Complete todos los campos obligatorios para configurar al profesional médico."
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
          <Button
            type="submit"
            form="doctor-form"
            disabled={isSubmitting || loadingSpecialties}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Doctor'}
          </Button>
        </>
      }
    >
      <form
        id="doctor-form"
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          id="doctor-name"
          label="Nombre Completo del Doctor"
          type="text"
          placeholder="Ej. Dr. Alejandro Martínez"
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
            htmlFor="doctor-specialty"
            className="text-xs font-semibold text-med-text-main"
          >
            Especialidad
          </label>
          <select
            id="doctor-specialty"
            disabled={loadingSpecialties}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-med-text-main focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-50 disabled:text-med-text-muted ${
              errors.specialtyId
                ? 'border-red-400 bg-red-50/20'
                : 'border-med-border'
            }`}
            {...register('specialtyId', {
              required: 'Debe seleccionar una especialidad.',
            })}
          >
            <option value="">
              {loadingSpecialties
                ? 'Cargando especialidades...'
                : 'Seleccione una especialidad'}
            </option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
          {errors.specialtyId && (
            <p className="text-xs font-medium text-red-500">
              {errors.specialtyId.message}
            </p>
          )}
          {specialtiesError && (
            <p className="text-xs font-medium text-red-500">
              {specialtiesError.message}
            </p>
          )}
        </div>

        <Input
          id="doctor-license"
          label="Número de Matrícula / Licencia"
          type="text"
          placeholder="Ej. MP-45920"
          error={errors.licenseNumber?.message}
          {...register('licenseNumber', {
            required: 'La matrícula es obligatoria.',
            validate: (value) => {
              const len = value.trim().length;

              if (len < 3) {
                return 'La matrícula debe tener al menos 3 caracteres.';
              }

              if (len > 50) {
                return 'La matrícula no puede superar los 50 caracteres.';
              }

              return true;
            },
          })}
        />

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
