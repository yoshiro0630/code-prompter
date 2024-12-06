import OpenAI from 'openai';
import { ApiProvider, ApiRequest, ApiResponse } from '../types/api-types';
import { apiConfig } from '../config/api-config';

export class OpenAIProvider implements ApiProvider {
  private client: OpenAI;
  private defaultModel: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: apiConfig.openai.apiKey,
      organization: apiConfig.openai.organization,
    });
    this.defaultModel = apiConfig.openai.defaultModel;
  }

  async generate(request: ApiRequest): Promise<ApiResponse> {
    const completion = await this.client.chat.completions.create({
      model: request.model || this.defaultModel,
      messages: [{ role: 'user', content: request.prompt }],
      max_tokens: request.maxTokens,
      temperature: request.temperature,
    });

    return {
      content: completion.choices[0].message.content || '',
      model: completion.model,
      provider: 'openai',
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
    };
  }

  async listModels(): Promise<string[]> {
    const models = await this.client.models.list();
    return models.data.map(model => model.id);
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }
}