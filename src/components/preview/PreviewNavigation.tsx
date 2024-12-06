import React from 'react';

const PreviewNavigation: React.FC = () => {
  const sections = [
    { id: 'objective', label: 'Objective' },
    { id: 'functionalities', label: 'Key Functionalities' },
    { id: 'ui-ux', label: 'UI/UX Guidelines' },
    { id: 'frameworks', label: 'Frameworks' },
    { id: 'storage', label: 'Storage' },
    { id: 'security', label: 'Security' },
    { id: 'development', label: 'Development Plan' },
    { id: 'timeline', label: 'Timeline' }
  ];

  return (
    <nav className="hidden lg:block w-64 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Quick Navigation
        </h3>
        <div className="space-y-1">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
            >
              <span className="w-6 text-gray-400 group-hover:text-gray-500">
                {index + 1}.
              </span>
              <span className="truncate">{section.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PreviewNavigation;