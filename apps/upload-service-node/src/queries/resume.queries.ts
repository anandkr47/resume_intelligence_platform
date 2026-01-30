/** Resumes SQL queries for upload service */

export const INSERT_RESUME = `
  INSERT INTO resumes (id, file_name, file_path, mime_type, file_size, status, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, NOW())
`;

export const GET_RESUME_BY_ID = `SELECT * FROM resumes WHERE id = $1`;

export const UPDATE_RESUME_STATUS = `
  UPDATE resumes SET status = $1, updated_at = NOW() WHERE id = $2
`;

export const DELETE_RESUME = `DELETE FROM resumes WHERE id = $1`;
