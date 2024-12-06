import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StagePrompt } from '../services/prompt/stagePrompts';
import { DocumentContent } from '../types/document-types';

interface Project {
  prompts: any;
  id: string;
  name: string;
  description?: string;
  document?: DocumentContent;
  stages: Record<number, {
    completed: boolean;
    prompts: StagePrompt[];
  }>;
  createdAt: string;
  updatedAt: string;
}

interface PromptStore {
  projects: Record<string, Project>;
  currentProject: string | null;
  
  // Project actions
  createProject: (name: string, description?: string) => string;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  getProject: (id: string) => Project | undefined;
  
  // Document actions
  saveProjectDocument: (projectId: string, document: DocumentContent) => void;
  getProjectDocument: (projectId: string) => DocumentContent | undefined;
  
  // Stage actions
  saveStagePrompts: (stage: number, prompts: StagePrompt[]) => void;
  getStagePrompts: (stage: number) => StagePrompt[];
  markStageComplete: (stage: number) => void;
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      projects: {},
      currentProject: null,

      createProject: (name, description) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        
        const project: Project = {
          id,
          name,
          description,
          stages: {},
          createdAt: now,
          updatedAt: now,
          prompts: undefined
        };

        set(state => ({
          projects: { ...state.projects, [id]: project },
          currentProject: id
        }));

        return id;
      },

      deleteProject: (id) => {
        set(state => {
          const { [id]: _, ...remainingProjects } = state.projects;
          return {
            projects: remainingProjects,
            currentProject: state.currentProject === id ? null : state.currentProject
          };
        });
      },

      setCurrentProject: (id) => {
        set({ currentProject: id });
      },

      getProject: (id) => {
        return get().projects[id];
      },

      saveProjectDocument: (projectId, document) => {
        set(state => ({
          projects: {
            ...state.projects,
            [projectId]: {
              ...state.projects[projectId],
              document,
              // Reset stages when a new document is uploaded
              stages: {},
              updatedAt: new Date().toISOString()
            }
          }
        }));
      },

      getProjectDocument: (projectId) => {
        return get().projects[projectId]?.document;
      },

      saveStagePrompts: (stage, prompts) => {
        const { currentProject, projects } = get();
        if (!currentProject) return;

        set(state => ({
          projects: {
            ...state.projects,
            [currentProject]: {
              ...state.projects[currentProject],
              stages: {
                ...state.projects[currentProject].stages,
                [stage]: {
                  completed: state.projects[currentProject].stages[stage]?.completed || false,
                  prompts
                }
              },
              updatedAt: new Date().toISOString()
            }
          }
        }));
      },

      getStagePrompts: (stage) => {
        const { currentProject, projects } = get();
        if (!currentProject || !projects[currentProject]) return [];
        
        return projects[currentProject].stages[stage]?.prompts || [];
      },

      markStageComplete: (stage) => {
        const { currentProject } = get();
        if (!currentProject) return;

        set(state => ({
          projects: {
            ...state.projects,
            [currentProject]: {
              ...state.projects[currentProject],
              stages: {
                ...state.projects[currentProject].stages,
                [stage]: {
                  ...state.projects[currentProject].stages[stage],
                  completed: true
                }
              },
              updatedAt: new Date().toISOString()
            }
          }
        }));
      }
    }),
    {
      name: 'bolt-prompts',
      version: 1
    }
  )
);