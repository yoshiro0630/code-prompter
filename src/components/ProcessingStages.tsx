import React from 'react';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Stage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error' | string;
  progress?: number;
}

interface ProcessingStagesProps {
  stages: Stage[];
  currentStage: string;
  progress: number;
}

const ProcessingStages: React.FC<ProcessingStagesProps> = ({ stages, currentStage, progress }) => {
  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <div 
          key={stage.id}
          className={`bg-gray-800 rounded-lg p-4 border ${
            stage.status === 'processing' 
              ? 'border-blue-500'
              : stage.status === 'completed'
              ? 'border-green-500'
              : stage.status === 'error'
              ? 'border-red-500'
              : 'border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              {stage.status === 'completed' ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
              ) : stage.status === 'processing' ? (
                <div className="w-5 h-5 border-2 border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent rounded-full animate-spin" />
              ) : (
                <ClockIcon className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-200">{stage.name}</h3>
                <p className="text-xs text-gray-400">{stage.description}</p>
              </div>
            </div>
            {stage.status === 'processing' && (
              <span className="text-sm text-blue-400">{Math.round(stage.progress || 0)}%</span>
            )}
          </div>

          {stage.status === 'processing' && (
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] transition-all duration-300"
                style={{ width: `${stage.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}

      <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Overall Progress</span>
          <span className="text-sm text-gray-200">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessingStages;