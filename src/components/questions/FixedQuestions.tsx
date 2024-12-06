import React, { useState } from 'react';
import QuestionInput from './QuestionInput';
import QuestionProgress from './QuestionProgress';
import QuestionNavigation from './QuestionNavigation';

interface Question {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
}

interface FixedQuestionsProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const fixedQuestions: Question[] = [
  {
    id: 'objective',
    label: 'Main Objective',
    description: 'What is the main objective of your software?',
    placeholder: 'e.g., An app for managing freelance projects',
    required: true
  },
  {
    id: 'users',
    label: 'Target Users',
    description: 'Who will be the primary users of this software?',
    placeholder: 'e.g., Freelancers and their clients',
    required: false
  },
  {
    id: 'features',
    label: 'Core Features',
    description: 'What are the main features needed?',
    placeholder: 'e.g., Task tracking, time logging, invoicing',
    required: true
  }
];

const FixedQuestions: React.FC<FixedQuestionsProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});

  const currentQuestion = fixedQuestions[currentStep];
  const isLastStep = currentStep === fixedQuestions.length - 1;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    setSkipped(prev => ({
      ...prev,
      [currentQuestion.id]: false
    }));
  };

  const handleSkip = () => {
    if (!currentQuestion.required) {
      setSkipped(prev => ({
        ...prev,
        [currentQuestion.id]: true
      }));
      handleNext();
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      const completedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
        if (!skipped[key]) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      onComplete(completedAnswers);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const canProceed = currentQuestion.required 
    ? !!answers[currentQuestion.id]?.trim() 
    : true;

  return (
    <div className="space-y-6">
      <QuestionProgress
        currentStep={currentStep}
        totalSteps={fixedQuestions.length}
        title={currentQuestion.label}
      />

      <QuestionInput
        id={currentQuestion.id}
        label={currentQuestion.label}
        description={currentQuestion.description}
        placeholder={currentQuestion.placeholder}
        value={answers[currentQuestion.id] || ''}
        onChange={handleAnswer}
        onSkip={!currentQuestion.required ? handleSkip : undefined}
        required={currentQuestion.required}
        skipped={skipped[currentQuestion.id]}
      />

      <QuestionNavigation
        onBack={onBack}
        onNext={handleNext}
        canProceed={canProceed}
        isLastStep={isLastStep}
        currentStep={currentStep}
        totalSteps={fixedQuestions.length}
      />
    </div>
  );
};

export default FixedQuestions;