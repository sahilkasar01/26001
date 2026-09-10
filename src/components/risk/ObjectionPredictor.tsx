import React, { useState } from 'react';
import { ObjectionScenario, Parcel } from '../../types';
import { mockObjectionScenarios } from '../../data/objections';
import { Scale, AlertTriangle, ArrowRight, Layers, MapPin } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface ObjectionPredictorProps {
  parcels: Parcel[];
  onSelectParcelForInspection?: (parcelId: string) => void;
}

export const ObjectionPredictor: React.FC<ObjectionPredictorProps> = ({
  parcels,
  onSelectParcelForInspection
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(mockObjectionScenarios[0].id);

  const currentScenario = mockObjectionScenarios.find(s => s.id === selectedScenarioId) || mockObjectionScenarios[0];
  const targetParcel = parcels.find(p => p.id === currentScenario.parcelId);

  return (
    <div className="bg-white border border-slate-300 shadow-xs p-5">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-3 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-[#0f2942]" />
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Objection Impact Predictor
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Simulate the spatial and operational ripple effects of legal, compensation, and civic objections.
            </p>
          </div>

          <span className="bg-slate-100 text-slate-700 text-[11px] font-mono px-2 py-0.5 border border-slate-300">
            Spatial Impact Modeling
          </span>
        </div>
      </div>

      {/* Selector */}
      <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
          Select Objection Case Scenario:
        </label>
        <select
          value={selectedScenarioId}
          onChange={(e) => setSelectedScenarioId(e.target.value)}
          className="w-full bg-white border border-slate-300 p-2.5 text-xs font-semibold text-slate-900 rounded-xs focus:ring-1 focus:ring-blue-900"
        >
          {mockObjectionScenarios.map(s => (
            <option key={s.id} value={s.id}>
              {s.id}: {s.objectionType} — Parcel {s.parcelId} ({s.village})
            </option>
          ))}
        </select>
      </div>

      {/* 3 Key Impact Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Metric 1 */}
        <div className="bg-white p-4 border-t-4 border-t-red-600 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Direct Parcel Delay Risk
          </div>
          <div className="text-3xl font-bold font-mono text-red-600 my-1">
            +{currentScenario.directParcelDelayRisk}
          </div>
          <p className="text-[11px] text-slate-500">
            Immediate delta in local parcel risk score (out of 100)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 border-t-4 border-t-orange-500 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Nearby Parcels Affected
          </div>
          <div className="text-3xl font-bold font-mono text-orange-600 my-1">
            {currentScenario.nearbyParcelsAffected}
          </div>
          <p className="text-[11px] text-slate-500">
            Contiguous plots subject to right-of-way alignment stall
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 border-t-4 border-t-blue-900 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Potential Project Delay
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 my-1">
            +{currentScenario.potentialProjectDelayDays} Days
          </div>
          <p className="text-[11px] text-slate-500">
            Overall corridor civil construction timeline extension
          </p>
        </div>
      </div>

      {/* Detailed Description & Affected Parcels List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Objection Case Description
            </h4>
          </div>

          <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
            <p className="font-medium text-slate-900">
              {currentScenario.description}
            </p>

            <div className="p-3 bg-white border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 block mb-1">Impacted Project:</span>
              <div className="font-semibold text-slate-900">{targetParcel?.projectName || currentScenario.projectId}</div>
            </div>

            <div className="p-3 bg-white border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 block mb-1">Epicenter Parcel:</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900">
                  {currentScenario.parcelId} ({currentScenario.village})
                </span>
                {targetParcel && <RiskBadge level={targetParcel.riskCategory} size="sm" score={targetParcel.riskScore} />}
              </div>
            </div>
          </div>
        </div>

        {/* Affected Parcels Array */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
            <div className="flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Cascading Affected Parcels ({currentScenario.affectedParcelIds.length})
              </h4>
            </div>
          </div>

          <div className="space-y-2">
            {currentScenario.affectedParcelIds.map(pid => {
              const pData = parcels.find(p => p.id === pid);
              const isEpicenter = pid === currentScenario.parcelId;

              return (
                <div
                  key={pid}
                  className={`p-2.5 border flex items-center justify-between text-xs ${
                    isEpicenter
                      ? 'bg-red-50/60 border-red-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{pid}</span>
                      {isEpicenter && (
                        <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 font-bold uppercase">
                          Epicenter
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {pData?.village || currentScenario.village} • {pData?.landownerStatus || 'Dependent'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {pData && <RiskBadge level={pData.riskCategory} size="sm" score={pData.riskScore} />}
                    {onSelectParcelForInspection && (
                      <button
                        onClick={() => onSelectParcelForInspection(pid)}
                        className="text-[11px] text-blue-800 hover:underline font-medium"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            Contiguity blockage halts right-of-way handover for the entire physical segment until the objection is resolved.
          </div>
        </div>
      </div>
    </div>
  );
};
