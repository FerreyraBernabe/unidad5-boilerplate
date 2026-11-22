import { instance } from '../../shared/api/axiosInstance.js';
import { ENDPOINTS } from '../../shared/api/endpoints.js';

// GET /api/doctors/{id}/slots
// -> [{ doctorId, day, slots: [{ id, date: "dd/MM/yyyy", startTime: "HH:mm:ss", endTime }] }]
// Una entrada por día de la semana en que el doctor atiende; solo trae turnos libres.
export async function getDoctorSlots(doctorId) {
  const response = await instance.get(ENDPOINTS.DOCTOR_SLOTS(doctorId));
  const payload = response.data?.data ?? response.data;

  return Array.isArray(payload) ? payload : [];
}

// POST /api/appointments
// El backend espera el id del SLOT (availabilitySlotId) y el DNI como número.
export async function createAppointment({
  doctorId,
  availabilitySlotId,
  dni,
  reason,
}) {
  const response = await instance.post(ENDPOINTS.APPOINTMENTS, {
    doctorId,
    availabilitySlotId,
    patient: { dni: Number(dni) },
    reason: reason.trim(),
  });

  return response.data;
}
