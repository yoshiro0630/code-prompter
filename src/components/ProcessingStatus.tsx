import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface ProcessingStatusProps {
  isProcessing: boolean;
  stage?: string;
  progress?: number;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ 
  isProcessing, 
  stage = 'Processing...', 
  progress = 0 
}) => {
  if (!isProcessing) return null;

  return (
    <div className="fixed bottom-24 right-4 bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-200">
      <div className="flex items-center space-x-3 mb-3">
        {/* Processing Wheel */}
        <div className="relative w-5 h-5">
          <div className="absolute inset-0 border-2 border-t-[#47FFFF] border-r-[#FF47FF] border-b-[#47FFFF] border-l-[#FF47FF] rounded-full animate-spin"></div>
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
        <DocumentTextIcon className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-medium text-gray-700">{stage}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          {progress < 100 ? 'Processing your request...' : 'Almost done...'}
        </p>
        <span className="text-xs font-medium text-[#47FFFF]">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default ProcessingStatus;