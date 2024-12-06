import { PromptStage } from '../../../types/prompt-types';
import { analyzeStructure } from './structure-analyzer';
import { analyzeContent } from './content-analyzer';
import { analyzeQuality } from './quality-analyzer';

export interface PromptAnalysis {
  structure: {
    isValid: boolean;
    sections: string[];
    missingComponents: string[];
  };
  content: {
    keyTopics: string[];
    complexity: 'low' | 'medium' | 'high';
    suggestedPromptCount: number;
  };
  quality: {
    clarity: number;
    specificity: number;
    actionability: number;
    suggestions: string[];
  };
}

export async function analyzePrompt(content: string, stage: PromptStage): Promise<PromptAnalysis> {
  const structureAnalysis = analyzeStructure(content);
  const contentAnalysis = await analyzeContent(content, stage);
  const qualityAnalysis = analyzeQuality(content);

  return {
    structure: structureAnalysis,
    content: contentAnalysis,
    quality: qualityAnalysis
  };
}