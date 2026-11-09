import { instance } from '../../shared/api/axiosInstance';

export const getSpecialities = async () => {
  const response = await fetch('/data/specialities.json');
  return response.json();
};
