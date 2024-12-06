import mammoth from 'mammoth';
import { DocumentParserResult } from '../../types/document-types';
import { cleanupContent } from '../utils/contentFormatter';

export const parseDoc = async (file: File): Promise<DocumentParserResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value) {
      return {
        success: false,
        document: null,
        error: 'No content found in DOC file'
      };
    }

    // Clean up the extracted content
    const cleanedContent = cleanupContent(result.value);

    return {
      success: true,
      document: null,
      content: cleanedContent,
      metadata: {
        fileName: file.name,
        fileType: 'doc',
        fileSize: file.size,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error parsing DOC:', error);
    return {
      success: false,
      document: null,
      error: `Failed to parse DOC file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};