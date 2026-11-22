import { instance } from '../../shared/api/axiosInstance.js';
import { ENDPOINTS } from '../../shared/api/endpoints.js';

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
