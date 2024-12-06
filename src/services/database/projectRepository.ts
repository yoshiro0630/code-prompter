// import { db } from './db';
// import { DocumentContent } from '../../types/document-types';
// import { StagePrompt } from '../prompt/stagePrompts';

// export interface Project {
//   id: string;
//   name: string;
//   description?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export class ProjectRepository {
//   async createProject(name: string, description?: string): Promise<string> {
//     const [project] = await db('projects')
//       .insert({
//         id: crypto.randomUUID(),
//         name,
//         description,
//         created_at: new Date(),
//         updated_at: new Date()
//       })
//       .returning('*');
    
//     return project.id;
//   }

//   async saveDocument(projectId: string, document: DocumentContent): Promise<void> {
//     const existing = await db('documents')
//       .where('project_id', projectId)
//       .first();

//     if (existing) {
//       await db('documents')
//         .where('project_id', projectId)
//         .update({
//           content: document.content,
//           metadata: JSON.stringify(document.metadata)
//         });
//     } else {
//       await db('documents').insert({
//         id: crypto.randomUUID(),
//         project_id: projectId,
//         content: document.content,
//         metadata: JSON.stringify(document.metadata),
//         created_at: new Date()
//       });
//     }

//     // Clear existing prompts when document changes
//     await db('prompts')
//       .where('project_id', projectId)
//       .delete();
//   }

//   async getDocument(projectId: string): Promise<DocumentContent | null> {
//     const doc = await db('documents')
//       .where('project_id', projectId)
//       .first();
    
//     if (!doc) return null;

//     return {
//       content: doc.content,
//       metadata: JSON.parse(doc.metadata)
//     };
//   }

//   async savePrompts(projectId: string, stage: number, prompts: StagePrompt[]): Promise<void> {
//     await db.transaction(async (trx) => {
//       // Delete existing prompts for this stage
//       await trx('prompts')
//         .where({ project_id: projectId, stage })
//         .delete();

//       // Insert new prompts
//       const now = new Date();
//       await trx('prompts')
//         .insert(prompts.map(prompt => ({
//           id: crypto.randomUUID(),
//           project_id: projectId,
//           stage,
//           content: JSON.stringify(prompt),
//           metadata: JSON.stringify({ timestamp: now.toISOString() }),
//           created_at: now,
//           updated_at: now
//         })));
//     });
//   }

//   async getPrompts(projectId: string, stage: number): Promise<StagePrompt[]> {
//     const prompts = await db('prompts')
//       .where({ project_id: projectId, stage })
//       .orderBy('created_at');

//     return prompts.map(p => JSON.parse(p.content));
//   }

//   async deleteProject(id: string): Promise<void> {
//     await db('projects').where('id', id).delete();
//   }

//   async getAllProjects(): Promise<Project[]> {
//     const projects = await db('projects')
//       .select('*')
//       .orderBy('created_at', 'desc');

//     return projects.map(p => ({
//       id: p.id,
//       name: p.name,
//       description: p.description,
//       createdAt: new Date(p.created_at),
//       updatedAt: new Date(p.updated_at)
//     }));
//   }

//   async getProject(id: string): Promise<Project | null> {
//     const project = await db('projects').where('id', id).first();
//     if (!project) return null;

//     return {
//       id: project.id,
//       name: project.name,
//       description: project.description,
//       createdAt: new Date(project.created_at),
//       updatedAt: new Date(project.updated_at)
//     };
//   }
// }