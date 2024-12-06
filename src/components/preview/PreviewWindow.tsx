import React, { useEffect } from 'react';
import { ProjectType } from '../../types/questions';
import { ProjectMetrics } from '../../types/project-types';
import { PreviewService } from '../../services/preview/previewService';
import { toast } from 'react-hot-toast';

interface PreviewWindowProps {
  answers: Record<string, string>;
  projectType: ProjectType;
  metrics: ProjectMetrics;
}

const PreviewWindow: React.FC<PreviewWindowProps> = ({ answers, projectType, metrics }) => {
  useEffect(() => {
    const openPreview = async () => {
      try {
        await PreviewService.openPreview(answers, projectType, metrics);
      } catch (error) {
        console.error('Failed to open preview:', error);
        toast.error('Failed to open preview. Please allow popups and try again.');
      }
    };

    // Open preview after a short delay
    const timeoutId = setTimeout(openPreview, 100);
    return () => clearTimeout(timeoutId);
  }, [answers, projectType, metrics]);

  return null;
};

export default PreviewWindow;