import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import type { Resume, ResumeFilters } from '../types';

export function useResumes(initialFilters?: ResumeFilters) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResumeFilters>(initialFilters ?? {});

  const loadResumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getResumes(filters);
      setResumes(data);
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
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refresh = useCallback(() => {
    loadResumes();
  }, [loadResumes]);

  return {
    resumes,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
  };
}
