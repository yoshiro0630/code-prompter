import React from 'react';
import { usePromptStore } from '../../stores/promptStore';
import { DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

const ProjectDetails: React.FC = () => {
  const { currentProject, getProject, getProjectDocument } = usePromptStore();
  
  if (!currentProject) return null;
  
  const project = getProject(currentProject);
  const document = getProjectDocument(currentProject);
  
  if (!project) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {project.name}
          </h2>
          {project.description && (
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {project.description}
            </p>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <ClockIcon className="w-4 h-4 mr-1" />
          Created {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>

      {document && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <DocumentTextIcon className="w-5 h-5" />
            <span>Reference Document: {document.metadata.fileName}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Uploaded {new Date(document.metadata.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Stages
          </div>
          <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Object.keys(project.stages).length} / 5
          </div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-sm font-medium text-green-900 dark:text-green-100">
            Completed
          </div>
          <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {Object.values(project.stages).filter(s => s.completed).length} / 5
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;