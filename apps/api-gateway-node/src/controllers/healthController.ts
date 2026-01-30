import { FastifyRequest, FastifyReply } from 'fastify';
import { healthService } from '../services/healthService';

export async function getHealth(request: FastifyRequest, reply: FastifyReply) {
  const health = await healthService.getHealthStatus();
  return health;
}
