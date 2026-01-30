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
      .getRoleMatches()
      .then((matches: { role_id?: string; role_title?: string }[]) => {
        if (cancelled) return;
        const unique: RoleOption[] = Array.from(
          new Map(matches.map((m) => [m.role_id, m.role_title])).entries()
        )
          .filter(([id]) => id != null && id !== '')
          .map(([id, title]) => ({ id: id as string, title: title ?? '' }));
        setRoles(unique);
      })
      .catch((err) => console.error('Failed to load roles:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  return roles;
}
