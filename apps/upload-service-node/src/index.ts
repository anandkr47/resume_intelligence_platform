import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
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

  await app.register(multipart, {
    limits: {
      fileSize: config.upload.maxSize,
    },
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

const PORT = config.uploadService.port;

const start = async () => {
  try {
    await setup();
    await app.listen({ port: PORT, host: '0.0.0.0', backlog: 512 });
    logger.info(`Upload Service running on port ${PORT}`);
  } catch (err) {
    logger.error('Error starting server', { error: err });
    process.exit(1);
  }
};

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await app.close();
  process.exit(0);
});
