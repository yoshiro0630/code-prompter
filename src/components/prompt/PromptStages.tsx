import React, { useState } from 'react';
import { ChevronRightIcon, ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import StagePrompts from './StagePrompts';
import { usePromptStore } from '../../stores/promptStore';
import { ProjectPromptService } from '../../services/prompt/projectPromptService';
import { OptimizationSettings } from '../../types/prompt-types';
import { Dialog } from '@headlessui/react';
import OptimizationSettingsPanel from '../settings/OptimizationSettings';
import { toast } from 'react-hot-toast';

const stages = [
  { id: 1, title: 'Core Features', description: 'Authentication, Profile, Dashboard, Search, Data Import/Export' },
  { id: 2, title: 'User Interface', description: 'Layouts, Forms, Tables, Modals, Theme' },
  { id: 3, title: 'Data Management', description: 'State, API, Real-time, Caching, Error Tracking' },
  { id: 4, title: 'Performance', description: 'Code Splitting, Optimization, Monitoring, Bundle, Memory' },
  { id: 5, title: 'Testing & Quality', description: 'Unit, Integration, Performance, Accessibility, Security' }
];

const PromptStages: React.FC = () => {
  const [expandedStages, setExpandedStages] = useState<number[]>([1]);
  const [currentStageIndex, setCurrentStageIndex] = useState(1);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    focus: 'clarity',
    iterativeRefinement: true
  });

  const { currentProject } = usePromptStore();

  const handleStageClick = (stageId: number) => {
    setExpandedStages(prev => 
      prev.includes(stageId)
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStage = currentStageIndex + 1;
      setCurrentStageIndex(nextStage);
      setExpandedStages(prev => [...prev, nextStage]);
    }
  };

  const handleReprocess = async () => {
    if (!currentProject) {
      toast.error('No project selected');
      return;
    }

    setIsProcessing(true);
    try {
      await ProjectPromptService.reprocessPrompts(currentProject, optimizationSettings);
      toast.success('Prompts regenerated successfully');
      setShowOptimizationModal(false);
    } catch (error) {
      console.error('Reprocess error:', error);
      toast.error('Failed to regenerate prompts');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Development Stages
        </h2>
        <button
          onClick={() => setShowOptimizationModal(true)}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Regenerate Prompts
        </button>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = index === currentStageIndex ? 'current' 
            : index < currentStageIndex ? 'completed' 
            : 'pending';
          const isExpanded = expandedStages.includes(stage.id);

          return (
            <div
              key={stage.id}
              className={`rounded-lg border transition-all duration-200 ${
                status === 'completed'
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : status === 'current'
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                  : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <button
                onClick={() => handleStageClick(stage.id)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      status === 'completed'
                        ? 'bg-green-500 text-white'
                        : status === 'current'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {status === 'completed' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stage.id
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stage.description}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? 'transform rotate-90' : ''
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <StagePrompts 
                    stage={stage.id} 
                    isActive={status === 'current'}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {currentStageIndex < stages.length - 1 && (
        <div className="flex justify-end pt-6">
          <button
            onClick={handleNextStage}
            className="flex items-center px-6 py-3 text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105"
          >
            <span className="mr-2">Next Stage</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Optimization Settings Modal */}
      <Dialog
        open={showOptimizationModal}
        onClose={() => setShowOptimizationModal(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Regenerate Prompts with Optimization
            </Dialog.Title>

            <div className="mb-6">
              <OptimizationSettingsPanel
                settings={optimizationSettings}
                onSettingsChange={setOptimizationSettings}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowOptimizationModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReprocess}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Regenerate Prompts'}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PromptStages;