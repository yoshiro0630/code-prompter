import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
    >
      <PlusIcon className="h-5 w-5" />
      <span>New Chat</span>
    </button>
  );
};

export default NewChatButton;