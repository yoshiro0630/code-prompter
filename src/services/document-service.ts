// ```typescript
import { DocumentContent, DocumentParserResult } from '../types/document-types';
import path from 'path';

export class DocumentService {
  async parseDocument(file: File): Promise<DocumentParserResult> {
    try {
      const content: DocumentContent = {
        rawContent: await file.text(),
        metadata: {
          fileName: file.name,
          fileType: path.extname(file.name).slice(1),
          fileSize: file.size,
          timestamp: new Date().toISOString()
        },
        content: undefined,
      };

      return {
        success: true,
        document: content
      };
    } catch (error) {
      return {
        success: false,
        document: null,
        error: `Document parsing failed: ${(error as Error).message}`
      };
    }
  }

  getSupportedFileTypes(): string[] {
    return ['txt', 'md', 'docx', 'pdf'];
  }
}
