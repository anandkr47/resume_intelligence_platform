import fs from 'fs/promises';
import { config } from '@resume-platform/config';
import type { FileValidationResult } from '../types';

export async function validateFile(filePath: string): Promise<FileValidationResult> {
  try {
    const stats = await fs.stat(filePath);
    
    // Check file size
    if (stats.size > config.upload.maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${config.upload.maxSize} bytes`,
      };
    }

    // Check if file exists and is readable
    await fs.access(filePath, fs.constants.R_OK);
    
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: `File validation failed: ${error.message}`,
    };
  }
}
