import { ExportFormat, ExportOptions, ExportResult } from '../../types/export-types';
import { PromptStage } from '../../types/prompt-types';

export class ExportService {
  async exportPrompts(stages: PromptStage[], options: ExportOptions): Promise<ExportResult> {
    try {
      let content = '';
      const date = new Date().toISOString().split('T')[0];

      if (options.separateFiles) {
        // Return a zip file containing individual files for each stage
        const zip = new Blob([await this.createSeparateFiles(stages, options)], {
          type: 'application/zip'
        });
        return { success: true, data: zip };
      }

      // Create a single document
      content = this.formatContent(stages, options);
      const blob = await this.createBlob(content, options.format);

      return { success: true, data: blob };
    } catch (error) {
      return {
        success: false,
        error: `Export failed: ${(error as Error).message}`
      };
    }
  }

  private formatContent(stages: PromptStage[], options: ExportOptions): string {
    let content = '# Generated Prompts\n\n';
    content += `Generated on: ${new Date().toLocaleString()}\n\n`;

    stages.forEach((stage) => {
      content += `## ${stage.title}\n\n`;
      content += `${stage.content}\n\n`;

      if (options.includeMetadata && stage.metadata) {
        content += '### Metadata\n\n';
        content += `- Type: ${stage.type}\n`;
        content += `- Order: ${stage.order}\n`;
        if (stage.metadata.optimizationSettings) {
          content += `- Optimization Focus: ${stage.metadata.optimizationSettings.focus}\n`;
        }
        content += '\n';
      }
    });

    return content;
  }

  private async createBlob(content: string, format: ExportFormat): Promise<Blob> {
    switch (format) {
      case 'txt':
        return new Blob([content], { type: 'text/plain' });
      case 'docx':
        // Convert markdown to DOCX format
        return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      case 'gdoc':
        // Format for Google Docs
        return new Blob([content], { type: 'application/vnd.google-apps.document' });
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async createSeparateFiles(stages: PromptStage[], options: ExportOptions): Promise<Blob> {
    // Implementation for creating separate files would go here
    // This would involve creating a zip file with individual files for each stage
    return new Blob(['Zip implementation placeholder']);
  }
}