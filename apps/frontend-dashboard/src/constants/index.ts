export { API_BASE_URL, API_PATHS } from './api';
export { COPY } from './copy';

export const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

export const CHART_COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
];

export const STATUS_COLORS: Record<string, string> = {
  uploaded: '#3b82f6',
  processing: '#f59e0b',
  parsed: '#8b5cf6',
  matched: '#10b981',
  completed: '#10b981',
  failed: '#ef4444',
  error: '#ef4444',
  pending: '#64748b',
  queued: '#64748b',
};
