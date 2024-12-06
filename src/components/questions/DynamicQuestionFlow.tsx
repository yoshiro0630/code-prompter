import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import QuestionInput from './QuestionInput';
import QuestionProgress from './QuestionProgress';

interface Question {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  required?: boolean;
  suggestions?: string[];
}

const baseQuestions: Question[] = [
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
    placeholder: 'e.g., Freelancers and their clients'
  },
  {
    id: 'problem',
    label: 'Problem Statement',
    description: 'What problem will this software solve for its users?',
    placeholder: 'e.g., Organizing tasks and tracking invoices for freelancers'
  },
  {
    id: 'outcome',
    label: 'Desired Outcome',
    description: 'What is the desired outcome for the users?',
    placeholder: 'e.g., Simplify freelance workflows and ensure faster payments'
  }
];

interface DynamicQuestionFlowProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const DynamicQuestionFlow: React.FC<DynamicQuestionFlowProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);

  const currentQuestion = baseQuestions[currentStep];
  const isLastStep = currentStep === baseQuestions.length - 1;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleSkip = () => {
    if (!currentQuestion.required) {
      setSkippedQuestions(prev => [...prev, currentQuestion.id]);
      handleNext();
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      const formattedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
        if (!skippedQuestions.includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      onComplete(formattedAnswers);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onBack();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = currentQuestion.required 
    ? !!answers[currentQuestion.id]?.trim() 
    : true;

  return (
    <div className="space-y-6">
      <QuestionProgress
        currentStep={currentStep}
        totalSteps={baseQuestions.length}
        title={`Step ${currentStep + 1}: ${currentQuestion.label}`}
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
        skipped={skippedQuestions.includes(currentQuestion.id)}
      />

      <div className="flex justify-between pt-6">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLastStep ? 'Generate Prompts' : 'Next'}
          {!isLastStep && <ChevronRightIcon className="w-5 h-5 ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default DynamicQuestionFlow;