export type OptimizationFocus = 'clarity' | 'technical' | 'creative' | 'audience';

export interface OptimizationSettings {
  focus: OptimizationFocus;
  iterativeRefinement: boolean;
  audience?: string;
  customInstructions?: string;
  customRule?: string;
  useCustomRule?: boolean;
}

export interface ParsedPrompt {
  title: string;
  objective: string;
  prompt: string;
  outcome: string;
}

export interface PromptStage {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'overview' | 'requirements' | 'timeline' | 'budget' | 'custom';
  metadata?: {
    sourceSection?: string;
    aiSuggestions?: string[];
    userModifications?: string[];
    optimizationSettings?: OptimizationSettings;
  };
}

export interface GeneratedPrompt {
  stageId: string;
  content: string;
  suggestions?: string[];
  context?: {
    previousStages?: string[];
    relatedSections?: string[];
  };
  metadata?: {
    validation: {
      isValid: boolean;
      errors: string[];
      warnings: string[];
    };
    categorizedPrompts: {
      promptNumber: number;
      title: string;
      category: {
        id: string;
        name: string;
        description: string;
        priority: number;
      };
      content: string;
    }[];
    requestedPromptCount: number; // Add this line
    actualPromptCount: number;
  };
}

export type ProjectType = 'website' | 'mobile' | 'desktop';

export class StageTemplate {
  type: string;
  title: string;
  promptTemplate: string;
  suggestedSections: string[];
  order: number;
  maxPrompts: number;

  constructor(
      type: string,
      title: string,
      promptTemplate: string,
      suggestedSections: string[],
      order: number,
      maxPrompts: number
  ) {
      this.type = type;
      this.title = title;
      this.promptTemplate = promptTemplate;
      this.suggestedSections = suggestedSections;
      this.order = order;
      this.maxPrompts = maxPrompts;
  }
}

export interface PromptGenerationRequest {
  // Define the structure of PromptGenerationRequest here
  documentId: string;
  stageId: string;
  context?: {
    previousStages?: string[];
    customInstructions?: string;
  };
}
