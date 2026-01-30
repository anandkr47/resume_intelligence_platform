/**
 * Legacy facade - prefer importing from services/ (analyticsService, jobService, resumeService, uploadService).
 * This file delegates to the modular services.
 */
import type { ResumeFilters } from '../types';
import { analyticsService } from './analyticsService';
import { jobService } from './jobService';
import { resumeService, getResumeFileUrl } from './resumeService';
import { uploadService } from './uploadService';

export const apiService = {
  uploadSingle: (file: File) => uploadService.uploadSingle(file),
  uploadMultiple: (formData: FormData) => uploadService.uploadMultiple(formData),

  getDashboardSummary: () => analyticsService.getDashboardSummary(),
  getTopSkills: (limit?: number) => analyticsService.getTopSkills(limit),
  getExperienceStats: () => analyticsService.getExperienceStats(),
  getEducationStats: () => analyticsService.getEducationStats(),
  getRoleMatches: (roleId?: string, minScore?: number) =>
    analyticsService.getRoleMatches(roleId, minScore),
  getResumes: (filters: ResumeFilters) => analyticsService.getResumes(filters),
  exportResumes: (resumeIds?: string[]) => analyticsService.exportResumes(resumeIds),

  getJobs: () => jobService.getJobs(),
  getJobsWithMatches: () => jobService.getJobsWithMatches(),
  getJobById: (id: string) => jobService.getJobById(id),
  getJobMatches: (jobId: string, minScore?: number) =>
    jobService.getJobMatches(jobId, minScore),
  seedJobs: () => jobService.seedJobs(),

  getResume: (id: string) => resumeService.getResume(id),
  deleteResume: (id: string) => resumeService.deleteResume(id),
  getResumeFileUrl,
};
