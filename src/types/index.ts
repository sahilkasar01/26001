export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AcquisitionStage = 
  | 'Project Initiated'
  | 'Landowner List Released'
  | 'Owner Notified'
  | 'Consent/Objection'
  | 'Compensation'
  | 'Legal/Approval'
  | 'Acquisition Complete';

export type UserRole = 'System Administrator' | 'Project Authority' | 'Landowner';

export interface ContributingFactor {
  name: string;
  weight: number; // e.g. 31%
  description?: string;
  category: 'Compensation' | 'Legal' | 'Landowner' | 'Approval' | 'Dispute' | 'Survey';
}

export interface Parcel {
  id: string; // e.g. "P-1042"
  projectId: string; // e.g. "PRJ-NH48"
  projectName: string;
  surveyNumber: string; // e.g. "74/2A"
  village: string;
  taluka: string;
  district: string;
  state: string;
  areaHectares: number;
  landownerName: string;
  landownerContact: string;
  landownerStatus: 'Responsive' | 'Unreachable' | 'Deceased / Inheritance Dispute' | 'Disputed Ownership' | 'Cooperative';
  stage: AcquisitionStage;
  riskScore: number; // 0-100
  riskCategory: RiskLevel;
  delayProbability: number; // 0-100%
  expectedDelayDays: number;
  topRiskFactors: ContributingFactor[];
  explanation: string;
  recommendedAction: string;
  compensationAmountLakhs: number;
  compensationStatus: 'Disbursed' | 'Pending Approval' | 'Under Dispute' | 'Account Verification' | 'Awaiting Fund Release';
  legalObjectionStatus: 'None' | 'Active Civil Suit' | 'Title Challenge' | 'Compensation Rate Dispute' | 'Tribal Land Clearance';
  lat: number;
  lng: number;
  connectedParcelIds?: string[];
}

export interface ProjectTimelineStage {
  stage: AcquisitionStage;
  progressPercentage: number;
  status: 'Completed' | 'In Progress' | 'Delayed' | 'Pending';
  targetDate: string;
  completionDate?: string;
}

export interface Project {
  id: string; // "PRJ-NH48"
  name: string;
  type: 'Highway' | 'Railway' | 'Industrial' | 'Smart City' | 'Irrigation' | 'Port Connectivity';
  district: string;
  state: string;
  totalParcels: number;
  acquiredParcels: number;
  pendingParcels: number;
  highRiskParcels: number;
  criticalRiskParcels: number;
  overallRisk: RiskLevel;
  overallRiskScore: number;
  progressPercentage: number;
  expectedCompletion: string;
  status: 'Critical Attention Required' | 'Moderate Delay Risk' | 'On Track' | 'Minor Delays';
  totalLandRequiredHectares: number;
  compensationProgress: number; // %
  rrProgress: number; // % Rehabilitation & Resettlement
  legalClearanceProgress: number; // %
  approvalProgress: number; // %
  leadDepartment: string;
  timeline: ProjectTimelineStage[];
  centerLat: number;
  centerLng: number;
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  parcelId?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  cause: string;
  recommendedAction: string;
  status: 'Active' | 'Investigating' | 'Action Assigned' | 'Resolved';
  assignedToDepartment?: string;
  assignedOfficer?: string;
}

export interface RecommendationItem {
  id: string;
  parcelId: string;
  projectId: string;
  projectName: string;
  village: string;
  problem: string;
  currentRiskScore: number;
  currentDelayProbability: number;
  recommendedAction: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  expectedImpact: string; // e.g. "Reduce delay probability from 82% to 54%"
  projectedRiskScore: number;
  projectedDelayProbability: number;
  assignedDepartment: string;
  status: 'Pending Review' | 'Action Scheduled' | 'Officer Assigned' | 'Resolved';
  officerName?: string;
}

export interface CoordinationTask {
  id: string;
  department: 'Revenue' | 'PWD' | 'Railways' | 'Legal' | 'R&R' | 'District Administration' | 'Project Authority';
  taskTitle: string;
  projectId: string;
  parcelId?: string;
  assignedOfficer: string;
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Escalated' | 'Completed';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  notes?: string;
}

export interface StakeholderGroup {
  id: string;
  entityName: string;
  type: 'Landowner Committee' | 'Community Group' | 'Farmers Union' | 'NGO' | 'Gram Panchayat';
  village: string;
  district: string;
  projectId: string;
  sentimentStatus: 'Adverse Opposition' | 'Conditional Agreement' | 'Grievance Pending' | 'Cooperative';
  totalObjections: number;
  unresolvedComplaints: number;
  escalationLevel: 'Level 3 - District Collector' | 'Level 2 - Sub-Divisional Magistrate' | 'Level 1 - Project Liaison' | 'Normal';
  primaryIssue: string;
  lastMeetingDate: string;
}

export interface ObjectionScenario {
  id: string;
  objectionType: string;
  parcelId: string;
  village: string;
  projectId: string;
  directParcelDelayRisk: number; // e.g. +18
  nearbyParcelsAffected: number; // e.g. 7
  potentialProjectDelayDays: number; // e.g. +11
  description: string;
  affectedParcelIds: string[];
}
