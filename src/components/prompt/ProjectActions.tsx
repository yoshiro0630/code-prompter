import React from 'react';
import { DocumentArrowDownIcon, FolderArrowDownIcon } from '@heroicons/react/24/outline';
import { ProjectExporter } from '../../services/export/projectExporter';
import { usePromptStore } from '../../stores/promptStore';
import { toast } from 'react-hot-toast';

const ProjectActions: React.FC = () => {
  const { currentProject } = usePromptStore();

  const handleExportProject = async () => {
    if (!currentProject) {
      toast.error('No project selected');
      return;
    }

    try {
      await ProjectExporter.exportProject(currentProject);
      toast.success('Project exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export project');
    }
  };

  const handleExportAllProjects = async () => {
    try {
      await ProjectExporter.exportAllProjects();
      toast.success('All projects exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export projects');
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleExportProject}
        disabled={!currentProject}
        className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
        Export Project
      </button>
      
      <button
        onClick={handleExportAllProjects}
        className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90"
      >
        <FolderArrowDownIcon className="w-5 h-5 mr-2" />
        Export All Projects
      </button>
    </div>
  );
};

export default ProjectActions;