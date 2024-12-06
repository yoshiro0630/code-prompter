export type ProjectType = 'website' | 'mobileApp' | 'dashboard' | 'custom';

export interface Question {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  placeholder?: string;
}

export interface ProjectTypeConfig {
  title: string;
  description: string;
  questions: Question[];
}

export interface BasicRequirements {
  objective: string;
  users: string;
  problem: string;
  outcome: string;
  skipped: Record<string, boolean>;
}

export interface FeatureRequirements {
  features: string;
  userActions: string;
  integrations: string;
  data: string;
  skipped: Record<string, boolean>;
}

export interface UXRequirements {
  userInterface: string;
  platforms: string;
  accessibility: string;
  skipped: Record<string, boolean>;
}

export interface TechnicalRequirements {
  technologies: string;
  performance: string;
  security: string;
  scalability: string;
  skipped: Record<string, boolean>;
}

export interface VisionRequirements {
  success: string;
  userFeelings: string;
  inspiration: string;
  skipped: Record<string, boolean>;
}