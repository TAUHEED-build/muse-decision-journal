export type DecisionStatus = 'deciding' | 'decided' | 'archived';

export interface AssumptionSparring {
  assumption: string;
  challenge: string;
  counterpoint: string;
  evidenceNeeded: string;
}

export interface DecisionOption {
  name: string;
  upside: string;
  downside: string;
  unknown: string;
}

export interface OptimizingFactor {
  tag: string;
  note: string;
}

export interface DecisionAnalysis {
  confidenceEstimated: number;
  coreBelief: string;
  optimizingFor: OptimizingFactor[];
  assumptions: AssumptionSparring[];
  risks: string[];
  unknowns: string[];
  options: DecisionOption[];
  museTake: {
    summary: string;
    reasoning: string;
    recommendedNextStep: string;
  };
}

export interface OutcomeReviewData {
  actualOutcome: string;
  whatGotRight: string;
  whatGotWrong: string;
  reviewedAt: string;
  predictionCalibration: 'Underconfident' | 'Well-Calibrated' | 'Overconfident';
  actualOutcomeAssessment: 'Positive' | 'Mixed' | 'Negative';
  whatYouPredictedWell: string;
  whatYouMissed: string;
  newPattern: string;
  calibrationScore: number;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  priorities: string[];
  concerns: string;
  initialAssumptions?: string;
  status: DecisionStatus;
  confidence: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
  analysis: DecisionAnalysis | null;
  outcome: OutcomeReviewData | null;
  reflectionNotes?: string;
}

export type PriorityTag =
  | 'Time'
  | 'Money'
  | 'Growth'
  | 'Relationships'
  | 'Learning'
  | 'Stability'
  | 'Freedom'
  | 'Health'
  | 'Focus'
  | 'Autonomy';
