import React from 'react';
import { useAPIStore } from '../stores/apiStore';
import { availableModels } from '../config/models';

const ModelSelector: React.FC = () => {
  const { modelConfig, setModelConfig, activeProvider } = useAPIStore();

  const providerModels = availableModels.filter(m => m.provider === activeProvider);
  const currentModel = providerModels.find(m => m.id === modelConfig.model) || providerModels[0];

  const handleModelChange = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      setModelConfig({ 
        model: modelId,
        maxTokens: model.maxTokens
      });
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <select
        value={modelConfig.model}
        onChange={(e) => handleModelChange(e.target.value)}
        className="block w-48 rounded-md border-gray-600 bg-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {providerModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      
      <div className="text-sm text-gray-400">
        Max tokens: {currentModel.maxTokens.toLocaleString()}
      </div>
    </div>
  );
};

export default ModelSelector;