import { useState, useCallback } from 'react';
import { ProjectType } from '../../../types/questions';
import { toast } from 'react-hot-toast';

interface UseQuestionNavigationProps {
  maxQuestions: number;
  onComplete: (answers: Record<string, string>) => void;
}

export const useQuestionNavigation = ({ maxQuestions, onComplete }: UseQuestionNavigationProps) => {
  const [questionCount, setQuestionCount] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(new Set());

  const handleSkip = useCallback((currentCount: number) => {
    if (currentCount < 5) {
      toast.error('The first 5 questions are required');
      return false;
    }
    setSkippedQuestions(prev => new Set(prev).add(currentCount));
    return true;
  }, []);

  const filterSkippedAnswers = useCallback((answers: Record<string, string>) => {
    return Object.entries(answers).reduce((acc, [key, value]) => {
      const questionNumber = parseInt(key.split('_')[1]);
      if (!skippedQuestions.has(questionNumber)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  }, [skippedQuestions]);

  const isQuestionSkipped = useCallback((questionNumber: number) => {
    return skippedQuestions.has(questionNumber);
  }, [skippedQuestions]);

  const canProceed = useCallback((currentAnswer: string) => {
    return !!(
      currentAnswer?.trim() || 
      isQuestionSkipped(questionCount) ||
      questionCount >= 5
    );
  }, [questionCount, isQuestionSkipped]);

  return {
    questionCount,
    setQuestionCount,
    handleSkip,
    filterSkippedAnswers,
    isQuestionSkipped,
    canProceed,
    skippedQuestions,
    setSkippedQuestions
  };
};