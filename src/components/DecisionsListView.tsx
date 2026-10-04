import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Plus, Filter, Sparkles, BookOpen } from 'lucide-react';
import { Decision, DecisionStatus } from '../types/decision';

interface DecisionsListViewProps {
  decisions: Decision[];
  onSelectDecision: (id: string) => void;
  onNewDecision: () => void;
}

export const DecisionsListView: React.FC<DecisionsListViewProps> = ({
  decisions,
  onSelectDecision,
  onNewDecision,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | DecisionStatus | 'reviewed'>('all');

  const filteredDecisions = decisions.filter((d) => {
    const matchesQuery =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.priorities.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'reviewed') return Boolean(d.outcome);
    return d.status === filterStatus;
  });

  const formatTimelineDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d
        .toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
        })
        .toUpperCase();
    } catch {
      return 'RECENT';
    }
  };

  const formatFullYear = (isoString: string) => {
    try {
      return new Date(isoString).getFullYear();
    } catch {
      return '2026';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 text-left space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E8E1] pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7D7D74]">
            Archive & Retrospectives
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1B1B19] mt-1 font-normal">
            Decision Journal
          </h1>
          <p className="text-xs text-[#73736A] mt-1">
            Track reasoning across time and review how hypotheses held up against reality.
          </p>
        </div>

        <button
          onClick={onNewDecision}
          className="inline-flex items-center space-x-1.5 bg-[#2B2B28] hover:bg-[#151513] text-white px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide shadow-xs transition-all cursor-pointer self-start sm:self-auto active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Decision</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E85]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords or values..."
            className="w-full text-xs text-[#1C1C1A] placeholder-[#9D9D93] bg-white border border-[#DFDFD7] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 shadow-2xs"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'deciding', 'decided', 'reviewed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium tracking-wide whitespace-nowrap transition-colors capitalize ${
                filterStatus === filter
                  ? 'bg-[#292926] text-white shadow-2xs'
                  : 'bg-[#F1F1EB] text-[#5C5C54] hover:bg-[#E7E7E0] hover:text-[#1C1C1A]'
              }`}
            >
              {filter === 'deciding' ? 'Still Deciding' : filter === 'reviewed' ? 'Reviewed' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredDecisions.length === 0 ? (
          <div className="bg-white border border-[#E9E9E2] rounded-xl p-10 text-center space-y-3">
            <BookOpen className="w-6 h-6 text-[#9A9A90] mx-auto" />
            <p className="text-sm text-[#73736A]">
              No decisions found matching your filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="text-xs text-indigo-700 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredDecisions.map((dec) => (
            <div
              key={dec.id}
              onClick={() => onSelectDecision(dec.id)}
              className="group bg-white border border-[#E4E4DE] hover:border-[#CBCBC2] rounded-xl p-5 transition-all shadow-2xs hover:shadow-xs cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Date & Title */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider text-[#8A8A80]">
                  <span className="font-semibold text-[#5A5A52]">
                    {formatTimelineDate(dec.createdAt)}
                  </span>
                  <span>{formatFullYear(dec.createdAt)}</span>
                  <span>•</span>
                  <span>Confidence {dec.confidence}%</span>
                </div>

                <h3 className="text-base sm:text-lg font-medium text-[#1E1E1C] group-hover:text-indigo-900 transition-colors leading-snug">
                  {dec.title}
                </h3>

                {dec.analysis?.coreBelief ? (
                  <p className="text-xs text-[#707067] font-editorial italic line-clamp-1">
                    "{dec.analysis.coreBelief}"
                  </p>
                ) : (
                  <p className="text-xs text-[#75756C] line-clamp-1">{dec.context}</p>
                )}

                {/* Priority tags */}
                {dec.priorities && dec.priorities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dec.priorities.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-[#F4F4F0] text-[#63635C] px-2 py-0.5 rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status and Badges */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    dec.status === 'decided'
                      ? 'bg-[#EBF7EE] text-[#1E6B35]'
                      : dec.status === 'archived'
                      ? 'bg-[#F2F2EC] text-[#6B6B62]'
                      : 'bg-[#F4F3EF] text-[#47473F]'
                  }`}
                >
                  {dec.status === 'decided' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Decided</span>
                    </>
                  ) : dec.status === 'archived' ? (
                    <span>Archived</span>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-[#707067]" />
                      <span>Deciding</span>
                    </>
                  )}
                </span>

                {dec.outcome && (
                  <span className="inline-flex items-center space-x-1 text-[11px] bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md font-medium">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                    <span>Outcome Reviewed</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
