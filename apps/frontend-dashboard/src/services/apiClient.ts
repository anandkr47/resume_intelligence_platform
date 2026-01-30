import axios from 'axios';
import { API_BASE_URL, API_PATHS } from '../constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { apiClient };

/** Build full URL for resume file (for links / download) */
export function getResumeFileUrl(id: string): string {
  return `${API_BASE_URL}${API_PATHS.UPLOAD.RESUME_FILE(id)}`;
}
