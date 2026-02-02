import { Pool } from 'pg';
import { config } from '@resume-platform/config';
import {
  getFindByRoleQuery,
  getCountByRoleQuery,
  GET_SUMMARY_BY_ROLE,
  GET_ROLES_WITH_MATCHES,
} from '../queries/match.queries';

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  max: 20,
});

export class MatchRepository {
  async findByRole(
    roleId?: string,
    minScore: number = 0,
    limit: number = 100,
    offset: number = 0
  ) {
    const client = await pool.connect();
    try {
      const { text } = getFindByRoleQuery(roleId);
      const params: unknown[] = [minScore];
      if (roleId) params.push(roleId);
      params.push(limit, offset);
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async countByRole(roleId?: string, minScore: number = 0): Promise<number> {
    const client = await pool.connect();
    try {
      const { text } = getCountByRoleQuery(roleId);
      const params: unknown[] = [minScore];
      if (roleId) params.push(roleId);
      const result = await client.query(text, params);
      return parseInt(result.rows[0]?.count || '0', 10);
    } finally {
      client.release();
    }
  }

  async getRolesWithMatches(minScore: number = 0): Promise<{ id: string; title: string }[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(GET_ROLES_WITH_MATCHES, [minScore]);
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
