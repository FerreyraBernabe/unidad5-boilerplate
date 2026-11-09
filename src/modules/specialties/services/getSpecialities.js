import { instance } from '../../shared/api/axiosInstance';

export const getSpecialities = async () => {
  try {
    const response = await instance.get('api/specialties');
    console.log('Conexión exitosa.');
    console.log(response.data.data);
    return response.data.data ?? [];
  } catch (error) {
    console.error('Error al obtener especialidades: ', error);
    throw error;
  }
};
