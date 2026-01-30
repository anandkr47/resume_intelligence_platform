import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '@resume-platform/logger';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error('Upload service error', {
    error: error.message,
    stack: error.stack,
    path: request.url,
    method: request.method,
    statusCode: error.statusCode,
  });

  if (error.message.includes('File type') || error.message.includes('File size')) {
    return reply.status(400).send({ error: error.message });
  }

  const statusCode = error.statusCode || 500;
  return reply.status(statusCode).send({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
}
