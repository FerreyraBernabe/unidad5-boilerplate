import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';

export async function getDoctorsAvailabilities(doctorId) {
  const response = await instance.get(
    ENDPOINTS.DOCTOR_AVAILABILITIES(doctorId)
  );
  return Array.isArray(response.data) ? response.data : [];
}

export async function createAvailabilities({ doctorId, days }) {
  const response = await instance.post(ENDPOINTS.AVAILABILITIES, {
    doctorId,
    days,
  });
  return response.data;
}

export async function updateAvailabilities({ doctorId, days }) {
  const response = await instance.put(ENDPOINTS.AVAILABILITIES, {
    doctorId,
    days,
  });
  return response.data;
}
