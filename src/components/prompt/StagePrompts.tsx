import React, { useState } from 'react';
import { getStagePrompts, StagePrompt } from '../../services/prompt/stagePrompts';
import PromptCard from './PromptCard';
import { usePromptStore } from '../../stores/promptStore';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface StagePromptsProps {
  stage: number;
  isActive?: boolean;
}

const StagePrompts: React.FC<StagePromptsProps> = ({ stage, isActive = true }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const { saveStagePrompts, getStagePrompts: getSavedPrompts } = usePromptStore();
  
  // Get default prompts from the service
  const defaultPrompts = getStagePrompts(stage);
  // Get saved prompts from the store
  const savedPrompts = getSavedPrompts(stage);
  // Use saved prompts if they exist, otherwise use defaults
  const prompts = savedPrompts.length > 0 ? savedPrompts : defaultPrompts;

  const handleSavePrompt = (updatedPrompt: StagePrompt) => {
    const updatedPrompts = [...prompts];
    updatedPrompts[currentPromptIndex] = updatedPrompt;
    saveStagePrompts(stage, updatedPrompts);
  };

  const handlePrevPrompt = () => {
    setCurrentPromptIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextPrompt = () => {
    setCurrentPromptIndex(prev => Math.min(prompts.length - 1, prev + 1));
  };

  if (!prompts.length) {
    return null;
  }

  const currentPrompt = prompts[currentPromptIndex];

  return (
    <div className={`mt-6 space-y-6 ${!isActive && 'opacity-75'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Stage {stage} Prompts
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPrompt}
            disabled={currentPromptIndex === 0}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {currentPromptIndex + 1} of {prompts.length}
          </span>
          <button
            onClick={handleNextPrompt}
            disabled={currentPromptIndex === prompts.length - 1}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <PromptCard
          number={currentPromptIndex + 1}
          {...currentPrompt}
          onSave={handleSavePrompt}
          isEditable={isActive}
        />
      </div>

      <div className="grid grid-cols-5 gap-4 mt-8">
        {prompts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPromptIndex(index)}
            className={`p-4 rounded-lg border transition-all ${
              index === currentPromptIndex
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
            }`}
          >
            <div className="text-sm font-medium text-center dark:text-gray-300">
              Prompt {index + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StagePrompts;