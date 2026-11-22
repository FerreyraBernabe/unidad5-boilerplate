// El backend devuelve el status del enum: BOOKED, ATTENDED, CANCELLED, NO_SHOW.
export const STATUS_STYLES = {
  BOOKED: {
    label: 'Agendado',
    badge: 'bg-med-active-bg text-med-active-text',
    dot: 'bg-med-active-text',
  },
  ATTENDED: {
    label: 'Atendido',
    badge: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-500',
  },
  CANCELLED: {
    label: 'Cancelado',
    badge: 'bg-med-danger-bg text-med-danger-text',
    dot: 'bg-med-danger-text',
  },
  NO_SHOW: {
    label: 'No asistió',
    badge: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
};

// "2026-11-24" -> "24/11/2026"
export const formatDate = (value = '') => {
  const [year, month, day] = String(value).slice(0, 10).split('-');

  return year && month && day ? `${day}/${month}/${year}` : value;
};

// "10:30:00" -> "10:30"
export const formatTime = (value = '') => String(value).slice(0, 5);

// El backend compara el DNI exacto: 7 u 8 dígitos, sin puntos.
export const isValidDni = (value = '') => /^\d{7,8}$/.test(value.trim());

// El backend no filtra doctores por especialidad: se filtra en el cliente.
export const doctorsOfSpecialty = (doctors, specialtyId) => {
  if (!specialtyId) {
    return doctors;
  }

  return doctors.filter((doctor) => {
    const specialty = doctor.specialty ?? doctor.speciality;

    return (specialty?.specialtyId ?? specialty?.id) === specialtyId;
  });
};
