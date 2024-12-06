import { ProjectType } from '../../types/questions';

interface DevelopmentMetrics {
  hours: number;
  cost: number;
  complexity: 'low' | 'medium' | 'high';
}

export class DevelopmentCalculator {
  private static readonly HOURLY_RATES = {
    lead: 150,
    senior: 120,
    mid: 100,
    junior: 80
  };

  calculateDevelopmentMetrics(answers: Record<string, string>, projectType: ProjectType): DevelopmentMetrics {
    const complexity = this.analyzeComplexity(answers);
    const hours = this.estimateHours(answers, projectType, complexity);
    const cost = this.calculateCost(hours, complexity);

    return {
      hours,
      cost,
      complexity
    };
  }

  private analyzeComplexity(answers: Record<string, string>): 'low' | 'medium' | 'high' {
    let complexityScore = 0;

    // Analyze features (question_1)
    const features = answers.question_1?.toLowerCase() || '';
    if (features.includes('authentication') || features.includes('payment')) complexityScore += 2;
    if (features.includes('real-time') || features.includes('analytics')) complexityScore += 2;
    if (features.includes('integration') || features.includes('api')) complexityScore += 1;

    // Analyze technical requirements (question_3)
    const tech = answers.question_3?.toLowerCase() || '';
    if (tech.includes('microservices') || tech.includes('distributed')) complexityScore += 3;
    if (tech.includes('ai') || tech.includes('machine learning')) complexityScore += 3;
    if (tech.includes('blockchain') || tech.includes('cloud')) complexityScore += 2;

    // Analyze scale (question_4)
    const scale = answers.question_4?.toLowerCase() || '';
    if (scale.includes('high availability') || scale.includes('load balancing')) complexityScore += 2;
    if (scale.includes('global') || scale.includes('enterprise')) complexityScore += 2;

    // Analyze security (question_5)
    const security = answers.question_5?.toLowerCase() || '';
    if (security.includes('encryption') || security.includes('compliance')) complexityScore += 1;
    if (security.includes('audit') || security.includes('certification')) complexityScore += 1;

    // Determine complexity level
    if (complexityScore <= 5) return 'low';
    if (complexityScore <= 10) return 'medium';
    return 'high';
  }

  private estimateHours(
    answers: Record<string, string>,
    projectType: ProjectType,
    complexity: 'low' | 'medium' | 'high'
  ): number {
    // Base hours by project type
    const baseHours = {
      website: 160,
      mobileApp: 240,
      dashboard: 200,
      custom: 280
    }[projectType];

    // Complexity multipliers
    const complexityMultiplier = {
      low: 1,
      medium: 1.5,
      high: 2.2
    }[complexity];

    // Feature-based adjustments
    let featureHours = 0;
    const features = answers.question_1?.toLowerCase() || '';
    
    if (features.includes('authentication')) featureHours += 40;
    if (features.includes('payment')) featureHours += 60;
    if (features.includes('real-time')) featureHours += 80;
    if (features.includes('analytics')) featureHours += 60;
    if (features.includes('api')) featureHours += 40;
    if (features.includes('integration')) featureHours += 40;

    // Calculate total hours
    return Math.round((baseHours + featureHours) * complexityMultiplier);
  }

  private calculateCost(hours: number, complexity: 'low' | 'medium' | 'high'): number {
    // Distribute hours across different developer levels based on complexity
    let distribution;
    switch (complexity) {
      case 'low':
        distribution = {
          lead: 0.1,
          senior: 0.2,
          mid: 0.4,
          junior: 0.3
        };
        break;
      case 'medium':
        distribution = {
          lead: 0.2,
          senior: 0.3,
          mid: 0.3,
          junior: 0.2
        };
        break;
      case 'high':
        distribution = {
          lead: 0.3,
          senior: 0.4,
          mid: 0.2,
          junior: 0.1
        };
        break;
    }

    // Calculate cost based on distribution and rates
    const cost = Object.entries(distribution).reduce((total, [level, percentage]) => {
      const levelHours = hours * percentage;
      const rate = DevelopmentCalculator.HOURLY_RATES[level as keyof typeof DevelopmentCalculator.HOURLY_RATES];
      return total + (levelHours * rate);
    }, 0);

    return Math.round(cost);
  }
}