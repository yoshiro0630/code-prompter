import React from 'react';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
}

interface ProcessingIndicatorProps {
  stage: string;
  progress: number;
  steps: ProcessingStep[];
  currentStep?: string;
  error?: string;
  processingTime?: number;
  version?: number;
  stageProgress?: {
    current: number;
    total: number;
  };
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  stage,
  progress,
  steps,
  currentStep,
  error,
  processingTime,
  version,
  stageProgress
}) => {
  return (
    <div className="mt-4 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      {/* Main Progress */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-[#47FFFF] border-r-[#FF47FF] border-b-[#47FFFF] border-l-[#FF47FF]"></div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-200 font-medium">{stage}</span>
            {stageProgress && (
              <span className="text-gray-400 text-sm bg-gray-700 px-2 py-1 rounded">
                Stage {stageProgress.current}/{stageProgress.total}
              </span>
            )}
            {processingTime !== undefined && (
              <span className="text-gray-400 text-sm">
                ({processingTime}s)
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[#47FFFF] font-medium">{Math.round(progress)}%</span>
          {version !== undefined && (
            <span className="px-2 py-1 bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white rounded text-sm">
              v{version}
            </span>
          )}
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] h-2 rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className="w-6 h-6 flex-shrink-0">
              {step.status === 'completed' && (
                <CheckIcon className="w-6 h-6 text-green-400" />
              )}
              {step.status === 'processing' && (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-[#47FFFF] border-r-[#FF47FF] border-b-[#47FFFF] border-l-[#FF47FF]"></div>
              )}
              {step.status === 'error' && (
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                  !
                </div>
              )}
              {step.status === 'pending' && (
                <ClockIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${
                  step.status === 'processing' ? 'text-[#47FFFF]' :
                  step.status === 'completed' ? 'text-green-400' :
                  step.status === 'error' ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {step.progress !== undefined && (
                  <span className="text-xs text-gray-400">
                    {Math.round(step.progress)}%
                  </span>
                )}
              </div>
              {step.status === 'processing' && step.progress !== undefined && (
                <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                  <div
                    className="bg-[#47FFFF] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              )}
              <p className="text-sm text-gray-400 mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5">!</div>
            <div className="flex-1">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Tips */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="animate-pulse w-4 h-4 rounded-full bg-[#47FFFF]"></div>
          <p className="text-sm">
            {currentStep === 'analyzing'
              ? 'Analyzing document structure and content...'
              : currentStep === 'extracting'
              ? 'Extracting key requirements and features...'
              : currentStep === 'generating'
              ? 'Generating optimized prompts...'
              : currentStep === 'formatting'
              ? 'Formatting and organizing generated content...'
              : 'Processing your request...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingIndicator;