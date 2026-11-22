import { useEffect, useState } from 'react';
import { parseApiError } from '../../shared/api/apiError';
import { days as defaultDays } from '../constants/days';
import {
  buildPayloadDays,
  buildSchedulesFromApi,
} from '../helpers/schedules';
import {
  getDoctorAvailabilities,
  saveAvailabilities,
} from '../services/getAvailabilities';

export function useAvailabilities(doctorId) {
  const [schedules, setSchedules] = useState(() =>
    defaultDays.map((day) => ({ ...day }))
  );
  // Si ya había disponibilidad guardada, se guarda con PUT; si no, con POST.
  const [hasStoredAvailability, setHasStoredAvailability] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) {
      setSchedules(defaultDays.map((day) => ({ ...day })));
      setHasStoredAvailability(false);
      setError(null);

      return undefined;
    }

    let cancelled = false;

    const loadAvailabilities = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiDays = await getDoctorAvailabilities(doctorId);

        if (cancelled) {
          return;
        }

        setSchedules(buildSchedulesFromApi(apiDays));
        setHasStoredAvailability(apiDays.length > 0);
      } catch (err) {
        if (!cancelled) {
          setError(
            parseApiError(err, 'No se pudo cargar la disponibilidad del doctor.')
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAvailabilities();

    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  const save = async () => {
    const result = await saveAvailabilities({
      doctorId,
      days: buildPayloadDays(schedules),
      isUpdate: hasStoredAvailability,
    });

    setHasStoredAvailability(true);

    return result;
  };

  return {
    schedules,
    setSchedules,
    loading,
    error,
    save,
  };
}
