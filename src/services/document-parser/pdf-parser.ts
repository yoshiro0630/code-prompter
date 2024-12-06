import PDFParse from 'pdf-parse';
import { DocumentProcessor, DocumentParserResult } from '../../types/document-types';
import { extractSections } from './section-extractor';

export class PDFParser implements DocumentProcessor {
  async parseDocument(buffer: Buffer, fileName: string): Promise<DocumentParserResult> {
    try {
      const pdfData = await PDFParse(buffer);
      
      const sections = await extractSections(pdfData.text);
      
      return {
        success: true,
        document: {
          content: pdfData.text,
          sections,
          metadata: {
            fileName,
            fileType: 'pdf',
            uploadDate: new Date(),
            fileSize: buffer.length,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        document: null,
        error: `Failed to parse PDF: ${(error as Error).message}`,
      };
    }
  }

  supports(fileType: string): boolean {
    return fileType.toLowerCase() === 'pdf';
  }
}