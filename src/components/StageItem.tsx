import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PromptStage } from '../types/prompt-types';

interface StageItemProps {
  stage: PromptStage;
  isSelected: boolean;
  onClick: () => void;
}

const StageItem: React.FC<StageItemProps> = ({ stage, isSelected, onClick }) => {
  const hasContent = stage.content.length > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg transition-colors ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'bg-white border border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
            {stage.title}
          </span>
          {hasContent && (
            <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
          )}
        </div>
        <span className="text-sm text-gray-500">Stage {stage.order}</span>
      </div>
    </button>
  );
}

export default StageItem;