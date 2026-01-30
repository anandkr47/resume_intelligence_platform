export function formatMatchScore(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

export function isHighMatch(score: number, threshold: number = 0.7): boolean {
  return score >= threshold;
}

export function categorizeMatch(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 0.8) return 'excellent';
  if (score >= 0.6) return 'good';
  if (score >= 0.4) return 'fair';
  return 'poor';
}
