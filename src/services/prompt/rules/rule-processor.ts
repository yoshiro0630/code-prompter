import { ConfigurationRule } from '../../../types/config-types';

interface ProcessedRule {
  id: string;
  type: string;
  appliedContent: string;
  impact: 'high' | 'medium' | 'low';
}

export function processRules(content: string, rules: ConfigurationRule[]): {
  modifiedContent: string;
  appliedRules: ProcessedRule[];
} {
  const appliedRules: ProcessedRule[] = [];
  let modifiedContent = content;

  // Sort rules by priority
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    const { modified, applied } = applyRule(modifiedContent, rule);
    
    if (applied) {
      modifiedContent = modified;
      appliedRules.push({
        id: rule.id,
        type: rule.type,
        appliedContent: rule.description,
        impact: determineImpact(content, modified)
      });
    }
  }

  return {
    modifiedContent,
    appliedRules
  };
}

function applyRule(content: string, rule: ConfigurationRule): {
  modified: string;
  applied: boolean;
} {
  let modified = content;
  let applied = false;

  switch (rule.type) {
    case 'constraint':
      // Apply constraints to limit or restrict certain patterns
      const { content: constrainedContent, applied: constraintApplied } = 
        applyConstraint(modified, rule);
      modified = constrainedContent;
      applied = constraintApplied;
      break;

    case 'enhancement':
      // Apply enhancements to improve or add features
      const { content: enhancedContent, applied: enhancementApplied } = 
        applyEnhancement(modified, rule);
      modified = enhancedContent;
      applied = enhancementApplied;
      break;

    case 'requirement':
      // Apply requirements to ensure specific elements
      const { content: requiredContent, applied: requirementApplied } = 
        applyRequirement(modified, rule);
      modified = requiredContent;
      applied = requirementApplied;
      break;
  }

  return { modified, applied };
}

function applyConstraint(content: string, rule: ConfigurationRule): {
  content: string;
  applied: boolean;
} {
  let modified = content;
  let applied = false;

  if (rule.condition) {
    const conditionMet = evaluateCondition(content, rule.condition);
    if (conditionMet) {
      modified = applyAction(content, rule.action);
      applied = true;
    }
  } else {
    modified = applyAction(content, rule.action);
    applied = true;
  }

  return { content: modified, applied };
}

function applyEnhancement(content: string, rule: ConfigurationRule): {
  content: string;
  applied: boolean;
} {
  let modified = content;
  const sections = content.split(/Prompt\s*\[\d+\]:/i);
  let applied = false;

  sections.forEach((section, index) => {
    if (index === 0) return; // Skip the first empty section

    if (rule.condition) {
      const conditionMet = evaluateCondition(section, rule.condition);
      if (conditionMet) {
        const enhancedSection = applyAction(section, rule.action);
        modified = modified.replace(section, enhancedSection);
        applied = true;
      }
    } else {
      const enhancedSection = applyAction(section, rule.action);
      modified = modified.replace(section, enhancedSection);
      applied = true;
    }
  });

  return { content: modified, applied };
}

function applyRequirement(content: string, rule: ConfigurationRule): {
  content: string;
  applied: boolean;
} {
  let modified = content;
  let applied = false;

  // Check if the requirement is already met
  const requirementMet = evaluateCondition(content, rule.condition || '');
  
  if (!requirementMet) {
    modified = applyAction(content, rule.action);
    applied = true;
  }

  return { content: modified, applied };
}

function evaluateCondition(content: string, condition: string): boolean {
  // Simple condition evaluation based on text presence
  return new RegExp(condition, 'i').test(content);
}

function applyAction(content: string, action: string): string {
  // Convert action string to actual content modification
  const actionParts = action.split(':');
  const actionType = actionParts[0].trim().toLowerCase();
  const actionValue = actionParts[1]?.trim() || '';

  switch (actionType) {
    case 'prepend':
      return `${actionValue}\n${content}`;
    case 'append':
      return `${content}\n${actionValue}`;
    case 'replace':
      const [search, replace] = actionValue.split('->').map(s => s.trim());
      return content.replace(new RegExp(search, 'g'), replace);
    case 'insert':
      const [position, text] = actionValue.split('at').map(s => s.trim());
      const lines = content.split('\n');
      lines.splice(parseInt(position), 0, text);
      return lines.join('\n');
    default:
      return content;
  }
}

function determineImpact(original: string, modified: string): 'high' | 'medium' | 'low' {
  const diffSize = Math.abs(modified.length - original.length);
  const originalSize = original.length;
  const changeRatio = diffSize / originalSize;

  if (changeRatio > 0.2) return 'high';
  if (changeRatio > 0.1) return 'medium';
  return 'low';
}