import { instance } from '../../shared/api/axiosInstance.js';
import { ENDPOINTS } from '../../shared/api/endpoints.js';

export async function getAppointments({
  dni = '',
  pageIndex = 1,
  pageSize = 10,
} = {}) {
  const params = { pageIndex, pageSize };
  const response = await instance.get(ENDPOINTS.APPOINTMENTS_SEARCH, {
    params,
  });

  return {
    data: Array.isArray(response.data?.data) ? response.data.data : [],
    total: response.data?.total ?? 0,
  };
}
