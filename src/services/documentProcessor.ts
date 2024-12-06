import { extractSections } from './extractors/documentSections';
import { toast } from 'react-hot-toast';
import { parsePdf } from './parsers/pdfParser';
import { parseText } from './parsers/textParser';
import { DocumentSections } from '../types/document-types';

interface DocumentContent {
  rawContent: string;
  metadata: {
    fileName: string;
    fileType: string | 'unknown';
    fileSize: number;
    timestamp: string;
  };
}

export const processDocument = async (file: File): Promise<DocumentContent> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  let content = '';
  
  try {
    switch (fileType) {
      case 'pdf':
        const pdfResult = await parsePdf(file);
        if (!pdfResult.success) {
          throw new Error(pdfResult.error);
        }
        content = pdfResult.content ?? '';
        break;
      case 'txt':
      case 'md':
        const textResult = await parseText(file);
        if (!textResult.success) {
          throw new Error(textResult.error);
        }
        content = textResult.content ?? '';
        break;
      default:
        throw new Error('Unsupported file type');
    }

    if (!content) {
      throw new Error('No content found in document');
    }

    // Extract structured sections from the content
    const sections = await extractSections(content);

    // Format the content for the API
    const formattedContent = formatContentForAPI(sections, content);

    return {
      rawContent: formattedContent,
      metadata: {
        fileName: file.name,
        fileType: fileType || 'unknown',
        fileSize: file.size,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error processing document:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to process document');
    throw error;
  }
};

const formatContentForAPI = (sections: DocumentSections, rawContent: string): string => {
  const parts = [];

  // Add sections if they exist
  if (sections.overview) {
    parts.push('# Project Overview\n' + sections.overview);
  }
  
  if (sections.requirements) {
    parts.push('# Requirements\n' + sections.requirements);
  }
  
  if (sections.userStories) {
    parts.push('# User Stories\n' + sections.userStories);
  }
  
  if (sections.technical) {
    parts.push('# Technical Specifications\n' + sections.technical);
  }

  // If no sections were found, use the raw content
  if (parts.length === 0) {
    parts.push('# Document Content\n' + rawContent);
  }

  // Add prompt generation instruction
  parts.push(`
Please analyze the above document and generate staged prompts for building this project.
Each stage should follow this format:

Prompt [1]: [Feature/Objective Title]
Objective: [Clear description of the prompt's goal]
Prompt: [Detailed prompt for development]
Outcome: [Expected results upon completion]

Generate 3-5 prompts that cover the key aspects of the project.
`);

  return parts.join('\n\n');
};
