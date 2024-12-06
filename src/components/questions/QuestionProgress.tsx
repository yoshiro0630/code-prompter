import React from 'react';

interface QuestionProgressProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  isLoading?: boolean;
}

const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentStep,
  totalSteps,
  title,
  isLoading
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-6 sticky top-0 bg-white z-10 py-4 px-4 -mx-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium text-gray-900">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-[#47FFFF] border-r-[#FF47FF] border-b-[#47FFFF] border-l-[#FF47FF]"></div>
              <span>Generating questions...</span>
            </div>
          ) : (
            title
          )}
        </h2>
        <div className="text-sm text-gray-500">
          Question {currentStep + 1} of {totalSteps}
        </div>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default QuestionProgress;