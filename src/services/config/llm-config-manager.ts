import { 
  LLMConfiguration, 
  KnowledgeSource, 
  ConfigurationRule,
  ConfigurationMode,
  StageConfig 
} from '../../types/config-types';

export class LLMConfigManager {
  private configuration: LLMConfiguration;
  private stageConfigs: Map<string, StageConfig>;
  private readonly STORAGE_KEY = 'bolt_stage_configs';

  constructor() {
    this.configuration = this.getDefaultConfiguration();
    this.stageConfigs = new Map();
    this.loadSavedConfigs();
    if (this.stageConfigs.size === 0) {
      this.initializeStageConfigs();
    }
  }

  private getDefaultConfiguration(): LLMConfiguration {
    return {
      mode: 'blended',
      knowledgeSources: [],
      rules: [],
      outputPreferences: {
        annotateKnowledgeSources: true,
        showRuleApplication: true,
        formatPreferences: {
          includeMetadata: true,
          structuredOutput: true,
          highlightKeyElements: true
        }
      }
    };
  }

  private loadSavedConfigs() {
    try {
      const savedConfigs = localStorage.getItem(this.STORAGE_KEY);
      if (savedConfigs) {
        const configs = JSON.parse(savedConfigs);
        Object.entries(configs).forEach(([key, value]) => {
          this.stageConfigs.set(key.toLowerCase(), value as StageConfig);
        });
      }
    } catch (error) {
      console.error('Error loading saved configurations:', error);
      // Initialize with defaults if loading fails
      this.initializeStageConfigs();
    }
  }

  private saveConfigs() {
    try {
      const configs = Object.fromEntries(this.stageConfigs.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configs));
    } catch (error) {
      console.error('Error saving configurations:', error);
    }
  }

  private initializeStageConfigs() {
    const defaultStages = ['overview', 'requirements', 'timeline', 'budget'];
    const defaultCounts = {
      overview: 5,
      requirements: 20,
      timeline: 15,
      budget: 10
    };

    defaultStages.forEach(stage => {
      const config: StageConfig = {
        maxPrompts: defaultCounts[stage as keyof typeof defaultCounts],
        optimizationSettings: {
          focus: 'clarity',
          iterativeRefinement: true
        }
      };
      this.stageConfigs.set(stage.toLowerCase(), config);
    });
    this.saveConfigs();
  }

  updateStageConfig(stage: string, config: Partial<StageConfig>) {
    const stageKey = stage.toLowerCase();
    const currentConfig = this.stageConfigs.get(stageKey) || {
      maxPrompts: 5,
      optimizationSettings: {
        focus: 'clarity',
        iterativeRefinement: true
      }
    };

    const updatedConfig = {
      ...currentConfig,
      ...config,
      maxPrompts: Math.max(1, Math.min(config.maxPrompts || currentConfig.maxPrompts, 20))
    };

    this.stageConfigs.set(stageKey, updatedConfig);
    this.saveConfigs();
  }

  getStageConfig(stage: string): StageConfig | undefined {
    return this.stageConfigs.get(stage.toLowerCase());
  }

  addKnowledgeSource(source: Omit<KnowledgeSource, 'id'>): string {
    const id = crypto.randomUUID();
    const newSource: KnowledgeSource = {
      ...source,
      id,
      metadata: {
        ...source.metadata,
        dateAdded: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };

    this.configuration.knowledgeSources.push(newSource);
    this.sortKnowledgeSources();
    return id;
  }

  addRule(rule: Omit<ConfigurationRule, 'id'>): string {
    const id = crypto.randomUUID();
    const newRule: ConfigurationRule = { ...rule, id };
    
    this.configuration.rules.push(newRule);
    this.sortRules();
    return id;
  }

  setMode(mode: ConfigurationMode): void {
    this.configuration.mode = mode;
  }

  updateOutputPreferences(preferences: Partial<LLMConfiguration['outputPreferences']>): void {
    this.configuration.outputPreferences = {
      ...this.configuration.outputPreferences,
      ...preferences
    };
  }

  private sortKnowledgeSources(): void {
    this.configuration.knowledgeSources.sort((a, b) => b.priority - a.priority);
  }

  private sortRules(): void {
    this.configuration.rules.sort((a, b) => b.priority - a.priority);
  }

  getConfiguration(): LLMConfiguration {
    return { ...this.configuration };
  }

  getPromptPrefix(): string {
    const { mode, knowledgeSources, rules } = this.configuration;
    
    let prefix = `Configuration Mode: ${mode}\n\n`;

    if (knowledgeSources.length > 0) {
      prefix += 'Knowledge Sources:\n';
      knowledgeSources.forEach(source => {
        prefix += `- [${source.type}] ${source.content}\n`;
      });
      prefix += '\n';
    }

    if (rules.length > 0) {
      prefix += 'Rules:\n';
      rules.forEach(rule => {
        prefix += `- [${rule.type}] ${rule.description}\n`;
        if (rule.condition) {
          prefix += `  When: ${rule.condition}\n`;
        }
        prefix += `  Action: ${rule.action}\n`;
      });
    }

    return prefix;
  }

  applyConfiguration(prompt: string): string {
    const prefix = this.getPromptPrefix();
    
    let configuredPrompt = `${prefix}\n${prompt}`;
    
    if (this.configuration.mode === 'exclusive') {
      configuredPrompt += '\n\nNote: Use ONLY the provided knowledge sources and rules for generating the response.';
    } else {
      configuredPrompt += '\n\nNote: Combine the provided knowledge with your general training while prioritizing the specified rules.';
    }

    return configuredPrompt;
  }
}