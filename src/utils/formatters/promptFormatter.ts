import { ProjectType } from '../../types/questions';

export const formatPromptContent = (
  answers: Record<string, string>,
  projectType: ProjectType
): string => {
  return `# ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Requirements

${Object.entries(answers).map(([_, value]) => value).join('\n\n')}

Please analyze the above requirements and generate staged prompts for building this project.
Each stage should follow this format:

Prompt [1]: [Feature/Objective Title]
Objective: [Clear description of the prompt's goal]
Prompt: [Detailed prompt for development]
Outcome: [Expected results upon completion]

Generate 3-5 prompts that cover the key aspects of the project.`;
};

export const formatAnswersForPrompts = (
  answers: Record<string, string>,
  projectType: ProjectType
): Record<string, string> => {
  return {
    type: 'prompts',
    content: formatPromptContent(answers, projectType)
  };
};