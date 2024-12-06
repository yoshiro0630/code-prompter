import { DocumentContent, DocumentProcessorOptions } from '../../types/document-types';
import { parseFile } from './parsers';
import { validateFile } from './validators';
import { processContent } from './processors';
import { toast } from 'react-hot-toast';

export class FileProcessor {
  async processFile(
    file: File, 
    options: DocumentProcessorOptions = {}
  ): Promise<DocumentContent> {
    try {
      // Validate file
      await validateFile(file);

      // Parse file content
      const parseResult = await parseFile(file);
      
      // Process content with options
      const processedContent = await processContent(parseResult, options);

      return processedContent;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process file';
      toast.error(message);
      throw error;
    }
  }
}