import { config } from '@resume-platform/config';
import type { GatewayRouteConfig } from '../types';

/** All backend services expose APIs under /api/v1; gateway rewrites client paths to these. */
export const gatewayRoutes: Record<string, GatewayRouteConfig> = {
  upload: {
    upstream: config.uploadService.url,
    prefix: '/api/upload',
    rewritePrefix: '/api/v1/upload',
    timeout: 30000, // 30 seconds for file uploads
  },
  analytics: {
    upstream: config.analyticsApi.url,
    prefix: '/api/analytics',
    rewritePrefix: '/api/v1',
    timeout: 10000,
  },
  jobs: {
    upstream: config.analyticsApi.url,
    prefix: '/api/jobs',
    rewritePrefix: '/api/v1/jobs',
    timeout: 10000,
  },
  resumes: {
    upstream: config.analyticsApi.url,
    prefix: '/api/resumes',
    rewritePrefix: '/api/v1/resumes',
    timeout: 10000,
  },
};

export const rateLimitConfig = {
  max: 100,
  timeWindow: '15 minutes',
};

export const corsConfig = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
