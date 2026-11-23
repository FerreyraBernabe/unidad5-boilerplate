export const ENDPOINTS = {
  AUTH_ADMIN_LOGIN: 'api/auth/admin/login',
  AUTH_PATIENT_LOGIN: 'api/auth/patient/login',

  SPECIALTIES: 'api/specialties',
  SPECIALTY_BY_ID: (id) => `api/specialties/${id}`,

  DOCTORS: 'api/doctors',
  DOCTOR_BY_ID: (id) => `api/doctors/${id}`,
  DOCTOR_AVAILABILITIES: (id) => `api/doctors/${id}/availabilities`,
  DOCTOR_SLOTS: (id) => `api/doctors/${id}/slots`,

  AVAILABILITIES: 'api/availabilities',

  APPOINTMENTS: 'api/appointments',
  APPOINTMENT_BY_ID: (id) => `api/appointments/${id}`,
  APPOINTMENTS_PATIENT: 'api/appointments/patient',
  APPOINTMENTS_SEARCH: 'api/appointments/search',
};
