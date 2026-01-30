import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '@resume-platform/logger';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error('Request error', {
    error: error.message,
    stack: error.stack,
    path: request.url,
    method: request.method,
    statusCode: error.statusCode,
  });

  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' ? error.message : 'Internal server error';

  return reply.status(statusCode).send({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}
