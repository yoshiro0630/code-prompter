import React from 'react';
import { ProjectType } from '../../types/questions';

interface PreviewContentProps {
  answers: Record<string, string>;
  projectType: ProjectType;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  answers,
  projectType
}) => {
  const sections = [
    {
      id: 'objective',
      title: '1. Objective',
      content: answers.question_0 || ''
    },
    {
      id: 'functionalities',
      title: '2. Key Functionalities and Modules',
      content: answers.question_1 || '',
      subsections: ['Core Features', 'Module Dependencies', 'Integration Points']
    },
    {
      id: 'ui-ux',
      title: '3. UI and UX Guidelines',
      content: answers.question_2 || '',
      subsections: ['Design Philosophy', 'UI Components', 'User Experience']
    },
    {
      id: 'frameworks',
      title: '4. Frameworks and Guidelines',
      content: answers.question_3 || '',
      subsections: ['Architecture Overview', 'Framework Selection', 'API Design']
    },
    {
      id: 'storage',
      title: '5. Storage and Uploads',
      content: answers.question_4 || ''
    },
    {
      id: 'security',
      title: '6. Security and Compliance',
      content: answers.question_5 || '',
      subsections: ['Authentication', 'Data Protection', 'Compliance']
    },
    {
      id: 'development',
      title: '7. Development Plan and Structure',
      content: answers.question_6 || '',
      subsections: ['Frontend', 'Backend', 'Testing']
    },
    {
      id: 'timeline',
      title: '8. Timeline and Milestones',
      content: answers.question_7 || ''
    }
  ];

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {section.title}
          </h2>
          
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
            </div>

            {section.subsections && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {section.subsections.map((subsection) => (
                  <div
                    key={subsection}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {subsection}
                    </h3>
                    <div className="text-sm text-gray-600">
                      Related to: {section.content.split(' ').slice(0, 3).join(' ')}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default PreviewContent;