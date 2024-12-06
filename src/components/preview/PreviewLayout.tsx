import React, { useState } from 'react';
import { ProjectType } from '../../types/questions';
import PreviewWindow from './PreviewWindow';
import { ProjectCalculator } from '../../services/calculator/projectCalculator';
import { DocumentArrowDownIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../../utils/clipboard';
import { toast } from 'react-hot-toast';

interface PreviewLayoutProps {
  answers: Record<string, string>;
  projectType: ProjectType;
  onBack: () => void;
  onGeneratePrompts: () => void;
}

const PreviewLayout: React.FC<PreviewLayoutProps> = ({
  answers,
  projectType,
  onBack,
  onGeneratePrompts
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const calculator = new ProjectCalculator();
  const metrics = calculator.calculateProjectMetrics(answers, projectType);

  const handleCopy = async () => {
    try {
      const content = formatContent(answers, projectType);
      await copyToClipboard(content);
      toast.success('Content copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  const formatContent = (answers: Record<string, string>, projectType: ProjectType): string => {
    return `# ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Requirements\n\n` +
      Object.entries(answers)
        .map(([_, value]) => value)
        .join('\n\n');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Project Requirements Preview
            </h1>

            <div className="mt-8">
              <p className="text-gray-600 mb-8">
                Your project requirements document has been generated. Choose how you'd like to view or export it.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Open Preview
                </button>
                
                <button
                  onClick={handleCopy}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
                >
                  <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                  Copy to Clipboard
                </button>
                
                <button
                  onClick={onGeneratePrompts}
                  className="px-6 py-3 bg-gradient-to-r from-[#FF47FF] to-[#7F47FF] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center col-span-2"
                >
                  Generate BOLT.NEW Prompts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <PreviewWindow
          answers={answers}
          projectType={projectType}
          metrics={metrics}
        />
      )}
    </div>
  );
};

export default PreviewLayout;