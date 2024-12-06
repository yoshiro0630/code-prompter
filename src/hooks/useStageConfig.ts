import { useState, useEffect } from 'react';
import { useAPIStore } from '../stores/apiStore';
import { StageConfig } from '../types/config-types';
import { storage } from '../services/config/storage';
import { configValidation } from '../services/config/validation';
import { getDefaultConfig } from '../services/config/defaults';
import { toast } from 'react-hot-toast';

export const useStageConfig = (stageName: string) => {
  // const { updateStageConfig, getStageConfig } = useAPIStore();
  const [config, setConfig] = useState<StageConfig & { stage: string }>({
    ...getDefaultConfig(stageName),
    stage: stageName
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to load from store first
        // const storeConfig = getStageConfig(stageName);
        // if (storeConfig) {
        //   setConfig({ ...storeConfig, stage: stageName });
        //   return;
        // }

        // Try to load from storage
        const storedConfig = storage.loadStageConfig(stageName);
        if (storedConfig) {
          const validation = configValidation.validateStageConfig(storedConfig);
          if (validation.isValid) {
            setConfig({ ...storedConfig, stage: stageName });
            // updateStageConfig(stageName, storedConfig);
          } else {
            throw new Error(validation.errors.join(', '));
          }
        } else {
          // Use default config
          const defaultConfig = getDefaultConfig(stageName);
          setConfig({ ...defaultConfig, stage: stageName });
          // updateStageConfig(stageName, defaultConfig);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load configuration';
        setError(message);
        toast.error(message);
        
        // Fallback to defaults
        const defaultConfig = getDefaultConfig(stageName);
        setConfig({ ...defaultConfig, stage: stageName });
        // updateStageConfig(stageName, defaultConfig);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [stageName]);

  const updateConfig = (updates: Partial<StageConfig>) => {
    try {
      const newConfig: StageConfig = {
        ...config,
        ...updates,
        maxPrompts: updates.maxPrompts ?? config.maxPrompts
      };

      const validation = configValidation.validateStageConfig(newConfig);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      setConfig({ ...newConfig, stage: stageName });
      // updateStageConfig(stageName, newConfig);
      storage.saveStageConfig(stageName, newConfig);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update configuration';
      setError(message);
      toast.error(message);
    }
  };

  return {
    config,
    updateConfig,
    isLoading,
    error,
    resetToDefault: () => {
      const defaultConfig = getDefaultConfig(stageName);
      updateConfig(defaultConfig);
    }
  };
};