import { config } from '@resume-platform/config';
import type { QueueConfig } from '../types';

export const matcherQueueConfig: QueueConfig = {
  queueName: 'matcher-queue',
  concurrency: config.matcher?.concurrency || 5,
  retryAttempts: 3,
  retryDelay: 5000, // 5 seconds
};

export const queueJobTypes = {
  PROCESS_MATCH: 'process-match',
} as const;
