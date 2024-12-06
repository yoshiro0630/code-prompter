import { useState, useCallback } from 'react';
import { ProjectType } from '../../../types/questions';
import { generateDynamicQuestions } from '../../../services/questions/dynamicQuestionGenerator';
import { generateAISuggestion } from '../../../services/questions/aiSuggestionGenerator';
import { toast } from 'react-hot-toast';

interface UseQuestionGenerationProps {
  projectType: ProjectType | null;
  activeProvider: string;
  questionCount: number;
  answers: Record<string, string>;
}

export const useQuestionGeneration = ({
  projectType,
  activeProvider,
  questionCount,
  answers
}: UseQuestionGenerationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const generateNextQuestion = useCallback(async () => {
    if (!projectType) return;

    setIsLoading(true);
    setProcessingProgress(25);

    try {
      const [nextQuestion] = await generateDynamicQuestions(projectType, answers);
      setProcessingProgress(50);

      if (questionCount > 1) {
        const suggestion = await generateAISuggestion(
          projectType,
          answers,
          nextQuestion,
          activeProvider
        );
        setAiSuggestion(suggestion);
      } else {
        setAiSuggestion(null);
      }

      setProcessingProgress(75);
      setCurrentQuestion(nextQuestion);
    } catch (error) {
      console.error('Failed to generate question:', error);
      toast.error('Failed to generate question. Please try again.');
    } finally {
      setIsLoading(false);
      setProcessingProgress(0);
    }
  }, [projectType, activeProvider, questionCount, answers]);

  return {
    isLoading,
    processingProgress,
    currentQuestion,
    aiSuggestion,
    generateNextQuestion,
    setCurrentQuestion,
    setAiSuggestion
  };
};