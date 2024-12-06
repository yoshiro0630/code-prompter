import React, { useState } from 'react';
import QuestionWorkflowSelector from './QuestionWorkflowSelector';
import FixedQuestions from './FixedQuestions';
import DynamicQuestions from './DynamicQuestions';

interface GuidedQuestionsProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const GuidedQuestions: React.FC<GuidedQuestionsProps> = ({ onComplete, onBack }) => {
  const [mode, setMode] = useState<'select' | 'fixed' | 'dynamic'>('select');

  const handleWorkflowSelect = (type: 'fixed' | 'dynamic') => {
    setMode(type);
  };

  const handleBack = () => {
    if (mode === 'select') {
      onBack();
    } else {
      setMode('select');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {mode === 'select' && (
        <QuestionWorkflowSelector
          onSelect={handleWorkflowSelect}
          onBack={onBack}
        />
      )}

      {mode === 'fixed' && (
        <FixedQuestions
          onComplete={onComplete}
          onBack={handleBack}
        />
      )}

      {mode === 'dynamic' && (
        <DynamicQuestions
          onComplete={onComplete}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default GuidedQuestions;