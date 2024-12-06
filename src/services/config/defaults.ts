import { StageConfig } from '../../types/config-types';

export const defaultConfigs: Record<string, StageConfig> = {
  overview: {
    maxPrompts: 5,
    optimizationSettings: {
      focus: 'clarity',
      iterativeRefinement: true
    }
  },
  requirements: {
    maxPrompts: 20,
    optimizationSettings: {
      focus: 'technical',
      iterativeRefinement: true
    }
  },
  timeline: {
    maxPrompts: 15,
    optimizationSettings: {
      focus: 'clarity',
      iterativeRefinement: true
    }
  },
  budget: {
    maxPrompts: 10,
    optimizationSettings: {
      focus: 'technical',
      iterativeRefinement: true
    }
  }
};

export const getDefaultConfig = (stage: string): StageConfig => {
  return defaultConfigs[stage.toLowerCase()] || {
    maxPrompts: 5,
    optimizationSettings: {
      focus: 'clarity',
      iterativeRefinement: true
    }
  };
};