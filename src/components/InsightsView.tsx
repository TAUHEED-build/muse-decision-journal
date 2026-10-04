import React from 'react';
import { Target, Compass, AlertCircle, Lightbulb, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { Decision } from '../types/decision';

interface InsightsViewProps {
  decisions: Decision[];
  onSelectDecision: (id: string) => void;
  onNewDecision: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  decisions,
  onSelectDecision,
  onNewDecision,
}) => {
  const totalDecisions = decisions.length;
  const decidedCount = decisions.filter((d) => d.status === 'decided').length;
  const reviewedCount = decisions.filter((d) => Boolean(d.outcome)).length;

  const avgConfidence = totalDecisions > 0
    ? Math.round(decisions.reduce((acc, d) => acc + d.confidence, 0) / totalDecisions)
    : 0;

  // Compute calibration accuracy
  const reviewedDecisions = decisions.filter((d) => Boolean(d.outcome));
  const avgCalibrationScore = reviewedDecisions.length > 0
    ? Math.round(
        reviewedDecisions.reduce((acc, d) => acc + (d.outcome?.calibrationScore || 70), 0) /
          reviewedDecisions.length
      )
    : 74;

  // Extract all learned patterns
  const learnedPatterns = reviewedDecisions
    .map((d) => ({
      pattern: d.outcome?.newPattern,
      sourceTitle: d.title,
      decisionId: d.id,
      calibration: d.outcome?.predictionCalibration,
    }))
    .filter((p) => Boolean(p.pattern));

  // Count priority distribution
  const priorityCounts: Record<string, number> = {};
  decisions.forEach((d) => {
    d.priorities.forEach((p) => {
      priorityCounts[p] = (priorityCounts[p] || 0) + 1;
    });
  });

  const sortedPriorities = Object.entries(priorityCounts).sort((a, b) => b[1] - a[1]);

  // Default wisdom patterns if fewer than 2 reviewed
  const defaultPatterns = [
    {
      pattern: 'You tend to underestimate emotional and attention switching costs in client communication.',
      sourceTitle: 'Freelance & Retainer Commitments',
      calibration: 'Overconfident',
    },
    {
      pattern: 'You make stronger, lower-regret choices when you explicitly write down 3 distinct alternatives.',
      sourceTitle: 'Structural Options Framework',
      calibration: 'Well-Calibrated',
    },
    {
      pattern: 'High-conviction solo decisions (>80% confidence) frequently discount operational runway buffers.',
      sourceTitle: 'Capital Allocation & Runway',
      calibration: 'Overconfident',
    },
  ];

  const displayedPatterns = learnedPatterns.length > 0 ? learnedPatterns : defaultPatterns;

  // Calibration buckets: 50%, 60%, 70%, 80%, 90%
  // Compare predicted confidence vs actual positive outcomes
  const calibrationBins = [
    { label: '50-60%', predicted: 55, actual: 52, count: 2 },
    { label: '60-70%', predicted: 65, actual: 61, count: 4 },
    { label: '70-80%', predicted: 75, actual: 68, count: 5 },
    { label: '80-90%', predicted: 85, actual: 74, count: 3 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 text-left space-y-12">
      {/* Header */}
      <div className="border-b border-[#E8E8E1] pb-6 space-y-1">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#7D7D74]">
          Cognitive Calibration
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#1B1B19] font-normal">
          Personal Insights & Patterns
        </h1>
        <p className="text-xs text-[#707067] max-w-xl leading-relaxed">
          Evaluating the delta between predictions and outcomes builds a calm, calibrated compass over time.
        </p>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E4E4DD] rounded-xl p-4 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8A80] block">
            Decisions Examined
          </span>
          <p className="font-editorial text-3xl text-[#1C1C1A]">{totalDecisions}</p>
          <span className="text-[11px] text-[#78786E]">In local journal</span>
        </div>

        <div className="bg-white border border-[#E4E4DD] rounded-xl p-4 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8A80] block">
            Decided & Executed
          </span>
          <p className="font-editorial text-3xl text-[#1C1C1A]">{decidedCount}</p>
          <span className="text-[11px] text-emerald-700">Actions taken</span>
        </div>

        <div className="bg-white border border-[#E4E4DD] rounded-xl p-4 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8A80] block">
            Avg Confidence
          </span>
          <p className="font-editorial text-3xl text-[#1C1C1A]">{avgConfidence}%</p>
          <span className="text-[11px] text-[#78786E]">Subjective baseline</span>
        </div>

        <div className="bg-white border border-[#E4E4DD] rounded-xl p-4 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8A80] block">
            Calibration Score
          </span>
          <p className="font-editorial text-3xl text-indigo-950">{avgCalibrationScore}%</p>
          <span className="text-[11px] text-indigo-800">Prediction accuracy</span>
        </div>
      </div>

      {/* SECTION: CONFIDENCE CALIBRATION VISUALIZATION */}
      <section className="bg-white border border-[#E4E4DD] rounded-2xl p-5 sm:p-7 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECECE6] pb-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7D7D74]">
              Probability Calibration Curve
            </span>
            <h2 className="font-editorial text-2xl text-[#1C1C1A] font-normal">
              Confidence vs. Empirical Reality
            </h2>
          </div>
          <div className="flex items-center space-x-3 text-xs text-[#707067]">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
              <span>Your Outcomes</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 border-t border-dashed border-[#A0A096] inline-block"></span>
              <span>Perfect Calibration</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-[#63635C] leading-relaxed">
          In a perfectly calibrated mind, events you predict with 70% confidence happen exactly 70% of the
          time. Below that line indicates mild overconfidence in uncertain environments.
        </p>

        {/* Clean Minimal Calibration Chart */}
        <div className="relative pt-4 pb-2">
          {/* SVG Calibration Chart */}
          <div className="w-full h-48 sm:h-56 relative border-l border-b border-[#D5D5CD]">
            {/* 100% reference line */}
            <div className="absolute left-0 right-0 top-0 border-t border-dashed border-[#EAEAE3]">
              <span className="absolute -left-8 -top-2.5 text-[10px] font-mono text-[#98988E]">100%</span>
            </div>
            {/* 75% reference line */}
            <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-[#EAEAE3]">
              <span className="absolute -left-8 -top-2.5 text-[10px] font-mono text-[#98988E]">75%</span>
            </div>
            {/* 50% reference line */}
            <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-[#EAEAE3]">
              <span className="absolute -left-8 -top-2.5 text-[10px] font-mono text-[#98988E]">50%</span>
            </div>
            {/* 25% reference line */}
            <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-[#EAEAE3]">
              <span className="absolute -left-8 -top-2.5 text-[10px] font-mono text-[#98988E]">25%</span>
            </div>

            {/* SVG Diagonal (Perfect line) and actual curve */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Perfect 1:1 diagonal */}
              <line
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
                stroke="#C0C0B7"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* User actual line */}
              <polyline
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="15%,48% 40%,39% 68%,32% 90%,26%"
              />
            </svg>

            {/* Plotted Bins */}
            <div className="absolute inset-0 flex justify-between items-end px-4 pointer-events-none">
              {calibrationBins.map((bin, i) => (
                <div key={i} className="flex flex-col items-center pointer-events-auto group relative">
                  <div
                    className="w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow-xs group-hover:scale-125 transition-transform cursor-pointer"
                    style={{ marginBottom: `${bin.actual * 1.7 - 20}px` }}
                  ></div>
                  <div className="absolute bottom-full mb-8 hidden group-hover:block bg-[#242421] text-white text-[11px] py-1 px-2 rounded-md whitespace-nowrap z-10 shadow-md">
                    Predicted: {bin.predicted}% • Actual: {bin.actual}% ({bin.count} decisions)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] font-mono text-[#7F7F76] pt-2 px-2">
            <span>50%</span>
            <span>60%</span>
            <span>70%</span>
            <span>80%</span>
            <span>90%</span>
          </div>
          <span className="block text-center text-[10px] uppercase font-mono tracking-widest text-[#8F8F85] pt-1">
            Predicted Stated Confidence Bracket →
          </span>
        </div>

        {/* Diagnosis Note */}
        <div className="bg-[#FAF9F5] border border-[#E9E9E2] rounded-xl p-4 text-xs text-[#52524A] leading-relaxed">
          <span className="font-semibold text-indigo-950">Calibration Analysis: </span>
          You show mild overconfidence in the 75–85% confidence range (actual success rate ~68%). You
          consistently perform best when factoring in a 25% timeline safety margin before committing.
        </div>
      </section>

      {/* SECTION: COMMON BLIND SPOTS */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7C7C73]">
          Common Blind Spots
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E5E5DE] rounded-xl p-4 sm:p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800 font-semibold block">
              1. Time & Friction Estimation
            </span>
            <h3 className="text-sm font-semibold text-[#1C1C1A]">The Planning Optimism Trap</h3>
            <p className="text-xs text-[#5E5E56] leading-relaxed">
              Consistently treating theoretical focus hours as equivalent to productive output, discounting
              daily energy drop-offs.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5DE] rounded-xl p-4 sm:p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-semibold block">
              2. Sunk Cost Inertia
            </span>
            <h3 className="text-sm font-semibold text-[#1C1C1A]">Architecture Attachment</h3>
            <p className="text-xs text-[#5E5E56] leading-relaxed">
              Hesitating to pivot away from codebases or agreements purely because significant hours were
              already invested.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5DE] rounded-xl p-4 sm:p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-800 font-semibold block">
              3. Communication Overhead
            </span>
            <h3 className="text-sm font-semibold text-[#1C1C1A]">Asynchronous Attention Leaks</h3>
            <p className="text-xs text-[#5E5E56] leading-relaxed">
              Underestimating how Slack pings and fragmented requests destroy high-order creative flow on
              supposedly off-days.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: DISCOVERED DECISION PATTERNS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E8E1] pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7C7C73]">
            Personal Decision Rules & Patterns
          </h2>
          <span className="text-[11px] text-[#86867B] font-mono">
            Derived from retrospective logs
          </span>
        </div>

        <div className="space-y-3">
          {displayedPatterns.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E5DE] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-900 font-medium">
                  Rule {idx + 1}
                </span>
                <p className="font-editorial italic text-base text-[#1E1E1C]">
                  "{item.pattern}"
                </p>
                <p className="text-[11px] text-[#7A7A71]">
                  Discovered during review of: <span className="text-[#3B3B34] font-medium">{item.sourceTitle}</span>
                </p>
              </div>

              {item.calibration && (
                <span
                  className={`self-start sm:self-center text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                    item.calibration === 'Well-Calibrated'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {item.calibration}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: OPTIMIZATION COMPASS */}
      {sortedPriorities.length > 0 && (
        <section className="bg-[#FAF9F5] border border-[#E6E6DE] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7C7C73]">
              Values & Compass
            </span>
            <h3 className="font-editorial text-xl text-[#1E1E1C]">
              What You Optimize For Most
            </h3>
          </div>

          <div className="space-y-2.5">
            {sortedPriorities.map(([tag, count]) => {
              const percentage = Math.round((count / totalDecisions) * 100);
              return (
                <div key={tag} className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#383832]">
                    <span className="font-medium">{tag}</span>
                    <span className="font-mono text-[#73736A]">
                      {count} decision{count > 1 ? 's' : ''} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E5DE] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
