import { useEffect, useState, useCallback } from 'react';
import { getSpecialities } from '../services/getSpecialities';
import { parseApiError } from '../../shared/api/apiError';

export function useSpecialties() {
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpecialties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSpecialities();
      setSpecialties(Array.isArray(data) ? data : []);
    } catch (err) {
      const apiError = parseApiError(err, 'No se pudieron cargar las especialidades.');
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  const filteredSpecialties = specialties.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    specialties: filteredSpecialties,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    refetch: fetchSpecialties,
  };
}