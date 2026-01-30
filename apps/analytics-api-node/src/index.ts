import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { randomUUID } from 'crypto';
import { config } from '@resume-platform/config';
import { logger } from '@resume-platform/logger';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: FastifyInstance = Fastify({
  logger: false,
  requestIdLogLabel: 'reqId',
  genReqId: () => randomUUID(),
});

async function setup() {
  // Register plugins
  await app.register(cors, {
    origin: true,
  });

  // Request logging
  app.addHook('onRequest', async (request, reply) => {
    const start = Date.now();
    (request as any).startTime = start;
  });

  app.addHook('onSend', async (request, reply) => {
    const startTime = (request as any).startTime || Date.now();
    const duration = Date.now() - startTime;
    logger.info('HTTP Request', {
      method: request.method,
      path: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      ip: request.ip,
    });
  });

  // Register routes (api/v1 structure)
  await registerRoutes(app);

  // Error handler
  app.setErrorHandler(errorHandler);
}

const PORT = config.analyticsApi.port;

const start = async () => {
  try {
    await setup();
    await app.ready(); // Ensure plugins are loaded
    console.log(app.printRoutes());
    await app.listen({ port: PORT, host: '0.0.0.0' });
    logger.info(`Analytics API running on port ${PORT}`);
  } catch (err) {
    logger.error('Error starting server', { error: err });
    process.exit(1);
  }
};

start();

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await app.close();
  process.exit(0);
});
