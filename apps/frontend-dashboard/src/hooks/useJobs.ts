import { useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/jobService';
import { resumeService } from '../services/resumeService';
import type { Job, JobMatchDetail, Resume } from '../types';
import { MOCK_JOBS } from '../data/mockJobs';

function mapApiJobToJob(apiJob: {
  id: string;
  title: string;
  domain?: string;
  requiredExperience?: number;
  location?: string;
  requiredSkills?: string[];
  keywords?: string[];
}): Job {
  return {
    jobId: apiJob.id,
    title: apiJob.title,
    domain: apiJob.domain ?? 'General',
    experienceRange: apiJob.requiredExperience
      ? `${apiJob.requiredExperience}+ years`
      : 'Not specified',
    location: apiJob.location ?? 'Not specified',
    skills: apiJob.requiredSkills ?? [],
    keywords: apiJob.keywords ?? [],
  };
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [jobMatches, setJobMatches] = useState<Record<string, JobMatchDetail>>({});
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      let jobsData: Job[] = [];
      try {
        const apiJobs = await jobService.getJobsWithMatches();
        jobsData = apiJobs.map((job: unknown) => mapApiJobToJob(job as Parameters<typeof mapApiJobToJob>[0]));
      } catch {
        jobsData = MOCK_JOBS;
      }

      const matches: Record<string, JobMatchDetail> = {};
      for (const job of jobsData) {
        try {
          const matchDetail = await jobService.getJobMatches(job.jobId);
          if (matchDetail) matches[job.jobId] = matchDetail;
        } catch {
          // skip
        }
      }

      setJobMatches(matches);
      setJobs(jobsData);
    } catch {
      setJobs(MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadJobMatches = useCallback(async (jobId: string) => {
    if (jobMatches[jobId]) return jobMatches[jobId];
    try {
      const matchDetail = await jobService.getJobMatches(jobId);
      if (matchDetail) {
        setJobMatches((prev) => ({ ...prev, [jobId]: matchDetail }));
        return matchDetail;
      }
    } catch (err) {
      console.error(`Failed to load matches for job ${jobId}:`, err);
    }
    return null;
  }, [jobMatches]);

  const loadResumeForView = useCallback(async (resumeId: string) => {
    try {
      const resume = await resumeService.getResume(resumeId);
      setSelectedResume(resume);
    } catch (err) {
      console.error('Failed to load resume:', err);
    }
  }, []);

  const clearSelectedResume = useCallback(() => setSelectedResume(null), []);

  return {
    jobs,
    jobMatches,
    loading,
    loadData,
    loadJobMatches,
    loadResumeForView,
    selectedResume,
    clearSelectedResume,
  };
}
