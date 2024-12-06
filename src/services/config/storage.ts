import { StageConfig } from '../../types/config-types';

const STORAGE_KEY_PREFIX = 'bolt_config_';

export const storage = {
  saveStageConfig(stage: string, config: StageConfig): void {
    try {
      const key = `${STORAGE_KEY_PREFIX}${stage.toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(config));
    } catch (error) {
      console.error(`Failed to save config for stage ${stage}:`, error);
      throw new Error(`Configuration save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  loadStageConfig(stage: string): StageConfig | null {
    try {
      const key = `${STORAGE_KEY_PREFIX}${stage.toLowerCase()}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(`Failed to load config for stage ${stage}:`, error);
      return null;
    }
  },

  clearStageConfig(stage: string): void {
    const key = `${STORAGE_KEY_PREFIX}${stage.toLowerCase()}`;
    localStorage.removeItem(key);
  },

  clearAllConfigs(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_KEY_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};