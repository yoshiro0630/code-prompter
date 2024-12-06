import { PromptStage } from './prompt-types';

export type ExportFormat = 'txt' | 'docx' | 'gdoc';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata: boolean;
  separateFiles: boolean;
}

export interface ExportResult {
  success: boolean;
  data?: Blob;
  error?: string;
}