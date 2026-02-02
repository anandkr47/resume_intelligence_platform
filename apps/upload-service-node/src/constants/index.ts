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

/** Database connection pool settings (overridable via config.database.poolMax) */
export const DB_POOL = {
  IDLE_TIMEOUT_MS: 30000,
  CONNECTION_TIMEOUT_MS: 5000,
} as const;
