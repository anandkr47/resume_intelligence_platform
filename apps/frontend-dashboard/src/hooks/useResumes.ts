import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import type { Resume, ResumeFilters } from '../types';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = { sortBy: 'created_at' as const, sortOrder: 'desc' as const };

export function useResumes(initialFilters?: ResumeFilters) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResumeFilters>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    ...DEFAULT_SORT,
    ...initialFilters,
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadResumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyticsService.getResumes(filters);
      setResumes(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load resumes';
      setError(message);
      console.error('Failed to load resumes:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const updateFilters = useCallback((newFilters: Partial<ResumeFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...newFilters };
      const filterKeys = ['keyword', 'location', 'minScore', 'roleId'];
      if (filterKeys.some((k) => k in newFilters) && !('page' in newFilters)) {
        next.page = 1;
      }
      return next;
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const setSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    loadResumes();
  }, [loadResumes]);

  return {
    resumes,
    loading,
    error,
    filters,
    total,
    totalPages,
    updateFilters,
    setPage,
    setPageSize,
    setSort,
    refresh,
  };
}
