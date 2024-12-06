import mammoth from 'mammoth';
import { DocumentProcessor, DocumentParserResult } from '../../types/document-types';
import { extractSections } from './section-extractor';

export class DocxParser implements DocumentProcessor {
  async parseDocument(buffer: Buffer, fileName: string): Promise<DocumentParserResult> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      
      const sections = await extractSections(result.value);
      
      return {
        success: true,
        document: {
          content: result.value,
          sections,
          metadata: {
            fileName,
            fileType: 'docx',
            uploadDate: new Date(),
            fileSize: buffer.length,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        document: null,
        error: `Failed to parse DOCX: ${(error as Error).message}`,
      };
    }
  }

  supports(fileType: string): boolean {
    return fileType.toLowerCase() === 'docx';
  }
}