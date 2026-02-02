/** Resume entity from API */
export interface Resume {
  id: string;
  file_name: string;
  file_path?: string;
  mime_type?: string;
  file_size?: number;
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experience?: unknown[];
  education?: unknown[];
  parsed_data?: unknown;
  location?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

/** Filters for resume list */
export interface ResumeFilters {
  keyword?: string;
  location?: string;
  minScore?: number;
  roleId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Single file upload result */
export interface UploadResult {
  resumeId?: string;
  fileName: string;
  status: 'uploaded' | 'failed';
  error?: string;
}

/** Bulk upload API response */
export interface BulkUploadResponse {
  total: number;
  success: number;
  failed: number;
  results: UploadResult[];
}

/** ResumeTable component props */
export interface ResumeTableProps {
  resumes: Resume[];
  onRowClick?: (resume: Resume) => void;
  onDelete?: (id: string) => void;
  getResumeFileUrl?: (id: string) => string;
}

/** ResumeDetailModal component props */
export interface ResumeDetailModalProps {
  resume: Resume | null;
  onClose: () => void;
  getResumeFileUrl?: (id: string) => string;
}
