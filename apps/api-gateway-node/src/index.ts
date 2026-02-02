import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { randomUUID } from 'crypto';
import { config } from '@resume-platform/config';
import { logger } from '@resume-platform/logger';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimitConfig, corsConfig, helmetConfig } from './config/gatewayConfig';

const app: FastifyInstance = Fastify({
  logger: false, // We use our custom logger
  requestIdLogLabel: 'reqId',
  genReqId: () => randomUUID(),
});

async function setup() {
  // Register plugins
  await app.register(cors, corsConfig);

  await app.register(helmet, helmetConfig);

  await app.register(rateLimit, rateLimitConfig);

  // Request logging middleware
  type RequestWithStartTime = { startTime?: number };
  app.addHook('onRequest', async (request, _reply) => {
    const start = Date.now();
    (request as RequestWithStartTime).startTime = start;
  });

  app.addHook('onSend', async (request, reply) => {
    const startTime = (request as RequestWithStartTime).startTime ?? Date.now();
    const duration = Date.now() - startTime;
    logger.info('HTTP Request', {
      method: request.method,
      path: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });
  });

  // Register routes (health + proxy)
  await registerRoutes(app);

  // Error handler
  app.setErrorHandler(errorHandler);
}

const PORT = config.apiGateway.port;
const HOST = config.apiGateway.host;

const start = async () => {
  try {
    await setup();
    await app.listen({ port: PORT, host: HOST, backlog: 512 });
    logger.info(`API Gateway running on ${HOST}:${PORT}`);
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
