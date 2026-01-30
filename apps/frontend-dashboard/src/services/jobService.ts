import { apiClient } from './apiClient';
import { API_PATHS } from '../constants';

export const jobService = {
  async getJobs() {
    const { data } = await apiClient.get(API_PATHS.JOBS.LIST);
    return data;
  },

  async getJobsWithMatches() {
    const { data } = await apiClient.get(API_PATHS.JOBS.WITH_MATCHES);
    return data;
  },

  async getJobById(id: string) {
    const { data } = await apiClient.get(API_PATHS.JOBS.BY_ID(id));
    return data;
  },

  async getJobMatches(jobId: string, minScore: number = 0) {
    const { data } = await apiClient.get(API_PATHS.JOBS.MATCHES(jobId), {
      params: { minScore },
    });
    return data;
  },

  async seedJobs() {
    const { data } = await apiClient.post(API_PATHS.JOBS.SEED);
    return data;
  },
};
