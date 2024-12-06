import React from 'react';
import QuestionInput from './QuestionInput';

interface UXQuestionsProps {
  value: {
    userInterface: string;
    platforms: string;
    accessibility: string;
  };
  onChange: (value: any) => void;
}

const UXQuestions: React.FC<UXQuestionsProps> = ({ value, onChange }) => {
  const handleChange = (field: string, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-6">
      <QuestionInput
        id="userInterface"
        label="User Interface"
        description="What type of user interface do you envision?"
        placeholder="e.g., A simple dashboard with task cards and a calendar view"
        value={value.userInterface}
        onChange={(val) => handleChange('userInterface', val)}
        required={true}
      />

      <QuestionInput
        id="platforms"
        label="Platform Support"
        description="Should the software support multiple devices or platforms?"
        placeholder="e.g., Desktop and mobile apps"
        value={value.platforms}
        onChange={(val) => handleChange('platforms', val)}
        required={true}
      />

      <QuestionInput
        id="accessibility"
        label="Accessibility Requirements"
        description="Are there any accessibility requirements to consider?"
        placeholder="e.g., Keyboard navigation and screen reader compatibility"
        value={value.accessibility}
        onChange={(val) => handleChange('accessibility', val)}
        required={false}
      />
    </div>
  );
};

export default UXQuestions;