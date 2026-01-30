/** Resumes SQL queries for export worker */

const RESUME_EXPORT_SELECT = `id, file_name, name, email, phone, skills, experience, education, status, created_at`;

export const GET_RESUMES_FOR_EXPORT_ALL = `
  SELECT ${RESUME_EXPORT_SELECT}
  FROM resumes
  ORDER BY created_at DESC
`;

export const GET_RESUMES_BY_IDS = `
  SELECT ${RESUME_EXPORT_SELECT}
  FROM resumes
  WHERE id = ANY($1)
  ORDER BY created_at DESC
`;
