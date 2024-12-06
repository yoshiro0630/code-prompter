import { StageTemplate } from '../../types/prompt-types';

interface ContentAnalysis {
  keyTopics: string[];
  complexity: 'low' | 'medium' | 'high';
  suggestedPromptCount: number;
  dependencies: string[];
}

export function generatePromptInstructions(
  template: StageTemplate,
  analysis: ContentAnalysis
): string {
  const instructions: string[] = [
    '### **MANDATORY RULES**',
    '',
    '1. **First Prompt Requirements**:',
    '   - Must define brand identity and software purpose',
    '   - Include concise brand description',
    '   - State clear goals and objectives',
    '   - Provide high-level core features overview',
    '',
    '2. **Subsequent Prompts Requirements**:',
    '   - Focus on single feature/functionality',
    '   - Provide detailed point-form instructions',
    '   - Include specific implementation steps',
    '   - Define clear success criteria',
    '',
    `Generate ${analysis.suggestedPromptCount} detailed prompts for this ${template.title.toLowerCase()} stage.`,
    'Ensure each prompt follows the required format and rules.',
    `Focus on the following key topics: ${analysis.keyTopics.join(', ')}.`
  ];

  // Add complexity-based instructions
  switch (analysis.complexity) {
    case 'high':
      instructions.push(
        'Break down complex requirements into manageable chunks.',
        'Include detailed context in each prompt.',
        'Consider edge cases and potential challenges.'
      );
      break;
    case 'medium':
      instructions.push(
        'Balance detail with clarity.',
        'Focus on core functionality first.',
        'Include relevant technical considerations.'
      );
      break;
    case 'low':
      instructions.push(
        'Keep prompts straightforward and focused.',
        'Emphasize essential requirements.',
        'Maintain clarity and simplicity.'
      );
      break;
  }

  // Add dependency-based instructions
  if (analysis.dependencies.length > 0) {
    instructions.push(
      'Consider the following dependencies:',
      ...analysis.dependencies.map(dep => `- ${dep}`)
    );
  }

  // Add template-specific instructions
  switch (template.type) {
    case 'overview':
      instructions.push(
        'Focus on high-level project goals and objectives.',
        'Include key stakeholder considerations.',
        'Address primary success criteria.'
      );
      break;
    case 'requirements':
      instructions.push(
        'Break down features into specific implementation tasks.',
        'Include data model and API requirements.',
        'Consider user interaction flows.'
      );
      break;
    case 'timeline':
      instructions.push(
        'Structure prompts in chronological order.',
        'Consider dependencies between tasks.',
        'Include testing and deployment considerations.'
      );
      break;
    case 'budget':
      instructions.push(
        'Include resource allocation details.',
        'Consider infrastructure and third-party service costs.',
        'Account for maintenance and scaling costs.'
      );
      break;
  }

  return instructions.join('\n');
}