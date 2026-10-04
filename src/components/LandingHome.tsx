import React, { useState } from 'react';
import { ArrowRight, Compass, ShieldAlert, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Decision } from '../types/decision';

interface LandingHomeProps {
  onStartThinking: (initialQuestion: string) => void;
  onSelectDecision: (id: string) => void;
  recentDecisions: Decision[];
  onViewAllDecisions: () => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({
  onStartThinking,
  onSelectDecision,
  recentDecisions,
  onViewAllDecisions,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onStartThinking(query.trim());
    }
  };

  const samplePrompts = [
    'Should I walk away from my current client?',
    'Should I launch my product now or polish it for 30 more days?',
    'Should I relocate to another city for creative momentum?',
  ];

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F2F2EC] text-[#55554D] text-xs font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
          <span>Intellectual Sparring for Crucial Choices</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl font-normal text-[#1A1A18] tracking-tight leading-[1.12]">
          Think clearly.
          <br />
          <span className="italic text-[#3B3A36]">Decide deliberately.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#616159] max-w-xl mx-auto leading-relaxed font-normal">
          MUSE helps you examine important decisions, challenge your assumptions, and learn from the
          outcomes over time.
        </p>

        {/* Large Focused Input Card */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white border border-[#E4E4DE] rounded-2xl p-2 sm:p-2.5 shadow-sm transition-all focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-100"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 px-3 py-2 text-left">
              <label
                htmlFor="decision-input"
                className="block text-[11px] uppercase tracking-wider text-[#8A8A80] font-medium mb-1"
              >
                What are you trying to decide?
              </label>
              <input
                id="decision-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="I'm thinking about whether I should…"
                className="w-full text-base sm:text-lg text-[#1C1C1A] placeholder-[#9C9C92] bg-transparent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!query.trim()}
              className="inline-flex items-center justify-center space-x-2 bg-[#1F1F1D] hover:bg-[#0F0F0E] disabled:bg-[#D4D4CD] disabled:text-[#8E8E85] text-white px-5 py-3 sm:py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all cursor-pointer active:scale-98"
            >
              <span>Start thinking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Sample prompt chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-[#8A8A80]">Or explore:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onStartThinking(prompt)}
              className="text-xs text-[#52524A] bg-[#F3F3ED] hover:bg-[#EBEBE4] hover:text-[#1F1F1D] px-2.5 py-1 rounded-md transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {/* Philosophy Callout: The Sparring Partner */}
      <section className="bg-[#FAF9F5] border border-[#ECECE6] rounded-xl p-5 sm:p-6 text-left">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-indigo-50/80 text-indigo-800 shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-editorial text-lg text-[#1F1F1D] font-normal tracking-tight">
              A counterweight to cognitive bias
            </h3>
            <p className="text-sm text-[#63635B] leading-relaxed">
              Most tools confirm what you want to hear. MUSE acts as an intellectual sparring partner:
              disentangling subjective beliefs from empirical evidence, revealing blind spots, and testing
              whether your confidence is grounded in reality.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Decisions Section */}
      <section className="space-y-4 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-[#EBEBE5]">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#78786E]">
            Recent Decisions
          </h2>
          <button
            onClick={onViewAllDecisions}
            className="text-xs font-medium text-[#4F46E5] hover:text-[#3730A3] hover:underline transition-colors"
          >
            View all decisions →
          </button>
        </div>

        <div className="divide-y divide-[#EFEFE9] border border-[#EAEAE4] rounded-xl bg-white overflow-hidden shadow-xs">
          {recentDecisions.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#7F7F75]">
              No decisions recorded yet. Start by writing your first query above.
            </div>
          ) : (
            recentDecisions.slice(0, 4).map((dec) => (
              <div
                key={dec.id}
                onClick={() => onSelectDecision(dec.id)}
                className="p-4 sm:p-5 hover:bg-[#F9F9F6] transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 pr-4">
                  <div className="flex items-center space-x-2 text-[11px] text-[#7F7F74]">
                    <span>{formatDate(dec.createdAt)}</span>
                    <span>•</span>
                    <span className="font-mono text-[#57574E]">
                      Confidence: {dec.confidence}%
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-[#1E1E1C] group-hover:text-indigo-900 transition-colors leading-snug">
                    {dec.title}
                  </h3>
                  {dec.analysis?.coreBelief && (
                    <p className="text-xs text-[#707066] line-clamp-1 italic font-editorial">
                      "{dec.analysis.coreBelief}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      dec.status === 'decided'
                        ? 'bg-[#EBF7EE] text-[#1E6B35]'
                        : dec.status === 'archived'
                        ? 'bg-[#F0F0EA] text-[#69695F]'
                        : 'bg-[#F2F1ED] text-[#47473F]'
                    }`}
                  >
                    {dec.status === 'decided' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Decided</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-[#707067]" />
                        <span>Still deciding</span>
                      </>
                    )}
                  </span>
                  {dec.outcome && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                      Reviewed
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Calm Footnote */}
      <footer className="text-center pt-8 border-t border-[#EAEAE4]">
        <blockquote className="font-editorial text-sm italic text-[#78786F] max-w-lg mx-auto leading-relaxed">
          “A decision is not judged solely by its outcome, but by the intellectual honesty of the reasoning
          that produced it.”
        </blockquote>
      </footer>
    </div>
  );
};
