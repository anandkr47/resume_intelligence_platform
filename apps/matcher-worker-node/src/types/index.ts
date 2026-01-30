export interface MatchJobData {
  resumeId: string;
}

export interface MatchResult {
  resumeId: string;
  matches: Array<{
    roleId: string;
    matchScore: number;
  }>;
  status: 'completed' | 'failed';
  error?: string;
}

export interface ResumeWithParsedData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  parsed_data?: any;
}

export interface QueueConfig {
  queueName: string;
  concurrency: number;
  retryAttempts: number;
  retryDelay: number;
}
