export const formatGuidedAnswers = (answers: Record<string, string>): string => {
  const sections = [
    '# Project Overview',
    answers.objective,
    '\n# Target Users',
    answers.users,
    '\n# Problem Statement',
    answers.problem,
    '\n# Desired Outcome',
    answers.outcome,
    '\n# Core Features',
    answers.features,
    '\n# User Actions',
    answers.userActions,
    answers.integrations ? '\n# External Integrations\n' + answers.integrations : '',
    '\n# Data Management',
    answers.data,
    '\n# User Interface',
    answers.userInterface,
    '\n# Platform Support',
    answers.platforms,
    answers.accessibility ? '\n# Accessibility Requirements\n' + answers.accessibility : '',
    '\n# Technical Requirements',
    answers.technologies ? '## Technologies\n' + answers.technologies : '',
    answers.performance ? '## Performance Requirements\n' + answers.performance : '',
    answers.security ? '## Security Requirements\n' + answers.security : '',
    answers.scalability ? '## Scalability Requirements\n' + answers.scalability : ''
  ].filter(Boolean).join('\n\n');

  return `${sections}\n\nPlease analyze the above requirements and generate staged prompts for building this project.
Each stage should follow this format:

Prompt [1]: [Feature/Objective Title]
Objective: [Clear description of the prompt's goal]
Prompt: [Detailed prompt for development]
Outcome: [Expected results upon completion]

Generate 3-5 prompts that cover the key aspects of the project.`;
};