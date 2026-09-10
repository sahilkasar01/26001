import React, { useState } from 'react';
import { Parcel, Project } from '../types';
import { ExplainableAiPanel } from '../components/risk/ExplainableAiPanel';
import { BrainCircuit, BarChart3, PieChart, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

interface RiskIntelligencePageProps {
  parcels: Parcel[];
  projects: Project[];
  onSelectParcel: (parcel: Parcel) => void;
  onNavigateToWhatIf: (parcel: Parcel) => void;
  onNavigateToDependency: (parcel: Parcel) => void;
}

export const RiskIntelligencePage: React.FC<RiskIntelligencePageProps> = ({
  parcels,
  projects,
  onSelectParcel,
  onNavigateToWhatIf,
  onNavigateToDependency
}) => {
  const [selectedParcelId, setSelectedParcelId] = useState<string>('P-1042');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const filteredParcels = parcels.filter(p =>
    projectFilter === 'all' || p.projectId === projectFilter
  );

  const activeParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];

  // Risk distributions stats
  const criticalCount = parcels.filter(p => p.riskCategory === 'CRITICAL').length;
  const highCount = parcels.filter(p => p.riskCategory === 'HIGH').length;
  const mediumCount = parcels.filter(p => p.riskCategory === 'MEDIUM').length;
  const lowCount = parcels.filter(p => p.riskCategory === 'LOW').length;

  const total = parcels.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-[#0f2942]" />
              <h1 className="font-serif text-xl font-bold text-slate-900">
                Risk Intelligence & Predictive Explainability
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Machine Learning parcel-level risk attribution decomposition, SHAP weights, and delay probabilities
            </p>
          </div>

          <span className="bg-slate-100 text-slate-700 text-xs font-mono font-medium px-2.5 py-1 rounded-xs border border-slate-300">
            AI Model Output – Demo Data
          </span>
        </div>

        {/* Global Distribution Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {/* Critical */}
          <div className="p-3 bg-red-50/70 border border-red-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-800 uppercase">Critical (81–100)</span>
              <span className="font-mono font-bold text-base text-red-700">{criticalCount}</span>
            </div>
            <div className="text-[11px] text-red-600 mt-1">
              {Math.round((criticalCount / total) * 100)}% of monitored plots
            </div>
            <div className="w-full bg-red-200 h-1 mt-2">
              <div className="bg-red-600 h-full" style={{ width: `${(criticalCount / total) * 100}%` }} />
            </div>
          </div>

          {/* High */}
          <div className="p-3 bg-orange-50/70 border border-orange-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-800 uppercase">High (61–80)</span>
              <span className="font-mono font-bold text-base text-orange-700">{highCount}</span>
            </div>
            <div className="text-[11px] text-orange-600 mt-1">
              {Math.round((highCount / total) * 100)}% of monitored plots
            </div>
            <div className="w-full bg-orange-200 h-1 mt-2">
              <div className="bg-orange-500 h-full" style={{ width: `${(highCount / total) * 100}%` }} />
            </div>
          </div>

          {/* Medium */}
          <div className="p-3 bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-800 uppercase">Medium (31–60)</span>
              <span className="font-mono font-bold text-base text-amber-700">{mediumCount}</span>
            </div>
            <div className="text-[11px] text-amber-600 mt-1">
              {Math.round((mediumCount / total) * 100)}% of monitored plots
            </div>
            <div className="w-full bg-amber-200 h-1 mt-2">
              <div className="bg-amber-500 h-full" style={{ width: `${(mediumCount / total) * 100}%` }} />
            </div>
          </div>

          {/* Low */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800 uppercase">Low (0–30)</span>
              <span className="font-mono font-bold text-base text-emerald-700">{lowCount}</span>
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">
              {Math.round((lowCount / total) * 100)}% on schedule
            </div>
            <div className="w-full bg-emerald-200 h-1 mt-2">
              <div className="bg-emerald-600 h-full" style={{ width: `${(lowCount / total) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Left = Interactive Parcel Selector, Right = Explainable AI Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Parcel List & Selector */}
        <div className="lg:col-span-5 bg-white border border-slate-300 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Parcel to Inspect Attribution:
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {filteredParcels.length} Parcels
              </span>
            </div>

            {/* Filter by Project */}
            <div className="mb-3">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full p-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xs text-slate-800 focus:ring-1 focus:ring-blue-900"
              >
                <option value="all">All Infrastructure Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.id}: {p.name}</option>
                ))}
              </select>
            </div>

            {/* Parcel List */}
            <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredParcels.map(p => {
                const isSelected = p.id === activeParcel.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedParcelId(p.id)}
                    className={`p-2.5 border cursor-pointer transition text-xs ${
                      isSelected
                        ? 'border-[#0f2942] bg-blue-50/70 ring-1 ring-[#0f2942]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-blue-950 bg-slate-100 px-1.5 py-0.5 border border-slate-300">
                          {p.id}
                        </span>
                        <span className="font-semibold text-slate-800">{p.village}</span>
                      </div>
                      <RiskBadge level={p.riskCategory} size="sm" score={p.riskScore} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                      <span>Stage: {p.stage}</span>
                      <span className="font-mono text-red-700 font-semibold">
                        +{p.expectedDelayDays}d ({p.delayProbability}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Explainable AI Panel for the active parcel */}
        <div className="lg:col-span-7">
          <ExplainableAiPanel
            parcel={activeParcel}
            onOpenWhatIf={onNavigateToWhatIf}
            onOpenDependency={onNavigateToDependency}
          />
        </div>
      </div>
    </div>
  );
};
