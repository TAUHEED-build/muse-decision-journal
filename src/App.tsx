import React, { useState } from 'react';
import { DecisionProvider, useDecisions } from './context/DecisionContext';
import { Navigation, ActiveTab } from './components/Navigation';
import { LandingHome } from './components/LandingHome';
import { DecisionsListView } from './components/DecisionsListView';
import { NewDecisionView } from './components/NewDecisionView';
import { DecisionDetailView } from './components/DecisionDetailView';
import { InsightsView } from './components/InsightsView';
import { OutcomeReviewModal } from './components/OutcomeReviewModal';
import { DecisionStatus } from './types/decision';
import { RotateCcw } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    decisions,
    loading,
    createDecisionWithAnalysis,
    reanalyzeDecision,
    updateDecision,
    deleteDecision,
    submitOutcomeReview,
    resetToSeeds,
  } = useDecisions();

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [initialNewTitle, setInitialNewTitle] = useState('');
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [outcomeDecisionId, setOutcomeDecisionId] = useState<string | null>(null);

  const selectedDecision = decisions.find((d) => d.id === selectedDecisionId) || null;
  const outcomeDecision = decisions.find((d) => d.id === outcomeDecisionId) || null;

  const handleStartThinking = (initialQuestion: string) => {
    setInitialNewTitle(initialQuestion);
    setSelectedDecisionId(null);
    setActiveTab('new-decision');
  };

  const handleSelectDecision = (id: string) => {
    setSelectedDecisionId(id);
  };

  const handleBackFromDetail = () => {
    setSelectedDecisionId(null);
    if (activeTab === 'new-decision') {
      setActiveTab('decisions');
    }
  };

  const handleCreateDecision = async (data: {
    title: string;
    context: string;
    priorities: string[];
    concerns: string;
    assumptionsPrompt?: string;
  }) => {
    const created = await createDecisionWithAnalysis(data);
    setSelectedDecisionId(created.id);
    setActiveTab('decisions');
    setInitialNewTitle('');
  };

  const handleOpenOutcomeReview = (id: string) => {
    setOutcomeDecisionId(id);
    setIsOutcomeModalOpen(true);
  };

  const handleUpdateStatus = (id: string, status: DecisionStatus) => {
    updateDecision(id, { status });
  };

  const handleUpdateConfidence = (id: string, confidence: number) => {
    updateDecision(id, { confidence });
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    updateDecision(id, { reflectionNotes: notes });
  };

  const handleDeleteDecision = (id: string) => {
    deleteDecision(id);
    if (selectedDecisionId === id) {
      setSelectedDecisionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1E1E1C] flex flex-col font-sans">
      {/* Sticky Navigation */}
      <Navigation
        activeTab={selectedDecisionId ? 'decisions' : activeTab}
        setActiveTab={(tab) => {
          setSelectedDecisionId(null);
          setActiveTab(tab);
        }}
        onNewDecision={() => {
          setSelectedDecisionId(null);
          setInitialNewTitle('');
          setActiveTab('new-decision');
        }}
        decisionsCount={decisions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedDecision ? (
          <DecisionDetailView
            decision={selectedDecision}
            onBack={handleBackFromDetail}
            onUpdateStatus={handleUpdateStatus}
            onUpdateConfidence={handleUpdateConfidence}
            onUpdateNotes={handleUpdateNotes}
            onReanalyze={async (id) => {
              await reanalyzeDecision(id);
            }}
            onOpenOutcomeReview={handleOpenOutcomeReview}
            onDelete={handleDeleteDecision}
          />
        ) : activeTab === 'new-decision' ? (
          <NewDecisionView
            initialTitle={initialNewTitle}
            onCancel={() => setActiveTab('home')}
            onSubmit={handleCreateDecision}
            isAnalyzing={loading}
          />
        ) : activeTab === 'decisions' ? (
          <DecisionsListView
            decisions={decisions}
            onSelectDecision={handleSelectDecision}
            onNewDecision={() => {
              setInitialNewTitle('');
              setActiveTab('new-decision');
            }}
          />
        ) : activeTab === 'insights' ? (
          <InsightsView
            decisions={decisions}
            onSelectDecision={handleSelectDecision}
            onNewDecision={() => {
              setInitialNewTitle('');
              setActiveTab('new-decision');
            }}
          />
        ) : (
          <LandingHome
            onStartThinking={handleStartThinking}
            onSelectDecision={handleSelectDecision}
            recentDecisions={decisions}
            onViewAllDecisions={() => setActiveTab('decisions')}
          />
        )}
      </main>

      {/* Outcome Review Modal */}
      {isOutcomeModalOpen && outcomeDecision && (
        <OutcomeReviewModal
          decision={outcomeDecision}
          onClose={() => {
            setIsOutcomeModalOpen(false);
            setOutcomeDecisionId(null);
          }}
          onSubmitReview={async (inputs) => {
            return await submitOutcomeReview(outcomeDecision.id, inputs);
          }}
        />
      )}

      {/* Understated Minimal Footer */}
      <footer className="border-t border-[#E8E8E1] py-6 px-4 sm:px-6 mt-16 bg-[#F8F8F5]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#7F7F74] gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-editorial text-sm font-normal text-[#1C1C1A]">MUSE</span>
            <span>—</span>
            <span>Intellectual sparring for crucial choices.</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (confirm('Reset your journal with the sample seed decisions?')) {
                  resetToSeeds();
                  setSelectedDecisionId(null);
                  setActiveTab('home');
                }
              }}
              className="inline-flex items-center space-x-1 text-[#78786F] hover:text-[#1C1C1A] transition-colors"
              title="Reset journal with realistic sample entries"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
            <span>•</span>
            <span>Private local storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <DecisionProvider>
      <AppContent />
    </DecisionProvider>
  );
}
