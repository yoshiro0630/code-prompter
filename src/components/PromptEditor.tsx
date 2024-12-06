import React, { useState } from 'react';
import { PromptStage } from '../types/prompt-types';
import type { OptimizationSettings } from '../types/prompt-types';
import OptimizationSettingsPanel from './settings/OptimizationSettingsPanel';

interface PromptEditorProps {
  stage: PromptStage;
  onSave: (content: string, settings?: OptimizationSettings) => void;
  suggestions?: string[];
}

const PromptEditor: React.FC<PromptEditorProps> = ({ stage, onSave, suggestions }) => {
  const [content, setContent] = useState(stage.content);
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>(
    stage.metadata?.optimizationSettings || {
      focus: 'clarity',
      iterativeRefinement: false
    }
  );

  const handleSave = () => {
    onSave(content, optimizationSettings);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{stage.title}</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            {showSettings ? 'Hide Settings' : 'Optimization Settings'}
          </button>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setContent(stage.content);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <OptimizationSettingsPanel
            settings={optimizationSettings}
            onSettingsChange={setOptimizationSettings}
          />
        </div>
      )}

      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your prompt content..."
        />
      ) : (
        <div className="prose max-w-none">
          <pre className="p-4 bg-gray-50 rounded-md">{content}</pre>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Suggestions:</h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100"
                onClick={() => setContent(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PromptEditor;