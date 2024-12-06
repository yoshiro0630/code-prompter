import { DocumentParserResult } from '../../../types/document-types';

export const docxParser = async (file: File): Promise<DocumentParserResult> => {
  try {
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          if (!e.target?.result) {
            reject(new Error('Failed to read file content'));
            return;
          }
          
          // For now, treat DOCX as plain text since we removed mammoth
          const content = e.target.result.toString();
          resolve(content);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });

    return {
      success: true,
      document: null,
      content: text,
      metadata: {
        fileName: file.name,
        fileType: 'docx',
        fileSize: file.size,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    return {
      success: false,
      document: null,
      error: `Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};