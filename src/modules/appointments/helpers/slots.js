const DAY_NAMES_SHORT = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const DAY_NAMES_LONG = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const pad = (value) => String(value).padStart(2, '0');

// Fecha local -> "yyyy-MM-dd" (sin pasar por UTC para no correr el día).
export const toIsoDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// "yyyy-MM-dd" -> Date local a las 00:00
export const fromIsoDate = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);

  return new Date(year, month - 1, day);
};

// El backend manda "dd/MM/yyyy" -> "yyyy-MM-dd"
const backendDateToIso = (value = '') => {
  const [day, month, year] = value.split('/');

  return `${year}-${pad(month)}-${pad(day)}`;
};

// "08:30:00" -> "08:30"
const toHHmm = (value = '') => String(value).slice(0, 5);

// Respuesta del backend -> { "2026-11-23": [{ id, time, endTime }], ... }
// Descarta los horarios de hoy que ya pasaron (RN04) y ordena por hora.
export function groupSlotsByDate(apiRules = [], now = new Date()) {
  const byDate = {};

  apiRules.forEach((rule) => {
    (rule.slots ?? []).forEach((slot) => {
      const iso = backendDateToIso(slot.date);
      const time = toHHmm(slot.startTime);
      const [hours, minutes] = time.split(':').map(Number);
      const startsAt = fromIsoDate(iso);

      startsAt.setHours(hours, minutes, 0, 0);

      if (startsAt <= now) {
        return;
      }

      byDate[iso] = byDate[iso] ?? [];
      byDate[iso].push({ id: slot.id, time, endTime: toHHmm(slot.endTime) });
    });
  });

  Object.values(byDate).forEach((list) =>
    list.sort((a, b) => a.time.localeCompare(b.time))
  );

  return byDate;
}

// Lunes de la semana de una fecha
export function getWeekStart(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffToMonday = (start.getDay() + 6) % 7;

  start.setDate(start.getDate() - diffToMonday);

  return start;
}

export function addDays(date, amount) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  next.setDate(next.getDate() + amount);

  return next;
}

export function formatFullDate(date) {
  return `${DAY_NAMES_LONG[date.getDay()]} ${date.getDate()} de ${
    MONTH_NAMES[date.getMonth()]
  } de ${date.getFullYear()}`;
}

// Lunes a sábado de la semana que empieza en weekStart
export function buildWeekDays(weekStart) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = addDays(weekStart, index);

    return {
      iso: toIsoDate(date),
      dayName: DAY_NAMES_SHORT[date.getDay()],
      dateNumber: String(date.getDate()),
      monthShort: MONTH_NAMES[date.getMonth()].slice(0, 3).toUpperCase(),
      fullDate: formatFullDate(date),
    };
  });
}

// "Lunes 23 - Sábado 28, Noviembre"
export function formatWeekRange(weekDays) {
  const first = fromIsoDate(weekDays[0].iso);
  const last = fromIsoDate(weekDays[weekDays.length - 1].iso);
  const sameMonth = first.getMonth() === last.getMonth();
  const left = `${DAY_NAMES_LONG[first.getDay()]} ${first.getDate()}${
    sameMonth ? '' : ` ${MONTH_NAMES[first.getMonth()]}`
  }`;
  const right = `${DAY_NAMES_LONG[last.getDay()]} ${last.getDate()}`;

  return `${left} - ${right}, ${MONTH_NAMES[last.getMonth()]}`;
}

// Fecha más temprana con turnos libres (o null)
export function getFirstSlotDate(slotsByDate) {
  const dates = Object.keys(slotsByDate).sort();

  return dates.length > 0 ? dates[0] : null;
}

export function getLastSlotDate(slotsByDate) {
  const dates = Object.keys(slotsByDate).sort();

  return dates.length > 0 ? dates[dates.length - 1] : null;
}
