/** Default uploads directory (overridable via config) */
export const UPLOADS = {
  DEFAULT_DIR: '/app/uploads',
} as const;

/** Resume status values */
export const RESUME_STATUS = {
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  PARSED: 'parsed',
  MATCHED: 'matched',
  FAILED: 'failed',
} as const;

/** Database connection pool settings */
export const DB_POOL = {
  MAX: 20,
  IDLE_TIMEOUT_MS: 30000,
  CONNECTION_TIMEOUT_MS: 2000,
} as const;
