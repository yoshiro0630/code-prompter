// ```typescript
import React, { useState } from 'react';
import { useAPIStore } from '../stores/apiStore';
import BoltNewWorkflow from './BoltNewWorkflow';
import APIKeyManager from './APIKeyManager';
import { toast } from 'react-hot-toast';

const ChatInterface: React.FC = () => {
  const { showAPISettings } = useAPIStore();
  const [showBoltWorkflow, setShowBoltWorkflow] = useState(true);

  const handleBoltWorkflowComplete = () => {
    setShowBoltWorkflow(false);
    toast.success('Project requirements generated successfully');
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {showBoltWorkflow && (
        <BoltNewWorkflow 
          onComplete={handleBoltWorkflowComplete}
          onClose={() => setShowBoltWorkflow(false)}
        />
      )}
      {showAPISettings && <APIKeyManager />}
    </div>
  );
};

export default ChatInterface;
// ```