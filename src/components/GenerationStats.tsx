import React from 'react';
import { ChartBarIcon, ClockIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

interface GenerationStatsProps {
  totalPrompts: number;
  processedStages: number;
  processingTime: number;
  version: number;
}

const GenerationStats: React.FC<GenerationStatsProps> = ({
  totalPrompts,
  processedStages,
  processingTime,
  version
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Prompts</p>
            <p className="text-2xl font-bold text-gray-200">{totalPrompts}</p>
            <p className="text-xs text-gray-400 mt-1">Across {processedStages} stages</p>
          </div>
          <ChartBarIcon className="w-8 h-8 text-[#47FFFF]" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Stages Generated</p>
            <p className="text-2xl font-bold text-gray-200">{processedStages}/5</p>
            <p className="text-xs text-gray-400 mt-1">Total stages completed</p>
          </div>
          <DocumentCheckIcon className="w-8 h-8 text-[#FF47FF]" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Processing Time</p>
            <p className="text-2xl font-bold text-gray-200">{processingTime}s</p>
            <p className="text-xs text-gray-400 mt-1">Total generation time</p>
          </div>
          <ClockIcon className="w-8 h-8 text-[#7F47FF]" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Version</p>
            <p className="text-2xl font-bold text-gray-200">v{version}</p>
            <p className="text-xs text-gray-400 mt-1">Current version</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] flex items-center justify-center text-white font-bold">
            {version}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationStats;