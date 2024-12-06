import React, { useState, useEffect } from 'react';
import { ProjectType } from '../../types/questions';
import { generateDynamicQuestions } from '../../services/questions/dynamicQuestionGenerator';
import { useAPIStore } from '../../stores/apiStore';
import QuestionInput from './QuestionInput';
import QuestionProgress from './QuestionProgress';
import QuestionNavigation from './QuestionNavigation';
import ProcessingIndicator from '../ProcessingIndicator';
import CompletionOptions from './CompletionOptions';
import ProjectTypeSelector from './ProjectTypeSelector';
import { toast } from 'react-hot-toast';

interface DynamicQuestionsProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const DynamicQuestions: React.FC<DynamicQuestionsProps> = ({ onComplete, onBack }) => {
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { apiKey } = useAPIStore();

  useEffect(() => {
    // Check for test mode data
    const useTestAnswers = localStorage.getItem('use-test-answers');
    const testProjectType = localStorage.getItem('test-project-type');
    const testAnswers = localStorage.getItem('test-answers');

    if (useTestAnswers === 'true' && testProjectType && testAnswers) {
      try {
        setProjectType(testProjectType as ProjectType);
        setAnswers(JSON.parse(testAnswers));
        setIsComplete(true);
        
        // Clear test mode data
        localStorage.removeItem('use-test-answers');
        localStorage.removeItem('test-project-type');
        localStorage.removeItem('test-answers');
      } catch (error) {
        console.error('Error loading test data:', error);
      }
    } else if (projectType && !currentQuestion) {
      generateNextQuestion();
    }
  }, [projectType]);

  const generateNextQuestion = async () => {
    if (!projectType || !apiKey) return;

    setIsLoading(true);
    setProgress(20);

    try {
      const [question, newSuggestion] = await generateDynamicQuestions(projectType, answers);
      setProgress(80);
      
      if (question) {
        setCurrentQuestion(question);
        setSuggestion(newSuggestion || null);
      } else {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Failed to generate question:', error);
      toast.error('Failed to generate question. Please try again.');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [`question_${currentStep}`]: value
    }));
  };

  const handleUseSuggestion = () => {
    if (suggestion) {
      handleAnswer(suggestion);
    }
  };

  const handleNext = async () => {
    if (!answers[`question_${currentStep}`]?.trim()) {
      toast.error('Please provide an answer before continuing');
      return;
    }

    setCurrentStep(prev => prev + 1);
    await generateNextQuestion();
  };

  const handleBack = () => {
    if (currentStep === 0) {
      setProjectType(null);
      onBack();
    } else {
      setCurrentStep(prev => prev - 1);
      setCurrentQuestion(answers[`question_${currentStep - 1}`] || '');
    }
  };

  return (
    <div className="space-y-6">
      {!projectType && !isComplete && (
        <ProjectTypeSelector
          onSelect={setProjectType}
          onBack={onBack}
        />
      )}

      {isComplete && (
        <CompletionOptions
          answers={answers}
          projectType={projectType as ProjectType}
          onGeneratePrompts={() => onComplete(answers)}
        />
      )}

      {projectType && !isComplete && (
        <>
          <QuestionProgress
            currentStep={currentStep}
            totalSteps={8}
            title={`Question ${currentStep + 1}`}
            isLoading={isLoading}
          />

          {isLoading ? (
            <ProcessingIndicator 
              stage="Generating next question..."
              progress={progress} steps={[]}            />
          ) : (
            <QuestionInput
              id={`question_${currentStep}`}
              label={currentQuestion}
              description="Please provide a detailed answer to help generate the next relevant question."
              placeholder="Enter your answer here..."
              value={answers[`question_${currentStep}`] || ''}
              onChange={handleAnswer}
              required={true}
              suggestion={suggestion}
              onUseSuggestion={handleUseSuggestion}
            />
          )}

          <QuestionNavigation
            onBack={handleBack}
            onNext={handleNext}
            canProceed={!!answers[`question_${currentStep}`]?.trim()}
            isLastStep={false}
            currentStep={currentStep}
            totalSteps={8}
          />
        </>
      )}
    </div>
  );
};

export default DynamicQuestions;