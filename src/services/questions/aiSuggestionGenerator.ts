import { generateResponse } from '../api';
import { useAPIStore } from '../../stores/apiStore';
import { ProjectType } from '../../types/questions';

export const generateAISuggestion = async (
  projectType: ProjectType,
  previousAnswers: Record<string, string>,
  currentQuestion: string,
  provider: string
): Promise<string> => {
  const { modelConfig } = useAPIStore.getState();

  const prompt = `As an expert software development consultant, suggest a detailed answer to the following question for a ${projectType} project:

Question: ${currentQuestion}

Context from previous answers:
${formatPreviousAnswers(previousAnswers)}

Generate a comprehensive, specific answer that:
1. Aligns with the project type and previous answers
2. Provides concrete examples and details
3. Follows industry best practices
4. Is realistic and implementable

Format: Return ONLY the suggested answer, without any additional formatting or explanation.`;

  try {
    const response = await generateResponse(
      prompt
    );

    return cleanupResponse(response);
  } catch (error) {
    console.error('Failed to generate AI suggestion:', error);
    return '';
  }
};

const formatPreviousAnswers = (answers: Record<string, string>): string => {
  return Object.entries(answers)
    .filter(([_, value]) => value.trim())
    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
    .join('\n');
};

const cleanupResponse = (response: string): string => {
  return response.trim().replace(/^[#\-*\d.]+\s*/gm, '');
};