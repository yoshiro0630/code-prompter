import { OpenAIProvider } from '../providers/openai-provider';
// import { AnthropicProvider } from '../providers/anthropic-provider';
// import { PalmProvider } from '../providers/palm-provider';
// import { CustomProvider } from '../providers/custom-provider';
import { ApiProvider, ApiRequest, ApiResponse } from '../types/api-types';

export class ApiService {
  private providers: Map<string, ApiProvider>;

  constructor() {
    this.providers = new Map();
    this.initializeProviders();
  }

  private initializeProviders() {
    this.providers.set('openai', new OpenAIProvider());
    // this.providers.set('anthropic', new AnthropicProvider());
    // this.providers.set('palm', new PalmProvider());

    try {
      // this.providers.set('custom', new CustomProvider());
    } catch (error) {
      console.log('Custom provider not configured');
    }
  }

  async generate(provider: string, request: ApiRequest): Promise<ApiResponse> {
    const apiProvider = this.providers.get(provider);
    if (!apiProvider) {
      throw new Error(`Provider ${provider} not found`);
    }
    return apiProvider.generate(request);
  }

  async listModels(provider: string): Promise<string[]> {
    const apiProvider = this.providers.get(provider);
    if (!apiProvider) {
      throw new Error(`Provider ${provider} not found`);
    }
    return apiProvider.listModels();
  }

  async validateApiKey(provider: string): Promise<boolean> {
    const apiProvider = this.providers.get(provider);
    if (!apiProvider) {
      throw new Error(`Provider ${provider} not found`);
    }
    return apiProvider.validateApiKey();
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}