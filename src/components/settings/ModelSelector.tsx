import React from 'react';
import { availableModels } from '../../config/models';
import { useAPIStore } from '../../stores/apiStore';

const ModelSelector: React.FC = () => {
  const { modelConfig, setModelConfig, activeProvider } = useAPIStore();

  const availableProviderModels = availableModels.filter(
    model => model.provider === activeProvider
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Model
        </label>
        <select
          value={modelConfig.model}
          onChange={(e) => setModelConfig({ model: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {availableProviderModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500">
          {availableModels.find(m => m.id === modelConfig.model)?.description}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Temperature
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={modelConfig.temperature}
          onChange={(e) => setModelConfig({ temperature: parseFloat(e.target.value) })}
          className="mt-1 block w-full"
        />
        <div className="mt-1 flex justify-between text-sm text-gray-500">
          <span>Precise</span>
          <span>{modelConfig.temperature}</span>
          <span>Creative</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Maximum Length
        </label>
        <input
          type="number"
          min="1"
          max={availableModels.find(m => m.id === modelConfig.model)?.maxTokens || 4096}
          value={modelConfig.maxTokens}
          onChange={(e) => setModelConfig({ maxTokens: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Maximum number of tokens to generate
        </p>
      </div>
    </div>
  );
};

export default ModelSelector;