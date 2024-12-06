import React, { useEffect, useState } from 'react';
import { ClockIcon, DocumentCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import ProcessingStages from './ProcessingStages';

type Status = 'error' | 'pending' | 'processing' | 'completed' | string;
interface Stage {
  id: string;
  name: string;
  description: string;
  status: Status;
  progress: number;
}

interface RegenerationDashboardProps {
  isRegenerating: boolean;
  currentStage: number;
  totalStages: number;
  progress: number;
  processingTime: number;
  version: number;
  promptsGenerated: number;
}

const RegenerationDashboard: React.FC<RegenerationDashboardProps> = ({
  isRegenerating,
  currentStage,
  totalStages,
  progress,
  processingTime,
  version,
  promptsGenerated
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stageStartTime, setStageStartTime] = useState(Date.now());

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRegenerating) {
      setStageStartTime(Date.now());
      intervalId = setInterval(() => {
        setElapsedTime((Date.now() - stageStartTime) / 1000);
      }, 100);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRegenerating, currentStage]);

  const displayTime = isRegenerating ? elapsedTime : processingTime;
  const currentStageNumber = isRegenerating ? (currentStage || 1) : totalStages;

  const stages = [
    {
      id: 'analyzing',
      name: 'Document Analysis',
      description: 'Analyzing requirements and extracting key features',
      status: currentStage === 1 ? 'processing' : currentStage > 1 ? 'completed' : 'pending',
      progress: currentStage === 1 ? progress : currentStage > 1 ? 100 : 0
    },
    {
      id: 'core',
      name: 'Core Features',
      description: 'Generating prompts for core functionality',
      status: currentStage === 2 ? 'processing' : currentStage > 2 ? 'completed' : 'pending',
      progress: currentStage === 2 ? progress : currentStage > 2 ? 100 : 0
    },
    {
      id: 'ui',
      name: 'User Interface',
      description: 'Creating UI/UX implementation prompts',
      status: currentStage === 3 ? 'processing' : currentStage > 3 ? 'completed' : 'pending',
      progress: currentStage === 3 ? progress : currentStage > 3 ? 100 : 0
    },
    {
      id: 'data',
      name: 'Data Management',
      description: 'Developing data and state management prompts',
      status: currentStage === 4 ? 'processing' : currentStage > 4 ? 'completed' : 'pending',
      progress: currentStage === 4 ? progress : currentStage > 4 ? 100 : 0
    },
    {
      id: 'testing',
      name: 'Testing & Quality',
      description: 'Generating testing and deployment prompts',
      status: currentStage === 5 ? 'processing' : currentStage > 5 ? 'completed' : 'pending',
      progress: currentStage === 5 ? progress : currentStage > 5 ? 100 : 0
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isRegenerating ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
          <h3 className="text-lg font-medium text-gray-200">
            {isRegenerating ? 'Regenerating Prompts...' : 'Generation Complete'}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Version</span>
          <span className="px-2 py-1 bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white rounded text-sm">
            v{version}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Current Stage</p>
              <p className="text-xl font-bold text-gray-200">{currentStageNumber}/{totalStages}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-[#47FFFF]" />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Processing Time</p>
              <p className="text-xl font-bold text-gray-200">{displayTime.toFixed(1)}s</p>
            </div>
            <ClockIcon className="w-8 h-8 text-[#FF47FF]" />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Prompts Generated</p>
              <p className="text-xl font-bold text-gray-200">{promptsGenerated}</p>
            </div>
            <DocumentCheckIcon className="w-8 h-8 text-[#7F47FF]" />
          </div>
        </div>
      </div>

      {/* Processing Stages */}
      <ProcessingStages
        stages={stages}
        currentStage={`stage-${currentStage}`}
        progress={progress}
      />

      {/* Stage Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Overall Progress</span>
          <span className="text-gray-200">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalStages }).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full ${
              index + 1 === currentStage
                ? 'bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] animate-pulse'
                : index + 1 < currentStage
                ? 'bg-green-500'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Processing Details */}
      {isRegenerating && (
        <div className="text-sm text-gray-400">
          <p className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>
              {currentStage === 1
                ? 'Analyzing document and extracting requirements...'
                : currentStage === 2
                ? 'Generating core feature prompts...'
                : currentStage === 3
                ? 'Creating interface and user experience prompts...'
                : currentStage === 4
                ? 'Developing data and state management prompts...'
                : 'Finalizing testing and deployment prompts...'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default RegenerationDashboard;
