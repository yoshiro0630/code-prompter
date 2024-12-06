import { validateFileType, validateFileSize } from '../utils/fileUtils';

export const validateFile = async (file: File): Promise<void> => {
  // Validate file type
  if (!validateFileType(file.name)) {
    throw new Error('Unsupported file type');
  }

  // Validate file size (10MB limit)
  if (!validateFileSize(file.size, 10 * 1024 * 1024)) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Validate file is not empty
  if (file.size === 0) {
    throw new Error('File is empty');
  }
};