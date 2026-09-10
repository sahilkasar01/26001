import React, { useState, useEffect } from 'react';
import { Project, Parcel } from '../../types';
import { apiService, SimulationResult } from '../../services/apiService';
import { Sliders, CheckCircle2, ArrowRight, RotateCcw, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface WhatIfSimulatorProps {
  projects: Project[];
  parcels: Parcel[];
  initialParcelId?: string;
  onAssignAction?: (parcelId: string, actionSummary: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  projects,
  parcels,
  initialParcelId,
  onAssignAction
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || 'PRJ-NH48'
  );

  const availableParcels = parcels.filter(p => p.projectId === selectedProjectId);
  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    initialParcelId || availableParcels[0]?.id || 'P-1042'
  );

  // Actions state
  const [resolveLegalObjection, setResolveLegalObjection] = useState<boolean>(true);
  const [completeCompensation, setCompleteCompensation] = useState<boolean>(true);
  const [contactLandowner, setContactLandowner] = useState<boolean>(false);
  const [expediteApproval, setExpediteApproval] = useState<boolean>(false);
  const [conductMediation, setConductMediation] = useState<boolean>(false);
  const [increaseFieldStaff, setIncreaseFieldStaff] = useState<boolean>(false);

  const [assignedNotice, setAssignedNotice] = useState<string | null>(null);

  // Sync selected parcel if project changes
  useEffect(() => {
    if (availableParcels.length > 0 && !availableParcels.find(p => p.id === selectedParcelId)) {
      setSelectedParcelId(availableParcels[0].id);
    }
  }, [selectedProjectId, availableParcels, selectedParcelId]);

  const activeParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];

  // Run simulation calculation
  const simulation: SimulationResult = apiService.simulateAction({
    parcelId: selectedParcelId,
    resolveLegalObjection,
    completeCompensation,
    contactLandowner,
    expediteApproval,
    conductMediation,
    increaseFieldStaff
  });

  const getRiskLevelFromScore = (score: number) => {
    if (score <= 30) return 'LOW';
    if (score <= 60) return 'MEDIUM';
    if (score <= 80) return 'HIGH';
    return 'CRITICAL';
  };

  const projectedLevel = getRiskLevelFromScore(simulation.projectedRiskScore);

  const handleReset = () => {
    setResolveLegalObjection(false);
    setCompleteCompensation(false);
    setContactLandowner(false);
    setExpediteApproval(false);
    setConductMediation(false);
    setIncreaseFieldStaff(false);
    setAssignedNotice(null);
  };

  const handlePresetHighImpact = () => {
    setResolveLegalObjection(true);
    setCompleteCompensation(true);
    setConductMediation(true);
    setContactLandowner(false);
    setExpediteApproval(false);
    setIncreaseFieldStaff(false);
    setAssignedNotice(null);
  };

  const handleDispatch = () => {
    const summary = `Intervention order issued for Parcel ${activeParcel.id}: Resolved legal objections and expedited treasury compensation clearance. Projected risk mitigated to ${simulation.projectedRiskScore}/100.`;
    setAssignedNotice(summary);
    if (onAssignAction) {
      onAssignAction(activeParcel.id, summary);
    }
  };

  return (
    <div className="bg-white border border-slate-300 shadow-xs p-5">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-3 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#0f2942]" />
              <h2 className="font-serif text-lg font-bold text-slate-900">
                What-If Action Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Simulate the quantitative impact of administrative and legal interventions on delay probabilities.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-amber-900 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-xs border border-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-700" />
              Core Innovation
            </span>
            <button
              onClick={handlePresetHighImpact}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-2.5 py-1 border border-slate-300 rounded-xs"
            >
              Apply Recommended Preset
            </button>
            <button
              onClick={handleReset}
              className="text-xs text-slate-600 hover:text-slate-900 p-1 rounded-xs"
              title="Reset all toggles"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Select Project and Parcel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-3.5 bg-slate-50 border border-slate-200 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-white border border-slate-300 p-2 text-slate-900 rounded-xs focus:ring-1 focus:ring-blue-900"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.id}: {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Select Parcel ID:</label>
          <select
            value={selectedParcelId}
            onChange={(e) => setSelectedParcelId(e.target.value)}
            className="w-full bg-white border border-slate-300 p-2 text-slate-900 rounded-xs focus:ring-1 focus:ring-blue-900"
          >
            {availableParcels.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.village} ({p.riskCategory} - {p.riskScore}/100)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Baseline Risk:</label>
          <div className="flex items-center justify-between p-1.5 bg-white border border-slate-300 rounded-xs">
            <span className="font-mono font-bold text-slate-900 text-sm">
              {activeParcel.riskScore}/100
            </span>
            <RiskBadge level={activeParcel.riskCategory} size="sm" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Intervention Toggles, Right = Simulation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Intervention Toggles */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
            Administrative & Legal Interventions:
          </div>

          {/* Toggle 1 */}
          <label className="flex items-start space-x-3 p-3 bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition">
            <input
              type="checkbox"
              checked={resolveLegalObjection}
              onChange={(e) => setResolveLegalObjection(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-900 rounded-xs border-slate-300"
            />
            <div className="text-xs flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Resolve Legal Objection</span>
                <span className="text-emerald-700 font-mono font-semibold">-21 Risk Pts</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Deposit disputed coparcenary claim under Section 77(2) in revenue escrow to vacate court stay.
              </p>
            </div>
          </label>

          {/* Toggle 2 */}
          <label className="flex items-start space-x-3 p-3 bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition">
            <input
              type="checkbox"
              checked={completeCompensation}
              onChange={(e) => setCompleteCompensation(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-900 rounded-xs border-slate-300"
            />
            <div className="text-xs flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Complete Compensation Disbursement</span>
                <span className="text-emerald-700 font-mono font-semibold">-18 Risk Pts</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Expedite treasury mandate approval & release DBT funds directly to co-sharers.
              </p>
            </div>
          </label>

          {/* Toggle 3 */}
          <label className="flex items-start space-x-3 p-3 bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition">
            <input
              type="checkbox"
              checked={conductMediation}
              onChange={(e) => setConductMediation(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-900 rounded-xs border-slate-300"
            />
            <div className="text-xs flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Conduct Joint Administrative Mediation</span>
                <span className="text-emerald-700 font-mono font-semibold">-12 Risk Pts</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Hold special Sub-Divisional Magistrate lok adalat session with village representatives.
              </p>
            </div>
          </label>

          {/* Toggle 4 */}
          <label className="flex items-start space-x-3 p-3 bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition">
            <input
              type="checkbox"
              checked={contactLandowner}
              onChange={(e) => setContactLandowner(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-900 rounded-xs border-slate-300"
            />
            <div className="text-xs flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Contact Landowner (Physical Village Outreach)</span>
                <span className="text-emerald-700 font-mono font-semibold">-8 Risk Pts</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Deploy Talathi and Circle Inspector for physical spot notice service and address verification.
              </p>
            </div>
          </label>

          {/* Toggle 5 */}
          <label className="flex items-start space-x-3 p-3 bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition">
            <input
              type="checkbox"
              checked={expediteApproval}
              onChange={(e) => setExpediteApproval(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-900 rounded-xs border-slate-300"
            />
            <div className="text-xs flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Expedite Inter-Department Approval</span>
                <span className="text-emerald-700 font-mono font-semibold">-10 Risk Pts</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Fast-track utility shifting and social forestry tree felling NoC permissions.
              </p>
            </div>
          </label>

          {/* Toggle 6 */}
          <label className="flex items-start space-x-3 p-3 bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition">
            <input
              type="checkbox"
              checked={increaseFieldStaff}
              onChange={(e) => setIncreaseFieldStaff(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-900 rounded-xs border-slate-300"
            />
            <div className="text-xs flex-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Increase Field Survey Staff Allocation</span>
                <span className="text-emerald-700 font-mono font-semibold">-7 Risk Pts</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Depute 2 additional Cadastral Surveyors to compress joint measurement schedule.
              </p>
            </div>
          </label>
        </div>

        {/* Dynamic Simulation Results Card */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-900 text-white p-5 border border-slate-800 shadow-md">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Real-Time Simulated Impact Output
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {simulation.actionsAppliedCount} Interventions Selected
              </span>
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Risk Score */}
              <div className="p-3 bg-slate-800/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 block mb-1">Risk Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl text-slate-400 line-through">
                    {simulation.currentRiskScore}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-2xl font-bold text-white">
                    {simulation.projectedRiskScore}
                  </span>
                  <span className="text-xs text-slate-400">/100</span>
                </div>
                <div className="mt-2">
                  <RiskBadge level={projectedLevel} size="sm" />
                </div>
              </div>

              {/* Delay Probability */}
              <div className="p-3 bg-slate-800/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 block mb-1">Delay Probability</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl text-red-400 line-through">
                    {simulation.currentDelayProbability}%
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-2xl font-bold text-emerald-400">
                    {simulation.projectedDelayProbability}%
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-300 font-mono">
                  -{simulation.currentDelayProbability - simulation.projectedDelayProbability}% probability drop
                </div>
              </div>
            </div>

            {/* Estimated Delay Reduction Highlight */}
            <div className="p-4 bg-emerald-950/70 border border-emerald-800 mb-4 text-center">
              <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">
                Estimated Delay Reduction
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 my-1">
                {simulation.expectedDelayReductionDays} DAYS
              </div>
              <p className="text-[11px] text-emerald-200">
                Time saved on the critical corridor execution path
              </p>
            </div>

            {/* Narrative Explanation */}
            <div className="p-3 bg-slate-800/60 border border-slate-700 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-amber-300 block mb-1">Simulation Assessment:</span>
              {simulation.summaryExplanation}
            </div>
          </div>

          {/* Action Dispatch Button */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            {assignedNotice ? (
              <div className="p-3 bg-emerald-900/60 border border-emerald-700 text-xs text-emerald-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Intervention Plan Dispatched</div>
                  <div className="text-[11px] mt-0.5">{assignedNotice}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleDispatch}
                disabled={simulation.actionsAppliedCount === 0}
                className={`w-full py-2.5 px-4 font-bold text-xs rounded-xs flex items-center justify-center space-x-2 transition ${
                  simulation.actionsAppliedCount > 0
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Assign Action Plan to Department</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
