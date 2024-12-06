import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  DocumentTextIcon, 
  AdjustmentsHorizontalIcon,
  DocumentArrowDownIcon,
  BookOpenIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import DocumentUpload from '../DocumentUpload';
import OptimizationSettings from '../OptimizationSettings';
import PromptOutput from './PromptOutput';
import RulesEditor from '../settings/RulesEditor';
import ProjectHeader from '../ProjectHeader';
import ProjectStats from '../ProjectStats';
import { OptimizationSettings as OptimizationSettingsType } from '../../types/prompt-types';
import { useProjectStore } from '../../stores/projectStore';

const PromptBuilder: React.FC = () => {
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettingsType>({
    focus: 'clarity',
    iterativeRefinement: true,
    customRule: '',
    useCustomRule: false
  });

  const { setCurrentProject } = useProjectStore();

  const handleBackToProjects = () => {
    setCurrentProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToProjects}
                className="p-2 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-700"
                title="Back to Projects"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] bg-clip-text text-transparent">
                Project Builder
              </h1>
            </div>
          </div>
        </div>
      </header>

      <ProjectHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ProjectStats />

        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-xl bg-gray-800 p-1 shadow-lg mb-6">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                ${selected 
                  ? 'bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white shadow'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <DocumentTextIcon className="w-5 h-5" />
                <span>Document</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                ${selected 
                  ? 'bg-gradient-to-r from-[#FF47FF] to-[#7F47FF] text-white shadow'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                ${selected 
                  ? 'bg-gradient-to-r from-[#7F47FF] to-[#47FFFF] text-white shadow'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <BookOpenIcon className="w-5 h-5" />
                <span>Rules</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                ${selected 
                  ? 'bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white shadow'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>Output</span>
              </div>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <DocumentUpload onDocumentProcess={function (content: string): void {
                  throw new Error('Function not implemented.');
                } } />
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-lg font-semibold text-gray-200 mb-6">Prompt Generation Settings</h2>
                  <OptimizationSettings
                    settings={optimizationSettings}
                    onSettingsChange={setOptimizationSettings}
                  />
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-lg font-semibold text-gray-200 mb-6">Prompt Rules</h2>
                  <RulesEditor
                    settings={optimizationSettings}
                    onSettingsChange={setOptimizationSettings}
                  />
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <PromptOutput />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  );
};

export default PromptBuilder;