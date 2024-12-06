import React from 'react';
import { Message } from '../types/chat';
import PromptOutput from './PromptOutput';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-3xl ${
              message.role === 'user'
                ? 'bg-blue-600 text-white rounded-lg px-4 py-2'
                : 'w-full'
            }`}
          >
            {message.loading ? (
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            ) : message.role === 'user' ? (
              <p>{message.content}</p>
            ) : (
              <PromptOutput content={message.content} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;