import { useDoctors } from '../hooks/useDoctors';
import { useSpecialties } from '../../specialties/hooks/useSpecialties';

const {
    doctors,
    create,
    total,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    pageIndex,
    pageSize,
    totalPages,
    goToPage,
} = useDoctors({ initialPageSize: 10 });

