import { ParsedDocument } from '../../types/document-types';
import { PromptStage, GeneratedPrompt, PromptGenerationRequest, StageTemplate } from '../../types/prompt-types';
import { stageTemplates } from './stage-templates';
import { ApiService } from '../api-service';
import { generatePromptInstructions } from './prompt-instructions';
import { analyzeContent } from './content-analyzer';
import { validatePrompt } from './validators/prompt-validator';
import { categorizePrompts } from './categorization/prompt-categorizer';
import { LLMConfigManager } from '../config/llm-config-manager';
import { useAPIStore } from '../../stores/apiStore';

export class PromptGenerator {
  private apiService: ApiService;
  private documents: Map<string, ParsedDocument>;
  private stages: Map<string, PromptStage>;
  private configManager: LLMConfigManager;
  private maxRetries = 3;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
    this.documents = new Map();
    this.stages = new Map();
    this.configManager = new LLMConfigManager();
  }

  async initializeStages(document: ParsedDocument): Promise<string> {
    const documentId = crypto.randomUUID();
    this.documents.set(documentId, document);
    
    const stages = stageTemplates.map(template => ({
      id: crypto.randomUUID(),
      title: template.title,
      content: '',
      order: template.order,
      type: template.type as 'overview' | 'requirements' | 'timeline' | 'budget' | 'custom',
      metadata: {
        sourceSection: document.sections[Number(template.suggestedSections[0])]
      }
    }));

    stages.forEach(stage => this.stages.set(stage.id, stage));
    return documentId;
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<GeneratedPrompt> {
    const document = this.documents.get(request.documentId);
    const stage = this.stages.get(request.stageId);

    if (!document || !stage) {
      throw new Error('Document or stage not found');
    }

    const template = stageTemplates.find(t => t.type === stage.type);
    if (!template) {
      throw new Error('Template not found for stage type');
    }

    const stageConfig = useAPIStore.getState().getStageConfig(stage.type);
    const maxPrompts = stageConfig?.maxPrompts || template.maxPrompts || 5;

    let attempts = 0;
    let response;
    let validation;

    while (attempts < this.maxRetries) {
      const contentAnalysis = await analyzeContent(document, stage, template);
      const promptInstructions = generatePromptInstructions(template, contentAnalysis);
      const basePrompt = await this.constructPrompt(document, stage, template, promptInstructions, request.context, maxPrompts);
      const configuredPrompt = this.configManager.applyConfiguration(basePrompt);
      
      response = await this.apiService.generate('openai', {
        prompt: configuredPrompt,
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2500
      });

      validation = validatePrompt(response.content, stage, maxPrompts);
      
      if (validation.isValid && validation.promptCount === maxPrompts) {
        break;
      }

      attempts++;
      if (attempts === this.maxRetries) {
        throw new Error(`Failed to generate exactly ${maxPrompts} prompts after ${this.maxRetries} attempts`);
      }
    }

    if (!response || !validation) {
      throw new Error('Failed to generate valid prompts');
    }

    const categorizedPrompts = categorizePrompts(response.content, stage);

    const generatedPrompt: GeneratedPrompt = {
      stageId: stage.id,
      content: response.content,
      suggestions: await this.generateSuggestions(response.content, template),
      context: {
        previousStages: request.context?.previousStages,
        relatedSections: template.suggestedSections
      },
      metadata: {
        validation,
        categorizedPrompts,
        requestedPromptCount: maxPrompts,
        actualPromptCount: validation.promptCount
      }
    };

    stage.content = response.content;
    this.stages.set(stage.id, stage);

    return generatedPrompt;
  }

  private async constructPrompt(
    document: ParsedDocument,
    stage: PromptStage,
    template: StageTemplate,
    instructions: string,
    context?: PromptGenerationRequest['context'],
    maxPrompts: number = 5
  ): Promise<string> {
    let prompt = `You MUST generate EXACTLY ${maxPrompts} detailed prompts for ${template.title.toLowerCase()}. This is a strict requirement - no more, no less than ${maxPrompts} prompts.\n\n`;
    prompt += `Each prompt MUST follow this exact format:\n\n`;
    prompt += `Prompt [X]: [Feature/Objective Title]\n`;
    prompt += `Objective: [Clear description of the prompt's goal]\n`;
    prompt += `Prompt: [Detailed prompt for development]\n`;
    prompt += `Outcome: [Expected results upon completion]\n\n`;
    
    prompt += `Instructions:\n${instructions}\n\n`;
    
    if (stage.metadata?.sourceSection) {
      prompt += `Relevant section content:\n${stage.metadata.sourceSection}\n\n`;
    }

    if (context?.previousStages) {
      prompt += `Previous stages context:\n${context.previousStages.join('\n')}\n\n`;
    }

    if (context?.customInstructions) {
      prompt += `Additional instructions:\n${context.customInstructions}\n\n`;
    }

    prompt += `CRITICAL REQUIREMENTS:\n`;
    prompt += `1. You MUST generate EXACTLY ${maxPrompts} prompts - no more, no less.\n`;
    prompt += `2. Each prompt MUST follow the format exactly.\n`;
    prompt += `3. Each prompt MUST be comprehensive and actionable.\n`;
    prompt += `4. Number prompts sequentially from 1 to ${maxPrompts}.\n`;
    prompt += `5. Ensure each prompt is unique and specific to this project's needs.\n\n`;
    prompt += `Failure to meet these requirements will result in rejection and regeneration.`;

    return prompt;
  }

  private async generateSuggestions(content: string, template: StageTemplate): Promise<string[]> {
    const response = await this.apiService.generate('openai', {
      prompt: `Based on these ${template.title.toLowerCase()} prompts, suggest 3 potential improvements or alternatives:\n\n${content}`,
      model: 'gpt-3.5-turbo',
      temperature: 0.8
    });

    return response.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, ''));
  }

  getStages(documentId: string): PromptStage[] {
    if (!this.documents.has(documentId)) {
      throw new Error('Document not found');
    }

    return Array.from(this.stages.values())
      .filter(stage => stage.metadata?.sourceSection)
      .sort((a, b) => a.order - b.order);
  }

  updateStageContent(stageId: string, content: string): void {
    const stage = this.stages.get(stageId);
    if (!stage) {
      throw new Error('Stage not found');
    }

    stage.content = content;
    stage.metadata?.userModifications?.push(content);
    this.stages.set(stageId, stage);
  }
}