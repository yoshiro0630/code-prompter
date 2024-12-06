import { ProjectType } from '../types/questions';

export const formatAnswersForBrief = (
  answers: Record<string, string>,
  projectType: ProjectType
): Record<string, string> => {
  const sections = {
    overview: Object.entries(answers).slice(0, 3).map(([_, value]) => value).join('\n\n'),
    requirements: Object.entries(answers).slice(3).map(([_, value]) => `- ${value}`).join('\n'),
    technical: [
      `Project Type: ${projectType}`,
      'Development Approach: Modern web development best practices',
      'Quality Standards: High emphasis on code quality and testing',
      'Documentation: Comprehensive technical and user documentation'
    ].join('\n'),
    implementation: [
      'Initial Setup and Configuration',
      'Core Feature Development',
      'Testing and Quality Assurance',
      'Documentation and Deployment',
      'Maintenance and Support'
    ].map((step, index) => `${index + 1}. ${step}`).join('\n')
  };

  const briefContent = `# ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Design Brief

## Project Overview
${sections.overview}

## Requirements
${sections.requirements}

## Technical Specifications
${sections.technical}

## Implementation Plan
${sections.implementation}`;

  return { type: 'brief', content: briefContent };
};

export const formatAnswersForPrompts = (
  answers: Record<string, string>,
  projectType: ProjectType
): Record<string, string> => {
  const promptContent = `# ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Requirements

${Object.entries(answers).map(([_, value]) => value).join('\n\n')}

Please analyze the above requirements and generate staged prompts for building this project.
Each stage should follow this format:

Prompt [1]: [Feature/Objective Title]
Objective: [Clear description of the prompt's goal]
Prompt: [Detailed prompt for development]
Outcome: [Expected results upon completion]

Generate 3-5 prompts that cover the key aspects of the project.`;

  return { type: 'prompts', content: promptContent };
};

export const formatBriefForExport = (
  answers: Record<string, string>,
  projectType: ProjectType
): string => {
  const { content } = formatAnswersForBrief(answers, projectType);
  return content;
};