import { ProjectType } from '../types/questions';

export const generateSuggestions = (
  questionId: string,
  previousAnswers: Record<string, string>,
  projectType: ProjectType
): string[] => {
  const suggestions: string[] = [];
  
  switch (questionId) {
    case 'features':
      if (projectType === 'website' && previousAnswers.objective) {
        suggestions.push(
          `Based on your objective "${previousAnswers.objective}", consider features like user authentication, responsive design, and search functionality`,
          `Common website features include contact forms, navigation menus, and social media integration`
        );
      } else if (projectType === 'mobileApp' && previousAnswers.objective) {
        suggestions.push(
          `For a mobile app focused on "${previousAnswers.objective}", consider features like push notifications, offline mode, and user profiles`,
          `Popular mobile app features include social sharing, data synchronization, and in-app messaging`
        );
      }
      break;
      
    case 'userActions':
      if (previousAnswers.features) {
        suggestions.push(
          `To support the features "${previousAnswers.features}", users might need to perform actions like:`,
          `Based on similar applications, consider actions such as:`
        );
      }
      break;
  }
  
  return suggestions;
};

export const validateAnswer = (answer: string, required: boolean): boolean => {
  if (!required) return true;
  return answer.trim().length >= 10;
};

export const formatAnswersForPrompt = (
  answers: Record<string, string>,
  projectType: ProjectType
): string => {
  const sections = [
    `# ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Overview`,
    answers.objective && `## Objective\n${answers.objective}`,
    answers.users && `## Target Users\n${answers.users}`,
    answers.features && `## Core Features\n${answers.features}`,
    answers.userActions && `## User Actions\n${answers.userActions}`,
  ].filter(Boolean);

  return sections.join('\n\n');
};