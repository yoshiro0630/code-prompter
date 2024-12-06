import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptData } from '../utils/encryption';
import { ModelConfig } from '../types/models';
import { getDefaultModel } from '../config/models';

interface APIState {
  apiKey: string;
  showAPISettings: boolean;
  activeProvider: string;
  modelConfig: ModelConfig;
  updateAPIKey: (key: string) => void;
  setModelConfig: (config: Partial<ModelConfig>) => void;
  getStageConfig: (type: string) => any;
}

export const useAPIStore = create<APIState>()(
  persist(
    (set) => ({
      apiKey: '',
      showAPISettings: false,
      activeProvider: 'openai',
      modelConfig: {
        provider: 'openai',
        model: getDefaultModel('openai'),
        temperature: 0.7,
        maxTokens: 4096
      },
      updateAPIKey: (key) => {
        const encryptedKey = encryptData(key);
        set({ apiKey: encryptedKey, showAPISettings: false });
      },
      setModelConfig: (config) => set((state) => ({
        modelConfig: { ...state.modelConfig, ...config }
      })),
      getStageConfig: (type) => {
        // Implement the logic to return the stage config
        // This could involve fetching data from an API or returning cached data
        return {}; // Placeholder return value
      },
    }),
    {
      name: 'api-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        modelConfig: state.modelConfig
      })
    }
  )
);