import React from 'react';
import QuestionInput from './QuestionInput';

interface FeatureQuestionsProps {
  value: {
    features: string;
    userActions: string;
    integrations: string;
    data: string;
    skipped: Record<string, boolean>;
  };
  onChange: (value: any) => void;
}

const FeatureQuestions: React.FC<FeatureQuestionsProps> = ({ value, onChange }) => {
  const handleChange = (field: string, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-6">
      <QuestionInput
        id="features"
        label="Core Features"
        description="What are the core features this software must include?"
        placeholder="e.g., Task management, invoicing, and client portals"
        value={value.features}
        onChange={(val) => handleChange('features', val)}
        required={true}
      />

      <QuestionInput
        id="userActions"
        label="User Actions"
        description="What specific user actions need to be supported?"
        placeholder="e.g., Upload files, assign tasks, view invoices"
        value={value.userActions}
        onChange={(val) => handleChange('userActions', val)}
        required={true}
      />

      <QuestionInput
        id="integrations"
        label="External Integrations"
        description="Do you need integrations with external systems or APIs?"
        placeholder="e.g., Stripe for payments, Google Calendar for task syncing"
        value={value.integrations}
        onChange={(val) => handleChange('integrations', val)}
        required={false}
      />

      <QuestionInput
        id="data"
        label="Data Management"
        description="What kind of data will the software need to manage?"
        placeholder="e.g., Client information, invoices, and project details"
        value={value.data}
        onChange={(val) => handleChange('data', val)}
        required={true}
      />
    </div>
  );
};

export default FeatureQuestions;