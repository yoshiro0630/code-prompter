export interface ProjectMetrics {
  timeline: Timeline;
  costs: Costs;
  resources: Resources;
}

export interface Timeline {
  totalWeeks: number;
  phases: Phase[];
}

export interface Phase {
  name: string;
  duration: number;
  tasks: string[];
  dependencies?: string[];
}

export interface Costs {
  development: number;
  design: number;
  qa: number;
  infrastructure: number;
  licenses: number;
  management: number;
  contingency: number;
  total: number;
}

export interface Resources {
  developers: number;
  designers: number;
  qaEngineers: number;
  devOpsEngineers: number;
}