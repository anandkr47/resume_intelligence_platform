export interface JobRole {
  id: string;
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredExperience?: number; // years
  keywords: string[];
  location?: string;
}

export interface MatchResult {
  roleId: string;
  roleTitle: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: boolean;
  details: {
    skillScore: number;
    keywordScore: number;
    experienceScore: number;
  };
}
