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

  if (dni.trim()) {
    params.dni = dni.trim();
  }

  if (specialtyId) {
    params.specialtyId = specialtyId;
  }

  if (doctorId) {
    params.doctorId = doctorId;
  }

  if (date) {
    params.date = date;
  }

  const response = await instance.get(ENDPOINTS.APPOINTMENTS_SEARCH, {
    params,
  });

  return {
    data: Array.isArray(response.data?.data) ? response.data.data : [],
    total: response.data?.total ?? 0,
  };
}
