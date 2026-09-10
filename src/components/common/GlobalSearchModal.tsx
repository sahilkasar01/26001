import React, { useState } from 'react';
import { Project, Parcel } from '../../types';
import { Search, X, FolderGit2, MapPin, User, ChevronRight } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  parcels: Parcel[];
  onSelectProject: (project: Project) => void;
  onSelectParcel: (parcel: Parcel) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  parcels,
  onSelectProject,
  onSelectParcel
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedProjects = cleanQuery === '' ? [] : projects.filter(p =>
    p.id.toLowerCase().includes(cleanQuery) ||
    p.name.toLowerCase().includes(cleanQuery) ||
    p.district.toLowerCase().includes(cleanQuery)
  );

  const matchedParcels = cleanQuery === '' ? [] : parcels.filter(p =>
    p.id.toLowerCase().includes(cleanQuery) ||
    p.village.toLowerCase().includes(cleanQuery) ||
    p.surveyNumber.toLowerCase().includes(cleanQuery) ||
    p.landownerName.toLowerCase().includes(cleanQuery) ||
    p.district.toLowerCase().includes(cleanQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-300 shadow-2xl max-w-2xl w-full rounded-none overflow-hidden flex flex-col">
        {/* Search input bar */}
        <div className="p-3 border-b border-slate-300 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search Project ID, Name, Parcel ID (e.g. P-1042), Village, Landowner..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 text-xs divide-y divide-slate-100">
          {query === '' ? (
            <div className="p-6 text-center text-slate-400">
              <div className="font-semibold text-slate-700 mb-1">Central Administrative Index</div>
              Type any Parcel ID (e.g. <span className="font-mono text-blue-900 font-bold">P-1042</span>), Project ID (<span className="font-mono text-blue-900 font-bold">PRJ-NH48</span>), Village (e.g. <span className="font-semibold text-slate-700">Talegaon</span>), or Landowner name.
            </div>
          ) : matchedProjects.length === 0 && matchedParcels.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No records found matching &quot;{query}&quot;
            </div>
          ) : (
            <>
              {/* Matched Projects */}
              {matchedProjects.length > 0 && (
                <div className="pb-3 mb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Projects ({matchedProjects.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedProjects.map(proj => (
                      <div
                        key={proj.id}
                        onClick={() => {
                          onSelectProject(proj);
                          onClose();
                        }}
                        className="p-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-blue-200"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            <span className="font-mono text-blue-900 mr-2">{proj.id}</span>
                            {proj.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {proj.district}, {proj.state} • {proj.totalParcels} Parcels • Progress: {proj.progressPercentage}%
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RiskBadge level={proj.overallRisk} size="sm" score={proj.overallRiskScore} />
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Parcels */}
              {matchedParcels.length > 0 && (
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Parcels ({matchedParcels.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedParcels.map(parcel => (
                      <div
                        key={parcel.id}
                        onClick={() => {
                          onSelectParcel(parcel);
                          onClose();
                        }}
                        className="p-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-blue-200"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-blue-950 bg-slate-100 px-1.5 py-0.5 border border-slate-300">
                              {parcel.id}
                            </span>
                            <span className="font-semibold text-slate-800">
                              Survey #{parcel.surveyNumber} • {parcel.village} ({parcel.district})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Owner: <span className="text-slate-700 font-medium">{parcel.landownerName}</span> • Stage: {parcel.stage} • Comp: ₹{parcel.compensationAmountLakhs}L
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RiskBadge level={parcel.riskCategory} size="sm" score={parcel.riskScore} />
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
