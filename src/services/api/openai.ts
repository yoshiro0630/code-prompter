import OpenAI from 'openai';
import { useAPIStore } from '../../stores/apiStore';
import { decryptData } from '../../utils/encryption';
import { toast } from 'react-hot-toast';
import { ModelConfig } from '../../types/models';

const createOpenAIClient = () => {
  const encryptedKey = useAPIStore.getState().apiKey;
  
  if (!encryptedKey) {
    toast.error('Please configure your OpenAI API key');
    useAPIStore.setState({ showAPISettings: true });
    throw new Error('OpenAI API key not configured');
  }

  const apiKey = decryptData(encryptedKey);
  
  if (!apiKey) {
    toast.error('Invalid OpenAI API key');
    useAPIStore.setState({ showAPISettings: true });
    throw new Error('Invalid API key');
  }

  return new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateOpenAIResponse = async (prompt: string, modelConfig: ModelConfig): Promise<string> => {
  try {
    const client = createOpenAIClient();
    
    // Ensure we're using a valid OpenAI model
    const model = modelConfig.model === 'gpt-4' ? 'gpt-4' : 'gpt-3.5-turbo';
    
    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: modelConfig.temperature,
      max_tokens: modelConfig.maxTokens
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    if (error.status === 401) {
      toast.error('Invalid API key. Please check your API key in settings.');
      useAPIStore.setState({ showAPISettings: true });
    } else if (error.status === 404) {
      toast.error('Selected model is not available. Switching to GPT-3.5-turbo.');
      useAPIStore.getState().setModelConfig({ model: 'gpt-3.5-turbo' });
    } else if (error.status === 429) {
      toast.error('Rate limit exceeded. Please try again later.');
    } else if (error.status === 500) {
      toast.error('OpenAI service error. Please try again.');
    } else {
      toast.error('Failed to generate response. Please try again.');
    }
    
    throw error;
  }
};