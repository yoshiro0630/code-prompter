import React from 'react';
import { DocumentArrowDownIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface PromptHeaderProps {
  onExport: () => void;
  onOpenPreview: () => void;
}

const PromptHeader: React.FC<PromptHeaderProps> = ({ onExport, onOpenPreview }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <svg className="w-10 h-10" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="16" fill="url(#gradient)" />
          <path d="M40 80V40L60 60L80 40V80" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#47FFFF"/>
              <stop offset="1" stopColor="#FF47FF"/>
            </linearGradient>
          </defs>
        </svg>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] bg-clip-text text-transparent">
          Generated Prompts
        </h2>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Export
        </button>
        <button
          onClick={onOpenPreview}
          className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90 transition-opacity"
        >
          <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
          Open Preview
        </button>
      </div>
    </div>
  );
};

export default PromptHeader;