// ```typescript
import { Table } from 'dexie';
import { Prompt } from '../schema';
import { StagePrompt } from '../../prompt/stagePrompts';

export class PromptTable {
  constructor(private table: Table<Prompt, string>) {}

  async save(projectId: string, stage: number, prompts: StagePrompt[]): Promise<void> {
    await this.table
      .where('[projectId+stage]')
      .equals([projectId, stage])
      .delete();

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

    await this.table.bulkAdd(promptRecords);
  }

  async get(projectId: string, stage: number): Promise<StagePrompt[]> {
    const prompts = await this.table
      .where('[projectId+stage]')
      .equals([projectId, stage])
      .toArray();

    return prompts.map(p => JSON.parse(p.content));
  }

  async deleteForProject(projectId: string): Promise<void> {
    await this.table.where('projectId').equals(projectId).delete();
  }

  async clear(): Promise<void> {
    await this.table.clear();
  }
}
// ```