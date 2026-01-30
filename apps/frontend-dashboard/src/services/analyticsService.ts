import { apiClient } from './apiClient';
import type { ResumeFilters } from '../types';
import { API_PATHS } from '../constants';

const DEFAULT_TOP_SKILLS_LIMIT = 10;

export const analyticsService = {
  async getDashboardSummary() {
    const { data } = await apiClient.get(API_PATHS.ANALYTICS.DASHBOARD);
    return data;
  },

  async getTopSkills(limit: number = DEFAULT_TOP_SKILLS_LIMIT) {
    const { data } = await apiClient.get(API_PATHS.ANALYTICS.SKILLS_TOP, {
      params: { limit },
    });
    return data;
  },

  async getExperienceStats() {
    const { data } = await apiClient.get(API_PATHS.ANALYTICS.EXPERIENCE_STATS);
    return data;
  },

  async getEducationStats() {
    const { data } = await apiClient.get(API_PATHS.ANALYTICS.EDUCATION_STATS);
    return data;
  },

  async getRoleMatches(roleId?: string, minScore: number = 0) {
    const params: Record<string, unknown> = { minScore };
    if (roleId) params.roleId = roleId;
    const { data } = await apiClient.get(API_PATHS.ANALYTICS.MATCHES, { params });
    return data;
  },

  async getResumes(filters: ResumeFilters) {
    const { data } = await apiClient.get(API_PATHS.ANALYTICS.RESUMES, {
      params: filters,
    });
    return data;
  },

  async exportResumes(resumeIds?: string[]) {
    const { data } = await apiClient.post(API_PATHS.ANALYTICS.EXPORT_CSV, {
      resumeIds,
    });
    return data;
  },
};
