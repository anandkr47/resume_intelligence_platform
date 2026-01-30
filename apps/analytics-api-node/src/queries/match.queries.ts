/** Resume matches SQL queries */

const MATCH_SELECT_BASE = `
  SELECT 
    rm.*,
    r.file_name,
    r.name,
    r.email,
    jr.title as role_title
  FROM resume_matches rm
  JOIN resumes r ON rm.resume_id = r.id
  JOIN job_roles jr ON rm.role_id = jr.id
  WHERE rm.match_score >= $1
`;

export function getFindByRoleQuery(roleId?: string): { text: string; paramCount: number } {
  let text = MATCH_SELECT_BASE.trim();
  if (roleId) {
    text += ' AND rm.role_id = $2';
  }
  text += ' ORDER BY rm.match_score DESC';
  const paramCount = roleId ? 3 : 2; // minScore, [roleId], limit
  return { text: text + ` LIMIT $${paramCount}`, paramCount };
}

export const GET_SUMMARY_BY_ROLE = `
  SELECT 
    jr.title as role_title,
    COUNT(*) as match_count,
    AVG(rm.match_score) as avg_score
  FROM resume_matches rm
  JOIN job_roles jr ON rm.role_id = jr.id
  GROUP BY jr.id, jr.title
  ORDER BY match_count DESC
`;
