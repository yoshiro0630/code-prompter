import { DocumentContent } from '../../types/document-types';
import { useProjectStore } from '../../stores/projectStore';
import { generateResponse } from '../api';
import { parsePrompts } from '../../utils/promptParser';
import { PromptLogger } from '../errorLogging/promptLogger';
import { OptimizationSettings } from '../../types/prompt-types';
import { PromptOutputService } from './promptOutputService';

export class ProjectPromptService {
  static reprocessPrompts(currentProject: string, optimizationSettings: OptimizationSettings) {
    throw new Error('Method not implemented.');
  }
  static async processDocument(
    projectId: string, 
    document: DocumentContent,
    optimizationSettings?: OptimizationSettings,
    onProgress?: (stage: string, progress: number) => void
  ): Promise<void> {
    try {
      const store = useProjectStore.getState();
      
      // Save document to project first
      await store.saveDocument(projectId, document);

      // Update progress
      onProgress?.('analyzing', 10);

      // Summarize content to stay within token limits
      const summarizedContent = document.content.slice(0, 2000);
      onProgress?.('analyzing', 30);

      // Generate prompts for each stage with delay between requests
      const stages = [1, 2, 3, 4, 5];
      const totalStages = stages.length;
      
      for (const [index, stage] of stages.entries()) {
        try {
          // Update progress
          onProgress?.('generating', 30 + (index / totalStages) * 60);

          // Add delay between requests
          if (stage > 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }

          // Generate prompt
          const prompt = stage === 1 
            ? this.generateFirstStagePrompt(summarizedContent, optimizationSettings)
            : this.generateStagePrompt(stage, summarizedContent, optimizationSettings);

          const response = await generateResponse(prompt);
          const parsedPrompts = parsePrompts(response);
          
          // Save prompts to database with version tracking
          await PromptOutputService.saveAndDisplayPrompts(projectId, stage, parsedPrompts);

        } catch (error) {
          if (error instanceof Error && error.message.includes('rate_limit_exceeded')) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            const prompt = stage === 1
              ? this.generateFirstStagePrompt(summarizedContent, optimizationSettings)
              : this.generateStagePrompt(stage, summarizedContent, optimizationSettings);
            const response = await generateResponse(prompt);
            const parsedPrompts = parsePrompts(response);
            
            await PromptOutputService.saveAndDisplayPrompts(projectId, stage, parsedPrompts);
          } else {
            throw error;
          }
        }
      }

      // Update final progress
      onProgress?.('formatting', 100);
    } catch (error) {
      PromptLogger.logPromptProcessing(projectId, error instanceof Error ? error : new Error('Unknown error'), {
        document: {
          fileName: document.metadata.fileName,
          fileSize: document.metadata.fileSize
        }
      });
      throw error;
    }
  }

  private static generateFirstStagePrompt(content: string, settings?: OptimizationSettings): string {
    return `You are tasked with generating prompts for this project. The first prompt MUST include a comprehensive project outline and brand identity guidelines.

Project Requirements:
${content}

Generate exactly 5 prompts, where the FIRST prompt MUST be about project outline and branding, following this format:

Prompt [1]: Project Outline & Brand Identity
Objective: Define the project architecture, technology stack, and brand guidelines
Prompt: Create a comprehensive project outline including:
- Project architecture and technology stack
- Development standards and conventions
- Brand identity (colors, typography, design language)
- Key technical decisions and rationale
- Project structure and organization
Outcome: A detailed project blueprint and brand guidelines document

For the remaining 4 prompts, focus on Core Features (Authentication, Profile, Dashboard, Search, Data Import/Export) following this format:

Prompt [X]: [Feature/Component Title]
Objective: [Clear description of what needs to be built]
Prompt: [Detailed development instructions]
Outcome: [Expected deliverables and success criteria]

${settings?.customRule || ''}

Focus on implementation details and best practices. Keep each prompt concise but specific.`;
  }

  private static generateStagePrompt(stage: number, content: string, settings?: OptimizationSettings): string {
    const stageDescriptions = {
      2: 'User Interface (Layouts, Forms, Tables, Modals, Theme)',
      3: 'Data Management (State, API, Real-time, Caching, Error Tracking)',
      4: 'Performance (Code Splitting, Optimization, Monitoring, Bundle, Memory)',
      5: 'Testing & Quality (Unit, Integration, Performance, Accessibility, Security)'
    };

    let promptInstructions = '';
    
    // Add optimization-specific instructions
    if (settings) {
      switch (settings.focus) {
        case 'clarity':
          promptInstructions = `
Focus on clear, step-by-step instructions:
- Break down complex tasks into smaller steps
- Use explicit, unambiguous language
- Include specific success criteria
- Provide context for each requirement`;
          break;
        case 'technical':
          promptInstructions = `
Focus on technical implementation details:
- Include specific technologies and patterns
- Reference architectural best practices
- Specify performance requirements
- Detail error handling and edge cases`;
          break;
        case 'creative':
          promptInstructions = `
Focus on innovative solutions:
- Encourage exploration of modern approaches
- Suggest alternative implementation options
- Consider future extensibility
- Balance innovation with practicality`;
          break;
        case 'audience':
          promptInstructions = `
Focus on ${settings.audience || 'developer'}-centric instructions:
- Use terminology familiar to the audience
- Provide relevant context and examples
- Include audience-specific considerations
- Reference common patterns for this audience`;
          break;
      }

      if (settings.iterativeRefinement) {
        promptInstructions += `\nEnsure each prompt builds upon previous ones and supports iterative development.`;
      }

      if (settings.customInstructions) {
        promptInstructions += `\n${settings.customInstructions}`;
      }

      if (settings.useCustomRule && settings.customRule) {
        promptInstructions = settings.customRule;
      }
    }

    return `Based on these project requirements, generate 5 detailed prompts for ${stageDescriptions[stage as keyof typeof stageDescriptions]}.

Project Requirements:
${content}

${promptInstructions}

Generate exactly 5 prompts in this format:

Prompt [1]: [Feature/Component Title]
Objective: [Clear description of what needs to be built]
Prompt: [Detailed development instructions]
Outcome: [Expected deliverables and success criteria]

Focus on implementation details and best practices. Keep each prompt concise but specific.`;
  }
}