import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  Copy,
  Trash2,
  Sparkles,
  Sliders,
  Check,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Decision, DecisionStatus } from '../types/decision';

interface DecisionDetailViewProps {
  decision: Decision;
  onBack: () => void;
  onUpdateStatus: (id: string, status: DecisionStatus) => void;
  onUpdateConfidence: (id: string, confidence: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onReanalyze: (id: string) => Promise<void>;
  onOpenOutcomeReview: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DecisionDetailView: React.FC<DecisionDetailViewProps> = ({
  decision,
  onBack,
  onUpdateStatus,
  onUpdateConfidence,
  onUpdateNotes,
  onReanalyze,
  onOpenOutcomeReview,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [notes, setNotes] = useState(decision.reflectionNotes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [isEditingConfidence, setIsEditingConfidence] = useState(false);
  const [confidenceValue, setConfidenceValue] = useState(decision.confidence);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const handleConfidenceChange = (val: number) => {
    setConfidenceValue(val);
    onUpdateConfidence(decision.id, val);
  };

  const handleNotesBlur = () => {
    onUpdateNotes(decision.id, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    await onReanalyze(decision.id);
    setIsReanalyzing(false);
  };

  const handleCopyMarkdown = () => {
    const text = `# ${decision.title}
Date: ${formatDate(decision.createdAt)}
Status: ${decision.status.toUpperCase()}
Confidence: ${decision.confidence}%

## What You Seem to Believe
${decision.analysis?.coreBelief || ''}

## Assumptions & Sparring
${decision.analysis?.assumptions
  .map(
    (a) => `### Assumption: ${a.assumption}
- Challenge: ${a.challenge}
- Counterpoint: ${a.counterpoint}
- Evidence Needed: ${a.evidenceNeeded}
`
  )
  .join('\n')}

## Options
${decision.analysis?.options
  .map(
    (o, i) => `${i + 1}. **${o.name}**
   - Upside: ${o.upside}
   - Downside: ${o.downside}
   - Unknown: ${o.unknown}
`
  )
  .join('\n')}

## MUSE's Take
${decision.analysis?.museTake.summary || ''}
${decision.analysis?.museTake.reasoning || ''}
**Next Step:** ${decision.analysis?.museTake.recommendedNextStep || ''}

${decision.outcome ? `## Outcome Review
Calibration: ${decision.outcome.predictionCalibration}
Outcome Assessment: ${decision.outcome.actualOutcomeAssessment}
New Pattern: ${decision.outcome.newPattern}` : ''}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const analysis = decision.analysis;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 text-left space-y-12">
      {/* Top Bar: Back & Utility Actions */}
      <div className="flex items-center justify-between border-b border-[#ECECE6] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs text-[#73736B] hover:text-[#1D1D1B] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>All Decisions</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMarkdown}
            className="p-1.5 text-[#73736B] hover:text-[#1D1D1B] hover:bg-[#F2F2EC] rounded-md transition-colors text-xs inline-flex items-center space-x-1"
            title="Copy as Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{copied ? 'Copied' : 'Export'}</span>
          </button>

          <button
            onClick={handleReanalyze}
            disabled={isReanalyzing}
            className="p-1.5 text-[#73736B] hover:text-[#1D1D1B] hover:bg-[#F2F2EC] rounded-md transition-colors text-xs inline-flex items-center space-x-1"
            title="Re-run analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline text-[11px]">Re-evaluate</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this decision?')) {
                onDelete(decision.id);
              }
            }}
            className="p-1.5 text-[#919188] hover:text-red-700 hover:bg-red-50 rounded-md transition-colors text-xs"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Header: Title & Meta */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7D7D74]">
            Your Decision • {formatDate(decision.createdAt)}
          </span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-[#1B1B19] leading-[1.18] tracking-tight">
          {decision.title}
        </h1>

        {decision.context && (
          <p className="text-sm sm:text-base text-[#616159] leading-relaxed pt-1 max-w-2xl font-normal">
            {decision.context}
          </p>
        )}

        {/* Status & Confidence Controls */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#F0F0EA]">
          {/* Confidence Slider / Badge */}
          <div className="flex items-center space-x-3 bg-white border border-[#E5E5DE] px-3.5 py-1.5 rounded-lg shadow-2xs">
            <div className="flex items-center space-x-1.5 text-xs text-[#6A6A61]">
              <span>Confidence</span>
              <span className="font-mono font-medium text-[#1E1E1C] text-sm">
                {confidenceValue}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={confidenceValue}
              onChange={(e) => handleConfidenceChange(Number(e.target.value))}
              className="w-20 sm:w-28 accent-indigo-600 cursor-pointer h-1.5 bg-[#E6E6DF] rounded-lg"
              title="Drag to calibrate your subjective confidence"
            />
          </div>

          {/* Status Selector */}
          <div className="flex items-center space-x-1 bg-[#F1F1EB] p-1 rounded-lg">
            <button
              onClick={() => onUpdateStatus(decision.id, 'deciding')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                decision.status === 'deciding'
                  ? 'bg-white text-[#1C1C1A] shadow-2xs'
                  : 'text-[#6A6A61] hover:text-[#1C1C1A]'
              }`}
            >
              Still deciding
            </button>
            <button
              onClick={() => onUpdateStatus(decision.id, 'decided')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1 ${
                decision.status === 'decided'
                  ? 'bg-white text-[#1B6732] shadow-2xs'
                  : 'text-[#6A6A61] hover:text-[#1C1C1A]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Decided</span>
            </button>
            <button
              onClick={() => onUpdateStatus(decision.id, 'archived')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                decision.status === 'archived'
                  ? 'bg-white text-[#65655D] shadow-2xs'
                  : 'text-[#6A6A61] hover:text-[#1C1C1A]'
              }`}
            >
              Archived
            </button>
          </div>

          {/* Outcome CTA if decided */}
          {decision.status === 'decided' && !decision.outcome && (
            <button
              onClick={() => onOpenOutcomeReview(decision.id)}
              className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 text-indigo-900 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Record Outcome Review</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: WHAT YOU'RE OPTIMIZING FOR */}
      {analysis?.optimizingFor && analysis.optimizingFor.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7C7C73]">
            What You're Optimizing For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {analysis.optimizingFor.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E5E5DE] rounded-xl p-3.5 shadow-2xs space-y-1"
              >
                <span className="inline-block text-xs font-medium text-indigo-900 bg-indigo-50/80 px-2 py-0.5 rounded-md">
                  {item.tag}
                </span>
                <p className="text-xs text-[#63635C] leading-relaxed pt-0.5">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: WHAT YOU SEEM TO BELIEVE */}
      {analysis?.coreBelief && (
        <section className="bg-[#FAF9F5] border-l-2 border-indigo-600/70 p-5 rounded-r-xl space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-950">
            What You Seem to Believe
          </span>
          <p className="font-editorial text-lg sm:text-xl text-[#21211E] italic leading-relaxed">
            "{analysis.coreBelief}"
          </p>
        </section>
      )}

      {/* SECTION 3: WHAT MAY BE AN ASSUMPTION (The Intellectual Sparring Centerpiece) */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-[#ECECE6] pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7C7C73]">
            What May Be An Assumption
          </h2>
          <span className="text-[11px] text-[#8C8C82] italic">
            Intellectual Sparring
          </span>
        </div>

        <div className="space-y-4">
          {analysis?.assumptions.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E3E3DC] rounded-xl overflow-hidden shadow-2xs"
            >
              {/* Assumption statement */}
              <div className="p-4 sm:p-5 border-b border-[#F0F0EA] bg-[#FDFDFB]">
                <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-amber-900 font-semibold mb-1">
                  <span>Assumption {idx + 1}</span>
                </div>
                <p className="text-base text-[#1E1E1C] font-medium leading-snug">
                  "{item.assumption}"
                </p>
              </div>

              {/* Challenge, Counterpoint, Evidence Needed */}
              <div className="p-4 sm:p-5 space-y-4 text-xs">
                {/* Challenge */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#73736A]">
                    Challenge
                  </span>
                  <p className="text-[#353530] text-sm leading-relaxed font-normal">
                    {item.challenge}
                  </p>
                </div>

                {/* Counterpoint */}
                <div className="space-y-1 pt-1 border-t border-[#F5F5F0]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-950">
                    Counterpoint
                  </span>
                  <p className="text-[#4F4F47] text-xs leading-relaxed">
                    {item.counterpoint}
                  </p>
                </div>

                {/* Evidence Needed */}
                <div className="space-y-1 pt-1 border-t border-[#F5F5F0] bg-stone-50/70 p-3 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                    Evidence Needed
                  </span>
                  <p className="text-[#363630] text-xs leading-relaxed">
                    {item.evidenceNeeded}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: RISKS & UNKNOWNS */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7C7C73]">
          Risks & Missing Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Second-order Risks */}
          <div className="bg-white border border-[#E4E4DD] rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2 text-rose-900 text-xs font-semibold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
              <span>Second-Order Risks</span>
            </div>
            <ul className="space-y-2 text-xs text-[#52524A] leading-relaxed">
              {analysis?.risks.map((risk, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-rose-400 mt-1">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Unknowns */}
          <div className="bg-white border border-[#E4E4DD] rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2 text-indigo-900 text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-700" />
              <span>Critical Unknowns</span>
            </div>
            <ul className="space-y-2 text-xs text-[#52524A] leading-relaxed">
              {analysis?.unknowns.map((unknown, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>{unknown}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 5: OPTIONS & PATHWAYS */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7C7C73]">
          Options & Pathways
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis?.options.map((option, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E4E4DD] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#EAEAE3] text-[#474740] text-[11px] font-mono flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-[#1C1C1A] leading-snug">
                    {option.name}
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] font-medium text-emerald-800 uppercase tracking-wider block">
                      Upside
                    </span>
                    <p className="text-[#4E4E46] leading-relaxed mt-0.5">{option.upside}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium text-rose-800 uppercase tracking-wider block">
                      Downside
                    </span>
                    <p className="text-[#4E4E46] leading-relaxed mt-0.5">{option.downside}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium text-[#7C7C72] uppercase tracking-wider block">
                      Unknown
                    </span>
                    <p className="text-[#595950] leading-relaxed mt-0.5">{option.unknown}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: MUSE'S TAKE */}
      <section className="bg-[#FAF9F5] border border-[#E6E6DE] rounded-2xl p-5 sm:p-7 space-y-5">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-900 font-semibold">
            Synthesis & Perspective
          </span>
          <h2 className="font-editorial text-2xl text-[#1E1E1C] font-normal">
            MUSE's Take
          </h2>
        </div>

        <p className="text-base text-[#2E2E2A] leading-relaxed font-normal">
          {analysis?.museTake.summary}
        </p>

        <p className="text-xs sm:text-sm text-[#5B5B52] leading-relaxed">
          {analysis?.museTake.reasoning}
        </p>

        {analysis?.museTake.recommendedNextStep && (
          <div className="pt-3 border-t border-[#EAEAE2] flex items-start space-x-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-950 shrink-0 mt-0.5">
              Recommended Next Step:
            </span>
            <p className="text-xs sm:text-sm text-[#242421] font-medium leading-relaxed">
              {analysis.museTake.recommendedNextStep}
            </p>
          </div>
        )}
      </section>

      {/* SECTION 7: OUTCOME REVIEW (If completed or prompt to complete) */}
      {decision.outcome ? (
        <section className="bg-white border border-[#DFDFD6] rounded-2xl p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECECE6] pb-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-800 font-semibold">
                Historical Calibration
              </span>
              <h2 className="font-editorial text-2xl text-[#1E1E1C]">
                Outcome Review
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#EBF7EE] text-[#1E6B35] font-medium">
                Prediction: {decision.outcome.predictionCalibration}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F3F3ED] text-[#47473F] font-medium">
                Outcome: {decision.outcome.actualOutcomeAssessment}
              </span>
            </div>
          </div>

          {/* What happened */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#484841] uppercase tracking-wider">
              What Actually Happened
            </span>
            <p className="text-sm text-[#2E2E2A] leading-relaxed bg-[#FAF9F6] p-3.5 rounded-xl border border-[#EDEDE6]">
              {decision.outcome.actualOutcome}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                What You Predicted Well
              </span>
              <p className="text-xs text-[#4A4A42] leading-relaxed">
                {decision.outcome.whatYouPredictedWell}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                What You Missed
              </span>
              <p className="text-xs text-[#4A4A42] leading-relaxed">
                {decision.outcome.whatYouMissed}
              </p>
            </div>
          </div>

          {/* Discovered Pattern */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-900 font-semibold">
              Discovered Behavioral Rule / Pattern
            </span>
            <p className="font-editorial italic text-base text-indigo-950">
              "{decision.outcome.newPattern}"
            </p>
          </div>
        </section>
      ) : (
        <section className="bg-[#FAF9F6] border border-[#E9E9E2] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#242421]">
              Has this decision reached an outcome?
            </h3>
            <p className="text-xs text-[#6E6E65]">
              Documenting what actually occurred calibrates your personal judgment against future overconfidence.
            </p>
          </div>
          <button
            onClick={() => onOpenOutcomeReview(decision.id)}
            className="shrink-0 bg-[#292926] hover:bg-[#1A1A18] text-white px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer active:scale-98"
          >
            Review Outcome →
          </button>
        </section>
      )}

      {/* SECTION 8: REFLECTIONS & JOURNAL SCRATCHPAD */}
      <section className="space-y-2.5 pt-4 border-t border-[#ECECE6]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-widest text-[#7C7C73]">
            Personal Reflections & Working Notes
          </label>
          {notesSaved && (
            <span className="text-xs text-emerald-600 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Saved</span>
            </span>
          )}
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          placeholder="Jot down evolving reflections, conversations, or intermediate tests as this decision unfolds..."
          className="w-full text-xs sm:text-sm text-[#1C1C1A] placeholder-[#9D9D93] bg-white border border-[#DFDFD8] rounded-xl p-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 shadow-2xs"
        />
      </section>
    </div>
  );
};
