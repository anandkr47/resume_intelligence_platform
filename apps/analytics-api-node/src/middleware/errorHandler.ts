import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '@resume-platform/logger';
import { ApiError } from '../types';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error('Analytics API error', {
    error: error.message,
    stack: error.stack,
    path: request.url,
    method: request.method,
    statusCode: error.statusCode,
  });

  const statusCode = error.statusCode || 500;
  const apiError: ApiError = {
    error: 'Internal server error',
    statusCode,
  };

  if (process.env.NODE_ENV === 'development') {
    apiError.message = error.message;
  }

  return reply.status(statusCode).send(apiError);
}
