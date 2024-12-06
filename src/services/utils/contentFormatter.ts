export const cleanupContent = (content: string): string => {
  return content
    // Replace Windows line endings with Unix style
    .replace(/\r\n/g, '\n')
    // Replace multiple consecutive newlines with double newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove extra whitespace
    .replace(/[ \t]+/g, ' ')
    // Remove whitespace at the start and end
    .trim();
};

export const formatContentWithSections = (
  sections: Record<string, string | undefined>,
  rawContent: string
): string => {
  const parts = [];

  const sectionMap = {
    overview: 'Project Overview',
    requirements: 'Requirements',
    userStories: 'User Stories',
    technical: 'Technical Specifications'
  };

  Object.entries(sectionMap).forEach(([key, title]) => {
    if (sections[key]) {
      parts.push(`# ${title}\n${sections[key]}`);
    }
  });

  if (parts.length === 0) {
    parts.push('# Document Content\n' + rawContent);
  }

  return parts.join('\n\n');
};

export const formatSectionHeaders = (content: string): string => {
  return content.replace(/^([A-Z][^.\n]+)$/gm, '# $1');
};

export const formatListItems = (content: string): string => {
  return content
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '• ');
};

export const normalizeWhitespace = (content: string): string => {
  return content
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
};