import React from 'react';
import { DocumentArrowDownIcon, DocumentDuplicateIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../../utils/clipboard';
import { toast } from 'react-hot-toast';
import { formatTemplateContent } from '../../utils/formatters/templateFormatter';
import { ProjectType } from '../../types/questions';

interface TemplateDocumentProps {
  answers: Record<string, string>;
  projectType: ProjectType;
  onGenerateDesignBrief: () => void;
  onGeneratePrompts: () => void;
  onBack: () => void;
}

const TemplateDocument: React.FC<TemplateDocumentProps> = ({
  answers,
  projectType,
  onGenerateDesignBrief,
  onGeneratePrompts,
  onBack
}) => {
  const formattedContent = formatTemplateContent(answers, projectType);

  const handleCopy = async () => {
    try {
      await copyToClipboard(formattedContent);
      toast.success('Document copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy document');
    }
  };

  const renderListItem = (line: string, index: string) => {
    const content = line.slice(1).trim();
    const bulletPoint = line.charAt(0) === '-' ? '•' : line.charAt(0);
    
    return (
      <div key={`${index}-${content}`} className="flex items-start space-x-2 my-1">
        <span className="text-[#47FFFF] flex-shrink-0">{bulletPoint}</span>
        <span className="flex-1">{content}</span>
      </div>
    );
  };

  const renderSection = (title: string, content: string, sectionIndex: number) => {
    const lines = content.split('\n');
    
    return (
      <div key={`section-${sectionIndex}`} className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="prose max-w-none">
          {lines.map((line, lineIndex) => {
            if (line.startsWith('-') || line.startsWith('•')) {
              return renderListItem(line, `${sectionIndex}-${lineIndex}`);
            }
            if (line.trim()) {
              return (
                <p key={`${sectionIndex}-${lineIndex}`} className="my-1">
                  {line}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  const sections = formattedContent.split('\n\n').map((section, index) => {
    const [title, ...content] = section.split('\n');
    return {
      title: title.replace('#', '').trim(),
      content: content.join('\n').trim(),
      index
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Project Summary
          </h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-8">
              {sections.map((section) => 
                renderSection(section.title, section.content, section.index)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="bg-white border-t border-gray-200 py-4 sticky bottom-0 z-10">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
            Copy Summary
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={onGenerateDesignBrief}
              className="flex items-center px-6 py-2 text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90"
            >
              Generate Design Brief
            </button>
            <button
              onClick={onGeneratePrompts}
              className="flex items-center px-6 py-2 text-white bg-gradient-to-r from-[#FF47FF] to-[#7F47FF] rounded-lg hover:opacity-90"
            >
              Generate BOLT.NEW Prompts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDocument;