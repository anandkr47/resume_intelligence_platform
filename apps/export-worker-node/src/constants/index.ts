/** Database connection pool settings */
export const DB_POOL = {
  MAX: 20,
} as const;

/** CSV export column definitions (id, title) for csv-writer */
export const CSV_EXPORT_HEADERS = [
  { id: 'id', title: 'ID' },
  { id: 'file_name', title: 'File Name' },
  { id: 'name', title: 'Name' },
  { id: 'email', title: 'Email' },
  { id: 'phone', title: 'Phone' },
  { id: 'skills', title: 'Skills' },
  { id: 'experience_count', title: 'Experience Count' },
  { id: 'education_count', title: 'Education Count' },
  { id: 'status', title: 'Status' },
  { id: 'created_at', title: 'Created At' },
] as const;

/** Export result status values */
export const EXPORT_STATUS = {
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;
