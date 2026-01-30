export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatSkills(skills?: string[]): string {
  if (!skills || skills.length === 0) return '-';
  if (skills.length <= 3) return skills.join(', ');
  return `${skills.slice(0, 3).join(', ')} +${skills.length - 3} more`;
}

export function normalizeMatchScore(score?: number | string): number {
  if (score === undefined || score === null) return 0;
  const numScore = typeof score === 'string' ? parseFloat(score) : score;
  if (isNaN(numScore)) return 0;

  // Handle various score ranges:
  // 1. 0.0 - 1.0 (Unit range)
  if (numScore > 0 && numScore <= 1) {
    return numScore * 100;
  }
  // 2. > 100 (likely Basis Points 0-10000 range)
  if (numScore > 100) {
    return numScore / 100;
  }
  // 3. 0 - 100 (Percentage range)
  return numScore;
}

export function formatMatchScore(score?: number | string): string {
  if (score === undefined || score === null) return '-';
  const percentage = normalizeMatchScore(score);
  return `${percentage.toFixed(0)}%`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
