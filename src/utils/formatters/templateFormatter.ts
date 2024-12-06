import { ProjectType } from '../../types/questions';

export const formatTemplateContent = (
  answers: Record<string, string>,
  projectType: ProjectType
): string => {
  const sections = [
    {
      title: '1. Executive Summary',
      content: formatExecutiveSummary(answers.question_0)
    },
    {
      title: '2. Project Scope & Objectives',
      content: formatProjectScope(answers.question_1)
    },
    {
      title: '3. Technical Architecture',
      content: formatTechnicalArchitecture(answers.question_2, answers.question_3)
    },
    {
      title: '4. Infrastructure & Security',
      content: formatInfrastructure(answers.question_4, answers.question_5)
    },
    {
      title: '5. Development Approach',
      content: formatDevelopmentApproach(answers.question_6)
    },
    {
      title: '6. Timeline & Milestones',
      content: formatTimeline(answers.question_7)
    }
  ];

  return sections.map(section => 
    `# ${section.title}\n\n${section.content}`
  ).join('\n\n');
};

const formatExecutiveSummary = (objective: string = ''): string => {
  return `## Overview
${objective}

## Key Deliverables
- Production-ready ${objective.toLowerCase()} solution
- Comprehensive documentation
- Deployment and maintenance guides
- Training and support materials`;
};

const formatProjectScope = (features: string = ''): string => {
  const featureList = features.split(',').map(f => f.trim());
  return `## Core Features
${featureList.map(f => `- ${f}`).join('\n')}

## Success Criteria
- Successful implementation of all core features
- Performance meeting or exceeding industry standards
- High user satisfaction and adoption rates
- Robust security and compliance measures`;
};

const formatTechnicalArchitecture = (ui: string = '', tech: string = ''): string => {
  return `## Frontend Architecture
- ${ui}
- Responsive design across all devices
- Modern UI/UX best practices
- Accessibility compliance

## Backend Architecture
- ${tech}
- Scalable microservices architecture
- RESTful API design
- Robust error handling`;
};

const formatInfrastructure = (storage: string = '', security: string = ''): string => {
  return `## Infrastructure Components
- ${storage}
- High-availability configuration
- Auto-scaling capabilities
- Disaster recovery planning

## Security Measures
- ${security}
- Industry-standard encryption
- Regular security audits
- Compliance monitoring`;
};

const formatDevelopmentApproach = (approach: string = ''): string => {
  return `## Development Methodology
- ${approach}
- Test-driven development
- Continuous integration/deployment
- Code quality standards

## Quality Assurance
- Comprehensive testing strategy
- Automated testing suite
- Performance benchmarking
- Security testing`;
};

const formatTimeline = (timeline: string = ''): string => {
  const phases = [
    { name: 'Planning & Design', duration: '2-3 weeks' },
    { name: 'Core Development', duration: '8-10 weeks' },
    { name: 'Testing & QA', duration: '3-4 weeks' },
    { name: 'Deployment', duration: '1-2 weeks' }
  ];

  return `## Project Timeline
${timeline}

## Development Phases
${phases.map(phase => `- ${phase.name}: ${phase.duration}`).join('\n')}`;
};