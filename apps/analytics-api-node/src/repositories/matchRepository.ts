import { Pool } from 'pg';
import { config } from '@resume-platform/config';
import { getFindByRoleQuery, GET_SUMMARY_BY_ROLE } from '../queries/match.queries';

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  max: 20,
});

export class MatchRepository {
  async findByRole(roleId?: string, minScore: number = 0, limit: number = 100) {
    const client = await pool.connect();
    try {
      const { text, paramCount } = getFindByRoleQuery(roleId);
      const params: any[] = [minScore];
      if (roleId) params.push(roleId);
      params.push(limit);
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getSummaryByRole() {
    const client = await pool.connect();
    try {
      const result = await client.query(GET_SUMMARY_BY_ROLE);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async close() {
    await pool.end();
  }
}

export const matchRepository = new MatchRepository();
