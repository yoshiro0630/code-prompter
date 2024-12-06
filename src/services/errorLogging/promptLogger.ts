import ErrorLogger from './ErrorLogger';

export class PromptLogger {
  static logPromptGeneration(stage: number, error: Error, context: Record<string, any> = {}) {
    ErrorLogger.logError(error, {
      component: 'PromptGeneration',
      stage: stage.toString(),
      ...context
    });
  }

  static logPromptProcessing(projectId: string, error: Error, context: Record<string, any> = {}) {
    ErrorLogger.logError(error, {
      component: 'PromptProcessing',
      projectId,
      ...context
    });
  }

  static logPromptOutput(projectId: string, stage: number, content: string) {
    console.log(`[Prompt Output] Project: ${projectId}, Stage: ${stage}`);
    console.log('Content:', content);
  }
}