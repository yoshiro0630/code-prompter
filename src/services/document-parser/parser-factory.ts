import { PDFParser } from './pdf-parser';
import { DocxParser } from './docx-parser';
import { TxtParser } from './txt-parser';
import { DocumentProcessor, SupportedFileType } from '../../types/document-types';

export class ParserFactory {
  private static parsers: DocumentProcessor[] = [
    new PDFParser(),
    new DocxParser(),
    new TxtParser(),
  ];

  static getParser(fileType: string): DocumentProcessor {
    const parser = this.parsers.find(p => p.supports(fileType));
    if (!parser) {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
    return parser;
  }

  static getSupportedTypes(): SupportedFileType[] {
    return ['pdf', 'docx', 'txt'];
  }
}