import React from 'react';
import { OptimizationSettings } from '../../types/prompt-types';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const defaultRule = `You are an advanced AI assistant tasked with generating **detailed, point-form instructions** for Bolt.New. Your goal is to produce a prompt that returns the best possible result for technical implementation. Use all known instructions, knowledge, and best practices to structure the output effectively.

### **Output Requirements**:

1. **Title**: Summarise the feature in 3–5 words.
2. **Objective**: Provide a concise description of what the feature aims to achieve.
3. **Instructions (Point Form)**:
   - Detailed, step-by-step technical guidance for implementing the feature.
   - Include best practices, tools, and frameworks to use.
   - Mention specific configurations, dependencies, or settings required.
4. **Outcome**: Clearly describe the deliverable or expected result from the implementation.

### **Guidelines for Detailed Point-Form Instructions**:
1. **Clarity and Precision**:
   - Each point must be actionable and concise.
   - Avoid vague or generic instructions.
2. **Technical Depth**:
   - Include specific coding techniques, frameworks, or libraries.
   - Provide context for any configuration or setup steps.
3. **Consistency**:
   - Maintain a uniform format across all instructions.
   - Ensure logical sequencing of steps.
4. **Best Practices**:
   - Use industry standards and coding conventions.
   - Highlight potential pitfalls or common mistakes to avoid.`;

interface RulesEditorProps {
  settings: OptimizationSettings;
  onSettingsChange: (settings: OptimizationSettings) => void;
}

const RulesEditor: React.FC<RulesEditorProps> = ({ settings, onSettingsChange }) => {
  const handleRuleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onSettingsChange({
        ...settings,
        customRule: content,
        useCustomRule: true
      });
      toast.success('Rule template uploaded successfully');
    };
    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsText(file);
  };

  const handleUseCustomRule = (checked: boolean) => {
    onSettingsChange({
      ...settings,
      useCustomRule: checked,
      customRule: checked ? settings.customRule || defaultRule : defaultRule
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-200">
            Prompt Rule Template
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Customize the rules used to generate prompts
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.useCustomRule}
              onChange={(e) => handleUseCustomRule(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-200">Use Custom Rule</span>
          </label>
          <label className="flex items-center px-4 py-2 text-sm text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90 cursor-pointer">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Upload Rule
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleRuleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={settings.customRule || defaultRule}
          onChange={(e) => {
            onSettingsChange({
              ...settings,
              customRule: e.target.value,
              useCustomRule: true
            });
          }}
          rows={20}
          className="w-full rounded-md border-gray-600 bg-gray-700 text-gray-200 font-mono text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {!settings.useCustomRule && (
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
        )}
      </div>

      <div className="bg-blue-900/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-400 mb-2">
          Rule Template Tips
        </h4>
        <ul className="text-sm text-blue-300 space-y-2">
          <li>• Use markdown formatting for better structure</li>
          <li>• Include clear output requirements and guidelines</li>
          <li>• Define specific formatting rules for consistency</li>
          <li>• Add examples to illustrate desired output</li>
        </ul>
      </div>
    </div>
  );
};

export default RulesEditor;