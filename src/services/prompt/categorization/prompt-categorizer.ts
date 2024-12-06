import { PromptStage } from '../../../types/prompt-types';

export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  priority: number;
}

export interface CategorizedPrompt {
  promptNumber: number;
  title: string;
  category: PromptCategory;
  content: string;
}

const categories: PromptCategory[] = [
  {
    id: 'core',
    name: 'Core Functionality',
    description: 'Essential features and primary functionality',
    priority: 1
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'System architecture and technical foundation',
    priority: 2
  },
  {
    id: 'ux',
    name: 'User Experience',
    description: 'User interface and interaction design',
    priority: 3
  },
  {
    id: 'integration',
    name: 'Integration',
    description: 'External systems and API integration',
    priority: 4
  },
  {
    id: 'optimization',
    name: 'Optimization',
    description: 'Performance and efficiency improvements',
    priority: 5
  }
];

export function categorizePrompts(content: string, stage: PromptStage): CategorizedPrompt[] {
  const categorizedPrompts: CategorizedPrompt[] = [];
  const promptSections = content.split(/Prompt\s*\[\d+\]:/i);

  promptSections.slice(1).forEach((section, index) => {
    const promptNumber = index + 1;
    const title = section.split('\n')[0].trim();
    const category = determineCategory(section, stage);

    categorizedPrompts.push({
      promptNumber,
      title,
      category,
      content: section.trim()
    });
  });

  return categorizedPrompts.sort((a, b) => 
    a.category.priority - b.category.priority
  );
}

function determineCategory(promptContent: string, stage: PromptStage): PromptCategory {
  const content = promptContent.toLowerCase();
  
  // Category indicators
  const indicators = {
    core: ['core', 'essential', 'basic', 'fundamental', 'primary'],
    infrastructure: ['architecture', 'system', 'database', 'server', 'deployment'],
    ux: ['interface', 'user', 'ui', 'ux', 'design', 'experience'],
    integration: ['api', 'integration', 'external', 'third-party', 'service'],
    optimization: ['performance', 'optimize', 'improve', 'efficiency', 'scale']
  };

  // Score each category
  const scores = new Map<string, number>();
  
  for (const [categoryId, words] of Object.entries(indicators)) {
    const score = words.reduce((total, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (promptContent.match(regex) || []).length;
      return total + matches;
    }, 0);
    scores.set(categoryId, score);
  }

  // Find category with highest score
  let maxScore = 0;
  let selectedCategoryId = 'core'; // Default category

  scores.forEach((score, categoryId) => {
    if (score > maxScore) {
      maxScore = score;
      selectedCategoryId = categoryId;
    }
  });

  return categories.find(cat => cat.id === selectedCategoryId) || categories[0];
}