import React from 'react';
import { ProjectType } from '../../types/questions';
import { DocumentArrowDownIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../../utils/clipboard';
import { toast } from 'react-hot-toast';

interface BriefTemplateProps {
  projectType: ProjectType;
  answers: Record<string, string>;
  onExport: () => void;
}

const BriefTemplate: React.FC<BriefTemplateProps> = ({
  projectType,
  answers,
  onExport
}) => {
  const handleCopy = async () => {
    try {
      const content = formatBriefContent();
      await copyToClipboard(content);
      toast.success('Brief copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy brief');
    }
  };

  const formatBriefContent = () => {
    const sections = [
      {
        title: 'Project Overview',
        content: Object.entries(answers).slice(0, 3).map(([_, value]) => value).join('\n\n')
      },
      {
        title: 'Requirements',
        content: Object.entries(answers).slice(3).map(([_, value]) => `• ${value}`).join('\n')
      },
      {
        title: 'Technical Specifications',
        content: [
          `• Project Type: ${projectType}`,
          '• Development Approach: Modern web development best practices',
          '• Quality Standards: High emphasis on code quality and testing',
          '• Documentation: Comprehensive technical and user documentation'
        ].join('\n')
      },
      {
        title: 'Implementation Plan',
        content: [
          '1. Initial Setup and Configuration',
          '2. Core Feature Development',
          '3. Testing and Quality Assurance',
          '4. Documentation and Deployment',
          '5. Maintenance and Support'
        ].join('\n')
      }
    ];

    return sections.map(section => 
      `## ${section.title}\n\n${section.content}`
    ).join('\n\n');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] p-4">
        <h2 className="text-white text-xl font-bold">
          Development Brief
        </h2>
        <p className="text-white/80 text-sm mt-1">
          {projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Project Overview */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Overview</h3>
          <div className="prose max-w-none">
            {Object.entries(answers).slice(0, 3).map(([_, value], index) => (
              <p key={index} className="text-gray-700">{value}</p>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
          <ul className="space-y-2">
            {Object.entries(answers).slice(3).map(([key, value]) => (
              <li key={key} className="flex items-start">
                <span className="text-[#47FFFF] mr-2">•</span>
                <span className="text-gray-700">{value}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Technical Specifications */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Specifications</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-[#47FFFF] mr-2">•</span>
              <span className="text-gray-700">Project Type: {projectType}</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#47FFFF] mr-2">•</span>
              <span className="text-gray-700">Development Approach: Modern web development best practices</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#47FFFF] mr-2">•</span>
              <span className="text-gray-700">Quality Standards: High emphasis on code quality and testing</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#47FFFF] mr-2">•</span>
              <span className="text-gray-700">Documentation: Comprehensive technical and user documentation</span>
            </li>
          </ul>
        </section>

        {/* Implementation Plan */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Implementation Plan</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li className="text-gray-700">Initial Setup and Configuration</li>
            <li className="text-gray-700">Core Feature Development</li>
            <li className="text-gray-700">Testing and Quality Assurance</li>
            <li className="text-gray-700">Documentation and Deployment</li>
            <li className="text-gray-700">Maintenance and Support</li>
          </ol>
        </section>
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end space-x-4">
        <button
          onClick={handleCopy}
          className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
          Copy Brief
        </button>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-md hover:opacity-90"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Export Brief
        </button>
      </div>
    </div>
  );
};

export default BriefTemplate;