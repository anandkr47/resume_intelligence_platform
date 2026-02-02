import type { ResumeFilters } from '../types';

/** Resumes SQL queries */

export const FIND_RESUME_BY_ID = `SELECT * FROM resumes WHERE id = $1`;

export const COUNT_RESUMES = `SELECT COUNT(*) as count FROM resumes`;

export const COUNT_RESUMES_BY_STATUS = `SELECT COUNT(*) as count FROM resumes WHERE status = $1`;

const SORT_COLUMNS: Record<string, string> = {
  created_at: 'created_at',
  name: 'name',
  file_name: 'file_name',
  status: 'status',
};

/**
 * Build dynamic count query for resumes with optional filters.
 */
export function buildCountResumesQuery(filters: ResumeFilters): { text: string; values: unknown[] } {
  let query = 'SELECT COUNT(*) as count FROM resumes WHERE 1=1';
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

  if (filters.roleId || (filters.minScore != null && filters.minScore > 0)) {
    if (filters.roleId && (filters.minScore == null || filters.minScore === 0)) {
      query += ` AND id IN (SELECT resume_id FROM resume_matches WHERE role_id = $${paramIndex})`;
      values.push(filters.roleId);
      paramIndex += 1;
    } else if (filters.roleId && filters.minScore != null && filters.minScore > 0) {
      query += ` AND id IN (
        SELECT resume_id FROM resume_matches 
        WHERE role_id = $${paramIndex} AND match_score >= $${paramIndex + 1}
      )`;
      values.push(filters.roleId, filters.minScore);
      paramIndex += 2;
    } else if (filters.minScore != null && filters.minScore > 0) {
      query += ` AND id IN (
        SELECT resume_id FROM resume_matches 
        WHERE match_score >= $${paramIndex}
      )`;
      values.push(filters.minScore);
      paramIndex += 1;
    }
  }

  return { text: query, values };
}

/**
 * Build dynamic findAll query and params for resumes with optional filters, pagination, and sort.
 */
export function buildFindAllResumesQuery(
  filters: ResumeFilters,
  limit: number,
  offset: number = 0,
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
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

  if (filters.roleId || (filters.minScore != null && filters.minScore > 0)) {
    if (filters.roleId && (filters.minScore == null || filters.minScore === 0)) {
      query += ` AND id IN (SELECT resume_id FROM resume_matches WHERE role_id = $${paramIndex})`;
      values.push(filters.roleId);
      paramIndex += 1;
    } else if (filters.roleId && filters.minScore != null && filters.minScore > 0) {
      query += ` AND id IN (
        SELECT resume_id FROM resume_matches 
        WHERE role_id = $${paramIndex} AND match_score >= $${paramIndex + 1}
      )`;
      values.push(filters.roleId, filters.minScore);
      paramIndex += 2;
    } else if (filters.minScore != null && filters.minScore > 0) {
      query += ` AND id IN (
        SELECT resume_id FROM resume_matches 
        WHERE match_score >= $${paramIndex}
      )`;
      values.push(filters.minScore);
      paramIndex += 1;
    }
  }

  const orderColumn = SORT_COLUMNS[sortBy] || 'created_at';
  query += ` ORDER BY ${orderColumn} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  return { text: query, values };
}
