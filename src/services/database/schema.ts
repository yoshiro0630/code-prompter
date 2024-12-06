export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  projectId: string;
  content: string;
  metadata: string;
  createdAt: string;
}

export interface Prompt {
  id: string;
  projectId: string;
  stage: number;
  content: string;
  metadata: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const schema = {
  projects: 'id',
  documents: 'id, projectId',
  prompts: '[projectId+stage], id'
};