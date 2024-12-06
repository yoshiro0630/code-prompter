import { ProjectType } from '../../types/questions';
import { ProjectMetrics } from '../../types/project-types';
import { generatePreviewHTML } from './htmlGenerator';
import { toast } from 'react-hot-toast';

export class PreviewService {
  static async openPreview(
    answers: Record<string, string>, 
    projectType: ProjectType,
    metrics: ProjectMetrics
  ): Promise<void> {
    try {
      const htmlContent = generatePreviewHTML(answers, projectType, metrics);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const previewUrl = URL.createObjectURL(blob);

      // Open in a new window with specific dimensions
      const previewWindow = window.open(
        previewUrl,
        'PreviewWindow',
        'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no'
      );

      if (!previewWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Clean up blob URL after window loads
      previewWindow.onload = () => {
        URL.revokeObjectURL(previewUrl);
      };
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to open preview. Please allow popups and try again.');
      throw error;
    }
  }
}