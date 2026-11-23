import { useAppointments } from '../../appointments/hooks/useAppointments';
import { toIsoDate } from '../../patients/helpers/weekCalendar';
import { useSpecialties } from '../../specialties/hooks/useSpecialties';

export default function useMetrics() {
  const todayIso = toIsoDate(new Date());
  const { total: totalSpecialities } = useSpecialties({ initialPageSize: 1 });
  const { total: totalAppointments } = useAppointments({
    initialPageSize: 1,
    initialFilters: { date: todayIso },
  });

  return { totalSpecialities, totalAppointments };
}
