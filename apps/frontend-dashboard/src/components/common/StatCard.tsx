import React from 'react';
import type { StatCardProps } from '../../types';

const variantStyles: Record<
  NonNullable<StatCardProps['variant']>,
  Record<string, string>
> = {
  primary: {
    border: 'border-l-primary-500',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    gradientFrom: 'from-primary-600',
    gradientTo: 'to-primary-400',
    bgGradient: 'from-primary-50 to-white',
  },
  secondary: {
    border: 'border-l-secondary-500',
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
    gradientFrom: 'from-secondary-600',
    gradientTo: 'to-secondary-400',
    bgGradient: 'from-secondary-50 to-white',
  },
  amber: {
    border: 'border-l-amber-500',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    gradientFrom: 'from-amber-600',
    gradientTo: 'to-amber-400',
    bgGradient: 'from-amber-50 to-white',
  },
  purple: {
    border: 'border-l-purple-500',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-purple-400',
    bgGradient: 'from-purple-50 to-white',
  },
  blue: {
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-blue-400',
    bgGradient: 'from-blue-50 to-white',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  label,
  icon: Icon,
  variant = 'primary',
  trend,
}) => {
  const styles = variantStyles[variant];
  return (
    <div
      className={`stat-card ${styles.border} bg-gradient-to-br ${styles.bgGradient} hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div className={`${styles.iconBg} p-2 rounded-lg`}>
            <Icon className={`w-5 h-5 ${styles.iconColor}`} />
          </div>
        )}
      </div>
      <div className="mb-2">
        <div
          className={`text-4xl font-bold bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo} bg-clip-text text-transparent`}
        >
          {value}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 mt-1 text-xs font-semibold ${
              trend.isPositive ? 'text-secondary-600' : 'text-red-600'
            }`}
          >
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
};
