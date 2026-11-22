import { createContext, useCallback, useState } from 'react';
import { loginAdmin, loginPatient } from '../services/authService';

const AUTH_STORAGE_KEY = 'sesion';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [session, setSession] = useState(readInitialSession);

  const saveSession = useCallback((nextSession) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    localStorage.setItem('token', nextSession.token);
    setSession(nextSession);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('token');
    setSession(null);
  }, []);

  const signInAdmin = useCallback(
    async ({ email, password }) => {
      const sessionData = await loginAdmin({ email, password });

      saveSession(sessionData);

      return sessionData;
    },
    [saveSession]
  );

  const signInPatient = useCallback(
    async ({ email, dni }) => {
      const sessionData = await loginPatient({ email, dni });

      saveSession(sessionData);

      return sessionData;
    },
    [saveSession]
  );

  const isAuthenticated = Boolean(session?.token);
  const role = session?.role ?? null;
  let user = null;

  if (session) {
    user = {
      email: session.email,
      dni: session.dni,
      role: session.role,
    };
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token: session?.token ?? null,
        role,
        user,
        signInAdmin,
        signInPatient,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function readInitialSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);

      if (parsed?.token) {
        return {
          token: parsed.token,
          role: parsed.role || null,
          email: parsed.email || null,
          dni: parsed.dni || null,
        };
      }
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return null;
}
export { AuthProvider, AuthContext };
