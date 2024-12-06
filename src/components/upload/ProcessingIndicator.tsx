import React from 'react';

interface ProcessingIndicatorProps {
  stage: string;
  progress: number;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ stage, progress }) => {
  return (
    <div className="mt-4 bg-[#2A2A3A] p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white">{stage}</span>
        <span className="text-[#47FFFF]">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-400 text-sm mt-2">This may take a few seconds...</p>
    </div>
  );
};

export default ProcessingIndicator;