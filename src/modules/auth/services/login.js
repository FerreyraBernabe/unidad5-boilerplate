import { instance } from '../../shared/api/axiosInstance';

export const login = async (email, password) => {
  const response = await instance.post(
    'api/auth/admin/login',
    JSON.stringify({ email, password }),
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }
  );

  return { data: response.data.token, error: null };
};
