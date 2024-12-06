export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
}

export interface ModelConfig {
  provider: string;
  model: string;
  temperature: number;
  maxTokens: number;
}