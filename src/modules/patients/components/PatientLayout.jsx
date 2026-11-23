import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import Button from '../../shared/components/Button';

function PatientLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const email = user?.email || 'Paciente';
  const displayName = email.includes('@') ? email.split('@')[0] : email;
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  const getNavLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
      isActive
        ? 'bg-med-primary-900 text-white'
        : 'text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-med-bg">
      <header className="sticky top-0 z-30 border-b border-med-border bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6 sm:gap-8">
            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-med-primary-900 text-xs font-bold text-white shadow-xs">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-med-primary-900">
                Portal Salud
              </span>
            </NavLink>

            <nav className="hidden items-center gap-2 md:flex">
              <NavLink to="/" end className={getNavLinkClass}>
                Reservar Turno
              </NavLink>
              <NavLink to="/appointments" className={getNavLinkClass}>
                Mis Turnos
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-med-border">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-med-primary-200 bg-med-primary-100 text-xs font-bold text-med-primary-900">
                {initials}
              </div>
              <span className="hidden text-xs font-semibold text-med-text-main sm:inline-block">
                {displayName}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="hidden px-2.5 py-1.5 text-xs font-semibold text-med-text-sub hover:bg-red-50/40 hover:text-red-600 sm:inline-flex"
            >
              Salir
            </Button>

            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="rounded-lg border border-med-border p-1.5 text-med-text-sub hover:bg-gray-50 md:hidden"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-2 border-t border-med-border bg-white px-4 py-3 md:hidden">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-med-primary-900 text-white'
                    : 'text-med-text-sub hover:bg-med-primary-50'
                }`
              }
            >
              Reservar Turno
            </NavLink>
            <NavLink
              to="/appointments"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-med-primary-900 text-white'
                    : 'text-med-text-sub hover:bg-med-primary-50'
                }`
              }
            >
              Mis Turnos
            </NavLink>
            <div className="flex items-center justify-between border-t border-med-border-subtle pt-2">
              <span className="text-xs font-medium text-med-text-sub">
                Paciente: {displayName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-bold text-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;
