import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAPIStore } from '../../stores/apiStore';
import { ConfigurationMode, KnowledgeSource, ConfigurationRule } from '../../types/config-types';
import KnowledgeSourceEditor from './KnowledgeSourceEditor';
import RuleEditor from './RuleEditor';
import PromptCountEditor from './PromptCountEditor';

interface ConfigurationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prompts' | 'knowledge' | 'rules'>('prompts');
  const [mode, setMode] = useState<ConfigurationMode>('blended');
  // const { configManager } = useAPIStore();

  const handleModeChange = (newMode: ConfigurationMode) => {
    setMode(newMode);
    // configManager?.setMode(newMode);
  };

  const handleAddKnowledgeSource = (source: Omit<KnowledgeSource, 'id'>) => {
    // configManager?.addKnowledgeSource(source);
  };

  const handleAddRule = (rule: Omit<ConfigurationRule, 'id'>) => {
    // configManager?.addRule(rule);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              Advanced Configuration
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('prompts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'prompts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Prompt Settings
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'knowledge'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Knowledge Sources
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rules'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rules
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'prompts' && (
              <PromptCountEditor />
            )}
            {activeTab === 'knowledge' && (
              <KnowledgeSourceEditor onAdd={handleAddKnowledgeSource} />
            )}
            {activeTab === 'rules' && (
              <RuleEditor onAdd={handleAddRule} />
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfigurationPanel;