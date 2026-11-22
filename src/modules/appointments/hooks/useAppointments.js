import { useCallback, useEffect, useState } from 'react';
import { usePagination } from '../../shared/hooks/usePagination';
import { parseApiError } from '../../shared/api/apiError';
import { getAppointments } from '../services/getAppointments';

export function useAppointments({ initialPageSize = 10 } = {}) {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const {
    pageIndex,
    pageSize,
    total,
    totalPages,
    setTotal,
    goToPage,
    resetPage,
  } = usePagination(initialPageSize);

  useEffect(() => {
    let cancelled = false;

    const loadAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAppointments({
          pageIndex,
          pageSize,
        });

        if (cancelled) {
          return;
        }
        let items = result.data;

        setAppointments(items);
        setTotal(result.total);
      } catch (err) {
        if (!cancelled) {
          setError(parseApiError(err, 'No se pudieron cargar las citas.'));
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
  }, [pageIndex, pageSize, reloadKey, setTotal]);

  return {
    appointments,
    total,
    loading,
    error,
  };
}
