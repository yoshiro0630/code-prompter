import { DocumentParserResult } from '../../../types/document-types';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
const pdfjsVersion = '3.11.174';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

export const pdfParser = async (file: File): Promise<DocumentParserResult> => {
  try {
    // Load and parse PDF
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Extract text from all pages
    let content = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      content += pageText + '\n\n';
    }
    
    // Validate content
    if (!content.trim()) {
      return {
        success: false,
        document: null,
        error: 'No text content found in PDF file'
      };
    }
    
    // Clean up content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return {
      success: true,
      document: null,
      content,
      metadata: {
        fileName: file.name,
        fileType: 'pdf',
        fileSize: file.size,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return {
      success: false,
      document: null,
      error: `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};