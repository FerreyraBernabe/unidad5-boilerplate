import {
  API_DAY_BY_ID,
  days as defaultDays,
} from '../constants/days';

// "Miércoles", "MIÉRCOLES", "miercoles" -> "MIERCOLES"
const normalizeDay = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .trim();

// "08:00:00" -> "08:00"
const toHHmm = (value = '') => String(value).slice(0, 5);

// API -> estado de la tabla.
// Si el backend devuelve [] (doctor nuevo o mes nuevo) se usan los horarios por defecto.
export function buildSchedulesFromApi(apiDays = []) {
  if (apiDays.length === 0) {
    return defaultDays.map((day) => ({ ...day }));
  }

  return defaultDays.map((day) => {
    const found = apiDays.find(
      (item) => normalizeDay(item.day) === normalizeDay(API_DAY_BY_ID[day.id])
    );

    if (!found) {
      return { ...day, activo: false, entrada: '', salida: '' };
    }

    return {
      ...day,
      activo: true,
      entrada: toHHmm(found.startTime),
      salida: toHHmm(found.endTime),
    };
  });
}

// Estado de la tabla -> payload del POST / PUT /api/availabilities (solo días activos).
export function buildPayloadDays(schedules) {
  return schedules
    .filter((item) => item.activo)
    .map((item) => ({
      day: API_DAY_BY_ID[item.id],
      startTime: item.entrada,
      endTime: item.salida,
    }));
}

// Validaciones del documento: al menos un día, horas completas y startTime < endTime.
// Devuelve { byDay: { [id]: mensaje }, general: mensaje | null }.
export function validateSchedules(schedules) {
  const active = schedules.filter((item) => item.activo);
  const byDay = {};

  if (active.length === 0) {
    return { byDay, general: 'Active al menos un día de atención.' };
  }

  active.forEach((item) => {
    if (!item.entrada || !item.salida) {
      byDay[item.id] = 'Complete la hora de entrada y de salida.';
    } else if (item.entrada >= item.salida) {
      byDay[item.id] = 'La entrada debe ser anterior a la salida.';
    }
  });

  return { byDay, general: null };
}

export const hasValidationErrors = ({ byDay, general }) =>
  Boolean(general) || Object.keys(byDay).length > 0;
