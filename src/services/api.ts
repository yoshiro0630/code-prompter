import OpenAI from 'openai';
import { useAPIStore } from '../stores/apiStore';
import { decryptData } from '../utils/encryption';
import { toast } from 'react-hot-toast';

export const generateResponse = async (prompt: string): Promise<string> => {
  const { apiKey } = useAPIStore.getState();
  
  if (!apiKey) {
    toast.error('Please configure your API key first');
    useAPIStore.setState({ showAPISettings: true });
    throw new Error('API key not configured');
  }

  const decryptedKey = decryptData(apiKey);
  if (!decryptedKey) {
    toast.error('Invalid API key');
    throw new Error('Invalid API key');
  }

  const openai = new OpenAI({ 
    apiKey: decryptedKey,
    dangerouslyAllowBrowser: true
  });

  try {
    // First try with GPT-4
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from API');
      }

      return response;
    } catch (error: any) {
      // If GPT-4 fails with rate limit, fall back to GPT-3.5
      if (error.status === 429) {
        console.log('Falling back to GPT-3.5-turbo due to rate limit');
        const fallbackCompletion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000
        });

        const fallbackResponse = fallbackCompletion.choices[0]?.message?.content;
        if (!fallbackResponse) {
          throw new Error('No response from fallback API');
        }

        return fallbackResponse;
      }
      throw error;
    }
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    if (error.status === 401) {
      toast.error('Invalid API key. Please check your settings.');
      useAPIStore.setState({ showAPISettings: true });
    } else if (error.status === 429) {
      toast.error('Rate limit exceeded. Please try again later.');
    } else {
      toast.error('Failed to generate response. Please try again.');
    }
    
    throw error;
  }
};