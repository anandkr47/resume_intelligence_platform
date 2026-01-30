import { FastifyInstance } from 'fastify';
import * as healthController from '../controllers/healthController';

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get('/health', healthController.getHealth);
}
