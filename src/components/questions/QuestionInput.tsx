import React from 'react';

export interface QuestionInputProps {
  id: string;
  label: string;
  description: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSkip?: () => void;
  required?: boolean;
  skipped?: boolean;
  suggestion?: string | null;
  onUseSuggestion?: () => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  id,
  label,
  description,
  placeholder,
  value,
  onChange,
  onSkip,
  required = false,
  skipped = false,
  suggestion,
  onUseSuggestion
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm ${skipped ? 'opacity-50' : ''}`}>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <label htmlFor={id} className="block text-lg font-medium text-gray-900">
              {label}
              {!required && <span className="text-gray-500 text-sm ml-2">(Optional)</span>}
              {required && <span className="text-red-500 text-sm ml-2">*</span>}
            </label>
            <p className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">{description}</p>
          </div>
          {onSkip && !required && !skipped && (
            <button
              onClick={onSkip}
              className="ml-4 flex items-center px-3 py-1 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Skip
            </button>
          )}
        </div>

        <div className="relative">
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className={`block w-full rounded-lg shadow-sm resize-y min-h-[100px] max-h-[200px] ${
              required && !value.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {required && !value.trim() && !skipped && (
            <p className="mt-1 text-sm text-red-500">This field is required</p>
          )}
        </div>

        {suggestion && !skipped && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
            <div className="max-h-[200px] overflow-y-auto p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-blue-700 whitespace-pre-wrap">{suggestion}</p>
                  {onUseSuggestion && (
                    <button
                      onClick={onUseSuggestion}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                    >
                      Use this suggestion
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionInput;