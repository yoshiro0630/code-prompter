import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types/chat';
import { ClipboardDocumentIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../utils/clipboard';
import { exportToMarkdown } from '../utils/export';
import { toast } from 'react-hot-toast';

interface BriefOutputProps {
  message: Message;
}

const BriefOutput: React.FC<BriefOutputProps> = ({ message }) => {
  const sections = parseBriefSections(message.content);

  const handleCopySection = async (title: string, content: string) => {
    await copyToClipboard(`# ${title}\n\n${content}`);
    toast.success('Section copied to clipboard');
  };

  const handleExportBrief = () => {
    exportToMarkdown(message.content);
    toast.success('Brief exported');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleExportBrief}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span>Export Brief</span>
        </button>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
          <div className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] px-4 py-2 flex justify-between items-center">
            <h3 className="text-white font-semibold">{section.title}</h3>
            <button
              onClick={() => handleCopySection(section.title, section.content)}
              className="p-1 text-white hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy section"
            >
              <ClipboardDocumentIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-4 prose max-w-none">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

const parseBriefSections = (content: string): { title: string; content: string }[] => {
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      if (currentSection) {
        sections.push({
          title: currentSection,
          content: currentContent.join('\n')
        });
      }
      currentSection = line.substring(2);
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    sections.push({
      title: currentSection,
      content: currentContent.join('\n')
    });
  }

  return sections;
};

export default BriefOutput;