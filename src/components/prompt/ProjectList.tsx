import React from 'react';
import { usePromptStore } from '../../stores/promptStore';
import { PlusIcon, FolderIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ProjectList: React.FC = () => {
  const { projects, currentProject, createProject, deleteProject, setCurrentProject } = usePromptStore();

  const handleCreateProject = () => {
    const name = prompt('Enter project name:');
    if (name?.trim()) {
      const id = createProject(name.trim());
      toast.success(`Project "${name}" created`);
      setCurrentProject(id);
    }
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete project "${name}"?`)) {
      deleteProject(id);
      toast.success(`Project "${name}" deleted`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
        <button
          onClick={handleCreateProject}
          className="flex items-center px-3 py-2 text-sm text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(projects).map(project => (
          <div
            key={project.id}
            className={`relative group p-4 rounded-lg border transition-all ${
              project.id === currentProject
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
            }`}
          >
            <button
              onClick={() => setCurrentProject(project.id)}
              className="w-full text-left"
            >
              <div className="flex items-center space-x-3">
                <FolderIcon className="w-6 h-6 text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.prompts ? Object.keys(project.prompts).length : 0} prompts
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDeleteProject(project.id, project.name)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;