import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/** Shared UI component props */
export interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  headerAction?: ReactNode;
  description?: string;
  style?: React.CSSProperties;
}

export interface LayoutProps {
  children: ReactNode;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: ReactNode;
}

export interface LoadingProps {
  message?: string;
}

export interface StatusBadgeProps {
  status: string;
}

export type StatCardVariant = 'primary' | 'secondary' | 'amber' | 'purple' | 'blue';

export interface StatCardProps {
  title: string;
  value: string | number;
  label?: string;
  icon?: LucideIcon;
  variant?: StatCardVariant;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
