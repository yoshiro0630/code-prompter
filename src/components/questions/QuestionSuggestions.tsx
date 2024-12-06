import React from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';

interface QuestionSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const QuestionSuggestions: React.FC<QuestionSuggestionsProps> = ({ suggestions, onSelect }) => {
  if (!suggestions.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center text-sm text-gray-500">
        <LightBulbIcon className="h-4 w-4 mr-2" />
        <span>Suggestions based on previous answers:</span>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left p-2 rounded-md bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionSuggestions;