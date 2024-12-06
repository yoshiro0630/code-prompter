import React from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

const PromptGenerationStatus: React.FC = () => {
  return (
    <div className="bg-[#2A2A3A] p-6 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] p-3 rounded-lg">
          <CodeBracketIcon className="h-6 w-6 text-white animate-pulse" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Generating BOLT.NEW Prompts</h3>
          <p className="text-gray-400 text-sm">Creating stage-based development prompts...</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Analyzing requirements...</span>
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-[#47FFFF] border-r-[#FF47FF] border-b-[#47FFFF] border-l-[#FF47FF]"></div>
            <span className="text-[#47FFFF]">In Progress</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Structuring prompts...</span>
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-[#47FFFF] border-r-[#FF47FF] border-b-[#47FFFF] border-l-[#FF47FF]"></div>
            <span className="text-[#47FFFF]">In Progress</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Optimizing for clarity...</span>
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-[#47FFFF] border-r-[#FF47FF] border-b-[#47FFFF] border-l-[#FF47FF]"></div>
            <span className="text-[#47FFFF]">In Progress</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Generating optimized prompts for your project...
          </p>
          <div className="animate-pulse text-[#47FFFF] text-sm">Please wait</div>
        </div>
      </div>
    </div>
  );
};

export default PromptGenerationStatus;