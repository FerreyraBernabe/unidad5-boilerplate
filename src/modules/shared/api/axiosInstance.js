import axios from 'axios';

export const AUTH_STORAGE_KEY = 'sesion';

export function clearStoredSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem('token');
}

const instance = axios.create({
  baseURL: import.meta.env.DEV ? '/' : import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (config) => config,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      const isLoginPage = path === '/login' || path === '/admin/login';

      if (!isLoginPage) {
        clearStoredSession();
        window.location.href = path.startsWith('/admin')
          ? '/admin/login'
          : '/login';
      }
    }

    return Promise.reject(error);
  }
);

export { instance };
