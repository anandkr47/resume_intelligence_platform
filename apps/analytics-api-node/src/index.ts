import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
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

/** Helmet security options (industry-standard HTTP headers). */
const helmetOptions = {
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-site' as const },
  crossOriginOpenerPolicy: { policy: 'same-origin' as const },
  dnsPrefetchControl: { allow: false },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' as const },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' as const },
};

/** Rate limit for analytics API (per IP). */
const rateLimitOptions = {
  max: parseInt(process.env.RATE_LIMIT_MAX || '1000', 10),
  timeWindow: process.env.RATE_LIMIT_WINDOW || '15 minutes',
};

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

async function setup() {
  // Security: Helmet (HTTP headers), rate-limit, CORS
  await app.register(helmet, helmetOptions);
  await app.register(rateLimit, rateLimitOptions);
  await app.register(cors, corsOptions);

  // Request logging
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
