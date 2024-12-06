import { SupportedFileType } from '../../../types/document-types';

export const getSupportedFileTypes = (): SupportedFileType[] => ['pdf', 'docx', 'txt', 'md'];

export const getFileType = (fileName: string): SupportedFileType | null => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return getSupportedFileTypes().includes(extension as SupportedFileType) 
    ? (extension as SupportedFileType) 
    : null;
};

export const validateFileType = (fileName: string): boolean => {
  return getFileType(fileName) !== null;
};

export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size > 0 && size <= maxSize;
};

export const getMimeType = (fileType: SupportedFileType): string => {
  const mimeTypes: Record<SupportedFileType, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    md: 'text/markdown'
  };
  return mimeTypes[fileType];
};