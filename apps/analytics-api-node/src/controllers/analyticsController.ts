import { FastifyRequest, FastifyReply } from 'fastify';
import { analyticsService } from '../services/analyticsService';
import { validateLimit, validateMinScore, sanitizeKeyword } from '../utils/validation';

export async function getDashboard(request: FastifyRequest, reply: FastifyReply) {
  try {
    const summary = await analyticsService.getDashboardSummary();
    return summary;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function getTopSkills(
  request: FastifyRequest<{ Querystring: { limit?: string } }>,
  reply: FastifyReply
) {
  try {
    const limit = validateLimit(request.query.limit, 10, 100);
    const skills = await analyticsService.getTopSkills(limit);
    return skills;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function getExperienceStats(request: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await analyticsService.getExperienceStats();
    return stats;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function getEducationStats(request: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await analyticsService.getEducationStats();
    return stats;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function getRoleMatches(
  request: FastifyRequest<{ Querystring: { roleId?: string; minScore?: string } }>,
  reply: FastifyReply
) {
  try {
    const roleId = request.query.roleId;
    const minScore = validateMinScore(request.query.minScore, 0);
    const matches = await analyticsService.getRoleMatches(roleId, minScore);
    return matches;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function getResumes(
  request: FastifyRequest<{
    Querystring: {
      keyword?: string;
      location?: string;
      minScore?: string;
      roleId?: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const filters = {
      keyword: sanitizeKeyword(request.query.keyword),
      location: sanitizeKeyword(request.query.location),
      minScore: validateMinScore(request.query.minScore, 0),
      roleId: request.query.roleId,
    };
    const resumes = await analyticsService.getResumes(filters);
    return resumes;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function getResumeById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const resume = await analyticsService.getResume(id);

    if (!resume) {
      return reply.status(404).send({ error: 'Resume not found' });
    }

    return resume;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function exportResumesCsv(
  request: FastifyRequest<{
    Body: {
      resumeIds?: string[];
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { resumeIds } = request.body || {};
    const exportResult = await analyticsService.exportResumesToCSV(resumeIds);
    return exportResult;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}
