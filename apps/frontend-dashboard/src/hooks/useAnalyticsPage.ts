import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import type { SkillCount, ExperienceStats, EducationStats, RoleMatch } from '../types';

const DEFAULT_TOP_SKILLS = 15;

export function useAnalyticsPage() {
  const [skills, setSkills] = useState<SkillCount[]>([]);
  const [experience, setExperience] = useState<ExperienceStats | null>(null);
  const [education, setEducation] = useState<EducationStats[]>([]);
  const [matches, setMatches] = useState<RoleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [skillsResult, expResult, eduResult, matchesResult] = await Promise.allSettled([
        analyticsService.getTopSkills(DEFAULT_TOP_SKILLS),
        analyticsService.getExperienceStats(),
        analyticsService.getEducationStats(),
        analyticsService.getRoleMatches(),
      ]);

      if (skillsResult.status === 'fulfilled') setSkills(skillsResult.value ?? []);
      if (expResult.status === 'fulfilled') setExperience(expResult.value ?? null);
      if (eduResult.status === 'fulfilled') setEducation(eduResult.value ?? []);
      if (matchesResult.status === 'fulfilled') setMatches(matchesResult.value ?? []);

      const allRejected =
        skillsResult.status === 'rejected' &&
        expResult.status === 'rejected' &&
        eduResult.status === 'rejected' &&
        matchesResult.status === 'rejected';
      if (allRejected) setError('Failed to load analytics data. Please check your connection and try again.');
    } catch (err) {
      console.error('Unexpected error loading analytics:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const filteredMatches = selectedRole
    ? matches.filter((m) => m.role_id === selectedRole)
    : matches;

  const uniqueRoles = Array.from(
    new Map(matches.map((m) => [m.role_id, { id: m.role_id, title: m.role_title }])).values()
  ).filter((r) => r.id && r.title);

  return {
    skills,
    experience,
    education,
    matches: filteredMatches,
    uniqueRoles,
    selectedRole,
    setSelectedRole,
    loading,
    error,
    loadAnalytics,
  };
}
