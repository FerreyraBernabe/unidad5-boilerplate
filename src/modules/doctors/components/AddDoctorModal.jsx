import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import { parseApiError } from '../../shared/api/apiError';

export default function AddDoctorModal({
  onCancel,
  onSubmitDoctor,
  specialties = [],
  loadingSpecialties = false,
  specialtiesError = null,
}) {
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', specialtyId: '', licenseNumber: '' },
    mode: 'onBlur',
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting && onCancel) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitting, onCancel]);

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
      setApiError(parseApiError(err, 'No se pudo registrar el doctor.'));
    }
  };

  return (
    <div
      onClick={(e) => {
        if (!isSubmitting && e.target === e.currentTarget && onCancel) {
          onCancel();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-modal-title"
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-med-border bg-med-primary-50/60 px-6 py-4">
          <div className="flex flex-col gap-1">
            <h2
              id="doctor-modal-title"
              className="text-lg font-bold text-med-primary-900"
            >
              Registrar Nuevo Doctor
            </h2>
            <p className="text-xs text-med-text-sub">
              Complete todos los campos obligatorios para integrar al nuevo
              facultativo al sistema del centro médico.
            </p>
          </div>
          <button
            type="button"
            aria-label="Cerrar modal"
            disabled={isSubmitting}
            onClick={onCancel}
            className="rounded-lg p-1 text-med-text-muted transition hover:bg-med-primary-100 hover:text-med-primary-900 disabled:opacity-40"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form
            id="create-doctor-form"
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="doctor-name"
                className="text-xs font-semibold text-med-text-main"
              >
                Nombre Completo del Doctor
              </label>
              <input
                id="doctor-name"
                type="text"
                placeholder="Ej. Dr. Alejandro Martínez"
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-med-text-main placeholder-med-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
                  errors.name
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-med-border'
                }`}
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
              {errors.name && (
                <p className="text-xs font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="doctor-license"
                className="text-xs font-semibold text-med-text-main"
              >
                Número de Matrícula / Licencia
              </label>
              <input
                id="doctor-license"
                type="text"
                placeholder="Ej. MP-45920"
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-med-text-main placeholder-med-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
                  errors.licenseNumber
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-med-border'
                }`}
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
              {errors.licenseNumber && (
                <p className="text-xs font-medium text-red-500">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>

            {apiError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700"
              >
                <p className="font-medium">{apiError.message}</p>
                {apiError.details?.length > 0 && (
                  <ul className="mt-1 list-disc pl-4">
                    {apiError.details.map((item, idx) => (
                      <li key={idx}>
                        {item.field ? `${item.field}: ` : ''}
                        {item.issue}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </form>
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-2.5 border-t border-med-border bg-med-primary-50/40 px-6 py-4">
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
            form="create-doctor-form"
            disabled={isSubmitting || loadingSpecialties}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Doctor'}
          </Button>
        </footer>
      </section>
    </div>
  );
}
