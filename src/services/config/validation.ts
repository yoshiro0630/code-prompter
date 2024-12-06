import { StageConfig } from '../../types/config-types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const configValidation = {
  validatePromptCount(count: number): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [] };
    
    if (typeof count !== 'number') {
      result.errors.push('Prompt count must be a number');
      result.isValid = false;
    } else if (count < 1) {
      result.errors.push('Prompt count must be at least 1');
      result.isValid = false;
    } else if (count > 20) {
      result.errors.push('Prompt count cannot exceed 20');
      result.isValid = false;
    }
    
    return result;
  },

  validateStageConfig(config: StageConfig): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [] };
    
    // Validate maxPrompts
    const promptCountValidation = this.validatePromptCount(config.maxPrompts);
    if (!promptCountValidation.isValid) {
      result.errors.push(...promptCountValidation.errors);
      result.isValid = false;
    }

    // Validate optimization settings
    if (!config.optimizationSettings) {
      result.errors.push('Optimization settings are required');
      result.isValid = false;
    } else {
      const validFocusValues = ['clarity', 'technical', 'creative', 'audience'];
      if (!validFocusValues.includes(config.optimizationSettings.focus)) {
        result.errors.push('Invalid optimization focus value');
        result.isValid = false;
      }
    }

    return result;
  }
};