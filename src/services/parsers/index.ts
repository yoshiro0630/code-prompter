import { DocumentParserResult } from '../../types/document-types';
import { parseDoc } from './docParser';
import { parseDocx } from './docxParser';
import { parsePdf } from './pdfParser';
import { parseText } from './textParser';

export type SupportedFileType = 'pdf' | 'docx' | 'doc' | 'txt' | 'md';

export const getSupportedFileTypes = (): SupportedFileType[] => ['pdf', 'docx', 'doc', 'txt', 'md'];

export const getFileType = (fileName: string): SupportedFileType | null => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return getSupportedFileTypes().includes(extension as SupportedFileType) 
    ? (extension as SupportedFileType) 
    : null;
};

export const getMimeType = (fileType: SupportedFileType): string => {
  const mimeTypes: Record<SupportedFileType, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    txt: 'text/plain',
    md: 'text/markdown'
  };
  return mimeTypes[fileType];
};

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
      case 'docx':
        return await parseDocx(file);
      case 'doc':
        return await parseDoc(file);
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