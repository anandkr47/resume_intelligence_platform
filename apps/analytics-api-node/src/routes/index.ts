import { FastifyInstance } from 'fastify';
import { registerAnalyticsRoutes } from './analytics.routes';
import { registerJobRoutes } from './job.routes';
import { registerHealthRoutes } from './health';

const API_V1_PREFIX = '/api/v1';

export async function registerRoutes(app: FastifyInstance) {
  await registerHealthRoutes(app);
  await registerAnalyticsRoutes(app, API_V1_PREFIX);
  await registerJobRoutes(app, API_V1_PREFIX);
}
