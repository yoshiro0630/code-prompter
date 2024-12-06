import { ParsedDocument } from '../../types/document-types';
import { PromptStage, StageTemplate } from '../../types/prompt-types';

interface ContentAnalysis {
  keyTopics: string[];
  complexity: 'low' | 'medium' | 'high';
  suggestedPromptCount: number;
  dependencies: string[];
}

export async function analyzeContent(
  document: ParsedDocument,
  stage: PromptStage,
  template: StageTemplate
): Promise<ContentAnalysis> {
  const content = stage.metadata?.sourceSection || '';
  
  // Analyze content complexity
  const complexity = analyzeComplexity(content);
  
  // Extract key topics
  const keyTopics = extractKeyTopics(content);
  
  // Identify dependencies
  const dependencies = findDependencies(content);
  
  // Calculate suggested prompt count based on complexity and template
  const suggestedPromptCount = calculatePromptCount(
    complexity,
    template.maxPrompts || 5,
    keyTopics.length
  );
  
  return {
    keyTopics,
    complexity,
    suggestedPromptCount,
    dependencies
  };
}

function analyzeComplexity(content: string): 'low' | 'medium' | 'high' {
  const words = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = words / sentences;
  
  if (avgWordsPerSentence > 20) return 'high';
  if (avgWordsPerSentence > 12) return 'medium';
  return 'low';
}

function extractKeyTopics(content: string): string[] {
  const topics = new Set<string>();
  
  // Look for section headers
  const headerMatches = content.match(/^[A-Z][^.!?]*(?=:|\n)/gm) || [];
  headerMatches.forEach(match => topics.add(match.trim()));
  
  // Look for bullet points
  const bulletMatches = content.match(/^[•\-*]\s*([^.!?]*)/gm) || [];
  bulletMatches.forEach(match => {
    const topic = match.replace(/^[•\-*]\s*/, '').trim();
    if (topic) topics.add(topic);
  });
  
  return Array.from(topics);
}

function findDependencies(content: string): string[] {
  const dependencies = new Set<string>();
  
  // Look for dependency keywords
  const dependencyKeywords = [
    'requires',
    'depends on',
    'prerequisite',
    'after',
    'before',
    'following'
  ];
  
  dependencyKeywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}\\s+([^.!?]*)`, 'gi');
    const matches = content.match(regex) || [];
    matches.forEach(match => {
      const dependency = match.replace(new RegExp(`^${keyword}\\s+`, 'i'), '').trim();
      if (dependency) dependencies.add(dependency);
    });
  });
  
  return Array.from(dependencies);
}

function calculatePromptCount(
  complexity: 'low' | 'medium' | 'high',
  maxPrompts: number,
  topicCount: number
): number {
  const baseCount = {
    low: Math.min(3, maxPrompts),
    medium: Math.min(5, maxPrompts),
    high: Math.min(8, maxPrompts)
  }[complexity];
  
  // Adjust based on number of topics
  const suggestedCount = Math.min(
    Math.max(baseCount, Math.ceil(topicCount * 1.5)),
    maxPrompts
  );
  
  return suggestedCount;
}