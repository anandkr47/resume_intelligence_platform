import { FastifyInstance } from 'fastify';
import * as uploadController from '../controllers/uploadController';

const API_V1_PREFIX = '/api/v1';

export async function registerUploadRoutes(app: FastifyInstance) {
  const uploadPrefix = `${API_V1_PREFIX}/upload`;

  app.post(`${uploadPrefix}/single`, uploadController.uploadSingle);
  app.post(`${uploadPrefix}/multiple`, uploadController.uploadMultiple);
  app.get(`${uploadPrefix}/:resumeId/status`, uploadController.getUploadStatus);
  app.delete(`${uploadPrefix}/resumes/:resumeId`, uploadController.deleteResume);
  app.get(`${uploadPrefix}/resumes/:resumeId/file`, uploadController.getResumeFile);

  // Internal endpoint for parser worker (no version prefix for backward compatibility)
  app.post('/api/internal/queue/matcher', uploadController.queueMatcherJob);
}
