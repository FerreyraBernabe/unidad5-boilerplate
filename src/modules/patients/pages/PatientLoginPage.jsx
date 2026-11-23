import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { useAuth } from '../../auth/hooks/useAuth';
import { parseApiError } from '../../shared/api/apiError';

function PatientLoginPage() {
  const [apiError, setApiError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', dni: '' },
    mode: 'onBlur',
  });

  const navigate = useNavigate();
  const { isAuthenticated, role, signInPatient } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate to={role === 'ADMINISTRADOR' ? '/admin/home' : '/'} replace />
    );
  }

  const onValid = async (formData) => {
    setApiError(null);

    try {
      await signInPatient({
        email: formData.email,
        dni: formData.dni,
      });

      navigate('/', { replace: true });
    } catch (error) {
      setApiError(
        parseApiError(error, 'Error al conectar con el servicio de pacientes')
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-med-primary-950 px-4 py-8 sm:p-6">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
          <svg
            className="h-8 w-8 text-med-primary-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          MedPortal
        </h1>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-med-primary-900">
            Portal del Paciente
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-med-text-sub">
            Inicia sesión para reservar y consultar tus turnos médicos
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            id="patient-email"
            label="Correo Electrónico"
            type="email"
            autoComplete="email"
            placeholder="paciente@medportal.com"
            error={errors.email?.message}
            icon={
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingrese un correo electrónico válido.',
              },
            })}
          />

          <Input
            id="patient-dni"
            label="DNI (sin puntos)"
            type="text"
            inputMode="numeric"
            maxLength={8}
            placeholder="Ej. 38123456"
            error={errors.dni?.message}
            icon={
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
            {...register('dni', {
              required: 'El DNI es obligatorio',
              pattern: {
                value: /^\d{7,8}$/,
                message: 'El DNI debe tener 7 u 8 dígitos numéricos.',
              },
            })}
          />

          <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
            {isSubmitting ? 'Ingresando...' : 'Ingresar Paciente'}
          </Button>

          <p className="text-center text-[11px] text-med-text-muted">
            Si es tu primer ingreso, tu cuenta de paciente se registrará
            automáticamente.
          </p>

          {apiError && (
            <Alert
              variant="error"
              message={apiError.message}
              details={apiError.details}
              onClose={() => setApiError(null)}
            />
          )}
        </form>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/admin/login"
          className="text-xs text-med-primary-200 transition hover:text-white"
        >
          ¿Es personal administrativo o médico? Ingrese aquí →
        </Link>
      </div>
    </div>
  );
}

export default PatientLoginPage;
