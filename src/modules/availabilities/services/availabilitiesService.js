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

export async function getDoctorSlots(doctorId, { from, to } = {}) {
  const params = {};

  if (from) {
    params.from = from;
  }

  if (to) {
    params.to = to;
  }

  const response = await instance.get(ENDPOINTS.DOCTOR_SLOTS(doctorId), {
    params,
  });
  const slots = Array.isArray(response.data) ? response.data : [];

  return slots.map((slot) => ({
    id: slot.id,
    date: slot.date,
    startTime: slot.startTime.slice(0, 5),
    endTime: slot.endTime.slice(0, 5),
    status: slot.status,
  }));
}
