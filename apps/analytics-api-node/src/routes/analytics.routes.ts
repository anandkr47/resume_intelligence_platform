import { FastifyInstance } from 'fastify';
import * as analyticsController from '../controllers/analyticsController';

export async function registerAnalyticsRoutes(app: FastifyInstance, prefix: string = '/api/v1') {
  app.get(`${prefix}/dashboard`, analyticsController.getDashboard);
  app.get(`${prefix}/skills/top`, analyticsController.getTopSkills);
  app.get(`${prefix}/experience/stats`, analyticsController.getExperienceStats);
  app.get(`${prefix}/education/stats`, analyticsController.getEducationStats);
  app.get(`${prefix}/matches`, analyticsController.getRoleMatches);
  app.get(`${prefix}/resumes`, analyticsController.getResumes);
  app.get(`${prefix}/resumes/:id`, analyticsController.getResumeById);
  app.post(`${prefix}/export/csv`, analyticsController.exportResumesCsv);
}
