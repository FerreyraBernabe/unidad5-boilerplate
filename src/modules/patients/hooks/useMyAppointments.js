import { useCallback, useEffect, useState } from 'react';
import {
  cancelAppointment,
  getPatientAppointments,
} from '../../appointments/services/getAppointments';
import { parseApiError } from '../../shared/api/apiError';

export function useMyAppointments(dni) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!dni) {
      setAppointments([]);
      setLoading(false);

      return undefined;
    }

    let cancelled = false;

    const loadAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getPatientAppointments(dni);

        if (!cancelled) {
          setAppointments(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            parseApiError(err, 'No se pudieron cargar tus turnos activos.')
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [dni, reloadKey]);

  const cancel = async (appointmentId) => {
    await cancelAppointment(appointmentId);
    refetch();
  };

  return {
    appointments,
    loading,
    error,
    cancel,
    refetch,
  };
}
