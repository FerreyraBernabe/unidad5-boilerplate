import { useDoctors } from '../../doctors/hooks/useDoctors';
import { useSpecialties } from '../../specialties/hooks/useSpecialties';
import { useAppointments } from '../../appointments/hooks/useAppointments';

export default function useMetrics() {
  const { total: totalDoctors } = useDoctors({ initialPageSize: 100 });
  const { total: totalSpecialities } = useSpecialties({ initialPageSize: 100 });
  const { total: totalAppointments } = useAppointments({
    initialPageSize: 100,
  });

  return { totalDoctors, totalSpecialities, totalAppointments };
}
