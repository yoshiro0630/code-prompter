import { ProjectType } from '../../types/questions';

export const formatBriefContent = (
  answers: Record<string, string>,
  projectType: ProjectType
): string => {
  const sections = [
    {
      title: 'Project Overview',
      content: Object.entries(answers).slice(0, 3).map(([_, value]) => value).join('\n\n')
    },
    {
      title: 'Requirements',
      content: Object.entries(answers).slice(3).map(([_, value]) => `• ${value}`).join('\n')
    },
    {
      title: 'Technical Specifications',
      content: [
        `• Project Type: ${projectType}`,
        '• Development Approach: Modern web development best practices',
        '• Quality Standards: High emphasis on code quality and testing',
        '• Documentation: Comprehensive technical and user documentation'
      ].join('\n')
    },
    {
      title: 'Implementation Plan',
      content: [
        '1. Initial Setup and Configuration',
        '2. Core Feature Development',
        '3. Testing and Quality Assurance',
        '4. Documentation and Deployment',
        '5. Maintenance and Support'
      ].join('\n')
    }
  ];

  return sections.map(section => 
    `## ${section.title}\n\n${section.content}`
  ).join('\n\n');
};

export const formatBriefForExport = (
  answers: Record<string, string>,
  projectType: ProjectType
): string => {
  return `# ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Design Brief\n\n${formatBriefContent(answers, projectType)}`;
};