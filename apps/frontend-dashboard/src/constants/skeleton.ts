import type { TableSkeletonVariant, SkeletonColumnType } from '../types/skeleton';

/** Table skeleton column configurations per variant */
export const TABLE_SKELETON_VARIANTS: Record<
  TableSkeletonVariant,
  { columns: SkeletonColumnType[]; showActions?: boolean }
> = {
  resumes: {
    columns: ['long', 'medium', 'medium', 'short', 'tags', 'short', 'short', 'short', 'short'],
    showActions: true,
  },
  matches: {
    columns: ['medium', 'long', 'short', 'tags'],
  },
};

/** Tailwind width classes per column type */
export const SKELETON_COLUMN_WIDTHS: Record<SkeletonColumnType, string> = {
  short: 'w-16',
  medium: 'w-32',
  long: 'w-48',
  tags: 'w-40',
} as const;

/** Bar heights for chart skeleton (percentage values) */
export const CHART_SKELETON_BAR_HEIGHTS = [40, 65, 45, 80, 55, 70, 50] as const;
