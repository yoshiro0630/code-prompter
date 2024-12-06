import React, { useState } from 'react';
import { ProjectType } from '../../types/questions';
import BriefPreview from '../brief/BriefPreview';

interface AnswersPreviewProps {
  answers: Record<string, string>;
  projectType: ProjectType;
  onGenerateDesignBrief: () => void;
  onGeneratePrompts: () => void;
}

const AnswersPreview: React.FC<AnswersPreviewProps> = ({
  answers,
  projectType,
  onGenerateDesignBrief,
  onGeneratePrompts
}) => {
  const [showBrief, setShowBrief] = useState(false);

  if (showBrief) {
    return (
      <BriefPreview
        answers={answers}
        projectType={projectType}
        onBack={() => setShowBrief(false)}
      />
    );
  }

  return (
    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 sticky top-0 bg-white z-10 py-2">
          Project Requirements Summary
        </h2>
        
        <div className="mb-6">
          <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            {projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project
          </div>
          
          <div className="space-y-4 mb-20">
            {Object.entries(answers).map(([key, value], index) => (
              <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Question {index + 1}
                </h3>
                <p className="text-gray-900 break-words">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowBrief(true)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              View Design Brief
            </button>
            <button
              onClick={onGeneratePrompts}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF47FF] to-[#7F47FF] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Generate BOLT.NEW Prompts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswersPreview;