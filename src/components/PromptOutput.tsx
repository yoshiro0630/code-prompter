import React from 'react';
import { PromptPreviewService } from '../services/preview/promptPreviewService';
import { exportToMarkdown } from '../utils/export';
import { toast } from 'react-hot-toast';
import { parsePrompts } from '../utils/promptParser';
import PromptHeader from './prompt/PromptHeader';
import PromptList from './prompt/PromptList';

interface PromptOutputProps {
  content: string;
}

const PromptOutput: React.FC<PromptOutputProps> = ({ content }) => {
  const prompts = parsePrompts(content);

  const handleOpenPreview = async () => {
    try {
      await PromptPreviewService.openPromptPreview(content);
    } catch (error) {
      console.error('Failed to open preview:', error);
    }
  };

  const handleExport = () => {
    try {
      exportToMarkdown(content);
      toast.success('Prompts exported successfully');
    } catch (error) {
      toast.error('Failed to export prompts');
    }
  };

  if (!content) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <PromptHeader 
        onExport={handleExport}
        onOpenPreview={handleOpenPreview}
      />
      
      <PromptList prompts={prompts} />
    </div>
  );
};

export default PromptOutput;