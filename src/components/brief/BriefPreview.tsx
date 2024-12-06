import React from 'react';
import { ProjectType } from '../../types/questions';
import BriefTemplate from './BriefTemplate';
import { exportToMarkdown } from '../../utils/export';
import { toast } from 'react-hot-toast';
import { formatBriefForExport } from '../../utils/formatters';

interface BriefPreviewProps {
  answers: Record<string, string>;
  projectType: ProjectType;
  onBack: () => void;
}

const BriefPreview: React.FC<BriefPreviewProps> = ({
  answers,
  projectType,
  onBack
}) => {
  const handleExport = () => {
    try {
      const content = formatBriefForExport(answers, projectType);
      exportToMarkdown(content);
      toast.success('Brief exported successfully');
    } catch (error) {
      toast.error('Failed to export brief');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back to Preview
        </button>
      </div>

      <div className="mb-8">
        <BriefTemplate
          projectType={projectType}
          answers={answers}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default BriefPreview;