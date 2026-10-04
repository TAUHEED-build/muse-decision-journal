import React, { createContext, useContext, useState, useEffect } from 'react';
import { Decision, DecisionStatus, OutcomeReviewData, DecisionAnalysis } from '../types/decision';
import { SEED_DECISIONS } from '../data/seedDecisions';

const STORAGE_KEY = 'muse_decisions_store_v1';

interface DecisionContextType {
  decisions: Decision[];
  loading: boolean;
  createDecisionWithAnalysis: (params: {
    title: string;
    context: string;
    priorities: string[];
    concerns: string;
    assumptionsPrompt?: string;
  }) => Promise<Decision>;
  reanalyzeDecision: (id: string) => Promise<DecisionAnalysis | null>;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  deleteDecision: (id: string) => void;
  submitOutcomeReview: (
    id: string,
    inputs: { actualOutcome: string; whatGotRight: string; whatGotWrong: string }
  ) => Promise<OutcomeReviewData>;
  resetToSeeds: () => void;
}

const DecisionContext = createContext<DecisionContextType | undefined>(undefined);

export const DecisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decisions, setDecisions] = useState<Decision[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load decisions from localStorage:', e);
    }
    return SEED_DECISIONS;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
    } catch (e) {
      console.warn('Failed to persist decisions to localStorage:', e);
    }
  }, [decisions]);

  const updateDecision = (id: string, updates: Partial<Decision>) => {
    setDecisions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
    );
  };

  const deleteDecision = (id: string) => {
    setDecisions((prev) => prev.filter((d) => d.id !== id));
  };

  const resetToSeeds = () => {
    setDecisions(SEED_DECISIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DECISIONS));
  };

  // Compile summary of previous decision patterns to feed into AI
  const getHistoricalPatternsSummary = (): string => {
    const reviewed = decisions.filter((d) => d.outcome?.newPattern);
    if (reviewed.length === 0) return '';
    return reviewed.map((d) => d.outcome?.newPattern).join('; ');
  };

  const createDecisionWithAnalysis = async ({
    title,
    context,
    priorities,
    concerns,
    assumptionsPrompt,
  }: {
    title: string;
    context: string;
    priorities: string[];
    concerns: string;
    assumptionsPrompt?: string;
  }): Promise<Decision> => {
    setLoading(true);
    const newId = 'dec-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();

    let analysis: DecisionAnalysis | null = null;
    let confidence = 70;

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          context,
          priorities,
          concerns,
          assumptionsPrompt,
          previousOutcomesSummary: getHistoricalPatternsSummary(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        analysis = data;
        confidence = data.confidenceEstimated || 70;
      } else {
        console.error('Failed to get analysis response from server');
      }
    } catch (err) {
      console.error('Network error during decision analysis:', err);
    }

    const newDecision: Decision = {
      id: newId,
      title: title.trim(),
      context: context.trim(),
      priorities,
      concerns: concerns.trim(),
      initialAssumptions: assumptionsPrompt?.trim(),
      status: 'deciding',
      confidence,
      createdAt: now,
      updatedAt: now,
      analysis,
      outcome: null,
      reflectionNotes: '',
    };

    setDecisions((prev) => [newDecision, ...prev]);
    setLoading(false);
    return newDecision;
  };

  const reanalyzeDecision = async (id: string): Promise<DecisionAnalysis | null> => {
    const target = decisions.find((d) => d.id === id);
    if (!target) return null;

    setLoading(true);
    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: target.title,
          context: target.context,
          priorities: target.priorities,
          concerns: target.concerns,
          assumptionsPrompt: target.initialAssumptions,
          previousOutcomesSummary: getHistoricalPatternsSummary(),
        }),
      });

      if (response.ok) {
        const data: DecisionAnalysis = await response.json();
        updateDecision(id, {
          analysis: data,
          confidence: data.confidenceEstimated || target.confidence,
        });
        setLoading(false);
        return data;
      }
    } catch (err) {
      console.error('Error reanalyzing decision:', err);
    }
    setLoading(false);
    return null;
  };

  const submitOutcomeReview = async (
    id: string,
    inputs: { actualOutcome: string; whatGotRight: string; whatGotWrong: string }
  ): Promise<OutcomeReviewData> => {
    const target = decisions.find((d) => d.id === id);
    if (!target) throw new Error('Decision not found');

    const response = await fetch('/api/review-outcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        decisionTitle: target.title,
        context: target.context,
        initialConfidence: target.confidence,
        initialAssumptions: target.analysis?.assumptions.map((a) => a.assumption) || [],
        actualOutcome: inputs.actualOutcome,
        whatGotRight: inputs.whatGotRight,
        whatGotWrong: inputs.whatGotWrong,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate outcome review');
    }

    const reviewData = await response.json();
    const outcomeResult: OutcomeReviewData = {
      actualOutcome: inputs.actualOutcome,
      whatGotRight: inputs.whatGotRight,
      whatGotWrong: inputs.whatGotWrong,
      reviewedAt: new Date().toISOString(),
      predictionCalibration: reviewData.predictionCalibration || 'Well-Calibrated',
      actualOutcomeAssessment: reviewData.actualOutcomeAssessment || 'Positive',
      whatYouPredictedWell: reviewData.whatYouPredictedWell,
      whatYouMissed: reviewData.whatYouMissed,
      newPattern: reviewData.newPattern,
      calibrationScore: reviewData.calibrationScore || 75,
    };

    updateDecision(id, {
      outcome: outcomeResult,
      status: 'decided',
    });

    return outcomeResult;
  };

  return (
    <DecisionContext.Provider
      value={{
        decisions,
        loading,
        createDecisionWithAnalysis,
        reanalyzeDecision,
        updateDecision,
        deleteDecision,
        submitOutcomeReview,
        resetToSeeds,
      }}
    >
      {children}
    </DecisionContext.Provider>
  );
};

export const useDecisions = () => {
  const context = useContext(DecisionContext);
  if (!context) {
    throw new Error('useDecisions must be used within a DecisionProvider');
  }
  return context;
};
