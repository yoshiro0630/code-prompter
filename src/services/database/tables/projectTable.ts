// ```typescript
import { Table } from 'dexie';
import { Project } from '../schema';

export class ProjectTable {
  constructor(private table: Table<Project, string>) {}

  async create(name: string, description?: string): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await this.table.add({
      id,
      name,
      description,
      createdAt: now,
      updatedAt: now
    });

    return id;
  }

  async getAll(): Promise<Project[]> {
    return this.table.orderBy('createdAt').reverse().toArray();
  }

  async get(id: string): Promise<Project | undefined> {
    return this.table.get(id);
  }

  async delete(id: string): Promise<void> {
    await this.table.delete(id);
  }

  async clear(): Promise<void> {
    await this.table.clear();
  }
}
// ```