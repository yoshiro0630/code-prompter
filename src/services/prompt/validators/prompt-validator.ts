import { PromptStage } from '../../../types/prompt-types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  promptCount: number;
}

export function validatePrompt(content: string, stage: PromptStage, expectedCount?: number): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    promptCount: 0
  };

  // Check basic structure
  const promptSections = content.split(/Prompt\s*\[\d+\]:/i);
  if (promptSections.length < 2) {
    result.errors.push('No valid prompt sections found');
    result.isValid = false;
    return result;
  }

  // Count actual prompts (excluding the initial empty split)
  const actualPromptCount = promptSections.length - 1;
  result.promptCount = actualPromptCount;

  // Validate prompt count if expected count is provided
  if (expectedCount !== undefined && actualPromptCount !== expectedCount) {
    result.errors.push(`Expected ${expectedCount} prompts but found ${actualPromptCount}`);
    result.isValid = false;
    return result;
  }

  // Validate first prompt requirements
  const firstPrompt = promptSections[1];
  if (firstPrompt) {
    if (!containsBrandIdentity(firstPrompt)) {
      result.errors.push('First prompt must define brand identity');
    }
    if (!containsSoftwarePurpose(firstPrompt)) {
      result.errors.push('First prompt must state software purpose');
    }
    if (!containsCoreFeatures(firstPrompt)) {
      result.errors.push('First prompt must include core features overview');
    }
  }

  // Validate each prompt section
  promptSections.slice(1).forEach((section, index) => {
    const sectionNumber = index + 1;
    
    // Check required components
    if (!section.includes('Objective:')) {
      result.errors.push(`Prompt ${sectionNumber}: Missing objective section`);
    }
    if (!section.includes('Prompt:')) {
      result.errors.push(`Prompt ${sectionNumber}: Missing prompt section`);
    }
    if (!section.includes('Outcome:')) {
      result.errors.push(`Prompt ${sectionNumber}: Missing outcome section`);
    }

    // For subsequent prompts, check single feature focus
    if (sectionNumber > 1 && !hasSingleFeatureFocus(section)) {
      result.warnings.push(`Prompt ${sectionNumber}: Should focus on a single feature/functionality`);
    }

    // Check content quality
    const lines = section.split('\n').map(line => line.trim());
    
    // Check objective clarity
    const objectiveIndex = lines.findIndex(line => line.startsWith('Objective:'));
    if (objectiveIndex !== -1) {
      const objective = lines[objectiveIndex + 1];
      if (objective && objective.length < 20) {
        result.warnings.push(`Prompt ${sectionNumber}: Objective may be too brief`);
      }
    }

    // Check prompt specificity and point-form instructions
    const promptIndex = lines.findIndex(line => line.startsWith('Prompt:'));
    if (promptIndex !== -1) {
      const promptContent = lines.slice(promptIndex + 1).join('\n');
      if (!containsPointFormInstructions(promptContent)) {
        result.warnings.push(`Prompt ${sectionNumber}: Should include point-form instructions`);
      }
      if (!containsActionableLanguage(promptContent)) {
        result.warnings.push(`Prompt ${sectionNumber}: Prompt may lack actionable instructions`);
      }
    }
  });

  result.isValid = result.errors.length === 0;
  return result;
}

function containsBrandIdentity(content: string): boolean {
  const brandKeywords = ['brand', 'identity', 'design language', 'style guide'];
  return brandKeywords.some(keyword => content.toLowerCase().includes(keyword));
}

function containsSoftwarePurpose(content: string): boolean {
  const purposeKeywords = ['purpose', 'goal', 'objective', 'aims to'];
  return purposeKeywords.some(keyword => content.toLowerCase().includes(keyword));
}

function containsCoreFeatures(content: string): boolean {
  const featureKeywords = ['core features', 'key features', 'main functionality'];
  return featureKeywords.some(keyword => content.toLowerCase().includes(keyword));
}

function hasSingleFeatureFocus(content: string): boolean {
  const featureCount = (content.match(/feature|functionality|component/gi) || []).length;
  return featureCount <= 2;
}

function containsPointFormInstructions(content: string): boolean {
  return content.includes('•') || content.includes('-') || content.includes('1.') || content.includes('2.');
}

function containsActionableLanguage(text: string): boolean {
  const actionWords = [
    'create', 'implement', 'develop', 'build', 'design',
    'configure', 'set up', 'integrate', 'add', 'modify',
    'update', 'optimize', 'ensure', 'validate', 'test'
  ];
  
  return actionWords.some(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(text)
  );
}