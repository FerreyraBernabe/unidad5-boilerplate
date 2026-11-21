import { useCallback, useState } from 'react';

export function usePagination(initialPageSize = 10) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goToPage = useCallback(
    (nextPage) => {
      const clamped = Math.max(1, Math.min(nextPage, totalPages));

      setPageIndex(clamped);
    },
    [totalPages]
  );

  const resetPage = useCallback(() => {
    setPageIndex(1);
  }, []);

  return {
    pageIndex,
    pageSize,
    total,
    totalPages,
    setTotal,
    goToPage,
    resetPage,
  };
}
