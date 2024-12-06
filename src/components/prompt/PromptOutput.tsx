import React, { useState, useEffect, useCallback } from 'react';
import { DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useProjectStore } from '../../stores/projectStore';
import { ProjectPromptService } from '../../services/prompt/projectPromptService';
import { PromptOutputService, VersionedPrompt } from '../../services/prompt/promptOutputService';
import { toast } from 'react-hot-toast';
import RegenerationDashboard from '../RegenerationDashboard';
import VersionBadge from '../VersionBadge';
import GenerationStats from '../GenerationStats';
import ProcessingIndicator from '../ProcessingIndicator';
import CopyButton from '../CopyButton';

const PromptOutput: React.FC = () => {
  const { currentProject, getDocument } = useProjectStore();
  const [prompts, setPrompts] = useState<VersionedPrompt[]>([]);
  const [promptsByStage, setPromptsByStage] = useState<Record<number, VersionedPrompt[]>>({});
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [processingTime, setProcessingTime] = useState(0);
  const [processedStages, setProcessedStages] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [processingSteps, setProcessingSteps] = useState<Array<{
    id: string;
    label: string;
    description: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress?: number;
  }>>([
    {
      id: 'analyzing',
      label: 'Analyzing Document',
      description: 'Extracting key requirements and features',
      status: 'pending'
    },
    {
      id: 'generating',
      label: 'Generating Prompts',
      description: 'Creating stage-based development prompts',
      status: 'pending'
    },
    {
      id: 'formatting',
      label: 'Formatting Output',
      description: 'Organizing and structuring prompts',
      status: 'pending'
    }
  ]);

  const loadPrompts = useCallback(async () => {
    if (!currentProject) return;

    try {
      console.log('[PromptOutput] Loading prompts for project:', currentProject);
      const loadedPrompts = await PromptOutputService.getAllPrompts(currentProject);
      console.log('[PromptOutput] Loaded prompts:', loadedPrompts);

      // Group prompts by stage
      const byStage: Record<number, VersionedPrompt[]> = {};
      loadedPrompts.forEach(prompt => {
        if (!byStage[prompt.stage]) {
          byStage[prompt.stage] = [];
        }
        byStage[prompt.stage].push(prompt);
      });

      setPrompts(loadedPrompts);
      setPromptsByStage(byStage);
      setProcessedStages(Object.keys(byStage).length);

      // Get latest version
      const latestVersion = Math.max(...loadedPrompts.map(p => p.version), 0);
      setCurrentVersion(latestVersion);
    } catch (error) {
      console.error('[PromptOutput] Failed to load prompts:', error);
      toast.error('Failed to load prompts');
    }
  }, [currentProject]);

  // Initial load
  useEffect(() => {
    if (currentProject) {
      loadPrompts();
    }
  }, [currentProject, loadPrompts]);

  const handleRegenerate = async () => {
    if (!currentProject) return;

    try {
      setIsRegenerating(true);
      const startTime = Date.now();

      const document = await getDocument(currentProject);
      if (!document) {
        toast.error('No document found. Please upload a document first.');
        return;
      }

      await ProjectPromptService.processDocument(
        currentProject,
        document,
        undefined,
        (stage, stageProgress) => {
          setCurrentStage(parseInt(stage));
          setProgress(stageProgress);
          
          const stepId = stage === 'analyzing' ? 'analyzing'
            : stage === 'extracting' ? 'extracting'
            : stage === 'generating' ? 'generating'
            : 'formatting';
            
          setProcessingSteps(steps => 
            steps.map(step => ({
              ...step,
              status: step.id === stepId ? 'processing' 
                : step.id < stepId ? 'completed' 
                : 'pending',
              progress: step.id === stepId ? stageProgress : undefined
            }))
          );
        }
      );

      const endTime = Date.now();
      setProcessingTime((endTime - startTime) / 1000);
      
      await loadPrompts();
      toast.success('Prompts regenerated successfully');
    } catch (error) {
      console.error('[PromptOutput] Failed to regenerate prompts:', error);
      toast.error('Failed to regenerate prompts');
    } finally {
      setIsRegenerating(false);
      setProgress(0);
      setCurrentStage(0);
      setProcessingSteps(steps => 
        steps.map(step => ({ ...step, status: 'pending', progress: undefined }))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-200">Generated Prompts</h2>
          <p className="text-sm text-gray-400">
            {prompts.length} prompts across {processedStages} stages
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate Prompts'}
          </button>
          <button
            onClick={() => {}} // TODO: Implement export
            className="flex items-center px-4 py-2 text-gray-200 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            Export All
          </button>
        </div>
      </div>

      {/* Regeneration Dashboard */}
      {isRegenerating && (
        <RegenerationDashboard
          isRegenerating={isRegenerating}
          currentStage={currentStage}
          totalStages={5}
          progress={progress}
          processingTime={processingTime}
          version={currentVersion + 1}
          promptsGenerated={prompts.length}
        />
      )}

      {/* Stats */}
      {!isRegenerating && prompts.length > 0 && (
        <GenerationStats
          totalPrompts={prompts.length}
          processedStages={processedStages}
          processingTime={processingTime}
          version={currentVersion}
        />
      )}

      {/* Prompts by Stage */}
      <div className="space-y-8">
        {Object.entries(promptsByStage).map(([stage, stagePrompts]) => (
          <div key={stage} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-200">
                Stage {stage}: {getStageTitle(parseInt(stage))}
              </h3>
              <VersionBadge
                version={Math.max(...stagePrompts.map(p => p.version))}
                timestamp={stagePrompts[0].timestamp}
                isLatest={true}
              />
            </div>

            <div className="grid gap-4">
              {stagePrompts.map((prompt, index) => (
                <div key={`${prompt.stage}-${prompt.promptNumber}`} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <div className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-medium">
                        Prompt {prompt.promptNumber}: {prompt.title}
                      </h4>
                      <CopyButton content={formatPromptForCopy(prompt)} />
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-400 mb-1">Objective</h5>
                      <p className="text-gray-200">{prompt.objective}</p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-400 mb-1">Instructions</h5>
                      <div className="bg-gray-700 rounded p-3 text-gray-200 font-mono text-sm whitespace-pre-wrap">
                        {prompt.prompt}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-400 mb-1">Expected Outcome</h5>
                      <p className="text-gray-200">{prompt.outcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isRegenerating && prompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No prompts generated yet.</p>
          <button
            onClick={handleRegenerate}
            className="px-4 py-2 text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90"
          >
            Generate Prompts
          </button>
        </div>
      )}
    </div>
  );
};

const getStageTitle = (stage: number): string => {
  const titles = {
    1: 'Core Features',
    2: 'User Interface',
    3: 'Data Management',
    4: 'Performance',
    5: 'Testing & Quality'
  };
  return titles[stage as keyof typeof titles] || 'Unknown Stage';
};

const formatPromptForCopy = (prompt: VersionedPrompt): string => {
  return `Prompt [${prompt.promptNumber}]: ${prompt.title}

Objective:
${prompt.objective}

Instructions:
${prompt.prompt}

Expected Outcome:
${prompt.outcome}`;
};

export default PromptOutput;