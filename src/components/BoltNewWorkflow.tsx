import React, { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import GuidedQuestions from './questions/GuidedQuestions';
import PromptOutput from './PromptOutput';
import { formatGuidedAnswers } from '../utils/promptFormatters';

interface BoltNewWorkflowProps {
  onComplete: (data: { type: 'document' | 'guided', content: string, outputType: 'prompt' | 'brief' }) => void;
  onClose: () => void;
}

const BoltNewWorkflow: React.FC<BoltNewWorkflowProps> = ({ onComplete, onClose }) => {
  const [mode, setMode] = useState<'select' | 'document' | 'guided'>('select');
  const [outputType, setOutputType] = useState<'prompt' | 'brief'>('prompt');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleDocumentProcess = (content: string) => {
    setGeneratedContent(content);
    onComplete({ type: 'document', content, outputType });
  };

  const handleGuidedComplete = (answers: Record<string, string>) => {
    const content = formatGuidedAnswers(answers);
    setGeneratedContent(content);
    onComplete({ 
      type: 'guided', 
      content,
      outputType
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 overflow-y-auto max-h-[90vh]">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            BOLT.NEW Generator
          </h2>

          {mode === 'select' && (
            <div className="space-y-6">
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={() => setOutputType('prompt')}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    outputType === 'prompt'
                      ? 'bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Generate Prompts
                </button>
                <button
                  onClick={() => setOutputType('brief')}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    outputType === 'brief'
                      ? 'bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Create Developer Brief
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('document')}
                  className="p-6 bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg text-white hover:opacity-90 transition-opacity"
                >
                  <h3 className="text-xl font-bold mb-2">Upload Document</h3>
                  <p className="text-sm opacity-90">
                    Upload an existing document with project details
                  </p>
                </button>
                <button
                  onClick={() => setMode('guided')}
                  className="p-6 bg-gradient-to-r from-[#FF47FF] to-[#7F47FF] rounded-lg text-white hover:opacity-90 transition-opacity"
                >
                  <h3 className="text-xl font-bold mb-2">Answer Questions</h3>
                  <p className="text-sm opacity-90">
                    Follow our guided process to define your project
                  </p>
                </button>
              </div>
            </div>
          )}

          {mode === 'document' && (
            <DocumentUpload onDocumentProcess={handleDocumentProcess} />
          )}

          {mode === 'guided' && (
            <GuidedQuestions 
              onComplete={handleGuidedComplete}
              onBack={() => setMode('select')}
            />
          )}

          {generatedContent && (
            <PromptOutput content={generatedContent} />
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={() => mode === 'select' ? onClose() : setMode('select')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {mode === 'select' ? 'Cancel' : 'Back'}
          </button>
          {mode === 'select' && (
            <div className="text-sm text-gray-500">
              Selected: {outputType === 'prompt' ? 'Generate Prompts' : 'Create Developer Brief'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoltNewWorkflow;