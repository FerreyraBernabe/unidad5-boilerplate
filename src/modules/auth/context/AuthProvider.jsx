import { createContext, useCallback, useState } from 'react';
import {
  AUTH_STORAGE_KEY,
  clearStoredSession,
} from '../../shared/api/axiosInstance';
import { loginAdmin, loginPatient } from '../services/authService';

const AuthContext = createContext(null);

function isTokenExpired(token) {
  if (!token || typeof token !== 'string') {
    return true;
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    return false;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    if (!payload?.exp) {
      return false;
    }

    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function readInitialSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);

      if (parsed?.token && !isTokenExpired(parsed.token)) {
        return {
          token: parsed.token,
          role: parsed.role || null,
          email: parsed.email || null,
          dni: parsed.dni || null,
        };
      }
    }
  } catch {
    // Si el JSON está corrupto se limpia la sesión almacenada.
  }

  clearStoredSession();

  return null;
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(readInitialSession);

  const saveSession = useCallback((nextSession) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    localStorage.setItem('token', nextSession.token);
    setSession(nextSession);
  }, []);

  const signOut = useCallback(() => {
    clearStoredSession();
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

export { AuthProvider, AuthContext };
