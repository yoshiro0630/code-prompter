import React from 'react';
import { OptimizationSettings } from '../../types/prompt-types';

interface OptimizationSettingsPanelProps {
  settings: OptimizationSettings;
  onSettingsChange: (settings: OptimizationSettings) => void;
}

const OptimizationSettingsPanel: React.FC<OptimizationSettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Optimization Focus
        </label>
        <select
          value={settings.focus}
          onChange={(e) => onSettingsChange({ ...settings, focus: e.target.value as OptimizationSettings['focus'] })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="clarity">Optimize for Clarity</option>
          <option value="technical">Optimize for Technical Details</option>
          <option value="creative">Optimize for Creative Brainstorming</option>
          <option value="audience">Audience-Specific Focus</option>
        </select>
      </div>

      {settings.focus === 'audience' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Audience
          </label>
          <input
            type="text"
            value={settings.audience || ''}
            onChange={(e) => onSettingsChange({ ...settings, audience: e.target.value })}
            placeholder="e.g., Technical managers, End users, Developers"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.iterativeRefinement}
            onChange={(e) => onSettingsChange({ ...settings, iterativeRefinement: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Enable Iterative Refinement</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Instructions
        </label>
        <textarea
          value={settings.customInstructions || ''}
          onChange={(e) => onSettingsChange({ ...settings, customInstructions: e.target.value })}
          placeholder="Add any specific instructions for prompt optimization..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>
    </div>
  );
};

export default OptimizationSettingsPanel;