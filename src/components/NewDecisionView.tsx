import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check, Info } from 'lucide-react';
import { PriorityTag } from '../types/decision';

interface NewDecisionViewProps {
  initialTitle?: string;
  onCancel: () => void;
  onSubmit: (data: {
    title: string;
    context: string;
    priorities: string[];
    concerns: string;
    assumptionsPrompt?: string;
  }) => Promise<void>;
  isAnalyzing: boolean;
}

const AVAILABLE_PRIORITIES: PriorityTag[] = [
  'Time',
  'Money',
  'Growth',
  'Relationships',
  'Learning',
  'Stability',
  'Freedom',
  'Health',
  'Focus',
  'Autonomy',
];

export const NewDecisionView: React.FC<NewDecisionViewProps> = ({
  initialTitle = '',
  onCancel,
  onSubmit,
  isAnalyzing,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [context, setContext] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['Growth', 'Time']);
  const [concerns, setConcerns] = useState('');
  const [assumptionsPrompt, setAssumptionsPrompt] = useState('');
  const [customPriority, setCustomPriority] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const togglePriority = (tag: string) => {
    if (selectedPriorities.includes(tag)) {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== tag));
    } else {
      setSelectedPriorities([...selectedPriorities, tag]);
    }
  };

  const addCustomPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPriority.trim() && !selectedPriorities.includes(customPriority.trim())) {
      setSelectedPriorities([...selectedPriorities, customPriority.trim()]);
      setCustomPriority('');
      setShowCustomInput(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isAnalyzing) return;

    await onSubmit({
      title: title.trim(),
      context: context.trim(),
      priorities: selectedPriorities,
      concerns: concerns.trim(),
      assumptionsPrompt: assumptionsPrompt.trim(),
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-14 text-left">
      {/* Back button */}
      <button
        onClick={onCancel}
        disabled={isAnalyzing}
        className="inline-flex items-center space-x-1.5 text-xs text-[#73736A] hover:text-[#1F1F1D] mb-8 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to journal</span>
      </button>

      {isAnalyzing ? (
        <div className="py-20 text-center space-y-6">
          <div className="inline-block p-4 rounded-full bg-[#F4F4EE] border border-[#E5E5DE] text-indigo-700 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1C]">
              Examining your reasoning...
            </h2>
            <p className="text-sm text-[#73736A] max-w-md mx-auto leading-relaxed">
              MUSE is identifying unstated assumptions, stress-testing counterarguments, and calculating
              balanced options.
            </p>
          </div>
          <div className="flex justify-center space-x-1.5 pt-4">
            <span className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="border-b border-[#E8E8E1] pb-4">
            <span className="text-[11px] uppercase tracking-widest text-indigo-900 font-medium">
              Entry / Clarification
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#1B1B19] mt-1 font-normal">
              Examine a Decision
            </h1>
            <p className="text-xs text-[#7A7A71] mt-1">
              Write candidly. MUSE treats your thoughts as a partner in dialogue, not a form to grade.
            </p>
          </div>

          {/* Section 1: What are you deciding? */}
          <div className="space-y-2.5">
            <label className="block text-sm font-medium text-[#2A2A26]">
              What are you deciding? <span className="text-stone-400 font-normal">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Should I leave my agency retainer to focus full-time on my bootstrapped software product?"
              className="w-full text-base sm:text-lg text-[#1C1C1A] placeholder-[#9B9B90] bg-white border border-[#DFDFD8] rounded-xl p-4 leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 shadow-2xs transition-all"
            />
          </div>

          {/* Section 2: What makes this difficult? */}
          <div className="space-y-2.5">
            <label className="block text-sm font-medium text-[#2A2A26]">
              What makes this difficult?
            </label>
            <p className="text-xs text-[#7B7B72]">
              Context, conflicting obligations, or recent friction that triggered this deliberation.
            </p>
            <textarea
              rows={4}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="The retainer provides $8k/mo guaranteed, but client demands are starting to bleed into evenings. I feel my indie project is stalling..."
              className="w-full text-sm sm:text-base text-[#1C1C1A] placeholder-[#9B9B90] bg-white border border-[#DFDFD8] rounded-xl p-4 leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 shadow-2xs transition-all"
            />
          </div>

          {/* Section 3: What matters most to you? */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#2A2A26]">
              What matters most to you?
            </label>
            <p className="text-xs text-[#7B7B72]">
              Select the core values you are optimizing for in this specific choice.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_PRIORITIES.map((tag) => {
                const isSelected = selectedPriorities.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => togglePriority(tag)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#292926] text-white shadow-2xs'
                        : 'bg-[#F1F1EB] text-[#52524B] hover:bg-[#E8E8E1] hover:text-[#1F1F1D]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-indigo-300" />}
                    <span>{tag}</span>
                  </button>
                );
              })}

              {/* Custom Priority addition */}
              {showCustomInput ? (
                <div className="inline-flex items-center space-x-1 bg-white border border-[#DCDCD5] rounded-lg px-2 py-1">
                  <input
                    type="text"
                    value={customPriority}
                    onChange={(e) => setCustomPriority(e.target.value)}
                    placeholder="Other value..."
                    className="text-xs text-[#1C1C1A] focus:outline-none w-24"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addCustomPriority}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="text-xs text-stone-400 hover:text-stone-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#6B6B63] border border-dashed border-[#D2D2CA] hover:border-[#A0A096] hover:text-[#1C1C1A] transition-colors"
                >
                  + Custom
                </button>
              )}
            </div>
          </div>

          {/* Section 4: What are you most worried about? */}
          <div className="space-y-2.5">
            <label className="block text-sm font-medium text-[#2A2A26]">
              What are you most worried about?
            </label>
            <p className="text-xs text-[#7B7B72]">
              The worst-case scenario, regret, or hidden vulnerability that gives you pause.
            </p>
            <textarea
              rows={3}
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder="Running out of savings within 6 months, having to scramble for emergency contracts, or realizing I was romanticizing solo founder life."
              className="w-full text-sm sm:text-base text-[#1C1C1A] placeholder-[#9B9B90] bg-white border border-[#DFDFD8] rounded-xl p-4 leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 shadow-2xs transition-all"
            />
          </div>

          {/* Section 5: Current assumptions (Optional / Sparring Primer) */}
          <div className="space-y-2.5 bg-[#FAF9F6] border border-[#E9E9E2] rounded-xl p-4 sm:p-5">
            <div className="flex items-center space-x-2 text-indigo-900">
              <Info className="w-4 h-4 text-indigo-700" />
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3C3C37]">
                Sparring Primer: What do you assume to be true? (Optional)
              </label>
            </div>
            <p className="text-xs text-[#6F6F66] leading-relaxed">
              If you already have a working hypothesis, state it here (e.g., “I believe users will pay $30/mo
              once I add authentication”). MUSE will specifically test the validity of this belief.
            </p>
            <input
              type="text"
              value={assumptionsPrompt}
              onChange={(e) => setAssumptionsPrompt(e.target.value)}
              placeholder="e.g. Quitting will instantly double my creative energy and free up 25 focus hours."
              className="w-full text-sm text-[#1C1C1A] placeholder-[#9B9B90] bg-white border border-[#DFDFD8] rounded-lg p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E8E1]">
            <span className="text-xs text-[#7F7F76]">
              Your decision is stored locally in your private journal.
            </span>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onCancel}
                className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-medium text-[#5F5F57] hover:text-[#1A1A18] hover:bg-[#F2F2EC] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="w-1/2 sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#21211E] hover:bg-[#0D0D0C] disabled:bg-[#D5D5CE] text-white px-6 py-2.5 rounded-lg text-xs font-medium tracking-wide shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <span>Analyze my thinking</span>
                <span className="text-indigo-300">→</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
