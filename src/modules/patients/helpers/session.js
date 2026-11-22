// Datos del paciente logueado.
// El login de paciente (POST api/auth/patient/login) debe guardar el DNI con:
//   localStorage.setItem('dni', dni)
// Se lee acá para no depender de cómo esté armado el AuthProvider.
export function getPatientDni() {
  try {
    return localStorage.getItem('dni') ?? '';
  } catch {
    return '';
  }
}
