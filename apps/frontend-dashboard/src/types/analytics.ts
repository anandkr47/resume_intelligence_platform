/** Dashboard summary from API */
export interface DashboardSummary {
  totalResumes: number;
  processedResumes: number;
  topSkills: SkillCount[];
  roleMatches: RoleMatchSummary[];
}

export interface SkillCount {
  skill: string;
  count: number;
}

export interface ExperienceStats {
  avg_years: number;
  min_years: number;
  max_years: number;
}

export interface EducationStats {
  institution: string;
  count: number;
}

export interface RoleMatchSummary {
  role_title: string;
  match_count: number;
  avg_score: number;
}

/** Paginated role matches API response */
export interface RoleMatchesResponse {
  data: RoleMatch[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  uniqueRoles: { id: string; title: string }[];
}

/** Role match row (from getRoleMatches API) */
export interface RoleMatch {
  role_id: string;
  role_title: string;
  resume_id: string;
  name?: string;
  resume_name?: string;
  file_name?: string;
  match_score: number | string;
  matched_skills: string[];
}

/** Chart component props */
export interface SkillsPieChartProps {
  data: SkillCount[];
  limit?: number;
  height?: number;
}

export interface ExperienceChartProps {
  data: ExperienceStats;
  height?: number;
}

export interface EducationBarChartProps {
  data: EducationStats[];
  height?: number;
}

export interface SkillsBarChartProps {
  data: SkillCount[];
  height?: number;
}
