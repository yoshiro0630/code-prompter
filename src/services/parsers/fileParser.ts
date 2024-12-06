import { DocumentParserResult, SupportedFileType } from '../../types/document-types';
import { parseText } from './textParser';
import { parsePdf } from './pdfParser';

export const parseFile = async (file: File): Promise<DocumentParserResult> => {
  const fileType = getFileType(file.name);
  if (!fileType) {
    return {
      success: false,
      document: null,
      error: `Unsupported file type: ${file.name}`
    };
  }

  try {
    switch (fileType) {
      case 'pdf':
        return await parsePdf(file);
      case 'txt':
      case 'md':
        return await parseText(file);
      default:
        return {
          success: false,
          document: null,
          error: `Unsupported file type: ${fileType}`
        };
    }
  } catch (error) {
    return {
      success: false,
      document: null,
      error: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const getFileType = (fileName: string): SupportedFileType | null => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return ['pdf', 'txt', 'md'].includes(extension || '') 
    ? (extension as SupportedFileType) 
    : null;
};

export const getSupportedFileTypes = (): SupportedFileType[] => ['pdf', 'txt', 'md'];

export const getMimeType = (fileType: SupportedFileType): string => {
  const mimeTypes: Record<SupportedFileType, string> = {
    pdf: 'application/pdf',
    txt: 'text/plain',
    md: 'text/markdown',
    docx: 'application/docx'
  };
  return mimeTypes[fileType];
};