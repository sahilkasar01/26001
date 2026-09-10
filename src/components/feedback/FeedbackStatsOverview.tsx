import React from 'react';
import { FeedbackSummaryStats, FeedbackRating } from '../../types/feedback';
import { 
  Star, 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  MessageSquareQuote, 
  Plus, 
  ShieldAlert, 
  BarChart3,
  HeartHandshake
} from 'lucide-react';

interface FeedbackStatsOverviewProps {
  stats: FeedbackSummaryStats;
  onOpenSubmitModal: () => void;
  activeRoleFilter?: string;
  onSelectRoleFilter?: (role: string) => void;
}

export const FeedbackStatsOverview: React.FC<FeedbackStatsOverviewProps> = ({
  stats,
  onOpenSubmitModal,
  activeRoleFilter,
  onSelectRoleFilter
}) => {
  const starsArray: FeedbackRating[] = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white border border-stone-300 shadow-xs p-4 sm:p-5">
      {/* Top Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-50 border border-amber-200 text-amber-900">
              <MessageSquareQuote className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                Stakeholder Feedback &amp; Field Sentiment Observatory
              </h2>
              <p className="text-xs text-stone-600">
                Centralized transparent registry of farmer grievances, site engineer reports, and revenue officer feedback
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSubmitModal}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs py-2 px-3.5 shadow-xs transition flex items-center justify-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-stone-950" />
          <span>Submit Your Feedback</span>
        </button>
      </div>

      {/* Grid of Key Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {/* Card 1: Overall Average Rating */}
        <div className="p-3.5 bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block mb-1">
              Overall Satisfaction Index
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-serif text-stone-900">
                {stats.averageRating}
              </span>
              <span className="text-stone-500 font-mono text-xs">/ 5.0</span>
            </div>

            <div className="flex items-center space-x-1 my-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(stats.averageRating)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-stone-600 mt-1">
              Based on {stats.totalCount} verified stakeholder submissions
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-200 text-[11px] flex items-center justify-between font-mono">
            <span className="text-stone-500">Favorable Ratio:</span>
            <span className="font-bold text-emerald-700">{stats.positivePercentage}%</span>
          </div>
        </div>

        {/* Card 2: Rating Distribution Breakdown */}
        <div className="p-3.5 bg-stone-50 border border-stone-200 space-y-1.5">
          <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block mb-1">
            Star Distribution
          </span>
          {starsArray.map((star) => {
            const count = stats.ratingDistribution[star] || 0;
            const pct = stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
            return (
              <div key={star} className="flex items-center space-x-2 text-[11px]">
                <span className="w-6 font-mono text-stone-600 flex items-center gap-0.5">
                  {star} <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500 inline" />
                </span>
                <div className="flex-1 bg-stone-200 h-2 rounded-xs overflow-hidden">
                  <div
                    className={`h-full ${
                      star >= 4 ? 'bg-emerald-600' : star === 3 ? 'bg-amber-500' : 'bg-red-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-7 text-right font-mono text-stone-500">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Card 3: Role Representation */}
        <div className="p-3.5 bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block mb-2">
              Stakeholder Role Breakdown
            </span>
            <div className="space-y-1.5">
              {Object.entries(stats.roleDistribution).map(([role, count]) => {
                const isSelected = activeRoleFilter === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onSelectRoleFilter && onSelectRoleFilter(isSelected ? 'ALL' : role)}
                    className={`w-full flex items-center justify-between p-1 px-1.5 transition text-left border ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 font-bold text-amber-950'
                        : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span className="truncate text-[11px]">{role}</span>
                    <span className="font-mono text-[10px] bg-stone-100 px-1 py-0.2 border border-stone-200">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-stone-200 text-[10px] text-stone-600 italic">
            Click any role to isolate their feedback entries
          </div>
        </div>

        {/* Card 4: Action & Resolution Health */}
        <div className="p-3.5 bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block mb-2">
              Action &amp; Resolution Pacing
            </span>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-stone-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Resolved Issues
                  </span>
                  <span className="font-bold font-mono text-emerald-800">
                    {stats.resolvedCount} ({stats.totalCount > 0 ? Math.round((stats.resolvedCount / stats.totalCount) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-1.5">
                  <div
                    className="bg-emerald-600 h-full"
                    style={{ width: `${stats.totalCount > 0 ? (stats.resolvedCount / stats.totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-stone-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    Action Planned
                  </span>
                  <span className="font-bold font-mono text-amber-900">
                    {stats.actionPlannedCount} ({stats.totalCount > 0 ? Math.round((stats.actionPlannedCount / stats.totalCount) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-1.5">
                  <div
                    className="bg-amber-600 h-full"
                    style={{ width: `${stats.totalCount > 0 ? (stats.actionPlannedCount / stats.totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-stone-600 flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-stone-600" />
                    Pending / Under Review
                  </span>
                  <span className="font-bold font-mono text-stone-800">
                    {stats.totalCount - stats.resolvedCount - stats.actionPlannedCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
            <span className="text-stone-500 font-mono">Response SLA:</span>
            <span className="font-mono font-bold text-stone-800">Avg 48 hrs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
