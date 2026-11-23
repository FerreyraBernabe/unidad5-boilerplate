import { instance } from '../../shared/api/axiosInstance.js';
import { ENDPOINTS } from '../../shared/api/endpoints.js';

// GET api/appointments/search?specialtyId&doctorId&dni&date&pageIndex&pageSize
// Solo se envían los filtros que tienen valor. pageIndex empieza en 1.
export async function getAppointments({
  dni = '',
  specialtyId = '',
  doctorId = '',
  date = '',
  pageIndex = 1,
  pageSize = 10,
} = {}) {
  const params = { pageIndex, pageSize };

  if (dni && dni.trim() !== '') params.dni = dni.trim();

  if (specialtyId && specialtyId !== 'Todas') params.specialtyId = specialtyId;

  if (doctorId && doctorId !== 'Todos') params.doctorId = doctorId;

  if (date) params.date = date;

  const response = await instance.get(ENDPOINTS.APPOINTMENTS_SEARCH, {
    params,
  });

  return {
    data: Array.isArray(response.data?.data) ? response.data.data : [],
    total: response.data?.total ?? 0,
  };
}

export async function createAppointment({
  doctorId,
  availabilityId,
  dni,
  reason,
}) {
  const response = await instance.post(ENDPOINTS.APPOINTMENTS, {
    doctorId,
    availabilityId,
    patient: {
      dni: Number(String(dni).trim()),
    },
    reason: reason.trim(),
  });

  return response.data;
}

export async function getPatientAppointments(dni) {
  const response = await instance.get(ENDPOINTS.APPOINTMENTS_PATIENT, {
    params: { dni: String(dni).trim() },
  });

  return Array.isArray(response.data) ? response.data : [];
}

export async function cancelAppointment(id) {
  await instance.delete(ENDPOINTS.APPOINTMENT_BY_ID(id));
}
