import React from 'react';
import { DocumentArrowDownIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../utils/clipboard';
import { exportToMarkdown } from '../utils/export';
import { toast } from 'react-hot-toast';

interface PromptDisplayProps {
  content: string;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ content }) => {
  const prompts = parsePrompts(content);

  const handleCopy = async (promptContent: string) => {
    try {
      await copyToClipboard(promptContent);
      toast.success('Prompt copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy prompt');
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

  if (!content || prompts.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Processing your document</h3>
          <p className="mt-2 text-sm text-gray-500">Please wait while we analyze and generate prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSIxNiIgZmlsbD0idXJsKCNncmFkaWVudCkiIC8+CiAgPHBhdGggZD0iTTQwIDgwVjQwTDYwIDYwTDgwIDQwVjgwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMTIwIiB5Mj0iMTIwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0N0ZGRkYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY0N0ZGIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KPC9zdmc+" 
            alt="Logo" 
            className="h-12 w-12"
          />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] bg-clip-text text-transparent">
            Generated Development Prompts
          </h2>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-md hover:opacity-90 transition-opacity"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Export All
        </button>
      </div>

      <div className="grid gap-6">
        {prompts.map((prompt, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-semibold text-lg">
                Prompt [{prompt.number}]: {prompt.title}
              </h3>
              <button
                onClick={() => handleCopy(prompt.content)}
                className="p-2 text-white hover:bg-white/20 rounded-md transition-colors"
                title="Copy prompt"
              >
                <DocumentDuplicateIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Objective</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-900">
                  {prompt.objective}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Development Prompt</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-900 font-mono text-sm relative group">
                  <pre className="whitespace-pre-wrap">{prompt.prompt}</pre>
                  <button
                    onClick={() => handleCopy(prompt.prompt)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy prompt text"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Expected Outcome</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-900">
                  {prompt.outcome}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const parsePrompts = (content: string): Array<{
  number: number;
  title: string;
  objective: string;
  prompt: string;
  outcome: string;
  content: string;
}> => {
  const prompts = [];
  const sections = content.split(/Prompt\s*\[(\d+)\]:/i);

  for (let i = 1; i < sections.length; i += 2) {
    const number = parseInt(sections[i]);
    const content = sections[i + 1].trim();

    const titleMatch = content.match(/^([^\n]+)/);
    const objectiveMatch = content.match(/Objective:\s*([^\n]+(?:\n(?!Prompt:)[^\n]+)*)/i);
    const promptMatch = content.match(/Prompt:\s*([^\n]+(?:\n(?!Outcome:)[^\n]+)*)/i);
    const outcomeMatch = content.match(/Outcome:\s*([^\n]+(?:\n(?!Prompt:|\[|$)[^\n]+)*)/i);

    if (titleMatch && objectiveMatch && promptMatch && outcomeMatch) {
      prompts.push({
        number,
        title: titleMatch[1].trim(),
        objective: objectiveMatch[1].trim(),
        prompt: promptMatch[1].trim(),
        outcome: outcomeMatch[1].trim(),
        content: content.trim()
      });
    }
  }

  return prompts;
};

export default PromptDisplay;