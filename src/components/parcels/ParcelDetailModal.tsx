import React from 'react';
import { Parcel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { RiskScoreBar } from '../common/RiskScoreBar';
import { ExplainableAiPanel } from '../risk/ExplainableAiPanel';
import { X, MapPin, User, IndianRupee, FileText, Scale, ArrowUpRight } from 'lucide-react';

interface ParcelDetailModalProps {
  parcel: Parcel | null;
  onClose: () => void;
  onNavigateToWhatIf?: (parcel: Parcel) => void;
  onNavigateToDependency?: (parcel: Parcel) => void;
  onNavigateToGIS?: (parcel: Parcel) => void;
}

export const ParcelDetailModal: React.FC<ParcelDetailModalProps> = ({
  parcel,
  onClose,
  onNavigateToWhatIf,
  onNavigateToDependency,
  onNavigateToGIS
}) => {
  if (!parcel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 shadow-xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col rounded-none">
        {/* Modal Header */}
        <div className="p-4 bg-[#0f2942] text-white flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-lg font-bold bg-white/10 px-2.5 py-0.5 border border-white/20">
              {parcel.id}
            </span>
            <div>
              <h2 className="text-base font-bold leading-none">{parcel.projectName}</h2>
              <span className="text-xs text-slate-300 mt-1 block">
                Survey No: {parcel.surveyNumber} • {parcel.village}, {parcel.taluka}, {parcel.district}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <RiskBadge level={parcel.riskCategory} size="md" score={parcel.riskScore} />
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 text-white rounded-xs transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-100 border border-slate-300">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Quick Actions:
            </span>
            {onNavigateToWhatIf && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToWhatIf(parcel);
                }}
                className="bg-[#0f2942] text-white px-3 py-1 font-semibold hover:bg-slate-800 transition"
              >
                Launch What-If Simulator →
              </button>
            )}
            {onNavigateToDependency && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDependency(parcel);
                }}
                className="bg-white text-slate-800 border border-slate-300 px-3 py-1 font-semibold hover:bg-slate-50 transition"
              >
                Inspect Delay Dependency Chain →
              </button>
            )}
            {onNavigateToGIS && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToGIS(parcel);
                }}
                className="bg-white text-slate-800 border border-slate-300 px-3 py-1 font-semibold hover:bg-slate-50 transition flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Locate on GIS Map</span>
              </button>
            )}
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Landowner & Title Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                <User className="w-4 h-4 text-slate-600" />
                <span>Landowner & Title Record</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <div>
                  <span className="text-slate-500 text-[11px] block">Title Holder:</span>
                  <span className="font-semibold text-slate-900">{parcel.landownerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Contact / Registry Phone:</span>
                  <span className="font-mono">{parcel.landownerContact}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Landowner Response Status:</span>
                  <span className="font-semibold text-slate-900">{parcel.landownerStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Acquisition Area:</span>
                  <span className="font-mono font-semibold text-slate-900">{parcel.areaHectares} Hectares</span>
                </div>
              </div>
            </div>

            {/* Compensation Details */}
            <div className="p-3.5 bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                <IndianRupee className="w-4 h-4 text-slate-600" />
                <span>Compensation Status</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <div>
                  <span className="text-slate-500 text-[11px] block">Award Amount:</span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    ₹ {parcel.compensationAmountLakhs} Lakhs
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Disbursement State:</span>
                  <span className={`font-semibold ${
                    parcel.compensationStatus === 'Disbursed' ? 'text-emerald-700' : 'text-amber-800'
                  }`}>
                    {parcel.compensationStatus}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Acquisition Stage:</span>
                  <span className="font-semibold text-slate-900">{parcel.stage}</span>
                </div>
              </div>
            </div>

            {/* Legal Status */}
            <div className="p-3.5 bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                <Scale className="w-4 h-4 text-slate-600" />
                <span>Legal & Clearances</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <div>
                  <span className="text-slate-500 text-[11px] block">Objection Category:</span>
                  <span className="font-semibold text-slate-900">{parcel.legalObjectionStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Connected Corridor Parcels:</span>
                  <span className="font-mono text-slate-700">
                    {parcel.connectedParcelIds ? parcel.connectedParcelIds.join(', ') : 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Coordinates:</span>
                  <span className="font-mono text-[11px] text-slate-600">
                    {parcel.lat.toFixed(4)}°N, {parcel.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Explainable AI Panel */}
          <ExplainableAiPanel
            parcel={parcel}
            onOpenWhatIf={onNavigateToWhatIf ? () => {
              onClose();
              onNavigateToWhatIf(parcel);
            } : undefined}
            onOpenDependency={onNavigateToDependency ? () => {
              onClose();
              onNavigateToDependency(parcel);
            } : undefined}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono">Record ID: {parcel.id}</span>
          <button
            onClick={onClose}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-1.5 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
