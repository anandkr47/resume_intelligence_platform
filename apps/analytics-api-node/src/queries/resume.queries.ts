import type { ResumeFilters } from '../types';

/** Resumes SQL queries */

export const FIND_RESUME_BY_ID = `SELECT * FROM resumes WHERE id = $1`;

export const COUNT_RESUMES = `SELECT COUNT(*) as count FROM resumes`;

export const COUNT_RESUMES_BY_STATUS = `SELECT COUNT(*) as count FROM resumes WHERE status = $1`;

/**
 * Build dynamic findAll query and params for resumes with optional filters.
 */
export function buildFindAllResumesQuery(
  filters: ResumeFilters,
  limit: number
): { text: string; values: unknown[] } {
  let query = 'SELECT * FROM resumes WHERE 1=1';
  const values: unknown[] = [];
  let paramIndex = 1;

  if (filters.keyword) {
    query += ` AND (name ILIKE $${paramIndex} OR file_name ILIKE $${paramIndex})`;
    values.push(`%${filters.keyword}%`);
    paramIndex++;
  }

  if (filters.location) {
    query += ` AND location ILIKE $${paramIndex}`;
    values.push(`%${filters.location}%`);
    paramIndex++;
  }

  if (filters.minScore != null && filters.minScore !== undefined && filters.roleId) {
    query += ` AND id IN (
      SELECT resume_id FROM resume_matches 
      WHERE role_id = $${paramIndex} AND match_score >= $${paramIndex + 1}
    )`;
    values.push(filters.roleId, filters.minScore);
    paramIndex += 2;
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
  values.push(limit);

  return { text: query, values };
}
