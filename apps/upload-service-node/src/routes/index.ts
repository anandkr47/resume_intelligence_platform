import { FastifyInstance } from 'fastify';
import { registerUploadRoutes } from './upload.routes';
import { registerHealthRoutes } from './health';

export async function registerRoutes(app: FastifyInstance) {
  await registerHealthRoutes(app);
  await registerUploadRoutes(app);
}
