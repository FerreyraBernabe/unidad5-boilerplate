import { useCallback, useEffect, useRef, useState } from 'react';
import { usePagination } from '../../shared/hooks/usePagination';
import { parseApiError } from '../../shared/api/apiError';
import { getSpecialties } from '../services/getSpecialties';

export function useSpecialties({ initialPageSize = 10 } = {}) {
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const { pageIndex, pageSize, total, totalPages, setTotal, goToPage } =
    usePagination(initialPageSize);

  const allSpecialtiesRef = useRef([]);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  // useEffect de primera carga
  useEffect(() => {
    const loadSpecialties = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getSpecialties();
        const data = result.data ?? [];

        allSpecialtiesRef.current = data;
        setSpecialties(data);
        setTotal(result.total ?? data.length);
      } catch (err) {
        setError(parseApiError(err, 'No se pudieron cargar las especialidades.'));
      } finally {
        setLoading(false);
      }
    };

    loadSpecialties();
  }, [reloadKey, setTotal]);

  // 2do useEffect: el filtrado del campo de busqueda local
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase(); // normaliza

    if (term.length > 3) {
      const filtered = allSpecialtiesRef.current.filter((item) =>
        item.name?.toLowerCase().includes(term)
      );
      setSpecialties(filtered);
      setTotal(filtered.length);
    } else {
      setSpecialties(allSpecialtiesRef.current);
      setTotal(allSpecialtiesRef.current.length);
    }
  }, [searchTerm, setTotal]);

  return {
    specialties,
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