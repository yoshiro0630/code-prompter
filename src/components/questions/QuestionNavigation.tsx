import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface QuestionNavigationProps {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  onBack,
  onNext,
  canProceed,
  isLastStep,
  currentStep,
  totalSteps
}) => {
  return (
    <div className="px-6 py-4 bg-white flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-1" />
        Back
      </button>

      <div className="text-sm text-gray-500">
        Question {currentStep + 1} of {totalSteps}
      </div>
      
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLastStep ? 'Complete' : 'Next'}
        {!isLastStep && <ChevronRightIcon className="w-5 h-5 ml-1" />}
      </button>
    </div>
  );
};

export default QuestionNavigation;