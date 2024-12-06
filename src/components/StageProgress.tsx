import React from 'react';

interface StageProgressProps {
  stage: number;
  totalStages: number;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

const StageProgress: React.FC<StageProgressProps> = ({ stage, totalStages, progress, status }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Stage {stage} of {totalStages}</span>
          <span className="text-sm text-gray-200">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              status === 'completed'
                ? 'bg-green-500'
                : status === 'error'
                ? 'bg-red-500'
                : 'bg-gradient-to-r from-[#47FFFF] to-[#FF47FF]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'completed'
            ? 'bg-green-500'
            : status === 'error'
            ? 'bg-red-500'
            : status === 'processing'
            ? 'bg-blue-500'
            : 'bg-gray-500'
        }`} />
        <span className="text-xs text-gray-400">
          {status === 'completed'
            ? 'Completed'
            : status === 'error'
            ? 'Error'
            : status === 'processing'
            ? 'Processing'
            : 'Pending'}
        </span>
      </div>
    </div>
  );
};

export default StageProgress;