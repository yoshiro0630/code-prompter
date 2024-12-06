import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { 
  ClipboardDocumentIcon, 
  EllipsisHorizontalIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Message } from '../types/chat';
import { copyToClipboard } from '../utils/clipboard';
import { exportToMarkdown } from '../utils/export';
import { toast } from 'react-hot-toast';

interface MessageActionsProps {
  message: Message;
}

const MessageActions: React.FC<MessageActionsProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="absolute top-2 right-2 flex items-center space-x-1">
      <button
        onClick={handleCopy}
        className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-green-500" />
        ) : (
          <ClipboardDocumentIcon className="h-4 w-4" />
        )}
      </button>

      <Menu as="div" className="relative">
        <Menu.Button
          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          title="Export options"
        >
          <EllipsisHorizontalIcon className="h-4 w-4" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-1 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    exportToMarkdown(message.content);
                    toast.success('Exported as Markdown');
                  }}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } flex items-center w-full px-4 py-2 text-sm group`}
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500" />
                  Export as Markdown
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default MessageActions;