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

export function getFindByRoleQuery(roleId?: string): {
  text: string;
  paramCount: number;
  limitIndex: number;
  offsetIndex: number;
} {
  let text = MATCH_SELECT_BASE.trim();
  let paramCount = 1; // minScore
  if (roleId) {
    text += ' AND rm.role_id = $2';
    paramCount = 2;
  }
  text += ' ORDER BY rm.match_score DESC';
  const limitIndex = paramCount + 1;
  const offsetIndex = paramCount + 2;
  text += ` LIMIT $${limitIndex} OFFSET $${offsetIndex}`;
  return { text, paramCount: offsetIndex, limitIndex, offsetIndex };
}

export function getCountByRoleQuery(roleId?: string): { text: string; paramCount: number } {
  let text = `
    SELECT COUNT(*) as count
    FROM resume_matches rm
    WHERE rm.match_score >= $1
  `.trim();
  if (roleId) {
    text += ' AND rm.role_id = $2';
    return { text, paramCount: 2 };
  }
  return { text, paramCount: 1 };
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

export const GET_ROLES_WITH_MATCHES = `
  SELECT DISTINCT jr.id, jr.title
  FROM resume_matches rm
  JOIN job_roles jr ON rm.role_id = jr.id
  WHERE rm.match_score >= $1
  ORDER BY jr.title
`;
