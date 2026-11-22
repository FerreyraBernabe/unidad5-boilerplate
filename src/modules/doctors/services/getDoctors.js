import { instance } from '../../shared/api/axiosInstance.js';
import { ENDPOINTS } from '../../shared/api/endpoints.js';

export async function getDoctors({
  name = '',
  pageIndex = 1,
  pageSize = 10,
} = {}) {
  const params = { pageIndex, pageSize };
  const trimmedName = name.trim();

  if (trimmedName.length >= 3) {
    params.name = trimmedName;
  }

  const response = await instance.get(ENDPOINTS.DOCTORS, { params });

  return {
    data: Array.isArray(response.data?.data) ? response.data.data : [],
    total: response.data?.total ?? 0,
  };
}

export async function createDoctor({ name, licenseNumber, specialtyId }) {
  const response = await instance.post(ENDPOINTS.DOCTORS, {
    name: name.trim(),
    licenseNumber: licenseNumber.trim(),
    specialtyId: specialtyId.trim(),
  });

  return response.data;
}
