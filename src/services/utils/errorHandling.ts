import { DocumentParserResult } from '../../types/document-types';

export const handleParserError = (error: unknown, fileType: string): DocumentParserResult => {
  console.error(`Error parsing ${fileType} file:`, error);
  return {
    success: false,
    document: null,
    error: `Failed to parse ${fileType} file: ${error instanceof Error ? error.message : 'Unknown error'}`
  };
};

export const validateFileContent = (content: string | null | undefined): DocumentParserResult => {
  if (!content?.trim()) {
    return {
      success: false,
      document: null,
      error: 'No content found in file'
    };
  }
  return { success: true, content, document: null, };
};