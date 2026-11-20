import axios from 'axios';

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
  (config) => {
    return config;
  },
    (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      const isLoginPage = path === '/login' || path === '/admin/login';

      if (!isLoginPage) {
        if (path.startsWith('/admin')) {
          localStorage.clear();
          window.location.href = '/admin/login';
        } else {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export { instance };
