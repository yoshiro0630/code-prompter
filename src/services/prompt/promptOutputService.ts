import { StagePrompt } from './stagePrompts';
import { useProjectStore } from '../../stores/projectStore';
import { PromptLogger } from '../errorLogging/promptLogger';

export interface VersionedPrompt extends StagePrompt {
  version: number;
  timestamp: string;
  stage: number;
  promptNumber: number;
  globalPromptNumber: number;
}

export class PromptOutputService {
  private static versionCache = new Map<string, number>();
  private static promptCountCache = new Map<string, number>();

  private static async getLatestVersion(projectId: string, stage: number): Promise<number> {
    try {
      const cacheKey = `${projectId}-${stage}`;
      if (this.versionCache.has(cacheKey)) {
        return this.versionCache.get(cacheKey)!;
      }

      const store = useProjectStore.getState();
      const existingPrompts = await store.getPrompts(projectId, stage);
      const versions = existingPrompts
        .map(p => (p as VersionedPrompt).version || 0)
        .filter(v => typeof v === 'number');
      
      const latestVersion = versions.length > 0 ? Math.max(...versions) : 0;
      this.versionCache.set(cacheKey, latestVersion);
      
      return latestVersion;
    } catch (error) {
      console.error('[PromptOutput] Failed to get latest version:', error);
      return 0;
    }
  }

  private static async getGlobalPromptCount(projectId: string): Promise<number> {
    if (this.promptCountCache.has(projectId)) {
      return this.promptCountCache.get(projectId)!;
    }

    const store = useProjectStore.getState();
    let totalCount = 0;
    
    for (let stage = 1; stage <= 5; stage++) {
      const prompts = await store.getPrompts(projectId, stage);
      totalCount += prompts.length;
    }

    this.promptCountCache.set(projectId, totalCount);
    return totalCount;
  }

  static async saveAndDisplayPrompts(
    projectId: string,
    stage: number,
    prompts: StagePrompt[]
  ): Promise<void> {
    try {
      console.log(`[PromptOutput] Saving prompts for stage ${stage}`);
      const store = useProjectStore.getState();
      
      // Get next version number
      const latestVersion = await this.getLatestVersion(projectId, stage);
      const newVersion = latestVersion + 1;

      // Get current global prompt count
      const currentCount = await this.getGlobalPromptCount(projectId);

      // Add version, timestamp, and prompt numbers to prompts
      const versionedPrompts: VersionedPrompt[] = prompts.map((prompt, index) => ({
        ...prompt,
        stage,
        version: newVersion,
        timestamp: new Date().toISOString(),
        promptNumber: index + 1,
        globalPromptNumber: currentCount + index + 1
      }));

      // Save to store
      await store.savePrompts(projectId, stage, versionedPrompts);
      
      // Update caches
      this.versionCache.set(`${projectId}-${stage}`, newVersion);
      this.promptCountCache.set(projectId, currentCount + prompts.length);
      
      console.log(`[PromptOutput] Prompts saved successfully for stage ${stage} (v${newVersion})`);
      PromptLogger.logPromptOutput(projectId, stage, JSON.stringify(versionedPrompts, null, 2));
    } catch (error) {
      console.error('[PromptOutput] Failed to save prompts:', error);
      throw error;
    }
  }

  static async getAllPrompts(projectId: string): Promise<VersionedPrompt[]> {
    try {
      console.log('[PromptOutput] Loading all prompts for project:', projectId);
      const store = useProjectStore.getState();
      const allPrompts: VersionedPrompt[] = [];

      // Load prompts from all stages
      for (let stage = 1; stage <= 5; stage++) {
        const stagePrompts = await store.getPrompts(projectId, stage);
        console.log(`[PromptOutput] Loaded ${stagePrompts.length} prompts for stage ${stage}`);
        
        // Ensure prompts have version info and prompt numbers
        const versionedPrompts = stagePrompts
          .filter(p => p && p.title && p.objective && p.prompt && p.outcome)
          .map((p, index) => ({
            ...p,
            stage,
            version: (p as VersionedPrompt).version || 1,
            timestamp: (p as VersionedPrompt).timestamp || new Date().toISOString(),
            promptNumber: (p as VersionedPrompt).promptNumber || (index + 1),
            globalPromptNumber: (p as VersionedPrompt).globalPromptNumber || allPrompts.length + index + 1
          }));

        allPrompts.push(...versionedPrompts);
      }

      console.log('[PromptOutput] Total prompts loaded:', allPrompts.length);
      return allPrompts.sort((a, b) => {
        // Sort by stage first, then by prompt number within each stage
        if (a.stage !== b.stage) return a.stage - b.stage;
        return a.promptNumber - b.promptNumber;
      });
    } catch (error) {
      console.error('[PromptOutput] Failed to load prompts:', error);
      throw error;
    }
  }

  static async clearProjectPrompts(projectId: string): Promise<void> {
    try {
      const store = useProjectStore.getState();
      for (let stage = 1; stage <= 5; stage++) {
        await store.savePrompts(projectId, stage, []);
        this.versionCache.delete(`${projectId}-${stage}`);
      }
      this.promptCountCache.delete(projectId);
      console.log('[PromptOutput] Cleared all prompts for project:', projectId);
    } catch (error) {
      console.error('[PromptOutput] Failed to clear prompts:', error);
      throw error;
    }
  }

  static resetCache(): void {
    this.versionCache.clear();
    this.promptCountCache.clear();
  }
}