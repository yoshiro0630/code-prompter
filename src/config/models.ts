import { Model } from '../types/models';

export const availableModels: Model[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and efficient for most tasks',
    maxTokens: 4096,
    contextWindow: 4096
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    description: 'Most capable GPT-4 model, better at complex tasks',
    maxTokens: 8192,
    contextWindow: 8192
  }
];

export const getDefaultModel = (provider: string): string => {
  const defaultModels: Record<string, string> = {
    openai: 'gpt-3.5-turbo'
  };
  return defaultModels[provider] || 'gpt-3.5-turbo';
};