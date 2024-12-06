import React from 'react';
import { Message } from '../types/chat';
import { ClipboardDocumentIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../utils/clipboard';
import { exportToMarkdown } from '../utils/export';
import { toast } from 'react-hot-toast';

interface PromptSection {
  title: string;
  objective: string;
  prompt: string;
  outcome: string;
}

interface MilestoneOutputProps {
  message: Message;
}

const MilestoneOutput: React.FC<MilestoneOutputProps> = ({ message }) => {
  const prompts = parsePrompts(message.content);

  const handleCopyPrompt = async (promptSection: PromptSection) => {
    const content = formatPromptForCopy(promptSection);
    await copyToClipboard(content);
    toast.success('Prompt copied to clipboard');
  };

  const handleExportPrompt = (promptSection: PromptSection) => {
    const content = formatPromptForCopy(promptSection);
    exportToMarkdown(content);
    toast.success('Prompt exported');
  };

  return (
    <div className="space-y-6">
      {prompts.map((promptSection, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
          <div className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] px-4 py-2 flex justify-between items-center">
            <h3 className="text-white font-semibold">
              Prompt {index + 1}: {promptSection.title}
            </h3>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <button
                onClick={() => handleCopyPrompt(promptSection)}
                className="p-1 text-white hover:bg-white/20 rounded"
                title="Copy prompt"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleExportPrompt(promptSection)}
                className="p-1 text-white hover:bg-white/20 rounded"
                title="Export prompt"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Objective</h4>
              <p className="mt-1 text-gray-900">{promptSection.objective}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Prompt</h4>
              <div className="mt-1 bg-gray-50 rounded-md p-3 text-gray-900 relative group">
                {promptSection.prompt}
                <button
                  onClick={() => copyToClipboard(promptSection.prompt)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy prompt"
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Expected Outcome</h4>
              <p className="mt-1 text-gray-900">{promptSection.outcome}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const parsePrompts = (content: string): PromptSection[] => {
  const promptRegex = /Prompt \[(\d+)\]: ([^\n]+)\nObjective: ([^\n]+)\nPrompt: ([^\n]+)\nOutcome: ([^\n]+)/g;
  const prompts: PromptSection[] = [];
  let match;

  while ((match = promptRegex.exec(content)) !== null) {
    prompts.push({
      title: match[2].trim(),
      objective: match[3].trim(),
      prompt: match[4].trim(),
      outcome: match[5].trim()
    });
  }

  return prompts;
};

const formatPromptForCopy = (promptSection: PromptSection): string => {
  return `# ${promptSection.title}\n\n` +
    `## Objective\n${promptSection.objective}\n\n` +
    `## Prompt\n${promptSection.prompt}\n\n` +
    `## Expected Outcome\n${promptSection.outcome}`;
};

export default MilestoneOutput;