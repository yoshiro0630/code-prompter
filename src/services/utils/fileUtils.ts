import { SupportedFileType } from '../../types/document-types';

export const getSupportedFileTypes = (): SupportedFileType[] => ['pdf', 'docx', 'txt', 'md'];

export const getFileType = (fileName: string): SupportedFileType | null => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return (extension as SupportedFileType) || null;
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

export const validateFileType = (fileName: string): boolean => {
  const fileType = getFileType(fileName);
  return fileType !== null && getSupportedFileTypes().includes(fileType);
};