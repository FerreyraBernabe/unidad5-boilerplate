import { useCallback, useEffect, useState } from 'react';
import { parseApiError } from '../../shared/api/apiError';
import { groupSlotsByDate } from '../helpers/slots';
import { getDoctorSlots } from '../services/getAppointments';

// Trae los turnos libres de un doctor, agrupados por fecha.
// Con doctorId vacío no pide nada.
export function useDoctorSlots(doctorId) {
  const [slotsByDate, setSlotsByDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!doctorId) {
      setSlotsByDate({});
      setError(null);

      return undefined;
    }

    let cancelled = false;

    const loadSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const rules = await getDoctorSlots(doctorId);

        if (!cancelled) {
          setSlotsByDate(groupSlotsByDate(rules));
        }
      } catch (err) {
        if (!cancelled) {
          setSlotsByDate({});
          setError(
            parseApiError(err, 'No se pudieron cargar los horarios del doctor.')
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [doctorId, reloadKey]);

  return { slotsByDate, loading, error, refetch };
}
