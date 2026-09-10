import React from 'react';
import { Parcel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { BrainCircuit, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExplainableAiPanelProps {
  parcel: Parcel;
  onOpenWhatIf?: (parcel: Parcel) => void;
  onOpenDependency?: (parcel: Parcel) => void;
}

export const ExplainableAiPanel: React.FC<ExplainableAiPanelProps> = ({
  parcel,
  onOpenWhatIf,
  onOpenDependency
}) => {
  return (
    <div className="bg-white border border-slate-300 shadow-xs p-5">
      {/* Official Model Output Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-[#0f2942]" />
            <h3 className="font-serif text-base font-bold text-slate-900">
              Why is Parcel {parcel.id} at {parcel.riskCategory} Risk?
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Predictive Feature Attribution Decomposition (Explainable AI / SHAP-style weights)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Strict compliance label */}
          <span className="bg-slate-100 text-slate-700 text-[11px] font-mono font-medium px-2 py-0.5 rounded-xs border border-slate-300">
            AI Model Output – Demo Data
          </span>
          <RiskBadge level={parcel.riskCategory} size="md" score={parcel.riskScore} />
        </div>
      </div>

      {/* Overview stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 mb-5 text-xs">
        <div>
          <div className="text-slate-500 text-[11px]">Risk Score:</div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {parcel.riskScore}<span className="text-slate-500 text-xs">/100</span>
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px]">Delay Probability:</div>
          <div className="text-lg font-bold font-mono text-red-700">
            {parcel.delayProbability}%
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px]">Projected Latency:</div>
          <div className="text-lg font-bold font-mono text-slate-900">
            +{parcel.expectedDelayDays} Days
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[11px]">Acquisition Stage:</div>
          <div className="text-xs font-semibold text-slate-800 mt-1">
            {parcel.stage}
          </div>
        </div>
      </div>

      {/* Contributing Factors Horizontal Bar Chart */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
          <span>Top Contributing Delay Factors</span>
          <span className="text-slate-500 font-mono">Relative Weight %</span>
        </div>

        <div className="space-y-3">
          {parcel.topRiskFactors.map((factor, idx) => {
            const barColors = [
              'bg-red-600',
              'bg-orange-600',
              'bg-amber-600',
              'bg-blue-800',
              'bg-slate-600'
            ];
            const colorClass = barColors[idx % barColors.length];

            return (
              <div key={factor.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    {factor.name}
                  </span>
                  <span className="font-mono font-bold text-slate-900">{factor.weight}%</span>
                </div>
                
                {/* Horizontal Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-none overflow-hidden">
                  <div
                    className={`h-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${factor.weight}%` }}
                  />
                </div>

                {factor.description && (
                  <p className="text-[11px] text-slate-500 leading-tight pl-3 italic">
                    {factor.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Textual Synthesis Box */}
      <div className="p-3.5 bg-blue-50/60 border border-blue-200 text-xs text-slate-800 mb-4">
        <div className="font-semibold text-blue-950 flex items-center gap-1.5 mb-1">
          <Info className="w-4 h-4 text-blue-800 shrink-0" />
          <span>Automated Diagnostic Synthesis</span>
        </div>
        <p className="leading-relaxed">
          &quot;{parcel.explanation}&quot;
        </p>
      </div>

      {/* Recommended Action & Action Triggers */}
      <div className="p-3.5 bg-slate-100 border border-slate-300 text-xs text-slate-800">
        <div className="font-semibold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
          Recommended Administrative Corrective Action:
        </div>
        <p className="font-medium text-slate-900 leading-relaxed mb-3">
          {parcel.recommendedAction}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
          {onOpenWhatIf && (
            <button
              onClick={() => onOpenWhatIf(parcel)}
              className="bg-[#0f2942] hover:bg-slate-800 text-white px-3 py-1.5 rounded-xs font-semibold text-xs transition"
            >
              Simulate Action Impact (What-If) →
            </button>
          )}

          {onOpenDependency && (
            <button
              onClick={() => onOpenDependency(parcel)}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-xs font-medium text-xs transition"
            >
              View Delay Dependency Chain →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
