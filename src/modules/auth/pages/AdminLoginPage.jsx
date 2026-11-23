import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import { parseApiError } from '../../shared/api/apiError';
import { useAuth } from '../hooks/useAuth';

function AdminLoginPage() {
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, role, signInAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  if (isAuthenticated) {
    return (
      <Navigate to={role === 'ADMINISTRADOR' ? '/admin/home' : '/'} replace />
    );
  }

  const onValid = async (formData) => {
    setApiError(null);

    try {
      await signInAdmin({
        email: formData.email,
        password: formData.password,
      });
      navigate('/admin/home', { replace: true });
    } catch (err) {
      setApiError(
        parseApiError(err, 'Credenciales administrativas inválidas.')
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-med-primary-950 px-4 py-8">
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

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
        <div className="p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-med-primary-900">
              Acceso Administrativo
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-med-text-sub">
              Autentíquese con su correo y contraseña institucional para
              administrar el centro médico.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="admin-email"
                className="text-xs font-semibold text-med-text-main"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted">
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
                </span>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@medportal.com"
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3.5 text-sm text-med-text-main placeholder-med-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
                    errors.email
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-med-border'
                  }`}
                  {...register('email', {
                    required: 'El correo electrónico es obligatorio.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Ingrese un correo electrónico válido.',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="admin-password"
                className="text-xs font-semibold text-med-text-main"
              >
                Contraseña
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted">
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
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-med-text-main placeholder-med-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
                    errors.password
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-med-border'
                  }`}
                  {...register('password', {
                    required: 'La contraseña es obligatoria.',
                    minLength: {
                      value: 8,
                      message:
                        'La contraseña debe tener al menos 8 caracteres.',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-med-text-muted hover:text-med-text-main"
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500">
                  {errors.password.message}
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 py-2.5"
            >
              <span>{isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}</span>
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </Button>
          </form>
        </div>

        <div className="flex items-start gap-3 border-t border-med-primary-100 bg-med-primary-50 p-4 sm:p-5">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-med-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <p className="text-xs leading-relaxed text-med-text-sub">
            <strong className="font-semibold text-med-text-main">
              Solo Acceso Seguro:
            </strong>{' '}
            Este sistema es para personal médico autorizado. Los intentos de
            acceso no autorizados son registrados y monitoreados.
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-xs text-med-primary-200 transition hover:text-white"
        >
          ← Volver al Portal de Pacientes
        </Link>
      </div>
    </div>
  );
}

export default AdminLoginPage;
