const DAY_NAMES_SHORT = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const DAY_NAMES_FULL = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const MONTH_NAMES_SHORT = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
];
const MONTH_NAMES_FULL = [
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

export function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getStartOfWeek(baseDate = new Date(), weekOffset = 0) {
  const copy = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate()
  );
  const jsDay = copy.getDay();
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay;

  copy.setDate(copy.getDate() + diffToMonday + weekOffset * 7);

  return copy;
}

export function buildWeekDays(weekOffset = 0, baseDate = new Date()) {
  const monday = getStartOfWeek(baseDate, weekOffset);
  const days = [];

  for (let i = 0; i < 7; i += 1) {
    const current = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + i
    );
    const dayIndex = current.getDay();
    const monthIndex = current.getMonth();
    const dayNum = current.getDate();

    days.push({
      isoDate: toIsoDate(current),
      dayShort: DAY_NAMES_SHORT[dayIndex],
      dayNumber: String(dayNum).padStart(2, '0'),
      monthShort: MONTH_NAMES_SHORT[monthIndex],
      fullDateLabel: `${DAY_NAMES_FULL[dayIndex]} ${dayNum} de ${MONTH_NAMES_FULL[monthIndex]} de ${current.getFullYear()}`,
    });
  }

  return days;
}

export function formatWeekRangeLabel(weekDays) {
  if (!Array.isArray(weekDays) || weekDays.length === 0) {
    return '';
  }

  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];
  const firstParts = first.isoDate.split('-');
  const lastParts = last.isoDate.split('-');
  const firstMonth = MONTH_NAMES_FULL[Number(firstParts[1]) - 1];
  const lastMonth = MONTH_NAMES_FULL[Number(lastParts[1]) - 1];

  if (firstMonth === lastMonth) {
    return `${first.dayShort} ${Number(firstParts[2])} - ${last.dayShort} ${Number(lastParts[2])}, ${firstMonth} ${lastParts[0]}`;
  }

  return `${Number(firstParts[2])} ${firstMonth} - ${Number(lastParts[2])} ${lastMonth} ${lastParts[0]}`;
}

export function isSlotInPast(isoDate, startTime, now = new Date()) {
  if (!isoDate || !startTime) {
    return false;
  }

  const [year, month, day] = isoDate.split('-').map(Number);
  const [hours, minutes] = startTime.split(':').map(Number);
  const slotDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  return slotDate.getTime() <= now.getTime();
}
