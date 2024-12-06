import { DocumentParserResult } from '../../../types/document-types';

export const textParser = async (file: File): Promise<DocumentParserResult> => {
  try {
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });

    if (!text.trim()) {
      return {
        success: false,
        error: 'File is empty',
        document: null
      };
    }

    return {
      success: true,
      document: null,
      content: text,
      metadata: {
        fileName: file.name,
        fileType: file.name.endsWith('.md') ? 'md' : 'txt',
        fileSize: file.size,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error parsing text file:', error);
    return {
      success: false,
      document: null,
      error: 'Failed to parse text file'
    };
  }
};