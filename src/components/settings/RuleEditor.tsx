import React, { useState } from 'react';
import { ConfigurationRule } from '../../types/config-types';

interface RuleEditorProps {
  onAdd: (rule: Omit<ConfigurationRule, 'id'>) => void;
}

const RuleEditor: React.FC<RuleEditorProps> = ({ onAdd }) => {
  const [type, setType] = useState<ConfigurationRule['type']>('constraint');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [action, setAction] = useState('');
  const [priority, setPriority] = useState(1);

  const handleAdd = () => {
    if (!description.trim() || !action.trim()) return;

    onAdd({
      type,
      description: description.trim(),
      condition: condition.trim(),
      action: action.trim(),
      priority
    });

    setDescription('');
    setCondition('');
    setAction('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rule Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ConfigurationRule['type'])}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="constraint">Constraint</option>
          <option value="enhancement">Enhancement</option>
          <option value="requirement">Requirement</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe the rule..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Condition (Optional)
        </label>
        <input
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="When should this rule apply?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Action
        </label>
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="What action should be taken?"
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
        disabled={!description.trim() || !action.trim()}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        Add Rule
      </button>
    </div>
  );
};

export default RuleEditor;