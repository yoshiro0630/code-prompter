import React from 'react';
import QuestionInput from './QuestionInput';

interface BasicQuestionsProps {
  value: {
    objective: string;
    users: string;
    problem: string;
    outcome: string;
    skipped: Record<string, boolean>;
  };
  onChange: (value: any) => void;
}

const BasicQuestions: React.FC<BasicQuestionsProps> = ({ value, onChange }) => {
  const handleChange = (field: string, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
      skipped: {
        ...value.skipped,
        [field]: false
      }
    });
  };

  const handleSkip = (field: string) => {
    onChange({
      ...value,
      [field]: '',
      skipped: {
        ...value.skipped,
        [field]: true
      }
    });
  };

  return (
    <div className="space-y-6">
      <QuestionInput
        id="objective"
        label="Main Objective"
        description="What is the main objective of the software you want to build?"
        placeholder="e.g., An app for managing freelance projects"
        value={value.objective}
        onChange={(val) => handleChange('objective', val)}
        required
      />

      <QuestionInput
        id="users"
        label="Target Users"
        description="Who will be the primary users of this software?"
        placeholder="e.g., Freelancers and their clients"
        value={value.users}
        onChange={(val) => handleChange('users', val)}
        onSkip={() => handleSkip('users')}
        skipped={value.skipped.users}
      />

      <QuestionInput
        id="problem"
        label="Problem Statement"
        description="What problem will this software solve for its users?"
        placeholder="e.g., Organizing tasks and tracking invoices for freelancers"
        value={value.problem}
        onChange={(val) => handleChange('problem', val)}
        onSkip={() => handleSkip('problem')}
        skipped={value.skipped.problem}
      />

      <QuestionInput
        id="outcome"
        label="Desired Outcome"
        description="What is the desired outcome for the users?"
        placeholder="e.g., Simplify freelance workflows and ensure faster payments"
        value={value.outcome}
        onChange={(val) => handleChange('outcome', val)}
        onSkip={() => handleSkip('outcome')}
        skipped={value.skipped.outcome}
      />
    </div>
  );
};

export default BasicQuestions;