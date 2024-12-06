import React, { useState } from 'react';
import { StagePrompt } from '../../services/prompt/stagePrompts';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PromptCardProps extends StagePrompt {
  number: number;
  onSave?: (prompt: StagePrompt) => void;
  isEditable?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({
  number,
  title,
  objective,
  prompt,
  outcome,
  onSave,
  isEditable = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState<StagePrompt>({
    title,
    objective,
    prompt,
    outcome
  });

  const handleSave = () => {
    onSave?.(editedPrompt);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPrompt({ title, objective, prompt, outcome });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] p-4 text-white flex justify-between items-center">
        <div>
          <div className="text-sm opacity-90 mb-1">Prompt {number}</div>
          {isEditing ? (
            <input
              type="text"
              value={editedPrompt.title}
              onChange={e => setEditedPrompt(prev => ({ ...prev, title: e.target.value }))}
              className="bg-white/10 text-white placeholder-white/50 rounded px-2 py-1 w-full"
              placeholder="Enter title..."
            />
          ) : (
            <h3 className="text-lg font-semibold">{title}</h3>
          )}
        </div>
        {isEditable && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Objective</div>
          {isEditing ? (
            <textarea
              value={editedPrompt.objective}
              onChange={e => setEditedPrompt(prev => ({ ...prev, objective: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
            />
          ) : (
            <div className="bg-gray-50 rounded p-3 text-gray-800">{objective}</div>
          )}
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Prompt</div>
          {isEditing ? (
            <textarea
              value={editedPrompt.prompt}
              onChange={e => setEditedPrompt(prev => ({ ...prev, prompt: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
              rows={4}
            />
          ) : (
            <div className="bg-gray-50 rounded p-3 text-gray-800 font-mono text-sm whitespace-pre-wrap">
              {prompt}
            </div>
          )}
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Expected Outcome</div>
          {isEditing ? (
            <textarea
              value={editedPrompt.outcome}
              onChange={e => setEditedPrompt(prev => ({ ...prev, outcome: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
            />
          ) : (
            <div className="bg-gray-50 rounded p-3 text-gray-800">{outcome}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;