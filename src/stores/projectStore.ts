import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../services/database/db';
import { DocumentContent } from '../types/document-types';
import { StagePrompt } from '../services/prompt/stagePrompts';

interface ProjectState {
  currentProject: string | null;
  repository: typeof db;
  setCurrentProject: (id: string | null) => void;
  createProject: (name: string, description?: string) => Promise<string>;
  deleteProject: (id: string) => Promise<void>;
  saveDocument: (projectId: string, document: DocumentContent) => Promise<void>;
  getDocument: (projectId: string) => Promise<DocumentContent | null>;
  savePrompts: (projectId: string, stage: number, prompts: StagePrompt[]) => Promise<void>;
  getPrompts: (projectId: string, stage: number) => Promise<StagePrompt[]>;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      repository: db,

      setCurrentProject: (id) => set({ currentProject: id }),

      createProject: async (name, description) => {
        const id = await db.createProject(name, description);
        set({ currentProject: id });
        return id;
      },

      deleteProject: async (id) => {
        await db.deleteProject(id);
        if (get().currentProject === id) {
          set({ currentProject: null });
        }
      },

      saveDocument: async (projectId, document) => {
        await db.saveDocument(projectId, document);
      },

      getDocument: async (projectId) => {
        return db.getDocument(projectId);
      },

      savePrompts: async (projectId, stage, prompts) => {
        await db.savePrompts(projectId, stage, prompts);
      },

      getPrompts: async (projectId, stage) => {
        return db.getPrompts(projectId, stage);
      }
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        currentProject: state.currentProject
      })
    }
  )
);