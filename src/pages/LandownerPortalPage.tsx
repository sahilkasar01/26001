import React, { useState } from 'react';
import { Parcel } from '../types';
import { UserCheck, Search, FileText, CheckCircle2, IndianRupee, Clock, HelpCircle, Send, AlertCircle } from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

interface LandownerPortalPageProps {
  parcels: Parcel[];
}

export const LandownerPortalPage: React.FC<LandownerPortalPageProps> = ({ parcels }) => {
  const [searchParcelId, setSearchParcelId] = useState('P-1042');
  const [activeParcel, setActiveParcel] = useState<Parcel>(
    parcels.find(p => p.id === 'P-1042') || parcels[0]
  );
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceType, setGrievanceType] = useState('Compensation Rate Query');
  const [submittedReceipt, setSubmittedReceipt] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = parcels.find(p =>
      p.id.toLowerCase() === searchParcelId.trim().toLowerCase() ||
      p.surveyNumber.toLowerCase() === searchParcelId.trim().toLowerCase() ||
      p.landownerName.toLowerCase().includes(searchParcelId.trim().toLowerCase())
    );
    if (found) {
      setActiveParcel(found);
    }
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;
    const token = `GRV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedReceipt(token);
    setGrievanceText('');
  };

  return (
    <div className="space-y-6">
      {/* Landowner Header */}
      <div className="bg-white border border-stone-300 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300">
                <UserCheck className="w-5 h-5 text-emerald-800" />
              </div>
              <h1 className="font-serif text-xl font-bold text-stone-900">
                🌾 Farmer &amp; Landowner 7/12 Transparency Portal
              </h1>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Direct cultivator interface for parcel acquisition status, crop solatium calculation, DBT disbursal tracking, and SLAO claims
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-700 bg-amber-50 px-2.5 py-1 border border-amber-300 font-mono font-semibold">
              Dial Toll-Free: <strong>1800-REV-LAND (1800-738-5263)</strong>
            </span>
          </div>
        </div>

        {/* Search your parcel */}
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2 text-xs">
          <label className="font-bold text-stone-800 flex items-center gap-1">
            <span>🔍</span>
            <span>Search Your Land Record / 7-12 Extract:</span>
          </label>
          <input
            type="text"
            placeholder="Enter Survey No. (e.g. 104/2B) or Parcel ID (P-1042)..."
            value={searchParcelId}
            onChange={(e) => setSearchParcelId(e.target.value)}
            className="p-2 border border-stone-300 rounded-xs text-xs w-72 focus:ring-1 focus:ring-amber-500 font-mono"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 text-xs rounded-xs shadow-xs transition"
          >
            Retrieve Land Record
          </button>
        </form>
      </div>

      {/* Parcel Information Certificate Card */}
      <div className="bg-white border-2 border-stone-300 shadow-sm p-6">
        {/* Certificate Top */}
        <div className="border-b-2 border-stone-200 pb-4 mb-5 flex flex-wrap items-center justify-between gap-2 bg-[#faf8f4] p-3 -mx-3 -mt-3">
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-amber-800 tracking-wider flex items-center gap-1">
              <span>📜</span>
              <span>Statutory Form 7 / Cadastral Land Extract Record</span>
            </div>
            <h2 className="text-lg font-bold font-serif text-stone-900 mt-0.5">
              Survey No. {activeParcel.surveyNumber} — {activeParcel.village}
            </h2>
            <p className="text-xs text-stone-600">
              Taluka: {activeParcel.taluka} • District: {activeParcel.district}, Maharashtra
            </p>
          </div>

          <div className="text-right">
            <span className="font-mono font-bold text-sm bg-amber-100 text-amber-950 px-3 py-1 border border-amber-300 block">
              Parcel ID: {activeParcel.id}
            </span>
            <span className="text-[11px] text-stone-600 mt-1 block">
              Corridor: {activeParcel.projectName}
            </span>
          </div>
        </div>

        {/* 4 Core Pillars for Landowner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-xs">
          {/* 1. Title Holder */}
          <div className="p-3.5 bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-600 block mb-1">Registered Khatedar (Owner)</span>
            <div className="font-bold text-stone-900 text-sm">{activeParcel.landownerName}</div>
            <div className="text-[11px] text-stone-600 mt-1">
              Registered Phone: {activeParcel.landownerContact}
            </div>
            <div className="text-[11px] text-stone-600 mt-0.5">
              Status: <strong className="text-amber-900">{activeParcel.landownerStatus}</strong>
            </div>
          </div>

          {/* 2. Acquisition Area */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-900 block mb-1">Acquired Farmland Extent</span>
            <div className="font-bold font-mono text-emerald-950 text-sm">
              {activeParcel.areaHectares} Hectares
            </div>
            <div className="text-[11px] text-emerald-800 mt-1">
              Equivalent: {(activeParcel.areaHectares * 2.471).toFixed(2)} Standard Acres
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
              Land Use: Perennial Irrigated (Bagayat)
            </div>
          </div>

          {/* 3. Compensation Award */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-900 block mb-1">Statutory Compensation Award</span>
            <div className="font-mono font-bold text-amber-950 text-base">
              ₹ {activeParcel.compensationAmountLakhs} Lakhs
            </div>
            <div className={`text-[11px] font-semibold mt-1 ${
              activeParcel.compensationStatus === 'Disbursed' ? 'text-emerald-700' : 'text-amber-800'
            }`}>
              Disbursal Status: {activeParcel.compensationStatus}
            </div>
            <div className="text-[10px] text-amber-800/80 mt-0.5">
              Includes 100% Solatium + 1.25x Rural Factor
            </div>
          </div>

          {/* 4. Current Stage */}
          <div className="p-3.5 bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-600 block mb-1">Civil Handover Stage</span>
            <div className="font-bold text-stone-900 text-sm">{activeParcel.stage}</div>
            <div className="text-[11px] text-stone-600 mt-1">
              Next SLAO Sitting: <strong>28-Oct-2026</strong>
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Revenue Office: Pune Sub-Division
            </div>
          </div>
        </div>

        {/* Transparent Compensation Calculation Breakdown */}
        <div className="p-4 bg-amber-50/40 border border-amber-200 mb-6 text-xs">
          <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-amber-200 pb-1 mb-3 flex items-center justify-between">
            <span>Transparent Solatium Breakdown (RFCTLARR Act 2013 First Schedule):</span>
            <span className="text-amber-800 font-mono text-[10px]">100% Legal Guarantee</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-stone-600 block">1. Base Market Value (Circle Rate):</span>
              <span className="font-mono font-bold text-stone-900">
                ₹ {(activeParcel.compensationAmountLakhs * 0.4).toFixed(1)} Lakhs
              </span>
            </div>
            <div>
              <span className="text-stone-600 block">2. Multiplier for Rural Farmland (1.25x):</span>
              <span className="font-mono font-bold text-stone-900">
                ₹ {(activeParcel.compensationAmountLakhs * 0.1).toFixed(1)} Lakhs
              </span>
            </div>
            <div>
              <span className="text-stone-600 block">3. Mandatory Farmer Solatium (100%):</span>
              <span className="font-mono font-bold text-stone-900">
                ₹ {(activeParcel.compensationAmountLakhs * 0.4).toFixed(1)} Lakhs
              </span>
            </div>
            <div>
              <span className="text-stone-600 block">4. Standing Crop, Well &amp; Tree Assets:</span>
              <span className="font-mono font-bold text-emerald-700">
                ₹ {(activeParcel.compensationAmountLakhs * 0.1).toFixed(1)} Lakhs
              </span>
            </div>
          </div>
        </div>

        {/* Submit Grievance or Objection Section */}
        <div className="border-t border-stone-200 pt-5">
          <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
            Submit Citizen Redressal Petition / Objection
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Direct statutory submission to the Special Land Acquisition Officer (SLAO) with guaranteed tracking token
          </p>

          {submittedReceipt ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">Petition Registered Successfully!</div>
                <div className="mt-1">
                  Your official grievance token is: <strong className="font-mono font-bold text-base text-emerald-900">{submittedReceipt}</strong>.
                </div>
                <div className="text-[11px] text-emerald-800 mt-1">
                  SMS acknowledgement sent to registered phone. The SLAO officer has been notified for statutory response within 14 working days.
                </div>
                <button
                  onClick={() => setSubmittedReceipt(null)}
                  className="mt-3 text-xs bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-3 py-1 transition"
                >
                  Submit Another Query
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGrievanceSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Objection / Inquiry Nature:</label>
                  <select
                    value={grievanceType}
                    onChange={(e) => setGrievanceType(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xs text-xs"
                  >
                    <option value="Compensation Rate Query">Compensation Rate Contest (Circle Valuation)</option>
                    <option value="Coparcenary Partition Dispute">Coparcenary Title / Co-Sharer Apportionment</option>
                    <option value="Physical Demarcation Discrepancy">Cadastral Boundary / Measurement Error</option>
                    <option value="Bank Account Update">Update Bank Account / IFSC for Direct Benefit Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Petitioner Contact Number:</label>
                  <input
                    type="text"
                    defaultValue={activeParcel.landownerContact}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xs text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Petition Details &amp; Demands:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your objection or request in detail..."
                  value={grievanceText}
                  onChange={(e) => setGrievanceText(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xs text-xs focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#18201a] hover:bg-stone-800 text-amber-300 font-bold px-4 py-2 text-xs flex items-center gap-1.5 border border-amber-500/40 shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Submit Official Petition to SLAO</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
