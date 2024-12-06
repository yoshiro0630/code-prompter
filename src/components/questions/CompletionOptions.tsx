import React from 'react';
import { DocumentTextIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { ProjectType } from '../../types/questions';
import { PreviewService } from '../../services/preview/previewService';
import { ProjectCalculator } from '../../services/calculator/projectCalculator';
import { toast } from 'react-hot-toast';

interface CompletionOptionsProps {
  answers: Record<string, string>;
  projectType: ProjectType;
  onGeneratePrompts: () => void;
}

const CompletionOptions: React.FC<CompletionOptionsProps> = ({
  answers,
  projectType,
  onGeneratePrompts
}) => {
  const handleGeneratePreview = async () => {
    try {
      const calculator = new ProjectCalculator();
      const metrics = calculator.calculateProjectMetrics(answers, projectType);
      await PreviewService.openPreview(answers, projectType, metrics);
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to open preview. Please allow popups and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Project Requirements Completed!
      </h2>

      <div className="mb-8">
        <p className="text-gray-600">
          Great job! You've completed all the questions. Choose how you'd like to proceed:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={handleGeneratePreview}
          className="p-6 bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg text-white hover:opacity-90 transition-opacity group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 rounded-lg p-2">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold mb-2">Generate Design Brief</h3>
              <p className="text-sm opacity-90">
                Create a comprehensive project brief with requirements, specifications, and timeline
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onGeneratePrompts}
          className="p-6 bg-gradient-to-r from-[#FF47FF] to-[#7F47FF] rounded-lg text-white hover:opacity-90 transition-opacity group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 rounded-lg p-2">
              <CodeBracketIcon className="h-6 w-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold mb-2">Generate BOLT.NEW Prompts</h3>
              <p className="text-sm opacity-90">
                Create stage-based prompts for building your application with AI assistance
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Project Summary</h4>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Type:</span> {projectType.charAt(0).toUpperCase() + projectType.slice(1)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Questions Completed:</span> {Object.keys(answers).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompletionOptions;