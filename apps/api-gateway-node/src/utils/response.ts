import { FastifyReply } from 'fastify';
import { ApiResponse } from '../types';

export function sendSuccess<T>(reply: FastifyReply, data: T, statusCode: number = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  return reply.status(statusCode).send(response);
}

export function sendError(reply: FastifyReply, error: string, statusCode: number = 500) {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return reply.status(statusCode).send(response);
}
