import { PromptStage } from '../../../types/prompt-types';

interface ContentAnalysis {
  keyTopics: string[];
  complexity: 'low' | 'medium' | 'high';
  suggestedPromptCount: number;
}

export async function analyzeContent(content: string, stage: PromptStage): Promise<ContentAnalysis> {
  const topics = extractKeyTopics(content);
  const complexity = determineComplexity(content);
  const suggestedCount = calculatePromptCount(complexity, topics.length);

  return {
    keyTopics: topics,
    complexity,
    suggestedPromptCount: suggestedCount
  };
}

function extractKeyTopics(content: string): string[] {
  const topics = new Set<string>();
  
  // Extract section headers
  const headers = content.match(/^[A-Z][^.!?]*(?=:|\n)/gm) || [];
  headers.forEach(header => topics.add(header.trim()));
  
  // Extract bullet points
  const bullets = content.match(/^[•\-*]\s*([^.!?]*)/gm) || [];
  bullets.forEach(bullet => {
    const topic = bullet.replace(/^[•\-*]\s*/, '').trim();
    if (topic) topics.add(topic);
  });
  
  return Array.from(topics);
}

function determineComplexity(content: string): 'low' | 'medium' | 'high' {
  const words = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = words / sentences;
  
  if (avgWordsPerSentence > 20) return 'high';
  if (avgWordsPerSentence > 12) return 'medium';
  return 'low';
}

function calculatePromptCount(complexity: 'low' | 'medium' | 'high', topicCount: number): number {
  const baseCount = {
    low: 3,
    medium: 5,
    high: 8
  }[complexity];
  
  return Math.min(Math.max(baseCount, Math.ceil(topicCount * 1.5)), 20);
}