export type ConfigurationMode = 'exclusive' | 'blended';

export interface KnowledgeSource {
  id: string;
  type: 'document' | 'rule' | 'example';
  content: string;
  priority: number;
  metadata?: {
    fileName?: string;
    dateAdded: string;
    lastModified: string;
  };
}

export interface LLMConfiguration {
  mode: ConfigurationMode;
  knowledgeSources: KnowledgeSource[];
  rules: ConfigurationRule[];
  outputPreferences: OutputPreferences;
}

export interface ConfigurationRule {
  id: string;
  type: 'constraint' | 'enhancement' | 'requirement';
  description: string;
  priority: number;
  condition?: string;
  action: string;
}

export interface OutputPreferences {
  annotateKnowledgeSources: boolean;
  showRuleApplication: boolean;
  formatPreferences: {
    includeMetadata: boolean;
    structuredOutput: boolean;
    highlightKeyElements: boolean;
  };
}

export interface StageConfig {
  maxPrompts: number;
  optimizationSettings: {
    focus: 'clarity' | 'technical' | 'creative' | 'audience';
    iterativeRefinement: boolean;
    audience?: string;
    customInstructions?: string;
  };
}