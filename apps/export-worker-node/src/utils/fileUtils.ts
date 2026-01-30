import fs from 'fs/promises';
import path from 'path';

export async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

export function validateOutputPath(outputPath: string): boolean {
  // Basic validation - ensure it's a valid path
  try {
    path.parse(outputPath);
    return true;
  } catch {
    return false;
  }
}
