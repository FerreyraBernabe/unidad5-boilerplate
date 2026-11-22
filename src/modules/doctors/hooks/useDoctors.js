import { useCallback, useEffect, useState } from 'react';
import { usePagination } from '../../shared/hooks/usePagination';
import { parseApiError } from '../../shared/api/apiError';
import { createDoctor, getDoctors, deleteDoctor } from '../services/getDoctors';

export function useDoctors({ initialPageSize = 10 } = {}) {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTermState] = useState('');
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

  const setSearchTerm = useCallback(
    (value) => {
      setSearchTermState(value);
      resetPage();
    },
    [resetPage]
  );

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDoctors = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getDoctors({
          name: searchTerm,
          pageIndex,
          pageSize,
        });

        if (cancelled) {
          return;
        }

        const trimmed = searchTerm.trim().toLowerCase();
        let items = result.data;

        if (trimmed.length > 0 && trimmed.length < 3) {
          items = result.data.filter(
            (item) =>
              item.name?.toLowerCase().includes(trimmed) ||
              item.licenseNumber?.toLowerCase().includes(trimmed) ||
              item.specialty?.name?.toLowerCase().includes(trimmed) ||
              item.speciality?.name?.toLowerCase().includes(trimmed)
          );
        }

        setDoctors(items);
        setTotal(
          trimmed.length > 0 && trimmed.length < 3 ? items.length : result.total
        );
      } catch (err) {
        if (!cancelled) {
          setError(parseApiError(err, 'No se pudieron cargar los doctores.'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDoctors();

    return () => {
      cancelled = true;
    };
  }, [searchTerm, pageIndex, pageSize, reloadKey, setTotal]);

  const create = async (payload) => {
    const created = await createDoctor(payload);

    refetch();

    return created;
  };

  const remove = async (payload) => {
    const deleted = await deleteDoctor(payload);
    refetch();
    return deleted;
  };

  return {
    doctors,
    create,
    remove,
    total,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    pageIndex,
    pageSize,
    totalPages,
    goToPage,
    refetch,
  };
}
