import React from 'react';
import { useStageConfig } from '../../hooks/useStageConfig';

const PromptCountEditor: React.FC = () => {
  const stages = ['overview', 'requirements', 'timeline', 'budget'];
  const stageConfigs = stages.map(stage => useStageConfig(stage));

  const handleCountChange = (stageName: string, value: number) => {
    const configHook = stageConfigs.find(c => c.config.stage === stageName);
    if (configHook) {
      configHook.updateConfig({ maxPrompts: value });
    }
  };

  const handleResetAll = () => {
    stageConfigs.forEach(configHook => configHook.resetToDefault());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Prompt Count Settings
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure the maximum number of prompts generated for each stage.
          </p>
        </div>
        <button
          onClick={handleResetAll}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center space-x-1"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          Reset to Defaults
        </button>
      </div>

      {stageConfigs.map(({ config, updateConfig, isLoading, error }) => (
        <div key={config.stage} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {config.stage.charAt(0).toUpperCase() + config.stage.slice(1)} Stage
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="20"
              value={config.maxPrompts}
              onChange={(e) => handleCountChange(config.stage, parseInt(e.target.value))}
              disabled={isLoading}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">
              {isLoading ? '...' : config.maxPrompts}
            </span>
          </div>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
      ))}

      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Dynamic Adjustment
        </h4>
        <p className="text-sm text-blue-700">
          The actual number of prompts will be dynamically adjusted based on:
        </p>
        <ul className="mt-2 text-sm text-blue-600 list-disc list-inside">
          <li>Content complexity</li>
          <li>Number of key topics identified</li>
          <li>Stage type</li>
          <li>Available context</li>
        </ul>
      </div>
    </div>
  );
};

export default PromptCountEditor;