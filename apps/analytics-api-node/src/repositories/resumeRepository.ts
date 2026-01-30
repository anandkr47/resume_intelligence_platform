import { Pool } from 'pg';
import { config } from '@resume-platform/config';
import { ResumeFilters } from '../types';
import {
  buildFindAllResumesQuery,
  FIND_RESUME_BY_ID,
  COUNT_RESUMES,
  COUNT_RESUMES_BY_STATUS,
} from '../queries/resume.queries';

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  max: 20,
});

export class ResumeRepository {
  async findAll(filters: ResumeFilters, limit: number = 100) {
    const client = await pool.connect();
    try {
      const { text, values } = buildFindAllResumesQuery(filters, limit);
      const result = await client.query(text, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async findById(id: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(FIND_RESUME_BY_ID, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async count() {
    const client = await pool.connect();
    try {
      const result = await client.query(COUNT_RESUMES);
      return parseInt(result.rows[0].count);
    } finally {
      client.release();
    }
  }

  async countByStatus(status: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(COUNT_RESUMES_BY_STATUS, [status]);
      return parseInt(result.rows[0].count);
    } finally {
      client.release();
    }
  }

  async close() {
    await pool.end();
  }
}

export const resumeRepository = new ResumeRepository();
