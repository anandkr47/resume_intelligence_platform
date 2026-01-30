import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import type { SkillCount, ExperienceStats, EducationStats } from '../types';

const DEFAULT_TOP_SKILLS = 15;

export function useAnalytics() {
  const [summary, setSummary] = useState<unknown | null>(null);
  const [topSkills, setTopSkills] = useState<SkillCount[]>([]);
  const [experienceStats, setExperienceStats] = useState<ExperienceStats | null>(null);
  const [educationStats, setEducationStats] = useState<EducationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, skillsData, expData, eduData] = await Promise.all([
        analyticsService.getDashboardSummary(),
        analyticsService.getTopSkills(DEFAULT_TOP_SKILLS),
        analyticsService.getExperienceStats(),
        analyticsService.getEducationStats(),
      ]);
      setSummary(summaryData);
      setTopSkills(skillsData);
      setExperienceStats(expData);
      setEducationStats(eduData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(message);
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return {
    summary,
    topSkills,
    experienceStats,
    educationStats,
    loading,
    error,
    refresh: loadAnalytics,
  };
}
