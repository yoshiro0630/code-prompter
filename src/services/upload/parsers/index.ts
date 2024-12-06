import { DocumentParserResult } from '../../../types/document-types';
import { pdfParser } from './pdfParser';
import { docxParser } from './docxParser';
import { textParser } from './textParser';
import { getFileType } from '../utils/fileUtils';

const parserMap = {
  pdf: pdfParser,
  docx: docxParser,
  txt: textParser,
  md: textParser
};

export const parseFile = async (file: File): Promise<DocumentParserResult> => {
  const fileType = getFileType(file.name);
  if (!fileType || !parserMap[fileType]) {
    throw new Error(`Unsupported file type: ${file.name}`);
  }

  return parserMap[fileType](file);
};