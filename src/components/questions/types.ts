import { ProjectType } from '../../types/questions';

export interface QuestionProps {
  id: string;
  label: string;
  description: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSkip?: () => void;
  required?: boolean;
  skipped?: boolean;
  suggestion?: string | null;
  onUseSuggestion?: () => void;
}

export interface NavigationProps {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface ProgressProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  isLoading?: boolean;
}

export interface PreviewProps {
  answers: Record<string, string>;
  projectType: ProjectType;
  onGenerateDesignBrief: () => void;
  onGeneratePrompts: () => void;
}