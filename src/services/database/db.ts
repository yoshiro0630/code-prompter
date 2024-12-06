import Dexie from 'dexie';
import { DocumentContent } from '../../types/document-types';
import { StagePrompt } from '../prompt/stagePrompts';

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  projectId: string;
  content: string;
  metadata: string;
  createdAt: string;
}

interface Prompt {
  id: string;
  projectId: string;
  stage: number;
  content: string;
  metadata: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

class BoltDatabase extends Dexie {
  updateProject(currentProject: string, arg1: { name: string; }) {
    throw new Error('Method not implemented.');
  }
  projects!: Dexie.Table<Project, string>;
  documents!: Dexie.Table<Document, string>;
  prompts!: Dexie.Table<Prompt, string>;

  constructor() {
    super('BoltDB');
    
    // Define schema without compound index
    this.version(1).stores({
      projects: 'id',
      documents: 'id, projectId',
      prompts: 'id, projectId, stage'
    });

    // Add hooks for logging
    this.prompts.hook('creating', (primKey, obj) => {
      console.log('[Database] Creating prompt:', obj);
      return obj;
    });

    this.prompts.hook('updating', (mods, primKey, obj) => {
      console.log('[Database] Updating prompt:', { mods, primKey, obj });
      return mods;
    });
  }

  async createProject(name: string, description?: string): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await this.projects.add({
      id,
      name,
      description,
      createdAt: now,
      updatedAt: now
    });

    return id;
  }

  async saveDocument(projectId: string, document: DocumentContent): Promise<void> {
    await this.transaction('rw', [this.documents, this.prompts], async () => {
      // Delete existing document
      await this.documents.where('projectId').equals(projectId).delete();

      // Add new document if content exists
      if (document.content.trim()) {
        await this.documents.add({
          id: crypto.randomUUID(),
          projectId,
          content: document.content,
          metadata: JSON.stringify(document.metadata),
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  async getDocument(projectId: string): Promise<DocumentContent | null> {
    const doc = await this.documents.where('projectId').equals(projectId).first();
    
    if (!doc) return null;

    return {
      content: doc.content,
      rawContent: doc.content,
      metadata: JSON.parse(doc.metadata)
    };
  }

  async savePrompts(projectId: string, stage: number, prompts: StagePrompt[]): Promise<void> {
    await this.transaction('rw', this.prompts, async () => {
      // Delete existing prompts for this stage
      await this.prompts
        .where('projectId')
        .equals(projectId)
        .and(item => item.stage === stage)
        .delete();

      // Add new prompts
      const now = new Date().toISOString();
      const promptRecords = prompts.map(prompt => ({
        id: crypto.randomUUID(),
        projectId,
        stage,
        content: JSON.stringify(prompt),
        metadata: JSON.stringify({ timestamp: now }),
        completed: false,
        createdAt: now,
        updatedAt: now
      }));

      await this.prompts.bulkAdd(promptRecords);
    });
  }

  async getPrompts(projectId: string, stage: number): Promise<StagePrompt[]> {
    const prompts = await this.prompts
      .where('projectId')
      .equals(projectId)
      .and(item => item.stage === stage)
      .toArray();

    return prompts.map(p => {
      try {
        const parsed = JSON.parse(p.content);
        return {
          ...parsed,
          stage: p.stage
        };
      } catch (error) {
        console.error('Failed to parse prompt content:', error);
        return null;
      }
    }).filter((p): p is StagePrompt => p !== null);
  }

  async deleteProject(id: string): Promise<void> {
    await this.transaction('rw', [this.projects, this.documents, this.prompts], async () => {
      await this.projects.delete(id);
      await this.documents.where('projectId').equals(id).delete();
      await this.prompts.where('projectId').equals(id).delete();
    });
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projects.orderBy('createdAt').reverse().toArray();
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async clearAllData(): Promise<void> {
    await this.transaction('rw', [this.projects, this.documents, this.prompts], async () => {
      await this.projects.clear();
      await this.documents.clear();
      await this.prompts.clear();
    });
  }
}

// Create and export a single instance
export const db = new BoltDatabase();