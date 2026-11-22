import { instance } from '../../shared/api/axiosInstance.js';
import { ENDPOINTS } from '../../shared/api/endpoints.js';

export async function getSpecialties({
  name = '',
  pageIndex = 1,
  pageSize = 10,
} = {}) {
  const params = { pageIndex, pageSize };
  const trimmedName = name.trim();

  if (trimmedName.length >= 3) {
    params.name = trimmedName;
  }

  const response = await instance.get(ENDPOINTS.SPECIALTIES, { params });

  return {
    data: Array.isArray(response.data?.data) ? response.data.data : [],
    total: response.data?.total ?? 0,
  };
}

export async function createSpecialty({ name, description }) {
  const response = await instance.post(ENDPOINTS.SPECIALTIES, {
    name: name.trim(),
    description: description.trim(),
  });

  return response.data;
}

export async function deleteSpecialty({ specialtyId }) {
  const response = await instance.delete(
    ENDPOINTS.SPECIALTY_BY_ID(specialtyId)
  );
  return response;
}
