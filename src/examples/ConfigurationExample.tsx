import React from 'react';
import { useAPIStore } from '../stores/apiStore';

const ConfigurationExample: React.FC = () => {
  // const { configManager } = useAPIStore();

  // Example: Add a knowledge source
  const addDocumentKnowledge = () => {
    // configManager?.addKnowledgeSource({
    //   type: 'document',
    //   content: 'Use React functional components with TypeScript.',
    //   priority: 3,
    //   metadata: {
    //     fileName: 'coding-standards.md',
    //     dateAdded: new Date().toISOString(),
    //     lastModified: new Date().toISOString()
    //   }
    // });
  };

  // Example: Add a rule
  const addCodingRule = () => {
    // configManager?.addRule({
    //   type: 'constraint',
    //   description: 'Use camelCase for variable names',
    //   priority: 2,
    //   action: 'replace: snake_case -> camelCase'
    // });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Configuration Example</h2>
      
      <div className="space-y-2">
        <button
          onClick={addDocumentKnowledge}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Knowledge Source
        </button>
        
        <button
          onClick={addCodingRule}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Add Rule
        </button>
      </div>
      
      <pre className="bg-gray-100 p-4 rounded-md">
        {/* {JSON.stringify(configManager?.getConfiguration(), null, 2)} */}
      </pre>
    </div>
  );
};

export default ConfigurationExample;