export type ApiProviderType = 'openai';

export interface ApiProvider {
  generate(request: ApiRequest): Promise<ApiResponse>;
  listModels(): Promise<string[]>;
  validateApiKey(): Promise<boolean>;
}

export interface ApiRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ApiResponse {
  content: string;
  model: string;
  provider: string;
  usage: object;
}