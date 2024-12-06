import { DocumentSections } from '../../../types/document-types';

export const extractSections = async (content: string): Promise<DocumentSections> => {
  const sections: DocumentSections = {};

  // Extract Project Overview
  const overviewMatch = content.match(/(?:Project Overview|Introduction)[\s\S]*?(?=\n#|\n##|$)/i);
  if (overviewMatch) {
    sections.overview = overviewMatch[0].trim();
  }

  // Extract Requirements
  const requirementsMatch = content.match(/(?:Requirements|Functional Requirements)[\s\S]*?(?=\n#|\n##|$)/i);
  if (requirementsMatch) {
    sections.requirements = requirementsMatch[0].trim();
  }

  // Extract User Stories
  const storiesMatch = content.match(/(?:User Stories|Use Cases)[\s\S]*?(?=\n#|\n##|$)/i);
  if (storiesMatch) {
    sections.userStories = storiesMatch[0].trim();
  }

  // Extract Technical Specifications
  const techMatch = content.match(/(?:Technical Specifications|Architecture)[\s\S]*?(?=\n#|\n##|$)/i);
  if (techMatch) {
    sections.technical = techMatch[0].trim();
  }

  return sections;
};