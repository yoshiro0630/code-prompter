import React from 'react';
import { PromptStage } from '../types/prompt-types';
import StageItem from './StageItem';

interface StageListProps {
  stages: PromptStage[];
  onStageSelect: (stageId: string) => void;
  selectedStageId?: string;
}

const StageList: React.FC<StageListProps> = ({ stages, onStageSelect, selectedStageId }) => {
  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <StageItem
          key={stage.id}
          stage={stage}
          isSelected={stage.id === selectedStageId}
          onClick={() => onStageSelect(stage.id)}
        />
      ))}
    </div>
  );
}

export default StageList;