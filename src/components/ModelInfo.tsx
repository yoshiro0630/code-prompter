import React from 'react';
import { ModelConfig } from '../types/models';

interface ModelInfoProps {
  modelConfig: ModelConfig;
}

const ModelInfo: React.FC<ModelInfoProps> = ({ modelConfig }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-500">Model:</span>
        <span className="text-sm font-medium text-gray-900">
          {modelConfig.model}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Temperature:</span>
        <span className="text-sm font-medium text-gray-900">
          {modelConfig.temperature}
        </span>
      </div>
    </div>
  );
};

export default ModelInfo;