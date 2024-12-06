import { DocumentContent, DocumentParserResult, DocumentProcessorOptions } from '../../../types/document-types';
import { extractSections } from './sectionExtractor';
import { formatContent } from './contentFormatter';

export const processContent = async (
  parseResult: DocumentParserResult,
  options: DocumentProcessorOptions
): Promise<DocumentContent> => {
  if (!parseResult.success || !parseResult.content) {
    throw new Error(parseResult.error || 'Failed to parse document');
  }

  let processedContent = parseResult.content;

  if (options.extractSections) {
    const sections = await extractSections(processedContent);
    processedContent = formatContent(sections, processedContent);
  }

  return {
    content: processedContent,
    rawContent: processedContent,
    metadata: parseResult.metadata || {
      fileName: 'unknown',
      fileType: 'txt',
      fileSize: 0,
      timestamp: new Date().toISOString()
    }
  };
};