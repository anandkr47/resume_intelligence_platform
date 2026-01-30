import { Job } from 'bullmq';
import { QueueJobData } from '@resume-platform/queue-lib';
import { logger } from '@resume-platform/logger';
import { createObjectCsvWriter } from 'csv-writer';
import { dbService } from '../services/dbService';
import { ensureDirectoryExists } from '../utils/fileUtils';
import { ExportResult } from '../types';
import { CSV_EXPORT_HEADERS, EXPORT_STATUS } from '../constants';

export async function processExportJob(job: Job<QueueJobData>): Promise<ExportResult> {
  const { resumeIds, outputPath } = job.data;

  logger.info(`Processing export job for ${resumeIds?.length || 'all'} resumes`);

  try {
    await ensureDirectoryExists(outputPath);

    const resumes = await dbService.getResumesForExport(resumeIds);

    const csvWriter = createObjectCsvWriter({
      path: outputPath,
      header: [...CSV_EXPORT_HEADERS],
    });

    await csvWriter.writeRecords(resumes);

    logger.info(`Export completed: ${outputPath}`, {
      recordCount: resumes.length,
      outputPath,
    });

    return {
      outputPath,
      recordCount: resumes.length,
      status: EXPORT_STATUS.COMPLETED,
    };
  } catch (error: any) {
    logger.error('Export failed', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}
