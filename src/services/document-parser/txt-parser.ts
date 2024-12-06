import { DocumentProcessor, DocumentParserResult } from '../../types/document-types';
import { extractSections } from './section-extractor';

export class TxtParser implements DocumentProcessor {
  async parseDocument(buffer: Buffer, fileName: string): Promise<DocumentParserResult> {
    try {
      const content = buffer.toString('utf-8');
      const sections = await extractSections(content);
      
      return {
        success: true,
        document: {
          content,
          sections,
          metadata: {
            fileName,
            fileType: 'txt',
            uploadDate: new Date(),
            fileSize: buffer.length,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        document: null,
        error: `Failed to parse TXT: ${(error as Error).message}`,
      };
    }
  }

  supports(fileType: string): boolean {
    return fileType.toLowerCase() === 'txt';
  }
}