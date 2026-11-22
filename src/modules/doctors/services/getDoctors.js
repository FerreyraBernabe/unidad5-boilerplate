import { instance } from '../../shared/api/axiosInstance';
export const getDoctors = async () => {
  try {
    const response = await instance.get('api/doctors');
    console.log('Conexión exitosa.');
    console.log(response.data.data);
    return response.data.data ?? [];
  } catch (error) {
    console.error('Error al obtener doctores: ', error);
    throw error;
  }
};
