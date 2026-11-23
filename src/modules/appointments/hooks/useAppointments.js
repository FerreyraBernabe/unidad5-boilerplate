import { useCallback, useEffect, useState } from 'react';
import { usePagination } from '../../shared/hooks/usePagination';
import { parseApiError } from '../../shared/api/apiError';
import { getAppointments } from '../services/getAppointments';

export function useAppointments({
  initialPageSize = 10,
  initialFilters = {},
} = {}) {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({
    dni: initialFilters.dni ?? '',
    specialtyId: initialFilters.specialtyId ?? '',
    doctorId: initialFilters.doctorId ?? '',
    date: initialFilters.date ?? '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    pageIndex,
    pageSize,
    total,
    totalPages,
    setTotal,
    goToPage,
    resetPage,
  } = usePagination(initialPageSize);

  const applyFilters = useCallback(
    (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      resetPage();
    },
    [resetPage]
  );

  useEffect(() => {
    let cancelled = false;

    const loadAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAppointments({
          ...filters,
          pageIndex,
          pageSize,
        });

        if (cancelled) {
          return;
        }

        setAppointments(result.data);
        setTotal(result.total);
      } catch (err) {
        if (!cancelled) {
          setAppointments([]);
          setTotal(0);
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
  }, [filters, pageIndex, pageSize, setTotal]);

  return {
    appointments,
    total,
    loading,
    error,
    filters,
    pageIndex,
    pageSize,
    totalPages,
    goToPage,
    applyFilters,
  };
}
