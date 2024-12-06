import React, { useState } from 'react';
import { KnowledgeSource } from '../../types/config-types';
import { DocumentTextIcon, CodeBracketIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface KnowledgeSourceEditorProps {
  onAdd: (source: Omit<KnowledgeSource, 'id'>) => void;
}

const KnowledgeSourceEditor: React.FC<KnowledgeSourceEditorProps> = ({ onAdd }) => {
  const [type, setType] = useState<KnowledgeSource['type']>('document');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState(1);

  const handleAdd = () => {
    if (!content.trim()) return;

    onAdd({
      type,
      content: content.trim(),
      priority,
      metadata: {
        dateAdded: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    });

    setContent('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Source Type
        </label>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setType('document')}
            className={`p-4 rounded-lg border ${
              type === 'document'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <DocumentTextIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="block text-sm">Document</span>
          </button>
          <button
            onClick={() => setType('rule')}
            className={`p-4 rounded-lg border ${
              type === 'rule'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CodeBracketIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="block text-sm">Rule</span>
          </button>
          <button
            onClick={() => setType('example')}
            className={`p-4 rounded-lg border ${
              type === 'example'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BookOpenIcon className="h-6 w-6 mx-auto mb-2" />
            <span className="block text-sm">Example</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder={
            type === 'document'
              ? 'Paste your document content here...'
              : type === 'rule'
              ? 'Enter your rule definition...'
              : 'Provide an example...'
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={priority}
          onChange={(e) => setPriority(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={!content.trim()}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        Add Knowledge Source
      </button>
    </div>
  );
};

export default KnowledgeSourceEditor;