import React from 'react';
import { ProjectType } from '../../types/questions';
import { DocumentTextIcon, DevicePhoneMobileIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';

interface ProjectTypeSelectorProps {
  onSelect: (type: ProjectType) => void;
  onBack: () => void;
}

const projectTypes: Array<{
  id: ProjectType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    id: 'website',
    title: 'Website',
    description: 'Build a web-based application or site',
    icon: <DocumentTextIcon className="h-6 w-6" />,
    color: 'from-[#47FFFF] to-[#FF47FF]'
  },
  {
    id: 'mobileApp',
    title: 'Mobile App',
    description: 'Create a mobile application',
    icon: <DevicePhoneMobileIcon className="h-6 w-6" />,
    color: 'from-[#FF47FF] to-[#7F47FF]'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Build a data visualization dashboard',
    icon: <ChartBarIcon className="h-6 w-6" />,
    color: 'from-[#7F47FF] to-[#47FFFF]'
  },
  {
    id: 'custom',
    title: 'Custom Tool',
    description: 'Create a specialized tool or application',
    icon: <CogIcon className="h-6 w-6" />,
    color: 'from-[#FF8888] to-[#FFD700]'
  }
];

const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({ onSelect, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Select Project Type
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projectTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`p-6 bg-gradient-to-r ${type.color} rounded-lg text-white hover:opacity-90 transition-opacity group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 rounded-lg p-2">
                {type.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                <p className="text-sm opacity-90">
                  {type.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectTypeSelector;