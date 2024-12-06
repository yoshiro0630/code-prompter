import React from 'react';
import { useAPIStore } from '../stores/apiStore';
import { availableModels } from '../config/models';

const ModelToggle: React.FC = () => {
  const { modelConfig, setModelConfig, activeProvider } = useAPIStore();

  const currentModel = availableModels.find(m => m.id === modelConfig.model);
  const providerModels = availableModels.filter(m => m.provider === activeProvider);

  return (
    <div className="flex items-center space-x-2">
      <select
        value={modelConfig.model}
        onChange={(e) => setModelConfig({ model: e.target.value })}
        className="block w-40 rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
      >
        {providerModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      
      {currentModel && (
        <div className="text-xs text-gray-500 hidden md:block">
          {currentModel.description}
        </div>
      )}
    </div>
  );
};

export default ModelToggle;