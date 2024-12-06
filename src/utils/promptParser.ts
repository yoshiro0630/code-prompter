import { ParsedPrompt } from '../types/prompt-types';

export const parsePrompts = (content: string): ParsedPrompt[] => {
  const prompts: ParsedPrompt[] = [];
  const sections = content.split(/Prompt\s*\[\d+\]:/i);

  sections.slice(1).forEach(section => {
    const titleMatch = section.match(/^([^\n]+)/);
    const objectiveMatch = section.match(/Objective:\s*([^\n]+(?:\n(?!Prompt:)[^\n]+)*)/i);
    const promptMatch = section.match(/Prompt:\s*([^\n]+(?:\n(?!Outcome:)[^\n]+)*)/i);
    const outcomeMatch = section.match(/Outcome:\s*([^\n]+(?:\n(?!Prompt:|\[|$)[^\n]+)*)/i);

    if (titleMatch && objectiveMatch && promptMatch && outcomeMatch) {
      prompts.push({
        title: titleMatch[1].trim(),
        objective: objectiveMatch[1].trim(),
        prompt: promptMatch[1].trim(),
        outcome: outcomeMatch[1].trim()
      });
    }
  });

  return prompts;
};