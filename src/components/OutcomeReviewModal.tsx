import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Decision, OutcomeReviewData } from '../types/decision';

interface OutcomeReviewModalProps {
  decision: Decision;
  onClose: () => void;
  onSubmitReview: (inputs: {
    actualOutcome: string;
    whatGotRight: string;
    whatGotWrong: string;
  }) => Promise<OutcomeReviewData>;
}

export const OutcomeReviewModal: React.FC<OutcomeReviewModalProps> = ({
  decision,
  onClose,
  onSubmitReview,
}) => {
  const [actualOutcome, setActualOutcome] = useState('');
  const [whatGotRight, setWhatGotRight] = useState('');
  const [whatGotWrong, setWhatGotWrong] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewResult, setReviewResult] = useState<OutcomeReviewData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualOutcome.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmitReview({
        actualOutcome: actualOutcome.trim(),
        whatGotRight: whatGotRight.trim(),
        whatGotWrong: whatGotWrong.trim(),
      });
      setReviewResult(result);
    } catch (err) {
      console.error('Error submitting outcome review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FAF9F6] border border-[#E3E3DC] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl text-left p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E8E8E1] pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-900 font-medium">
              Decision Retrospective
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#1B1B19] font-normal">
              Review Outcome
            </h2>
            <p className="text-xs text-[#707067] line-clamp-1 italic font-editorial">
              "{decision.title}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {reviewResult ? (
          /* Result View */
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Outcome Calibrated
              </span>
              <p className="text-xs text-emerald-950 leading-relaxed">
                Your retrospective has been analyzed and integrated into your personal calibration insights.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs bg-white p-3.5 rounded-xl border border-[#E5E5DE]">
                <span className="text-[#696960]">Prediction Calibration:</span>
                <span className="font-medium text-[#1E1E1C]">
                  {reviewResult.predictionCalibration}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs bg-white p-3.5 rounded-xl border border-[#E5E5DE]">
                <span className="text-[#696960]">Actual Outcome Assessment:</span>
                <span className="font-medium text-[#1E1E1C]">
                  {reviewResult.actualOutcomeAssessment}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E5E5DE] space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  What You Predicted Well
                </span>
                <p className="text-xs text-[#3E3E37] leading-relaxed">
                  {reviewResult.whatYouPredictedWell}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E5E5DE] space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                  What You Missed
                </span>
                <p className="text-xs text-[#3E3E37] leading-relaxed">
                  {reviewResult.whatYouMissed}
                </p>
              </div>

              <div className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-xl space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-900 font-semibold">
                  Discovered Behavioral Rule / Pattern
                </span>
                <p className="font-editorial italic text-base text-indigo-950 leading-relaxed">
                  "{reviewResult.newPattern}"
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={onClose}
                className="bg-[#242421] hover:bg-[#141412] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-wide shadow-xs"
              >
                Close & View Decision
              </button>
            </div>
          </div>
        ) : isSubmitting ? (
          /* Loading State */
          <div className="py-16 text-center space-y-4">
            <div className="inline-block p-3 rounded-full bg-indigo-50 text-indigo-700 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-xl text-[#1E1E1C]">
                Synthesizing Decision Retrospective...
              </h3>
              <p className="text-xs text-[#707067]">
                Evaluating prediction calibration against empirical outcome.
              </p>
            </div>
          </div>
        ) : (
          /* Form Input View */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#35352F]">
                What actually happened? <span className="text-stone-400 font-normal">*</span>
              </label>
              <p className="text-[11px] text-[#7A7A71]">
                Describe the concrete result, timeline, and any unexpected developments.
              </p>
              <textarea
                required
                rows={3}
                value={actualOutcome}
                onChange={(e) => setActualOutcome(e.target.value)}
                placeholder="e.g. Accepted the client offer; the work was straightforward, but communication overhead exceeded our estimated hours..."
                className="w-full text-xs sm:text-sm text-[#1C1C1A] placeholder-[#9E9E94] bg-white border border-[#DFDFD7] rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#35352F]">
                What did you get right?
              </label>
              <p className="text-[11px] text-[#7A7A71]">
                Which initial assumptions or predictions proved accurate?
              </p>
              <textarea
                rows={2}
                value={whatGotRight}
                onChange={(e) => setWhatGotRight(e.target.value)}
                placeholder="e.g. The financial buffer was exact, and my estimate of technical complexity was on target..."
                className="w-full text-xs sm:text-sm text-[#1C1C1A] placeholder-[#9E9E94] bg-white border border-[#DFDFD7] rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#35352F]">
                What did you get wrong?
              </label>
              <p className="text-[11px] text-[#7A7A71]">
                Where did reality surprise you or where did you experience friction?
              </p>
              <textarea
                rows={2}
                value={whatGotWrong}
                onChange={(e) => setWhatGotWrong(e.target.value)}
                placeholder="e.g. I assumed I would have energy to code in the evenings, but context-switching drained my focus..."
                className="w-full text-xs sm:text-sm text-[#1C1C1A] placeholder-[#9E9E94] bg-white border border-[#DFDFD7] rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 shadow-2xs"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E8E8E1]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#65655C] hover:text-[#1F1F1D]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!actualOutcome.trim()}
                className="inline-flex items-center space-x-2 bg-[#252522] hover:bg-[#141412] disabled:bg-[#D5D5CE] text-white px-5 py-2.5 rounded-lg text-xs font-medium tracking-wide shadow-xs transition-all cursor-pointer"
              >
                <span>Synthesize Retrospective</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
