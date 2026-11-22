import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { parseApiError } from '../../shared/api/apiError';

function PatientLoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
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
    return <Navigate to={role === "ADMINISTRADOR" ? '/admin/home' : '/'} replace />;
  }

  const onValid = async (formData) => {
    setErrorMessage('');

    try {
      await signInPatient({
        email: formData.email,
        dni: formData.dni,
      });

      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(
        parseApiError(error, 'Error al conectar con el servicio de pacientes')
          .message
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-med-primary-950 px-4 py-8 sm:p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <svg
            className="w-8 h-8 text-med-primary-900"
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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-med-primary-900">
            Portal del Paciente
          </h2>
          <p className="text-xs text-med-text-sub mt-1 leading-relaxed">
            Inicia sesión para reservar y consultar tus turnos médicos
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="patient-email"
              className="text-xs font-semibold text-med-text-main"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-med-text-muted">
                <svg
                  className="w-4 h-4"
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
              </span>
              <input
                id="patient-email"
                type="email"
                autoComplete="email"
                placeholder="paciente@medportal.com"
                className={`w-full border rounded-lg pl-10 pr-3.5 py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent ${errors.email
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-med-border'
                  }`}
                {...register('email', {
                  required: 'El correo electrónico es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingrese un correo electrónico válido.',
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="patient-dni"
              className="text-xs font-semibold text-med-text-main"
            >
              DNI (sin puntos)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-med-text-muted">
                <svg
                  className="w-4 h-4"
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
              </span>
              <input
                id="patient-dni"
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="Ej. 38123456"
                className={`w-full border rounded-lg pl-10 pr-3.5 py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent ${errors.dni
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-med-border'
                  }`}
                {...register('dni', {
                  required: 'El DNI es obligatorio',
                  pattern: {
                    value: /^\d{7,8}$/,
                    message: 'El DNI debe tener 7 u 8 dígitos numéricos.',
                  },
                })}
              />
            </div>
            {errors.dni && (
              <p className="text-xs text-red-500 font-medium">
                {errors.dni.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? 'Ingresando...' : 'Ingresar Paciente'}
          </Button>

          <p className="text-center text-[11px] text-med-text-muted">
            Si es tu primer ingreso, tu cuenta de paciente se registrará
            automáticamente.
          </p>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 text-center">
              {errorMessage}
            </div>
          )}
        </form>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/admin/login"
          className="text-xs text-med-primary-200 hover:text-white transition"
        >
          ¿Es personal administrativo o médico? Ingrese aquí →
        </Link>
      </div>
    </div>
  );
}

export default PatientLoginPage;
