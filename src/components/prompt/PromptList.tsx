import React from 'react';
import PromptCard from './PromptCard';
import { ParsedPrompt } from '../../types/prompt-types';

interface PromptListProps {
  prompts: ParsedPrompt[];
}

const PromptList: React.FC<PromptListProps> = ({ prompts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {prompts.map((prompt, index) => (
        <PromptCard
          key={index}
          number={index + 1}
          title={prompt.title}
          objective={prompt.objective}
          prompt={prompt.prompt}
          outcome={prompt.outcome}
        />
      ))}
    </div>
  );
};

export default PromptList;