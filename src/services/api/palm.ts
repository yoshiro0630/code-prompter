import { useAPIStore } from '../../stores/apiStore';

export const createPalmClient = () => {
  const apiKey = useAPIStore.getState().apiKey;
  if (!apiKey) throw new Error('PaLM API key not configured');
  
  return {
    generateText: async (prompt: string) => {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ prompt: { text: prompt } })
      });

      if (!response.ok) {
        throw new Error('Failed to generate text with PaLM API');
      }

      const data = await response.json();
      return data.candidates?.[0]?.output || '';
    }
  };
};

export const generatePalmResponse = async (prompt: string, modelConfig: any) => {
  const client = createPalmClient();
  return await client.generateText(prompt);
};