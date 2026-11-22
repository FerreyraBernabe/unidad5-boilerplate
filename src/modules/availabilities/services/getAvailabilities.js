import { instance } from '../../shared/api/axiosInstance.js';
import { ENDPOINTS } from '../../shared/api/endpoints.js';

// GET /api/doctors/{id}/availabilities -> [{ day, startTime, endTime }]
// Vacío si el doctor es nuevo o el mes es nuevo.
export async function getDoctorAvailabilities(doctorId) {
  const response = await instance.get(
    ENDPOINTS.DOCTOR_AVAILABILITIES(doctorId)
  );
  const payload = response.data?.data ?? response.data;

  return Array.isArray(payload) ? payload : [];
}

// POST crea la disponibilidad del mes; PUT sobreescribe todo el mes (mismo payload).
export async function saveAvailabilities({ doctorId, days, isUpdate = false }) {
  const method = isUpdate ? 'put' : 'post';
  const response = await instance[method](ENDPOINTS.AVAILABILITIES, {
    doctorId,
    days,
  });

  return response.data;
}
