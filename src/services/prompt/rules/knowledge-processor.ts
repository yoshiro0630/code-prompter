import { KnowledgeSource } from '../../../types/config-types';

interface ProcessedKnowledge {
  id: string;
  type: string;
  appliedContent: string;
  relevance: number;
}

export function processKnowledge(
  content: string,
  sources: KnowledgeSource[]
): {
  modifiedContent: string;
  appliedSources: ProcessedKnowledge[];
} {
  const appliedSources: ProcessedKnowledge[] = [];
  let modifiedContent = content;

  // Sort sources by priority
  const sortedSources = [...sources].sort((a, b) => b.priority - a.priority);

  for (const source of sortedSources) {
    const relevance = calculateRelevance(content, source.content);
    
    if (relevance > 0.3) { // Apply only relevant knowledge
      const enhancedContent = incorporateKnowledge(modifiedContent, source);
      
      if (enhancedContent !== modifiedContent) {
        modifiedContent = enhancedContent;
        appliedSources.push({
          id: source.id,
          type: source.type,
          appliedContent: source.content,
          relevance
        });
      }
    }
  }

  return {
    modifiedContent,
    appliedSources
  };
}

function calculateRelevance(content: string, knowledge: string): number {
  // Extract key terms from both content and knowledge
  const contentTerms = extractKeyTerms(content);
  const knowledgeTerms = extractKeyTerms(knowledge);
  
  // Calculate term overlap
  const overlap = contentTerms.filter(term => 
    knowledgeTerms.includes(term)
  ).length;
  
  // Calculate relevance score
  return overlap / Math.max(contentTerms.length, knowledgeTerms.length);
}

function extractKeyTerms(text: string): string[] {
  // Remove common words and extract key terms
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
    'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do'
  ]);

  return text
    .toLowerCase()
    .split(/[\s.,!?]+/)
    .filter(word => 
      word.length > 2 && !commonWords.has(word)
    );
}

function incorporateKnowledge(content: string, source: KnowledgeSource): string {
  let modified = content;

  switch (source.type) {
    case 'document':
      modified = incorporateDocumentKnowledge(modified, source);
      break;
    case 'rule':
      modified = incorporateRuleKnowledge(modified, source);
      break;
    case 'example':
      modified = incorporateExampleKnowledge(modified, source);
      break;
  }

  return modified;
}

function incorporateDocumentKnowledge(content: string, source: KnowledgeSource): string {
  // Extract relevant sections from the document
  const sections = content.split(/Prompt\s*\[\d+\]:/i);
  
  return sections.map((section, index) => {
    if (index === 0) return section;

    // Enhance section with document knowledge
    const enhancedSection = enhanceSectionWithKnowledge(
      section,
      source.content
    );

    return `Prompt [${index}]:${enhancedSection}`;
  }).join('');
}

function incorporateRuleKnowledge(content: string, source: KnowledgeSource): string {
  // Apply rule-based modifications
  return content.split(/Prompt\s*\[\d+\]:/i).map((section, index) => {
    if (index === 0) return section;

    // Apply rules to each section
    const enhancedSection = applyRuleKnowledge(
      section,
      source.content
    );

    return `Prompt [${index}]:${enhancedSection}`;
  }).join('');
}

function incorporateExampleKnowledge(content: string, source: KnowledgeSource): string {
  // Learn from examples and apply similar patterns
  return content.split(/Prompt\s*\[\d+\]:/i).map((section, index) => {
    if (index === 0) return section;

    // Apply example-based enhancements
    const enhancedSection = applyExamplePatterns(
      section,
      source.content
    );

    return `Prompt [${index}]:${enhancedSection}`;
  }).join('');
}

function enhanceSectionWithKnowledge(section: string, knowledge: string): string {
  const parts = section.split(/(?=Objective:|Prompt:|Outcome:)/i);
  
  return parts.map(part => {
    const header = part.match(/^(Objective|Prompt|Outcome):/i)?.[0] || '';
    const content = part.replace(/^(Objective|Prompt|Outcome):/i, '').trim();
    
    if (!content) return part;
    
    // Enhance content based on knowledge
    const enhanced = enrichContent(content, knowledge);
    
    return `${header}\n${enhanced}`;
  }).join('\n\n');
}

function applyRuleKnowledge(section: string, rules: string): string {
  const parts = section.split(/(?=Objective:|Prompt:|Outcome:)/i);
  
  return parts.map(part => {
    const header = part.match(/^(Objective|Prompt|Outcome):/i)?.[0] || '';
    const content = part.replace(/^(Objective|Prompt|Outcome):/i, '').trim();
    
    if (!content) return part;
    
    // Apply rules to content
    const enhanced = applyRules(content, rules);
    
    return `${header}\n${enhanced}`;
  }).join('\n\n');
}

function applyExamplePatterns(section: string, examples: string): string {
  const parts = section.split(/(?=Objective:|Prompt:|Outcome:)/i);
  
  return parts.map(part => {
    const header = part.match(/^(Objective|Prompt|Outcome):/i)?.[0] || '';
    const content = part.replace(/^(Objective|Prompt|Outcome):/i, '').trim();
    
    if (!content) return part;
    
    // Learn from examples and enhance content
    const enhanced = applyPatterns(content, examples);
    
    return `${header}\n${enhanced}`;
  }).join('\n\n');
}

function enrichContent(content: string, knowledge: string): string {
  // Add relevant details from knowledge
  const relevantDetails = extractRelevantDetails(content, knowledge);
  return `${content}\n${relevantDetails}`.trim();
}

function applyRules(content: string, rules: string): string {
  // Apply formatting and structure rules
  return content.replace(/\b(\w+)\b/g, (match) => {
    if (rules.includes(match)) {
      return `${match} (following rule guidelines)`;
    }
    return match;
  });
}

function applyPatterns(content: string, examples: string): string {
  // Apply patterns found in examples
  const patterns = extractPatterns(examples);
  return patterns.reduce((acc, pattern) => {
    return acc.replace(new RegExp(pattern.search, 'g'), pattern.replace);
  }, content);
}

function extractRelevantDetails(content: string, knowledge: string): string {
  // Extract and format relevant details
  const contentTerms = new Set(extractKeyTerms(content));
  const details = knowledge
    .split(/[.!?]+/)
    .filter(sentence => 
      extractKeyTerms(sentence).some(term => contentTerms.has(term))
    )
    .join('. ');
  
  return details ? `Additional Context: ${details}` : '';
}

function extractPatterns(examples: string): Array<{ search: string; replace: string }> {
  // Extract common patterns from examples
  const patterns: Array<{ search: string; replace: string }> = [];
  const sentences = examples.split(/[.!?]+/);
  
  sentences.forEach(sentence => {
    const words = sentence.trim().split(/\s+/);
    if (words.length > 3) {
      patterns.push({
        search: words.slice(0, 2).join('\\s+'),
        replace: words.slice(0, 3).join(' ')
      });
    }
  });
  
  return patterns;
}