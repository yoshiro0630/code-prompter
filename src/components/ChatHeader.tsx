import React from 'react';
import NewChatButton from './NewChatButton';
// import ProviderModelToggle from './ProviderModelToggle';
import { ModelConfig } from '../types/models';

interface ChatHeaderProps {
  onNewChat: () => void;
  modelConfig: ModelConfig;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onNewChat }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <NewChatButton onClick={onNewChat} />
        {/* <ProviderModelToggle /> */}
      </div>
    </div>
  );
};

export default ChatHeader;