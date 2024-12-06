interface Sections {
  projectOverview?: string;
  userStories?: string;
  functionalRequirements?: string;
  nonFunctionalRequirements?: string;
}

export async function extractSections(content: string): Promise<Sections> {
  const sections: Sections = {};
  
  // Project Overview
  const overviewMatch = content.match(/(?:Project Overview|Introduction)[\s\S]*?(?=\n#|\n##|$)/i);
  if (overviewMatch) {
    sections.projectOverview = overviewMatch[0].trim();
  }
  
  // User Stories
  const storiesMatch = content.match(/(?:User Stories|Use Cases)[\s\S]*?(?=\n#|\n##|$)/i);
  if (storiesMatch) {
    sections.userStories = storiesMatch[0].trim();
  }
  
  // Functional Requirements
  const functionalMatch = content.match(/(?:Functional Requirements|Features)[\s\S]*?(?=\n#|\n##|$)/i);
  if (functionalMatch) {
    sections.functionalRequirements = functionalMatch[0].trim();
  }
  
  // Non-Functional Requirements
  const nonFunctionalMatch = content.match(/(?:Non-Functional Requirements|System Requirements)[\s\S]*?(?=\n#|\n##|$)/i);
  if (nonFunctionalMatch) {
    sections.nonFunctionalRequirements = nonFunctionalMatch[0].trim();
  }
  
  return sections;
}