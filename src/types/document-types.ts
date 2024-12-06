export interface DocumentMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  timestamp: string;
}

export interface DocumentContent {
  content: any;
  rawContent: string;
  metadata: {
    fileName: string;
    fileType: string;
    fileSize: number;
    timestamp: string;
  };
}

export interface DocumentParserResult {
  document: any;
  success: boolean;
  content?: string;
  error?: string;
  metadata?: DocumentMetadata;
}

export type SupportedFileType = 'pdf' | 'txt' | 'md' | 'docx';

export interface DocumentProcessorOptions {
  extractSections?: boolean;
  formatContent?: boolean;
  preserveFormatting?: boolean;
}

export interface DocumentSections {
  overview?: string;
  requirements?: string;
  userStories?: string;
  technical?: string;
}

export interface ParserOptions {
  preserveFormatting?: boolean;
  extractImages?: boolean;
  parseLinks?: boolean;
}

export interface ParsedDocument {
  sections: string[];
  // Add other properties as needed
}

export interface DocumentProcessor {
  parseDocument(buffer: Buffer, fileName: string): Promise<DocumentParserResult>;
  supports(fileType: string): boolean;
}