/** User-facing copy and messages */

export const COPY = {
  APP_NAME: 'Resume Intelligence',

  /** Page titles & subtitles */
  PAGES: {
    ANALYTICS: {
      TITLE: 'Analytics & Insights',
      SUBTITLE: 'Visualize trends, skills distribution, and role matching statistics',
    },
    UPLOAD: {
      TITLE: 'Upload Resumes',
      SUBTITLE: 'Upload multiple resumes in PDF, DOCX, or image formats for automated processing',
    },
    RESUMES: {
      TITLE: 'Resume Database',
      SUBTITLE: 'Browse, filter, and export parsed resume data',
    },
    JOBS: {
      TITLE: 'Job Listings',
      SUBTITLE: 'Browse available positions and view resume matches',
    },
  },

  /** Loading messages */
  LOADING: {
    DEFAULT: 'Loading...',
    ANALYTICS: 'Loading analytics...',
    JOBS: 'Loading jobs and matches...',
    RESUMES: 'Loading resumes...',
    UPLOADING: 'Uploading and processing resumes...',
    UPLOADING_WAIT: 'Please wait while we process your files',
  },

  /** Errors */
  ERRORS: {
    SOMETHING_WRONG: 'Something went wrong',
    LOAD_ANALYTICS: 'Failed to load analytics data. Please check your connection and try again.',
    UNEXPECTED: 'An unexpected error occurred.',
    LOAD_JOBS: 'Failed to load jobs',
    LOAD_RESUMES: 'Error loading resumes',
    DELETE_RESUME: 'Failed to delete resume',
    UPLOAD_FAILED: 'Upload failed',
    CONFIRM_DELETE: 'Are you sure you want to delete this resume?',
  },

  /** Export */
  EXPORT: {
    NO_RESUMES: 'No resumes to export',
  },

  /** Empty states */
  EMPTY: {
    NO_SKILLS: 'No skills data available',
    NO_EDUCATION: 'No education data available',
    NO_ROLE_MATCHES: 'No role matches found',
    NO_ROLE_MATCHES_FILTER: 'Try selecting a different role or clearing the filter.',
    NO_ROLE_MATCHES_YET: "We haven't found any role matches yet.",
    NO_JOBS: 'No jobs found',
    NO_RESUMES: 'No resumes found',
    TRY_FILTERS: 'Try adjusting your filters',
    UPLOAD_TO_START: 'Upload resumes to get started',
    NO_MATCHES_FOR_JOB: 'No resumes match this job yet.',
  },

  /** Labels & actions */
  LABELS: {
    RETRY: 'Retry',
    FILTER_BY_ROLE: 'Filter by Role',
    ALL_ROLES: 'All Roles',
    SEARCH: 'Search',
    SEARCH_JOBS: 'Search jobs...',
    DOMAIN: 'Domain',
    ALL_DOMAINS: 'All Domains',
    LOCATION: 'Location',
    ALL_LOCATIONS: 'All Locations',
    SEARCH_KEYWORD: 'Search Keyword',
    SEARCH_PLACEHOLDER: 'Search by name, email, skills...',
    LOCATION_PLACEHOLDER: 'Filter by location...',
    JOB_ROLE: 'Job Role',
    MIN_MATCH_SCORE: 'Minimum Match Score',
    APPLY_FILTERS: 'Apply Filters',
    CLEAR: 'Clear',
    EXPORT_CSV: 'Export CSV',
    VIEW_DETAILS: 'View Details',
    VIEW_ORIGINAL: 'View Original',
    CLOSE: 'Close',
    ROLE: 'Role',
    RESUME: 'Resume',
    MATCH_SCORE: 'Match Score',
    MATCHED_SKILLS: 'Matched Skills',
    NO_SKILLS_MATCHED: 'No skills matched',
    REQUIRED_SKILLS: 'Required Skills',
    OVERALL_MATCH_SCORE: 'Overall Match Score',
    REQUIREMENTS_SATISFACTION: 'Requirements Satisfaction',
    MATCHED_RESUMES: 'Matched Resumes',
    CONTACT_INFORMATION: 'Contact Information',
    SKILLS: 'Skills',
    EXPERIENCE: 'Experience',
    EDUCATION: 'Education',
    RESUME_DETAILS: 'Resume Details',
    NAME: 'Name',
    EMAIL: 'Email',
    PHONE: 'Phone',
    CREATED: 'Created',
    STATUS: 'Status',
    FILE_SIZE: 'File Size',
    TYPE: 'Type',
    JOB_ID: 'Job ID',
    FILTERS: 'Filters',
    REFINE_SEARCH: 'Refine your search to find specific resumes',
    RESUME_LIST: 'Resume List',
    RESUMES_FOUND: (count: number) => `${count} ${count === 1 ? 'resume' : 'resumes'} found`,
  },

  /** Upload */
  UPLOAD: {
    CARD_TITLE: 'Upload Files',
    CARD_DESCRIPTION: 'Drag and drop or click to select multiple resume files',
    DROP_HERE: 'Drop files here to upload',
    RELEASE: 'Release to start processing',
    DRAG_DROP: 'Drag & drop resumes here',
    CLICK_BROWSE: 'click to browse',
    MULTIPLE_SUPPORTED: 'Multiple files supported • Max 10MB per file',
    UPLOAD_SUMMARY: 'Upload Summary',
    FILES_PROCESSED: (count: number) =>
      `${count} file${count !== 1 ? 's' : ''} processed successfully`,
    SUCCESSFUL: 'Successful',
    FAILED: 'Failed',
    QUEUED: 'Queued for processing',
    FILE_FORMATS: ['PDF', 'DOCX', 'JPEG', 'PNG'],
  },

  /** Stats (Analytics) */
  STATS: {
    AVG_EXPERIENCE: 'Average Experience',
    YEARS_EXPERIENCE: 'Years of experience',
    TOP_SKILLS: 'Top Skills',
    UNIQUE_SKILLS: 'Unique skills tracked',
    UNIVERSITIES: 'Universities',
    UNIQUE_INSTITUTIONS: 'Unique institutions',
    ROLE_MATCHES: 'Role Matches',
    TOTAL_MATCHES: 'Total matches found',
  },

  /** Chart / section titles */
  CHARTS: {
    TOP_SKILLS_DIST: 'Top Skills Distribution',
    TOP_SKILLS_DESC: 'Most common skills across all resumes',
    TOP_UNIVERSITIES: 'Top Universities',
    TOP_UNIVERSITIES_DESC: 'Most common educational institutions',
    EXPERIENCE_STATS: 'Experience Statistics',
    EXPERIENCE_STATS_DESC: 'Average, minimum, and maximum years of experience',
    ROLE_MATCHES: 'Role Matches',
    ROLE_MATCHES_DESC: 'Resume matches filtered by job role',
  },

  /** Table */
  TABLE: {
    SHOWING: (shown: number, total: number) => `Showing ${Math.min(shown, 50)} of ${total} matches`,
    SHOWING_PAGINATED: (start: number, end: number, total: number) =>
      `Showing ${start}-${end} of ${total}`,
    PER_PAGE: 'Per page',
    FILE_NAME: 'File Name',
    ACTIONS: 'Actions',
    EXPERIENCE_COUNT: 'Experience',
    EDUCATION_COUNT: 'Education',
    CREATED_AT: 'Created At',
  },

  /** Match score labels */
  MATCH: {
    MATCH: 'match',
    MATCHES: 'matches',
    MATCH_SCORE: 'match score',
    REQUIREMENTS_MET: (met: number, total: number, pct: number) =>
      `${met} of ${total} requirements met (${pct.toFixed(0)}%)`,
  },
} as const;
