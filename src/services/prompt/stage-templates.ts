import { StageTemplate } from '../../types/prompt-types';

export const stageTemplates: StageTemplate[] = [
  {
    type: 'overview',
    title: 'Project Overview',
    promptTemplate: 'Create a comprehensive project overview addressing:\n' +
      '1. Project scope and objectives\n' +
      '2. Key stakeholders\n' +
      '3. Primary deliverables\n' +
      '4. Success criteria',
    suggestedSections: ['projectOverview', 'userStories'],
    order: 1,
    maxPrompts: 5
  },
  {
    type: 'requirements',
    title: 'Functional Requirements',
    promptTemplate: 'Define the core functional requirements including:\n' +
      '1. Essential features\n' +
      '2. User interactions\n' +
      '3. System behaviors\n' +
      '4. Data handling requirements',
    suggestedSections: ['functionalRequirements', 'userStories'],
    order: 2,
    maxPrompts: 20
  },
  {
    type: 'timeline',
    title: 'Development Timeline',
    promptTemplate: 'Outline the development timeline covering:\n' +
      '1. Major milestones\n' +
      '2. Phase breakdowns\n' +
      '3. Resource allocation\n' +
      '4. Dependencies',
    suggestedSections: ['projectOverview', 'functionalRequirements'],
    order: 3,
    maxPrompts: 15
  },
  {
    type: 'budget',
    title: 'Budget Estimation',
    promptTemplate: 'Provide a detailed budget breakdown including:\n' +
      '1. Development costs\n' +
      '2. Resource allocation\n' +
      '3. Infrastructure costs\n' +
      '4. Contingency planning',
    suggestedSections: ['functionalRequirements', 'nonFunctionalRequirements'],
    order: 4,
    maxPrompts: 10
  }
];