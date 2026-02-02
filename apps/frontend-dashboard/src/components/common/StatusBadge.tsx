import React from 'react';
import type { StatusBadgeProps } from '../../types';

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClass = (s: string) => {
    const normalized = s?.toLowerCase() ?? '';
    if (['matched', 'completed', 'success'].includes(normalized)) return 'badge-success';
    if (['processing', 'parsing', 'uploaded'].includes(normalized)) return 'badge-info';
    if (['failed', 'error'].includes(normalized)) return 'badge-danger';
    if (['pending', 'queued'].includes(normalized)) return 'badge-warning';
    return 'badge-secondary';
  };

  const formatStatus = (s: string) => {
    const t = s?.charAt(0).toUpperCase() + s?.slice(1).toLowerCase();
    return t || 'Unknown';
  };

  return (
    <span
      className={`badge ${getStatusClass(status)} transform hover:scale-105 transition-transform duration-200`}
    >
      {formatStatus(status)}
    </span>
  );
};
