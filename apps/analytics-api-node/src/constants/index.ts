/** Validation and pagination defaults */
export const VALIDATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_MIN_SCORE: 0,
  MAX_KEYWORD_LENGTH: 100,
} as const;

/** Dashboard and analytics defaults */
export const ANALYTICS = {
  DEFAULT_TOP_SKILLS_LIMIT: 10,
  DEFAULT_EDUCATION_STATS_LIMIT: 10,
  DEFAULT_MATCH_LIMIT: 100,
  DEFAULT_RESUME_LIST_LIMIT: 100,
  MAX_RESUME_EXPORT_LIMIT: 1000,
} as const;

/** Resume status values */
export const RESUME_STATUS = {
  MATCHED: 'matched',
} as const;

/** Database table names (for reference / query modules) */
export const TABLES = {
  RESUMES: 'resumes',
  JOB_ROLES: 'job_roles',
  RESUME_MATCHES: 'resume_matches',
} as const;
