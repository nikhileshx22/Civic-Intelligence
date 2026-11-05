export type HazardCategory =
  | 'Pothole / Road Damage'
  | 'Garbage & Waste Overflow'
  | 'Streetlight / Electrical'
  | 'Water Leak / Drainage'
  | 'Open Manhole / Safety Hazard';

export type TicketStatus =
  | 'Pending'
  | 'In Progress'
  | 'Resolved (Photo Verified)';

export interface RetestAuditEntry {
  id: string;
  timestamp: string;
  inspectorType: 'AI Drone Sensor' | 'Field Engineer' | 'Citizen Ward Auditor' | 'Autonomous Satellite Mesh';
  result: 'Passed' | 'Failed' | 'Warning';
  notes: string;
  structuralPassRate: number; // e.g. 98.4%
  geotagHash: string;
}

export interface GodModeAnalysis {
  structuralIntegrityScore: number; // 0-100
  casualtyRiskRating: 'Negligible' | 'Moderate' | 'Severe Hazard' | 'Life-Threatening Imminent';
  monsoonErosionVulnerability: string;
  coastalSalinityIndex: string;
  rootCauseAnalysis: string;
  microCoordinates: string;
  materialEstimation: string;
  estimatedRepairCostINR: string;
  emergencyBypassRoute: string;
  satelliteAuditConfidence: number;
}

export interface Ticket {
  id: string;
  title: string;
  category: HazardCategory;
  zone: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
  resolvedImageUrl?: string;
  status: TicketStatus;
  urgencyScore: number;
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  upvotes: number;
  reportedAt: string;
  isSample: boolean;
  duplicateCount: number;
  bundledTicketIds?: string[];
  assignedDepartment: string;
  assignedOfficer: string;
  estimatedSlaHours: number;
  adminNotes: string;
  // Retest & Post-Repair Quality Lifecycle
  lastRetestedAt?: string;
  nextScheduledRetestAt?: string;
  retestCount: number;
  retestStatus: 'Initial Inspection' | 'Retest Scheduled' | 'Retested Safe' | 'Requires Rework' | 'Continuous Monitoring';
  retestAuditLog?: RetestAuditEntry[];
  godModeAnalysis?: GodModeAnalysis;
  aiVerificationDetails: {
    hazardFactors: string[];
    triageReasoning: string;
    photoProofStatus: string;
    commuterImpact: string;
  };
}

export interface VizagZone {
  name: string;
  lat: number;
  lng: number;
  ward: string;
  dept: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null; // km/h
  heading: number | null; // degrees
  altitude: number | null;
  timestamp: number;
  isTracking: boolean;
  mode: 'real' | 'simulated';
}

export interface AiInterferenceAdvisory {
  alertLevel: 'safe' | 'warning' | 'danger';
  headline: string;
  detailedAdvisory: string;
  recommendedAction: string;
  nearestHazardId?: string | null;
  distanceMeters?: number;
}

export interface AiTriageResult {
  isValidHazard: boolean;
  rejectionReason?: string;
  detectedObject?: string;
  isDuplicate?: boolean;
  duplicateMatchTicketId?: string | null;
  duplicateConfidencePercent?: number;
  detectedCategory?: HazardCategory;
  urgencyScore?: number;
  urgencyLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  commuterImpact?: string;
  assignedDepartment?: string;
  assignedOfficer?: string;
  estimatedSlaHours?: number;
  hazardFactors?: string[];
  triageReasoning?: string;
  photoProofChecklist?: string[];
  // God Mode Extensions
  godMode?: GodModeAnalysis;
  retestSchedule?: {
    initialInspectionAt: string;
    firstRetestDueAt: string;
    postMonsoonAuditAt: string;
    recommendedProtocol: string;
  };
}

