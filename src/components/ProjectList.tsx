import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { PlusIcon, FolderIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';

const ProjectList: React.FC = () => {
  const { currentProject, repository, createProject, deleteProject, setCurrentProject } = useProjectStore();
  const [projects, setProjects] = useState<Array<{ id: string; name: string; createdAt: string }>>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const allProjects = await repository.getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      try {
        const id = await createProject(newProjectName.trim());
        setNewProjectName('');
        setShowNewProject(false);
        await loadProjects();
        toast.success(`Project "${newProjectName}" created`);
      } catch (error) {
        console.error('Failed to create project:', error);
        toast.error('Failed to create project');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation) {
      try {
        await deleteProject(deleteConfirmation.id);
        await loadProjects();
        toast.success(`Project "${deleteConfirmation.name}" deleted`);
        setDeleteConfirmation(null);
      } catch (error) {
        console.error('Failed to delete project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleResetDatabase = async () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      try {
        await repository.clearAllData();
        await loadProjects();
        setCurrentProject(null);
        toast.success('Database reset successfully');
      } catch (error) {
        console.error('Failed to reset database:', error);
        toast.error('Failed to reset database');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-200">
          Your Projects
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleResetDatabase}
            className="flex items-center px-3 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
            title="Reset all data"
          >
            <ArrowPathIcon className="w-5 h-5 mr-1" />
            Reset Data
          </button>
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center px-3 py-2 text-sm text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            className={`relative group p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-all ${
              project.id === currentProject
                ? 'ring-2 ring-blue-500 ring-opacity-50'
                : ''
            }`}
          >
            <button
              onClick={() => setCurrentProject(project.id)}
              className="w-full text-left"
            >
              <div className="flex items-center space-x-3">
                <FolderIcon className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-200">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setDeleteConfirmation({ id: project.id, name: project.name })}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete project"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* New Project Dialog */}
      <Dialog
        open={showNewProject}
        onClose={() => setShowNewProject(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

          <div className="relative bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-200 mb-4">
              Create New Project
            </Dialog.Title>

            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full rounded-md border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                autoFocus
              />

              <div className="mt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewProject(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={!newProjectName.trim()}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={() => setDeleteConfirmation(null)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

          <div className="relative bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-200 mb-4">
              Delete Project
            </Dialog.Title>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{deleteConfirmation?.name}"? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProjectList;