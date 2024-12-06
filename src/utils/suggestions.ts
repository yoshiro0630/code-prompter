import { ProjectType } from '../types/questions';

export const generateSuggestion = (
  questionId: string,
  previousAnswers: Record<string, string>,
  projectType: ProjectType
): string | undefined => {
  // Generate contextual suggestions based on previous answers
  switch (questionId) {
    case 'features':
      if (previousAnswers.objective) {
        return `Based on your objective "${previousAnswers.objective}", consider including features like: ${getFeatureSuggestions(projectType)}`;
      }
      break;
      
    case 'userActions':
      if (previousAnswers.features) {
        return `To support the features you mentioned, typical user actions might include: ${getUserActionSuggestions(previousAnswers.features)}`;
      }
      break;
      
    case 'technologies':
      return getTechnologySuggestions(projectType);
      
    case 'integrations':
      return getIntegrationSuggestions(projectType, previousAnswers);
  }
  
  return undefined;
};

const getFeatureSuggestions = (projectType: ProjectType): string => {
  const suggestions = {
    website: 'user authentication, responsive design, search functionality, contact forms',
    mobileApp: 'push notifications, offline mode, user profiles, social sharing',
    dashboard: 'real-time updates, data filtering, export options, customizable widgets',
    custom: 'user management, data validation, reporting, automated workflows'
  };
  
  return suggestions[projectType] || suggestions.custom;
};

const getUserActionSuggestions = (features: string): string => {
  if (features.toLowerCase().includes('authentication')) {
    return 'login, register, reset password, update profile';
  }
  if (features.toLowerCase().includes('search')) {
    return 'search by keywords, filter results, save searches, view history';
  }
  return 'create, read, update, delete records, customize settings';
};

const getTechnologySuggestions = (projectType: ProjectType): string => {
  const suggestions = {
    website: 'React/Next.js for frontend, Node.js/Express for backend, PostgreSQL for database',
    mobileApp: 'React Native for cross-platform, Firebase for backend, Redux for state management',
    dashboard: 'Vue.js with Vuex, D3.js for visualizations, WebSocket for real-time updates',
    custom: 'TypeScript, NestJS, MongoDB, Docker for containerization'
  };
  
  return suggestions[projectType] || suggestions.custom;
};

const getIntegrationSuggestions = (projectType: ProjectType, answers: Record<string, string>): string => {
  const baseIntegrations = {
    website: 'payment gateways (Stripe), email service (SendGrid), analytics (Google Analytics)',
    mobileApp: 'social auth providers, cloud storage, push notification services',
    dashboard: 'data sources APIs, export services, notification systems',
    custom: 'third-party APIs, authentication providers, storage services'
  };
  
  let suggestion = baseIntegrations[projectType] || baseIntegrations.custom;
  
  if (answers.features?.toLowerCase().includes('payment')) {
    suggestion += ', payment processing services';
  }
  if (answers.features?.toLowerCase().includes('email')) {
    suggestion += ', email delivery services';
  }
  
  return suggestion;
};