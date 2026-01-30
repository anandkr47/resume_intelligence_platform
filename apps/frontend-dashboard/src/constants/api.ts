/** API base URL (env or default) */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/** API path segments - all under API_BASE_URL */
export const API_PATHS = {
  UPLOAD: {
    SINGLE: '/upload/single',
    MULTIPLE: '/upload/multiple',
    RESUME_FILE: (id: string) => `/upload/resumes/${id}/file`,
    DELETE_RESUME: (id: string) => `/upload/resumes/${id}`,
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    SKILLS_TOP: '/analytics/skills/top',
    EXPERIENCE_STATS: '/analytics/experience/stats',
    EDUCATION_STATS: '/analytics/education/stats',
    MATCHES: '/analytics/matches',
    RESUMES: '/analytics/resumes',
    EXPORT_CSV: '/analytics/export/csv',
  },
  JOBS: {
    LIST: '/jobs',
    WITH_MATCHES: '/jobs/with-matches',
    BY_ID: (id: string) => `/jobs/${id}`,
    MATCHES: (id: string) => `/jobs/${id}/matches`,
    SEED: '/jobs/seed',
  },
  RESUMES: {
    BY_ID: (id: string) => `/resumes/${id}`,
  },
} as const;
