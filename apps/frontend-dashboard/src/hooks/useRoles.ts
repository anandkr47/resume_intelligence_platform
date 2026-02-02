import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

export interface RoleOption {
  id: string;
  title: string;
}

export function useRoles(): RoleOption[] {
  const [roles, setRoles] = useState<RoleOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    analyticsService
      .getRoleMatches(undefined, 0, 1, 1)
      .then((res) => {
        if (cancelled) return;
        setRoles(res.uniqueRoles ?? []);
      })
      .catch((err) => console.error('Failed to load roles:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  return roles;
}
