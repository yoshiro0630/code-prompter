import { generateResponse } from '../api';
import { useAPIStore } from '../../stores/apiStore';
import { ProjectType } from '../../types/questions';
import { toast } from 'react-hot-toast';

const MAX_QUESTIONS = 8;

const getInitialQuestion = (projectType: ProjectType): string => {
  const questions = {
    website: "What is the main purpose and key objectives of this website?",
    mobileApp: "What is the primary purpose and target audience of this mobile app?",
    dashboard: "What key metrics and data will this dashboard visualize and track?",
    custom: "What specific problem or business need will this custom tool address?"
  };

  return questions[projectType] || "What is the main purpose of this software?";
};

export const generateDynamicQuestions = async (
  projectType: ProjectType,
  previousAnswers: Record<string, string>
): Promise<string[]> => {
  const { apiKey } = useAPIStore.getState();

  if (!apiKey) {
    toast.error('Please configure your API key first');
    throw new Error('No API key configured');
  }

  // Return initial question if no previous answers
  if (Object.keys(previousAnswers).length === 0) {
    return [getInitialQuestion(projectType)];
  }

  // Check if we've reached the maximum number of questions
  const currentQuestionCount = Object.keys(previousAnswers).length;
  if (currentQuestionCount >= MAX_QUESTIONS) {
    return [];
  }

  const prompt = `As an expert software development consultant, generate TWO questions for gathering requirements for a ${projectType} project. Consider the following context:

Previous Questions and Answers:
${formatPreviousAnswers(previousAnswers)}

Generate:
1. The next most relevant question to ask
2. A suggested answer or example response to guide the user

Each question should:
1. Build upon the information already provided
2. Help gather more detailed requirements
3. Be specific to the ${projectType} project type
4. Include clear examples

Note: This is question ${currentQuestionCount + 1} of ${MAX_QUESTIONS}.

Focus Areas Based on Current Stage:
${getFocusAreas(currentQuestionCount)}

Format: Return exactly TWO lines:
Line 1: The next question
Line 2: A suggested example answer`;

  try {
    const response = await generateResponse(prompt);
    const [question, suggestion] = response.split('\n').map(line => cleanupResponse(line));
    return [question, suggestion].filter(Boolean);
  } catch (error) {
    console.error('Failed to generate dynamic question:', error);
    toast.error('Failed to generate question. Please try again.');
    throw error;
  }
};

const formatPreviousAnswers = (answers: Record<string, string>): string => {
  return Object.entries(answers)
    .map(([key, value], index) => `Q${index + 1}: ${value}`)
    .join('\n\n');
};

const getFocusAreas = (questionCount: number): string => {
  const areas = [
    'Core purpose and objectives',
    'Key features and functionality',
    'User interface and experience',
    'Technical requirements',
    'Data handling and storage',
    'Security and compliance',
    'Integration requirements',
    'Timeline and milestones'
  ];

  return areas[questionCount] || 'Project requirements and specifications';
};

const cleanupResponse = (response: string): string => {
  // Remove any markdown formatting or numbering
  let cleaned = response.replace(/^[#\-*\d.]+\s*/gm, '').trim();
  
  // Ensure questions end with a question mark
  if (cleaned.match(/^[^?]*$/)) {
    cleaned += '?';
  }
  
  return cleaned;
};