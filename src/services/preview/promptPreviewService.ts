import { generatePreviewHTML } from './promptPreviewGenerator';
import { toast } from 'react-hot-toast';

export class PromptPreviewService {
  static async openPromptPreview(content: string): Promise<void> {
    try {
      const htmlContent = generatePreviewHTML(content);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const previewUrl = URL.createObjectURL(blob);

      const previewWindow = window.open(
        previewUrl,
        'PromptPreview',
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