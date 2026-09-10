import React, { useState } from 'react';
import { Parcel, Project } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { AlertOctagon, Search, Filter, ArrowUpDown, ArrowRight, MapPin, Sliders } from 'lucide-react';

interface CriticalParcelsPageProps {
  parcels: Parcel[];
  projects: Project[];
  onSelectParcel: (parcel: Parcel) => void;
  onNavigateToWhatIf: (parcel: Parcel) => void;
  onNavigateToGIS: (parcel: Parcel) => void;
}

export const CriticalParcelsPage: React.FC<CriticalParcelsPageProps> = ({
  parcels,
  projects,
  onSelectParcel,
  onNavigateToWhatIf,
  onNavigateToGIS
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'risk' | 'delay' | 'compensation'>('risk');

  // Filter for critical and high risk parcels (Score >= 70 or CRITICAL/HIGH)
  const criticalParcels = parcels.filter(p => {
    const isCriticalOrHigh = p.riskScore >= 70 || p.riskCategory === 'CRITICAL';
    const matchProject = projectFilter === 'all' || p.projectId === projectFilter;
    const matchSearch =
      searchQuery === '' ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.landownerName.toLowerCase().includes(searchQuery.toLowerCase());

    return isCriticalOrHigh && matchProject && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    if (sortBy === 'delay') return b.expectedDelayDays - a.expectedDelayDays;
    if (sortBy === 'compensation') return b.compensationAmountLakhs - a.compensationAmountLakhs;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-5 h-5 text-red-700" />
              <h1 className="font-serif text-xl font-bold text-slate-900">
                Critical Parcels Watchlist & Bottleneck Triage
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict screening criteria: Risk Score &ge; 70 or Delay Probability &ge; 70% threatening critical corridor handover
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-red-100 text-red-900 px-2.5 py-1 border border-red-300">
              {criticalParcels.length} Critical Parcels Identified
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Search Parcel / Village / Owner:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search P-1042, Talegaon, Rameshwar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Filter Corridor Project:</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
            >
              <option value="all">All Infrastructure Corridors</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.id}: {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Sort Prioritization:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
            >
              <option value="risk">Highest Risk Score First</option>
              <option value="delay">Longest Projected Delay Days</option>
              <option value="compensation">Highest Disputed Compensation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Critical Parcels Table (Section 8 Format) */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-3">Parcel ID</th>
                <th className="p-3">Project</th>
                <th className="p-3">Village / Survey</th>
                <th className="p-3">Landowner Status</th>
                <th className="p-3 text-center">Risk Score</th>
                <th className="p-3 text-center">Predicted Delay</th>
                <th className="p-3">Primary Delay Risk Factor</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {criticalParcels.map(parcel => {
                const mainFactor = parcel.topRiskFactors[0]?.name || 'Pending Review';
                const mainFactorWeight = parcel.topRiskFactors[0]?.weight || 0;

                return (
                  <tr
                    key={parcel.id}
                    onClick={() => onSelectParcel(parcel)}
                    className="hover:bg-red-50/40 cursor-pointer transition"
                  >
                    <td className="p-3">
                      <span className="font-mono font-bold text-blue-950 bg-slate-100 px-2 py-0.5 border border-slate-300 text-xs">
                        {parcel.id}
                      </span>
                    </td>

                    <td className="p-3 text-slate-800">
                      <div className="font-semibold">{parcel.projectName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{parcel.projectId}</div>
                    </td>

                    <td className="p-3 text-slate-800">
                      <div className="font-semibold">{parcel.village}</div>
                      <div className="text-[11px] text-slate-500">Survey #{parcel.surveyNumber} ({parcel.areaHectares} Ha)</div>
                    </td>

                    <td className="p-3 text-slate-700">
                      <div className="font-medium text-slate-900">{parcel.landownerName}</div>
                      <div className="text-[11px] text-slate-500">{parcel.landownerStatus}</div>
                    </td>

                    <td className="p-3 text-center">
                      <RiskBadge level={parcel.riskCategory} size="sm" score={parcel.riskScore} />
                    </td>

                    <td className="p-3 text-center font-mono font-bold text-red-700">
                      +{parcel.expectedDelayDays} Days
                      <div className="text-[10px] text-slate-500 font-normal">
                        ({parcel.delayProbability}% prob)
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{mainFactor}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Relative attribution weight: {mainFactorWeight}%
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToWhatIf(parcel);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 border border-slate-300 rounded-xs text-[11px] font-medium"
                          title="Simulate action impact"
                        >
                          Simulate
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectParcel(parcel);
                          }}
                          className="bg-[#0f2942] hover:bg-slate-800 text-white px-2.5 py-1 rounded-xs text-[11px] font-semibold"
                        >
                          View Details →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
