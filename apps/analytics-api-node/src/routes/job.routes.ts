import { FastifyInstance } from 'fastify';
import * as jobController from '../controllers/jobController';

export async function registerJobRoutes(app: FastifyInstance, prefix: string = '/api/v1') {
  app.get(`${prefix}/jobs`, jobController.getAllJobs);
  app.get(`${prefix}/jobs/with-matches`, jobController.getJobsWithMatches);
  app.get(`${prefix}/jobs/:id`, jobController.getJobById);
  app.get(`${prefix}/jobs/:id/matches`, jobController.getJobMatches);
  app.post(`${prefix}/jobs/seed`, jobController.seedJobs);
  app.post(`${prefix}/jobs`, jobController.createJob);
}
