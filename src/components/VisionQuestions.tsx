import React from 'react';
import QuestionInput from './questions/QuestionInput';
import { VisionRequirements } from '../types/questions';

interface VisionQuestionsProps {
  value: VisionRequirements;
  onChange: (value: VisionRequirements) => void;
}

const VisionQuestions: React.FC<VisionQuestionsProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof VisionRequirements, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-6">
      <QuestionInput
        id="success"
        label="Success Definition"
        description="What would success look like for this software?"
        placeholder="e.g., Freelancers save time and get paid faster"
        value={value.success}
        onChange={(val) => handleChange('success', val)}
        required
      />

      <QuestionInput
        id="userFeelings"
        label="User Experience Goals"
        description="How should users feel when interacting with your software?"
        placeholder="e.g., Empowered and organized"
        value={value.userFeelings}
        onChange={(val) => handleChange('userFeelings', val)}
        required
      />

      <QuestionInput
        id="inspiration"
        label="Inspiration Sources"
        description="Are there any similar tools you like or want to draw inspiration from?"
        placeholder="e.g., Trello for task management, Upwork for freelance portals"
        value={value.inspiration}
        onChange={(val) => handleChange('inspiration', val)}
        required={false}
      />
    </div>
  );
};

export default VisionQuestions;