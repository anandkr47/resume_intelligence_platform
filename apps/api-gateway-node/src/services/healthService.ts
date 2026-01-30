import axios from 'axios';
import { config } from '@resume-platform/config';
import { logger } from '@resume-platform/logger';
import { HealthCheckResponse } from '../types';

class HealthService {
  async checkServiceHealth(url: string, timeout: number = 5000): Promise<string> {
    try {
      const response = await axios.get(`${url}/health`, { timeout });
      return response.status === 200 ? 'healthy' : 'unhealthy';
    } catch (error) {
      logger.warn(`Health check failed for ${url}`, { error });
      return 'unhealthy';
    }
  }

  async getHealthStatus(): Promise<HealthCheckResponse> {
    const [uploadStatus, analyticsStatus] = await Promise.all([
      this.checkServiceHealth(config.uploadService.url),
      this.checkServiceHealth(config.analyticsApi.url),
    ]);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        upload: uploadStatus,
        analytics: analyticsStatus,
      },
    };
  }
}

export const healthService = new HealthService();
