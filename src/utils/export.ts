import { saveAs } from 'file-saver';

export const exportToMarkdown = (content: string): void => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `project-requirements-${timestamp}.md`);
};