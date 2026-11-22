import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';

export async function loginAdmin({ email, password }) {
  const response = await instance.post(ENDPOINTS.AUTH_ADMIN_LOGIN, {
    email: email.trim(),
    password: password.trim(),
  });

  const token = response.data?.token;
  const role = response.data?.role.toUpperCase();

  return {
    token,
    role,
    email: email.trim(),
    dni: null,
  };
}

export async function loginPatient({ email, dni }) {

  const response = await instance.post(ENDPOINTS.AUTH_PATIENT_LOGIN, {
    email: email.trim(),
    dni: Number(dni.trim()),
  });

  const token = response.data?.token;
  const role = response.data?.role.toUpperCase();
  return {
    token,
    role,
    email: email.trim(),
    dni: Number(dni.trim()),
  };
}
