export interface ExportJobData {
  resumeIds?: string[];
  outputPath: string;
  format?: 'csv' | 'json' | 'xlsx';
}

export interface ExportResult {
  outputPath: string;
  recordCount: number;
  status: 'completed' | 'failed';
  error?: string;
}

export interface ResumeExportRecord {
  id: string;
  file_name: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  experience_count: number;
  education_count: number;
  status: string;
  created_at: string;
}
