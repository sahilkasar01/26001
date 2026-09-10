import React, { useState } from 'react';
import { RecommendationItem, Parcel } from '../types';
import { Lightbulb, CheckCircle2, ArrowRight, ShieldCheck, Building2, Clock, IndianRupee, ArrowDown } from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

interface RecommendationsPageProps {
  recommendations: RecommendationItem[];
  parcels: Parcel[];
  onSelectParcel: (parcel: Parcel) => void;
  onNavigateToWhatIf: (parcel: Parcel) => void;
  onApplyRecommendation: (rec: RecommendationItem) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  parcels,
  onSelectParcel,
  onNavigateToWhatIf,
  onApplyRecommendation
}) => {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [filterDepartment, setFilterDepartment] = useState('all');

  const departments = Array.from(new Set(recommendations.map(r => r.assignedDepartment)));

  const filteredRecs = recommendations.filter(r =>
    filterDepartment === 'all' || r.assignedDepartment === filterDepartment
  );

  const handleApply = (rec: RecommendationItem) => {
    setAppliedIds(prev => [...prev, rec.id]);
    onApplyRecommendation(rec);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h1 className="font-serif text-xl font-bold text-slate-900">
                AI Corrective Action Recommendation Engine
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prescriptive administrative directives ranked by highest delay reduction impact and statutory viability
            </p>
          </div>

          <span className="text-xs font-mono bg-amber-100 text-amber-900 font-semibold px-2.5 py-1 border border-amber-300">
            {recommendations.length} Active Prescriptions
          </span>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-3 text-xs">
          <label className="font-semibold text-slate-700">Filter by Responsible Wing:</label>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="p-1.5 bg-white border border-slate-300 rounded-xs text-xs text-slate-900 focus:ring-1 focus:ring-blue-900"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecs.map(rec => {
          const isApplied = appliedIds.includes(rec.id);
          const targetParcel = rec.parcelId ? parcels.find(p => p.id === rec.parcelId) : null;

          return (
            <div
              key={rec.id}
              className={`bg-white border p-5 flex flex-col justify-between transition ${
                isApplied
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : 'border-slate-300 shadow-xs hover:border-slate-400'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                      {rec.id} • {rec.projectId}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-serif mt-0.5">
                      {rec.problem}
                    </h3>
                  </div>

                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border shrink-0 ${
                    rec.priority === 'CRITICAL'
                      ? 'bg-red-100 text-red-900 border-red-300 font-bold'
                      : 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                  }`}>
                    {rec.priority} PRIORITY
                  </span>
                </div>

                {/* Target context */}
                <div className="flex items-center space-x-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2 border border-slate-200">
                  <span className="font-semibold text-slate-800">Target:</span>
                  {rec.parcelId ? (
                    <span className="font-mono font-bold text-blue-950">
                      Parcel {rec.parcelId} ({rec.village})
                    </span>
                  ) : (
                    <span>Corridor-wide policy intervention</span>
                  )}
                  {targetParcel && (
                    <span className="ml-auto">
                      <RiskBadge level={targetParcel.riskCategory} size="sm" score={targetParcel.riskScore} />
                    </span>
                  )}
                </div>

                {/* Prescribed Action */}
                <div className="p-3 bg-blue-50/60 border border-blue-200 mb-4">
                  <span className="text-[11px] font-bold text-blue-950 block mb-1">
                    Mandated AI Recommendation:
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {rec.recommendedAction}
                  </p>
                </div>

                {/* Impact Metrics Strip */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Risk Score Compression:</span>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="font-mono font-bold text-red-700">{rec.currentRiskScore}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="font-mono font-bold text-emerald-700">{rec.projectedRiskScore}/100</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Delay Probability Impact:</span>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="font-mono font-bold text-red-700">{rec.currentDelayProbability}%</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="font-mono font-bold text-emerald-700">{rec.projectedDelayProbability}%</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-emerald-50/50 p-2 border border-emerald-200 mb-4">
                  <strong>Projected Net Impact: </strong>{rec.expectedImpact}
                </div>

                {/* Responsible Wing & Officer */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 mb-4 gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Wing: <strong>{rec.assignedDepartment}</strong></span>
                  </div>
                  {rec.officerName && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      Officer: {rec.officerName}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                {targetParcel ? (
                  <button
                    onClick={() => onNavigateToWhatIf(targetParcel)}
                    className="text-xs text-blue-900 font-semibold hover:underline"
                  >
                    Simulate What-If →
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">Policy directive</span>
                )}

                {isApplied ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Action Mandated
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(rec)}
                    className="bg-[#0f2942] hover:bg-slate-800 text-white font-semibold text-xs px-3 py-1.5 rounded-xs transition"
                  >
                    Apply Action Directive
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
