/** Job roles SQL queries */

const JOB_SELECT_FIELDS = `id, title, required_skills as "requiredSkills", preferred_skills as "preferredSkills", required_experience as "requiredExperience", keywords, location, description, created_at, updated_at`;

const JOB_RETURNING = `RETURNING id, title, required_skills as "requiredSkills", preferred_skills as "preferredSkills", required_experience as "requiredExperience", keywords, location, description, created_at, updated_at`;

export const FIND_ALL_JOBS = `SELECT ${JOB_SELECT_FIELDS} FROM job_roles ORDER BY created_at DESC`;

export const FIND_JOB_BY_ID = `SELECT ${JOB_SELECT_FIELDS} FROM job_roles WHERE id = $1`;

export const FIND_JOB_BY_TITLE = `SELECT ${JOB_SELECT_FIELDS} FROM job_roles WHERE title ILIKE $1 LIMIT 1`;

export const SELECT_JOB_ID_BY_TITLE = `SELECT id FROM job_roles WHERE title = $1`;

export const INSERT_JOB = `INSERT INTO job_roles (title, required_skills, preferred_skills, required_experience, keywords, location, description) VALUES ($1, $2, $3, $4, $5, $6, $7) ${JOB_RETURNING}`;
