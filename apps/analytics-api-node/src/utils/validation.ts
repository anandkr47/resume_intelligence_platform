import { VALIDATION } from '../constants';

export function validateLimit(
  limit: string | undefined,
  defaultLimit: number = VALIDATION.DEFAULT_LIMIT,
  maxLimit: number = VALIDATION.MAX_LIMIT
): number {
  if (!limit) return defaultLimit;
  const parsed = parseInt(limit, 10);
  if (isNaN(parsed) || parsed < 1) return defaultLimit;
  return Math.min(parsed, maxLimit);
}

export function validateMinScore(
  score: string | undefined,
  defaultScore: number = VALIDATION.DEFAULT_MIN_SCORE
): number {
  if (!score) return defaultScore;
  const parsed = parseFloat(score);
  if (isNaN(parsed) || parsed < 0) return defaultScore;
  return Math.min(parsed, 100);
}

export function sanitizeKeyword(keyword: string | undefined): string | undefined {
  if (!keyword) return undefined;
  return keyword.trim().substring(0, VALIDATION.MAX_KEYWORD_LENGTH);
}
