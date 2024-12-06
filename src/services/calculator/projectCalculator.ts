import { ProjectType } from '../../types/questions';
import { ProjectMetrics, Timeline, Costs, Resources } from '../../types/project-types';
import { DevelopmentCalculator } from './developmentCalculator';

export class ProjectCalculator {
  private developmentCalculator: DevelopmentCalculator;

  constructor() {
    this.developmentCalculator = new DevelopmentCalculator();
  }

  calculateProjectMetrics(answers: Record<string, string>, projectType: ProjectType): ProjectMetrics {
    const devMetrics = this.developmentCalculator.calculateDevelopmentMetrics(answers, projectType);
    const timeline = this.calculateTimeline(devMetrics.hours);
    const resources = this.calculateResources(timeline, devMetrics.complexity);
    const costs = this.calculateCosts(devMetrics, resources, projectType);

    return {
      timeline,
      costs,
      resources
    };
  }

  private calculateTimeline(totalDevHours: number): Timeline {
    const hoursPerWeek = 40;
    const totalWeeks = Math.ceil(totalDevHours / hoursPerWeek);

    return {
      totalWeeks,
      phases: [
        {
          name: 'Planning & Design',
          duration: Math.max(2, Math.round(totalWeeks * 0.2)),
          tasks: ['Requirements Analysis', 'Architecture Design', 'UI/UX Design']
        },
        {
          name: 'Development',
          duration: Math.round(totalWeeks * 0.5),
          tasks: ['Core Features', 'Integration', 'API Development']
        },
        {
          name: 'Testing & QA',
          duration: Math.max(2, Math.round(totalWeeks * 0.2)),
          tasks: ['Unit Testing', 'Integration Testing', 'User Acceptance Testing']
        },
        {
          name: 'Deployment',
          duration: Math.max(1, Math.round(totalWeeks * 0.1)),
          tasks: ['Production Setup', 'Data Migration', 'Go Live']
        }
      ]
    };
  }

  private calculateResources(timeline: Timeline, complexity: 'low' | 'medium' | 'high'): Resources {
    const resourceMultiplier = {
      low: 1,
      medium: 1.5,
      high: 2
    }[complexity];

    return {
      developers: Math.round(2 * resourceMultiplier),
      designers: Math.max(1, Math.round(1 * resourceMultiplier)),
      qaEngineers: Math.max(1, Math.round(1 * resourceMultiplier)),
      devOpsEngineers: 1
    };
  }

  private calculateCosts(
    devMetrics: { cost: number; complexity: 'low' | 'medium' | 'high' },
    resources: Resources,
    projectType: ProjectType
  ): Costs {
    // Development cost is calculated by the development calculator
    const developmentCost = devMetrics.cost;

    // Calculate other costs based on development cost
    const designCost = developmentCost * 0.2;
    const qaCost = developmentCost * 0.3;
    const infrastructureCost = this.calculateInfrastructureCost(projectType, devMetrics.complexity);
    const licensesCost = this.calculateLicenseCost(projectType, resources);
    const managementCost = developmentCost * 0.4;

    const subtotal = 
      developmentCost +
      designCost +
      qaCost +
      infrastructureCost +
      licensesCost +
      managementCost;

    const contingency = subtotal * 0.15;
    const total = subtotal + contingency;

    return {
      development: Math.round(developmentCost),
      design: Math.round(designCost),
      qa: Math.round(qaCost),
      infrastructure: Math.round(infrastructureCost),
      licenses: Math.round(licensesCost),
      management: Math.round(managementCost),
      contingency: Math.round(contingency),
      total: Math.round(total)
    };
  }

  private calculateInfrastructureCost(projectType: ProjectType, complexity: 'low' | 'medium' | 'high'): number {
    const baseCosts = {
      website: 5000,
      mobileApp: 8000,
      dashboard: 6000,
      custom: 10000
    };

    const multiplier = {
      low: 1,
      medium: 1.5,
      high: 2
    }[complexity];

    return baseCosts[projectType] * multiplier;
  }

  private calculateLicenseCost(projectType: ProjectType, resources: Resources): number {
    const baseCosts = {
      website: 3000,
      mobileApp: 5000,
      dashboard: 4000,
      custom: 6000
    };

    const baseLicense = baseCosts[projectType];
    const perDevLicense = 1000; // License cost per developer

    return baseLicense + (perDevLicense * resources.developers);
  }
}