import { apiClient } from './apiClient';
import type { ResumeFilters, PaginatedResponse, Resume } from '../types';
import type { RoleMatchesResponse } from '../types/analytics';
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

  async getRoleMatches(
    roleId?: string,
    minScore: number = 0,
    page: number = 1,
    limit: number = 10
  ): Promise<RoleMatchesResponse> {
    const params: Record<string, unknown> = { minScore, page, limit };
    if (roleId) params.roleId = roleId;
    const { data } = await apiClient.get(API_PATHS.ANALYTICS.MATCHES, { params });
    return data;
  },

  async getResumes(filters: ResumeFilters): Promise<PaginatedResponse<Resume>> {
    const params: Record<string, unknown> = {};
    if (filters.keyword != null) params.keyword = filters.keyword;
    if (filters.location != null) params.location = filters.location;
    if (filters.minScore != null) params.minScore = filters.minScore;
    if (filters.roleId != null) params.roleId = filters.roleId;
    if (filters.page != null) params.page = filters.page;
    if (filters.limit != null) params.limit = filters.limit;
    if (filters.sortBy != null) params.sortBy = filters.sortBy;
    if (filters.sortOrder != null) params.sortOrder = filters.sortOrder;
    const { data } = await apiClient.get(API_PATHS.ANALYTICS.RESUMES, { params });
    return data;
  },

  async exportResumes(resumeIds?: string[]) {
    const { data } = await apiClient.post(API_PATHS.ANALYTICS.EXPORT_CSV, {
      resumeIds,
    });
    return data;
  },
};
