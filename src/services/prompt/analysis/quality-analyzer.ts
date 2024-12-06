interface QualityAnalysis {
  clarity: number;
  specificity: number;
  actionability: number;
  suggestions: string[];
}

export function analyzeQuality(content: string): QualityAnalysis {
  const clarity = assessClarity(content);
  const specificity = assessSpecificity(content);
  const actionability = assessActionability(content);
  const suggestions = generateSuggestions(clarity, specificity, actionability);

  return {
    clarity,
    specificity,
    actionability,
    suggestions
  };
}

function assessClarity(content: string): number {
  let score = 100;
  
  // Check for ambiguous language
  const ambiguousWords = ['maybe', 'possibly', 'might', 'could', 'somehow'];
  ambiguousWords.forEach(word => {
    const matches = content.match(new RegExp(`\\b${word}\\b`, 'gi'));
    if (matches) score -= matches.length * 5;
  });
  
  // Check sentence length
  const sentences = content.split(/[.!?]+/);
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);
  score -= longSentences.length * 10;
  
  return Math.max(0, Math.min(100, score));
}

function assessSpecificity(content: string): number {
  let score = 100;
  
  // Check for specific technical terms
  const technicalTerms = content.match(/\b(API|database|function|component|interface|module|service)\b/gi);
  score += (technicalTerms?.length || 0) * 5;
  
  // Check for numerical specificity
  const numbers = content.match(/\b\d+\b/g);
  score += (numbers?.length || 0) * 3;
  
  // Penalize vague terms
  const vagueTerms = ['thing', 'stuff', 'etc', 'something'];
  vagueTerms.forEach(term => {
    const matches = content.match(new RegExp(`\\b${term}\\b`, 'gi'));
    if (matches) score -= matches.length * 10;
  });
  
  return Math.max(0, Math.min(100, score));
}

function assessActionability(content: string): number {
  let score = 100;
  
  // Check for action verbs
  const actionVerbs = [
    'implement', 'create', 'develop', 'build', 'design',
    'configure', 'set up', 'integrate', 'add', 'modify',
    'update', 'optimize', 'ensure', 'validate', 'test'
  ];
  
  const verbMatches = actionVerbs.reduce((count, verb) => {
    const matches = content.match(new RegExp(`\\b${verb}\\b`, 'gi'));
    return count + (matches?.length || 0);
  }, 0);
  
  score += verbMatches * 5;
  
  // Check for measurable outcomes
  const measurableTerms = content.match(/\b(complete when|results in|achieves|ensures)\b/gi);
  score += (measurableTerms?.length || 0) * 10;
  
  return Math.max(0, Math.min(100, score));
}

function generateSuggestions(clarity: number, specificity: number, actionability: number): string[] {
  const suggestions: string[] = [];
  
  if (clarity < 70) {
    suggestions.push('Consider using more precise language and shorter sentences');
    suggestions.push('Avoid ambiguous terms and clarify requirements');
  }
  
  if (specificity < 70) {
    suggestions.push('Add more technical details and specific requirements');
    suggestions.push('Include measurable criteria and concrete examples');
  }
  
  if (actionability < 70) {
    suggestions.push('Use more action-oriented verbs to describe tasks');
    suggestions.push('Define clear, measurable outcomes for each prompt');
  }
  
  return suggestions;
}