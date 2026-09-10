import { mockProjects } from '../data/projects';
import { mockParcels } from '../data/parcels';
import { mockAlerts } from '../data/alerts';
import { mockRecommendations } from '../data/recommendations';
import { mockCoordinationTasks } from '../data/departments';
import { mockStakeholders } from '../data/stakeholders';
import { mockObjectionScenarios } from '../data/objections';
import { Project, Parcel, SystemAlert, RecommendationItem, CoordinationTask, StakeholderGroup, ObjectionScenario } from '../types';

export interface SimulationInput {
  parcelId: string;
  resolveLegalObjection: boolean;
  completeCompensation: boolean;
  contactLandowner: boolean;
  expediteApproval: boolean;
  conductMediation: boolean;
  increaseFieldStaff: boolean;
}

export interface SimulationResult {
  currentRiskScore: number;
  projectedRiskScore: number;
  currentDelayProbability: number;
  projectedDelayProbability: number;
  expectedDelayReductionDays: number;
  riskReductionPercentage: number;
  actionsAppliedCount: number;
  summaryExplanation: string;
}

class NexoraApiService {
  // In future production: these methods would fetch from `/api/v1/...`
  async getProjects(): Promise<Project[]> {
    return Promise.resolve([...mockProjects]);
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const project = mockProjects.find(p => p.id === id);
    return Promise.resolve(project ? { ...project } : undefined);
  }

  async getParcels(projectId?: string): Promise<Parcel[]> {
    if (projectId) {
      return Promise.resolve(mockParcels.filter(p => p.projectId === projectId));
    }
    return Promise.resolve([...mockParcels]);
  }

  async getParcelById(id: string): Promise<Parcel | undefined> {
    const parcel = mockParcels.find(p => p.id === id);
    return Promise.resolve(parcel ? { ...parcel } : undefined);
  }

  async getParcelRisk(parcelId: string): Promise<{
    parcel: Parcel | undefined;
    riskScore: number;
    category: string;
    delayProbability: number;
    expectedDelayDays: number;
    topRiskFactors: { name: string; weight: number }[];
  }> {
    const parcel = mockParcels.find(p => p.id === parcelId);
    if (!parcel) {
      return Promise.resolve({
        parcel: undefined,
        riskScore: 0,
        category: 'LOW',
        delayProbability: 0,
        expectedDelayDays: 0,
        topRiskFactors: []
      });
    }
    return Promise.resolve({
      parcel,
      riskScore: parcel.riskScore,
      category: parcel.riskCategory,
      delayProbability: parcel.delayProbability,
      expectedDelayDays: parcel.expectedDelayDays,
      topRiskFactors: parcel.topRiskFactors
    });
  }

  async getAlerts(projectId?: string): Promise<SystemAlert[]> {
    if (projectId) {
      return Promise.resolve(mockAlerts.filter(a => a.projectId === projectId));
    }
    return Promise.resolve([...mockAlerts]);
  }

  async getRecommendations(projectId?: string): Promise<RecommendationItem[]> {
    if (projectId) {
      return Promise.resolve(mockRecommendations.filter(r => r.projectId === projectId));
    }
    return Promise.resolve([...mockRecommendations]);
  }

  async getCoordinationTasks(): Promise<CoordinationTask[]> {
    return Promise.resolve([...mockCoordinationTasks]);
  }

  async getStakeholders(projectId?: string): Promise<StakeholderGroup[]> {
    if (projectId) {
      return Promise.resolve(mockStakeholders.filter(s => s.projectId === projectId));
    }
    return Promise.resolve([...mockStakeholders]);
  }

  async getObjectionScenarios(): Promise<ObjectionScenario[]> {
    return Promise.resolve([...mockObjectionScenarios]);
  }

  async getGISData(): Promise<{
    projects: Project[];
    parcels: Parcel[];
    clusters: { name: string; center: [number, number]; count: number; highRiskCount: number }[];
  }> {
    return Promise.resolve({
      projects: mockProjects,
      parcels: mockParcels,
      clusters: [
        { name: 'Maval Corridor Hotspot (NH-48)', center: [18.7300, 73.6750], count: 8, highRiskCount: 6 },
        { name: 'Palghar Tribal Corridor (DFC)', center: [19.8000, 72.7600], count: 5, highRiskCount: 3 },
        { name: 'Dadri Industrial Fringe (Smart City)', center: [28.5200, 77.4800], count: 3, highRiskCount: 2 },
        { name: 'Vadhavan Coastal Zone (Port)', center: [19.9900, 72.7000], count: 3, highRiskCount: 2 }
      ]
    });
  }

  async predictDelay(parcelId: string): Promise<{
    predictedDays: number;
    probability: number;
    criticalPathImpact: boolean;
    confidence: number;
  }> {
    const parcel = mockParcels.find(p => p.id === parcelId);
    if (!parcel) {
      return Promise.resolve({ predictedDays: 0, probability: 0, criticalPathImpact: false, confidence: 0.9 });
    }
    return Promise.resolve({
      predictedDays: parcel.expectedDelayDays,
      probability: parcel.delayProbability,
      criticalPathImpact: parcel.riskScore >= 70,
      confidence: 0.94
    });
  }

  simulateAction(input: SimulationInput): SimulationResult {
    const parcel = mockParcels.find(p => p.id === input.parcelId) || mockParcels[0];
    const initialRisk = parcel.riskScore;
    const initialDelayProb = parcel.delayProbability;

    let riskReduction = 0;
    let delayDaysSaved = 0;
    let actionsCount = 0;

    if (input.resolveLegalObjection) {
      riskReduction += 21;
      delayDaysSaved += 24;
      actionsCount++;
    }
    if (input.completeCompensation) {
      riskReduction += 18;
      delayDaysSaved += 19;
      actionsCount++;
    }
    if (input.conductMediation) {
      riskReduction += 12;
      delayDaysSaved += 14;
      actionsCount++;
    }
    if (input.contactLandowner) {
      riskReduction += 8;
      delayDaysSaved += 9;
      actionsCount++;
    }
    if (input.expediteApproval) {
      riskReduction += 10;
      delayDaysSaved += 11;
      actionsCount++;
    }
    if (input.increaseFieldStaff) {
      riskReduction += 7;
      delayDaysSaved += 8;
      actionsCount++;
    }

    const projectedRiskScore = Math.max(12, initialRisk - riskReduction);
    const probReduction = Math.round(riskReduction * 0.92);
    const projectedDelayProbability = Math.max(10, initialDelayProb - probReduction);

    let summaryExplanation = 'No corrective interventions selected. Risk metrics remain at unmitigated baseline.';
    if (actionsCount > 0) {
      summaryExplanation = `Simulated combination of ${actionsCount} administrative interventions reduces overall risk score from ${initialRisk} to ${projectedRiskScore} and mitigates ~${delayDaysSaved} days of projected critical path latency.`;
    }

    return {
      currentRiskScore: initialRisk,
      projectedRiskScore,
      currentDelayProbability: initialDelayProb,
      projectedDelayProbability,
      expectedDelayReductionDays: delayDaysSaved,
      riskReductionPercentage: Math.round(((initialRisk - projectedRiskScore) / initialRisk) * 100),
      actionsAppliedCount: actionsCount,
      summaryExplanation
    };
  }
}

export const apiService = new NexoraApiService();
