// ```typescript
import { Table } from 'dexie';
import { Document } from '../schema';
import { DocumentContent } from '../../../types/document-types';

export class DocumentTable {
  constructor(private table: Table<Document, string>) {}

  async save(projectId: string, document: DocumentContent): Promise<void> {
    await this.table.where('projectId').equals(projectId).delete();

    if (document.content.trim()) {
      await this.table.add({
        id: crypto.randomUUID(),
        projectId,
        content: document.content,
        metadata: JSON.stringify(document.metadata),
        createdAt: new Date().toISOString()
      });
    }
  }

  async get(projectId: string): Promise<DocumentContent | null> {
    const doc = await this.table.where('projectId').equals(projectId).first();
    
    if (!doc) return null;

    return {
      content: doc.content,
      rawContent: doc.content,
      metadata: JSON.parse(doc.metadata)
    };
  }

  async clear(): Promise<void> {
    await this.table.clear();
  }
}
// ```