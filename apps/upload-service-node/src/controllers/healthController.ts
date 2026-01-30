import { FastifyInstance } from 'fastify';

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      service: 'upload-service',
      timestamp: new Date().toISOString(),
    };
  });
}
