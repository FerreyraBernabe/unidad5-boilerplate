import { instance } from '../../shared/api/axiosInstance.js';
import { ENDPOINTS } from '../../shared/api/endpoints.js';

export async function getSpecialties({ name = '', pageIndex = 1, PageSize = 10,} = {}) 

{ 
  const params = {pageIndex, PageSize,};
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

