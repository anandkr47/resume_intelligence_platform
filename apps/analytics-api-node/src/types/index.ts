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

export interface ResumeFilters {
  keyword?: string;
  location?: string;
  minScore?: number;
  roleId?: string;
}

export interface ResumeMatch {
  id: string;
  resume_id: string;
  role_id: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  experience_match: boolean;
  file_name?: string;
  name?: string;
  email?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}
