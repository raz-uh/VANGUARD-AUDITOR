
export interface TechStack {
  os: string;
  webServer: string;
  database: string;
  frontend: string;
  backend: string;
}

export interface ThreatVector {
  vector: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
}

export interface ReconStep {
  tool: string;
  command: string;
  objective: string;
}

export interface VulnerabilityLogic {
  feature: string;
  weakness: string;
  mitigation: string;
}

export interface BugBountyReport {
  title: string;
  vulnerabilityType: string;
  impact: string;
  stepsToReproduce: string[];
  validationPayload: string;
}

export interface AuditResponse {
  techStack: TechStack;
  threatModel: ThreatVector[];
  reconPlan: ReconStep[];
  vulnerabilityLogic: VulnerabilityLogic[];
  bugBountyReports: BugBountyReport[];
  summary: string;
}
