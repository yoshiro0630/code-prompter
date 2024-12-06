import Anthropic from '@anthropic-ai/sdk';
import { useAPIStore } from '../../stores/apiStore';

export const createAnthropicClient = () => {
  const apiKey = useAPIStore.getState().apiKey;
  if (!apiKey) throw new Error('Anthropic API key not configured');
  
  return new Anthropic({ apiKey });
};

export const generateAnthropicResponse = async (prompt: string, modelConfig: any) => {
  const client = createAnthropicClient();
  
  const response = await client.messages.create({
    model: modelConfig.model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: modelConfig.maxTokens,
  });

  return response.content[0].type;
};