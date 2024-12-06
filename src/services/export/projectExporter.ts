import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { StagePrompt } from '../prompt/stagePrompts';
import { usePromptStore } from '../../stores/promptStore';

export class ProjectExporter {
  static async exportProject(projectId: string): Promise<void> {
    const store = usePromptStore.getState();
    const project = store.getProject(projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    const zip = new JSZip();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `${project.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;
    
    // Create project metadata
    const metadata = {
      name: project.name,
      createdAt: project.createdAt,
      exportedAt: new Date().toISOString(),
      stages: Object.keys(project.stages).length
    };

    // Add metadata file
    zip.file('project-metadata.json', JSON.stringify(metadata, null, 2));

    // Create stages folder
    const stagesFolder = zip.folder('stages');
    if (!stagesFolder) throw new Error('Failed to create stages folder');

    // Add each stage's prompts
    for (const [stageNum, stage] of Object.entries(project.stages)) {
      const stageFolder = stagesFolder.folder(`stage-${stageNum}`);
      if (!stageFolder) continue;

      // Add stage metadata
      const stageMetadata = {
        stageNumber: parseInt(stageNum),
        completed: stage.completed,
        promptCount: stage.prompts.length
      };
      stageFolder.file('stage-metadata.json', JSON.stringify(stageMetadata, null, 2));

      // Add individual prompt files
      stage.prompts.forEach((prompt, index) => {
        const promptContent = formatPromptContent(prompt, index + 1);
        stageFolder.file(`prompt-${index + 1}.md`, promptContent);
      });

      // Add combined stage file
      const combinedContent = formatStageContent(stage.prompts);
      stageFolder.file('all-prompts.md', combinedContent);
    }

    // Generate and save zip file
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${folderName}.zip`);
  }

  static async exportAllProjects(): Promise<void> {
    const store = usePromptStore.getState();
    const projects = Object.values(store.projects);
    
    const zip = new JSZip();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Add each project
    for (const project of projects) {
      const projectFolder = zip.folder(project.name.toLowerCase().replace(/\s+/g, '-'));
      if (!projectFolder) continue;

      // Add project metadata
      const metadata = {
        name: project.name,
        createdAt: project.createdAt,
        exportedAt: new Date().toISOString(),
        stages: Object.keys(project.stages).length
      };
      projectFolder.file('project-metadata.json', JSON.stringify(metadata, null, 2));

      // Add stages
      const stagesFolder = projectFolder.folder('stages');
      if (!stagesFolder) continue;

      for (const [stageNum, stage] of Object.entries(project.stages)) {
        const stageFolder = stagesFolder.folder(`stage-${stageNum}`);
        if (!stageFolder) continue;

        stage.prompts.forEach((prompt, index) => {
          const promptContent = formatPromptContent(prompt, index + 1);
          stageFolder.file(`prompt-${index + 1}.md`, promptContent);
        });

        const combinedContent = formatStageContent(stage.prompts);
        stageFolder.file('all-prompts.md', combinedContent);
      }
    }

    // Generate and save zip file
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `bolt-projects-${timestamp}.zip`);
  }
}

function formatPromptContent(prompt: StagePrompt, number: number): string {
  return `# Prompt ${number}: ${prompt.title}

## Objective
${prompt.objective}

## Prompt
${prompt.prompt}

## Expected Outcome
${prompt.outcome}
`;
}

function formatStageContent(prompts: StagePrompt[]): string {
  return prompts.map((prompt, index) => 
    formatPromptContent(prompt, index + 1)
  ).join('\n\n---\n\n');
}
