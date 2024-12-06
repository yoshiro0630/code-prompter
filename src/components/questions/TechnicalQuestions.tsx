import React from 'react';
import QuestionInput from './QuestionInput';
import { TechnicalRequirements } from '../../types/questions';

interface TechnicalQuestionsProps {
  value: TechnicalRequirements;
  onChange: (value: TechnicalRequirements) => void;
}

const TechnicalQuestions: React.FC<TechnicalQuestionsProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof TechnicalRequirements, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-6">
      <QuestionInput
        id="technologies"
        label="Technologies & Frameworks"
        description="What technologies or frameworks would you prefer to use?"
        placeholder="e.g., React for frontend, Node.js for backend, or let us suggest the best tools"
        value={value.technologies}
        onChange={(val) => handleChange('technologies', val)}
        required={false}
      />

      <QuestionInput
        id="performance"
        label="Performance Requirements"
        description="Are there any specific performance targets or metrics?"
        placeholder="e.g., Handle 10,000 concurrent users, page load times under 2 seconds"
        value={value.performance}
        onChange={(val) => handleChange('performance', val)}
        required={false}
      />

      <QuestionInput
        id="security"
        label="Security Requirements"
        description="What security measures or compliance standards are needed?"
        placeholder="e.g., End-to-end encryption, OAuth2 authentication, GDPR compliance"
        value={value.security}
        onChange={(val) => handleChange('security', val)}
        required={false}
      />

      <QuestionInput
        id="scalability"
        label="Scalability Needs"
        description="What are your growth expectations and scaling requirements?"
        placeholder="e.g., Start small but scale to enterprise-level, support global audience"
        value={value.scalability}
        onChange={(val) => handleChange('scalability', val)}
        required={false}
      />
    </div>
  );
};

export default TechnicalQuestions;