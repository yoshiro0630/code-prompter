import { generateOpenAIResponse } from './openai';
import { generateAnthropicResponse } from './anthropic';
import { generatePalmResponse } from './palm';
import { ModelConfig } from '../../types/models';
import { useAPIStore } from '../../stores/apiStore';
import { toast } from 'react-hot-toast';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

export const generateResponse = async (
  provider: string,
  prompt: string,
  modelConfig: ModelConfig
): Promise<string> => {
  let lastError;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      switch (provider) {
        case 'openai':
          return await generateOpenAIResponse(prompt, modelConfig);
        case 'anthropic':
          return await generateAnthropicResponse(prompt, modelConfig);
        case 'palm':
          return await generatePalmResponse(prompt, modelConfig);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on authentication errors
      if (error.status === 401) {
        throw error;
      }
      
      // Wait before retrying
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
      }
    }
  }

  // If we get here, all retries failed
  console.error(`Failed after ${MAX_RETRIES} attempts:`, lastError);
  throw lastError;
};