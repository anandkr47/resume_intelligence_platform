import { apiClient, getResumeFileUrl } from './apiClient';
import { API_PATHS } from '../constants/api';

export { getResumeFileUrl };

export const resumeService = {
  async getResume(id: string) {
    const { data } = await apiClient.get(API_PATHS.RESUMES.BY_ID(id));
    return data;
  },

  async deleteResume(id: string) {
    const { data } = await apiClient.delete(API_PATHS.UPLOAD.DELETE_RESUME(id));
    return data;
  },

  getResumeFileUrl,
};
