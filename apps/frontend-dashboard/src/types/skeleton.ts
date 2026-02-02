/** Table skeleton layout variant */
export type TableSkeletonVariant = 'resumes' | 'matches';

/** Column width hint for table skeleton */
export type SkeletonColumnType = 'short' | 'medium' | 'long' | 'tags';

/** Table skeleton component props */
export interface TableSkeletonProps {
  /** Number of rows to show */
  rowCount?: number;
  /** Table layout variant */
  variant?: TableSkeletonVariant;
}

/** Chart skeleton component props */
export interface ChartSkeletonProps {
  /** Height of the chart placeholder in pixels */
  height?: number;
}
