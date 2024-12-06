import React from 'react';
import { XMarkIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface SkippableQuestionProps {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSkip?: () => void;
  required?: boolean;
  skipped?: boolean;
  suggestion?: string;
}

const SkippableQuestion: React.FC<SkippableQuestionProps> = ({
  id,
  label,
  description,
  placeholder,
  value,
  onChange,
  onSkip,
  required = false,
  skipped = false,
  suggestion
}) => {
  const handleUseSuggestion = () => {
    if (suggestion) {
      onChange(suggestion);
    }
  };

  return (
    <div className={`relative ${skipped ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-900">
          {label}
          {!required && <span className="text-gray-500 text-xs ml-2">(Optional)</span>}
          {required && <span className="text-red-500 text-xs ml-2">*</span>}
        </label>
        {!required && !skipped && onSkip && (
          <button
            onClick={onSkip}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Skip
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      
      {skipped ? (
        <div className="mt-2">
          {suggestion ? (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-start">
                <LightBulbIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-blue-700">{suggestion}</p>
                  <button
                    onClick={handleUseSuggestion}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Use this suggestion
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 italic">Question skipped</span>
              <button
                onClick={() => onChange('')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Answer now
              </button>
            </div>
          )}
        </div>
      ) : (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`mt-2 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            required && !value.trim() ? 'border-red-300' : 'border-gray-300'
          }`}
          required={required}
        />
      )}
      
      {required && !value.trim() && !skipped && (
        <p className="mt-1 text-sm text-red-500">This field is required</p>
      )}
    </div>
  );
};

export default SkippableQuestion;