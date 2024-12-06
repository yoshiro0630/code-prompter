import { DocumentSections } from '../../../types/document-types';

export const formatContent = (
  sections: DocumentSections,
  rawContent: string
): string => {
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

export const cleanupContent = (content: string): string => {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};