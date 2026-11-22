import { useCallback, useEffect, useState } from 'react';
import { usePagination } from '../../shared/hooks/usePagination';
import { parseApiError } from '../../shared/api/apiError';
import {
  createSpecialty,
  getSpecialties,
  deleteSpecialty,
} from '../services/getSpecialties';

export function useSpecialties({ initialPageSize = 10 } = {}) {
  const [specialties, setSpecialties] = useState([]);
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

    const loadSpecialties = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getSpecialties({
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
              item.description?.toLowerCase().includes(trimmed)
          );
        }

        setSpecialties(items);
        setTotal(
          trimmed.length > 0 && trimmed.length < 3 ? items.length : result.total
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            parseApiError(err, 'No se pudieron cargar las especialidades.')
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSpecialties();

    return () => {
      cancelled = true;
    };
  }, [searchTerm, pageIndex, pageSize, reloadKey, setTotal]);

  const create = async (payload) => {
    const created = await createSpecialty(payload);

    refetch();

    return created;
  };

  const remove = async (payload) => {
    const removed = await deleteSpecialty(payload);
    refetch();
    return removed;
  };

  return {
    specialties,
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
