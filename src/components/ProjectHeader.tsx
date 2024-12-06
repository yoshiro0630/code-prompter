import React, { useState } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import ModelSelector from './ModelSelector';

const ProjectHeader: React.FC = () => {
  const { currentProject, repository } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [project, setProject] = useState<{ name: string; createdAt: string } | null>(null);

  React.useEffect(() => {
    const loadProject = async () => {
      if (!currentProject) return;
      const proj = await repository.getProject(currentProject);
      if (proj) {
        setProject(proj);
        setProjectName(proj.name);
      }
    };
    loadProject();
  }, [currentProject, repository]);

  const handleSave = async () => {
    if (!currentProject || !projectName.trim()) return;

    try {
      await repository.updateProject(currentProject, { name: projectName.trim() });
      setProject(prev => prev ? { ...prev, name: projectName.trim() } : null);
      setIsEditing(false);
      toast.success('Project name updated');
    } catch (error) {
      toast.error('Failed to update project name');
    }
  };

  if (!project) return null;

  return (
    <div className="bg-gray-800 border-b border-gray-700 mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-gray-700 text-gray-200 border-gray-600 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="p-1 text-green-400 hover:text-green-300"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setProjectName(project.name);
                    setIsEditing(false);
                  }}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-200">{project.name}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-gray-300"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-400">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Model:</span>
              <ModelSelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;