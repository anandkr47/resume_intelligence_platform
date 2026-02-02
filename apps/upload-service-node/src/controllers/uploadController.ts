import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { pipeline } from 'stream/promises';
import { createWriteStream, createReadStream } from 'fs';
import { config } from '@resume-platform/config';
import { logger } from '@resume-platform/logger';
import { validateFile } from '../validators/fileValidator';
import { dbService } from '../services/dbService';
import { generateUniqueFileName, getUploadPath } from '../utils/fileUtils';
import { queueHandler } from '../queues/queueHandler';
import { createConcurrencyLimiter } from '../utils/concurrency';
import { UPLOADS, RESUME_STATUS } from '../constants';

const uploadsDir = config.upload.directory || UPLOADS.DEFAULT_DIR;
fs.mkdir(uploadsDir, { recursive: true }).catch(err => {
  logger.error('Failed to create uploads directory', { error: err.message });
});

/** Limit concurrent uploads per process when UPLOAD_MAX_CONCURRENT is set; scale via replicas for more capacity */
const uploadLimiter = createConcurrencyLimiter(config.upload.maxConcurrent ?? 0);

export async function uploadSingle(request: FastifyRequest, reply: FastifyReply) {
  await uploadLimiter.acquire();
  try {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    if (!config.upload.allowedTypes.includes(data.mimetype)) {
      return reply.status(400).send({ error: `File type ${data.mimetype} not allowed` });
    }

    const uniqueName = generateUniqueFileName(data.filename);
    const filePath = getUploadPath(uniqueName);

    await pipeline(data.file, createWriteStream(filePath));
    const stats = await fs.stat(filePath);

    const validation = await validateFile(filePath);
    if (!validation.valid) {
      await fs.unlink(filePath).catch(() => {});
      return reply.status(400).send({ error: validation.error });
    }

    const resumeId = uuidv4();
    await dbService.createResume({
      id: resumeId,
      fileName: data.filename,
      filePath: filePath,
      mimeType: data.mimetype,
      fileSize: stats.size,
      status: RESUME_STATUS.UPLOADED,
    });

    await queueHandler.queueOCRJob({
      resumeId,
      filePath: filePath,
      fileName: data.filename,
      mimeType: data.mimetype,
    });

    logger.info('Resume uploaded and queued for processing', {
      resumeId,
      fileName: data.filename,
    });

    return reply.status(201).send({
      resumeId,
      fileName: data.filename,
      status: RESUME_STATUS.UPLOADED,
      message: 'Resume uploaded successfully and queued for processing',
    });
  } catch (error: any) {
    logger.error('Upload error', { error: error.message, stack: error.stack });
    return reply.status(500).send({ error: 'Failed to upload resume' });
  } finally {
    uploadLimiter.release();
  }
}

export async function uploadMultiple(request: FastifyRequest, reply: FastifyReply) {
  await uploadLimiter.acquire();
  try {
    const parts = request.parts();
    const results: Array<{ resumeId?: string; fileName: string; status: string; error?: string }> = [];
    const files: Array<{ data: any; filename: string; mimetype: string; filePath: string }> = [];

    for await (const part of parts) {
      if (part.type === 'file') {
        const data = part as any;

        if (!config.upload.allowedTypes.includes(data.mimetype)) {
          results.push({
            fileName: data.filename,
            status: RESUME_STATUS.FAILED,
            error: `File type ${data.mimetype} not allowed`,
          });
          continue;
        }

        const uniqueName = `${uuidv4()}${path.extname(data.filename)}`;
        const filePath = path.join(uploadsDir, uniqueName);
        await pipeline(data.file, createWriteStream(filePath));
        files.push({
          data,
          filename: data.filename,
          mimetype: data.mimetype,
          filePath,
        });
      }
    }

    if (files.length === 0) {
      return reply.status(400).send({ error: 'No files uploaded' });
    }

    for (const file of files) {
      try {
        const stats = await fs.stat(file.filePath);
        const validation = await validateFile(file.filePath);

        if (!validation.valid) {
          await fs.unlink(file.filePath).catch(() => {});
          results.push({
            fileName: file.filename,
            status: RESUME_STATUS.FAILED,
            error: validation.error,
          });
          continue;
        }

        const resumeId = uuidv4();
        await dbService.createResume({
          id: resumeId,
          fileName: file.filename,
          filePath: file.filePath,
          mimeType: file.mimetype,
          fileSize: stats.size,
          status: RESUME_STATUS.UPLOADED,
        });

        await queueHandler.queueOCRJob({
          resumeId,
          filePath: file.filePath,
          fileName: file.filename,
          mimeType: file.mimetype,
        });

        results.push({
          resumeId,
          fileName: file.filename,
          status: RESUME_STATUS.UPLOADED,
        });

        logger.info('Resume uploaded and queued', {
          resumeId,
          fileName: file.filename,
        });
      } catch (error: any) {
        logger.error('Error processing file', {
          fileName: file.filename,
          error: error.message,
        });
        await fs.unlink(file.filePath).catch(() => {});
        results.push({
          fileName: file.filename,
          status: RESUME_STATUS.FAILED,
          error: error.message,
        });
      }
    }

    const successCount = results.filter(r => r.status === RESUME_STATUS.UPLOADED).length;
    const failCount = results.length - successCount;

    return reply.status(201).send({
      total: results.length,
      success: successCount,
      failed: failCount,
      results,
    });
  } catch (error: any) {
    logger.error('Batch upload error', { error: error.message });
    return reply.status(500).send({ error: 'Failed to process uploads' });
  } finally {
    uploadLimiter.release();
  }
}

export async function getUploadStatus(
  request: FastifyRequest<{ Params: { resumeId: string } }>,
  reply: FastifyReply
) {
  try {
    const { resumeId } = request.params;
    const resume = await dbService.getResume(resumeId);

    if (!resume) {
      return reply.status(404).send({ error: 'Resume not found' });
    }

    return reply.send({
      resumeId: resume.id,
      status: resume.status,
      fileName: resume.file_name,
      createdAt: resume.created_at,
    });
  } catch (error: any) {
    logger.error('Error fetching resume status', { error: error.message });
    return reply.status(500).send({ error: 'Failed to fetch status' });
  }
}

export async function deleteResume(
  request: FastifyRequest<{ Params: { resumeId: string } }>,
  reply: FastifyReply
) {
  try {
    const { resumeId } = request.params;
    const resume = await dbService.getResume(resumeId);

    if (!resume) {
      return reply.status(404).send({ error: 'Resume not found' });
    }

    await fs.unlink(resume.file_path).catch(() => {
      logger.warn('File not found regarding resume record', {
        resumeId,
        filePath: resume.file_path,
      });
    });

    await dbService.deleteResume(resumeId);

    logger.info('Resume deleted', { resumeId });
    return reply.send({ success: true, message: 'Resume deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting resume', { error: error.message });
    return reply.status(500).send({ error: 'Failed to delete resume' });
  }
}

export async function getResumeFile(
  request: FastifyRequest<{ Params: { resumeId: string } }>,
  reply: FastifyReply
) {
  try {
    const { resumeId } = request.params;
    const resume = await dbService.getResume(resumeId);

    if (!resume) {
      return reply.status(404).send({ error: 'Resume not found' });
    }

    try {
      await fs.access(resume.file_path);
    } catch {
      return reply.status(404).send({ error: 'File not found on server' });
    }

    reply.header('Content-Type', resume.mime_type);
    reply.header('Content-Disposition', `inline; filename="${resume.file_name}"`);

    return reply.send(createReadStream(resume.file_path));
  } catch (error: any) {
    logger.error('Error serving file', { error: error.message });
    return reply.status(500).send({ error: 'Failed to serve file' });
  }
}

export async function queueMatcherJob(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { resumeId } = request.body as { resumeId: string };

    if (!resumeId) {
      return reply.status(400).send({ error: 'resumeId is required' });
    }

    await queueHandler.queueMatcherJob(resumeId);

    return reply.status(200).send({
      success: true,
      message: 'Matcher job queued',
      resumeId,
    });
  } catch (error: any) {
    logger.error('Error queueing matcher job', { error: error.message });
    return reply.status(500).send({ error: 'Failed to queue matcher job' });
  }
}
