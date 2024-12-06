import React from 'react';
import { DocumentArrowDownIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface PreviewActionsProps {
  onExport: () => void;
  onPrint: () => void;
  onGoogleDocs: () => void;
  onCopy: () => void;
  onGeneratePrompts: () => void;
}

const PreviewActions: React.FC<PreviewActionsProps> = ({
  onExport,
  onPrint,
  onGoogleDocs,
  onCopy,
  onGeneratePrompts
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCopy}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
            Copy to Clipboard
          </button>
          
          <div className="relative">
            <button
              onClick={onExport}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 hidden group-hover:block">
              <button
                onClick={onPrint}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Save as PDF
              </button>
              <button
                onClick={onGoogleDocs}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export to Google Docs
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={onGeneratePrompts}
          className="flex items-center px-6 py-2 text-white bg-gradient-to-r from-[#FF47FF] to-[#7F47FF] rounded-lg hover:opacity-90"
        >
          Generate BOLT.NEW Prompts
        </button>
      </div>
    </div>
  );
};

export default PreviewActions;