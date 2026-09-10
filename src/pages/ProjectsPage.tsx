import React, { useState } from 'react';
import { Project, Parcel } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  FolderGit2, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  ChevronLeft, 
  ArrowRight,
  IndianRupee,
  Layers
} from 'lucide-react';

interface ProjectsPageProps {
  projects: Project[];
  parcels: Parcel[];
  selectedProject: Project | null;
  onSelectProject: (project: Project | null) => void;
  onSelectParcel: (parcel: Parcel) => void;
  onNavigateToGIS: (parcel?: Parcel) => void;
  onNavigateToWhatIf: (parcel?: Parcel) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  parcels,
  selectedProject,
  onSelectProject,
  onSelectParcel,
  onNavigateToGIS,
  onNavigateToWhatIf
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [authorityFilter, setAuthorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'parcels' | 'progress' | 'budget'>('risk');

  // Filter and sort projects
  const authorities = Array.from(new Set(projects.map(p => p.executingAuthority)));

  const filteredProjects = projects.filter(p => {
    const matchSearch =
      searchQuery === '' ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRisk = riskFilter === 'all' || p.overallRisk === riskFilter;
    const matchAuthority = authorityFilter === 'all' || p.executingAuthority === authorityFilter;
    return matchSearch && matchRisk && matchAuthority;
  }).sort((a, b) => {
    if (sortBy === 'risk') return b.overallRiskScore - a.overallRiskScore;
    if (sortBy === 'parcels') return b.totalParcels - a.totalParcels;
    if (sortBy === 'progress') return a.progressPercentage - b.progressPercentage;
    if (sortBy === 'budget') return b.budgetCr - a.budgetCr;
    return 0;
  });

  // If a project is selected, render the detailed view
  if (selectedProject) {
    const projectParcels = parcels.filter(p => p.projectId === selectedProject.id);

    return (
      <div className="space-y-6">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onSelectProject(null)}
            className="flex items-center space-x-1.5 text-xs text-blue-900 font-semibold hover:underline bg-white px-3 py-1.5 border border-slate-300 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>← Back to All Projects</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-mono">Status:</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-200">
              Active Statutory Acquisition
            </span>
          </div>
        </div>

        {/* Project Header Banner */}
        <div className="bg-white border border-slate-300 shadow-xs p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs bg-slate-100 text-blue-950 px-2 py-0.5 border border-slate-300">
                  {selectedProject.id}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {selectedProject.type} Corridor
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
                {selectedProject.name}
              </h1>
              <p className="text-xs text-slate-600 mt-1 flex items-center space-x-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {selectedProject.district}, {selectedProject.state}
                </span>
                <span>•</span>
                <span>Executing Authority: <strong>{selectedProject.executingAuthority}</strong></span>
                <span>•</span>
                <span>Budget: <strong>₹ {selectedProject.budgetCr.toLocaleString('en-IN')} Crores</strong></span>
              </p>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Delay Risk:</span>
                <RiskBadge level={selectedProject.overallRisk} size="md" score={selectedProject.overallRiskScore} />
              </div>
              <div className="text-xs font-mono font-bold text-red-700 mt-2">
                Projected Completion Lag: +{selectedProject.predictedDelayDays} Days
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Total Monitored Parcels</span>
              <span className="text-lg font-bold font-mono text-slate-900">{selectedProject.totalParcels}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Acquired & Handed Over</span>
              <span className="text-lg font-bold font-mono text-emerald-700">{selectedProject.acquiredParcels}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">In Active Statutory Process</span>
              <span className="text-lg font-bold font-mono text-amber-700">{selectedProject.inProgressParcels}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Critical Delay Bottlenecks</span>
              <span className="text-lg font-bold font-mono text-red-700">{selectedProject.criticalRiskParcels}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Target Commissioning</span>
              <span className="text-sm font-semibold font-mono text-slate-900 mt-1 block">
                {selectedProject.targetCompletionDate}
              </span>
            </div>
          </div>
        </div>

        {/* 7-Stage Interactive Project Timeline (Prompt Section 4 Mandate) */}
        <div className="bg-white border border-slate-300 shadow-xs p-5">
          <div className="border-b border-slate-200 pb-2 mb-4">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Statutory Land Acquisition Timeline & Stage Progression
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current progress across the 7 mandatory LARR statutory milestones
            </p>
          </div>

          <div className="space-y-4">
            {selectedProject.timelineStages.map((stage, idx) => {
              let statusBadge = (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-300">
                  Upcoming
                </span>
              );

              if (stage.status === 'Completed') {
                statusBadge = (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Completed
                  </span>
                );
              } else if (stage.status === 'In Progress') {
                statusBadge = (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-700" />
                    In Progress ({stage.completionPercentage}%)
                  </span>
                );
              } else if (stage.status === 'Delayed') {
                statusBadge = (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-red-100 text-red-900 border border-red-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    Delayed Bottleneck
                  </span>
                );
              }

              return (
                <div
                  key={stage.stageNumber}
                  className={`p-3 border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    stage.status === 'Delayed'
                      ? 'border-red-300 bg-red-50/40'
                      : stage.status === 'In Progress'
                      ? 'border-blue-300 bg-blue-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="font-mono font-bold text-xs w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                      {stage.stageNumber}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {stage.stageName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Target Date: {stage.targetDate} • Actual / Forecast: {stage.actualOrForecastDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-32 hidden md:block">
                      <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{stage.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5">
                        <div
                          className={`h-full ${
                            stage.status === 'Delayed' ? 'bg-red-600' : 'bg-blue-900'
                          }`}
                          style={{ width: `${stage.completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="shrink-0">{statusBadge}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parcels in this Project Table */}
        <div className="bg-white border border-slate-300 shadow-xs p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                Parcels Registry for {selectedProject.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {projectParcels.length} surveyed land parcels with AI delay risk assessments
              </p>
            </div>

            <button
              onClick={() => onNavigateToGIS()}
              className="bg-[#0f2942] hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View All on GIS Map</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-2.5">Parcel ID</th>
                  <th className="p-2.5">Village / Survey No.</th>
                  <th className="p-2.5">Landowner</th>
                  <th className="p-2.5">Stage</th>
                  <th className="p-2.5 text-center">Compensation</th>
                  <th className="p-2.5 text-center">Delay Risk</th>
                  <th className="p-2.5 text-center">Predicted Delay</th>
                  <th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projectParcels.map(parcel => (
                  <tr
                    key={parcel.id}
                    className="hover:bg-blue-50/50 cursor-pointer transition"
                    onClick={() => onSelectParcel(parcel)}
                  >
                    <td className="p-2.5 font-mono font-bold text-blue-950">
                      {parcel.id}
                    </td>
                    <td className="p-2.5 text-slate-800">
                      <div className="font-semibold">{parcel.village}</div>
                      <div className="text-[11px] text-slate-500">Survey #{parcel.surveyNumber} ({parcel.areaHectares} Ha)</div>
                    </td>
                    <td className="p-2.5 text-slate-700">
                      <div>{parcel.landownerName}</div>
                      <div className="text-[10px] text-slate-500">{parcel.landownerStatus}</div>
                    </td>
                    <td className="p-2.5 text-slate-800 font-medium">
                      {parcel.stage}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className="font-mono font-semibold text-slate-900">
                        ₹ {parcel.compensationAmountLakhs}L
                      </span>
                      <div className={`text-[10px] ${
                        parcel.compensationStatus === 'Disbursed' ? 'text-emerald-700' : 'text-amber-800 font-semibold'
                      }`}>
                        {parcel.compensationStatus}
                      </div>
                    </td>
                    <td className="p-2.5 text-center">
                      <RiskBadge level={parcel.riskCategory} size="sm" score={parcel.riskScore} />
                    </td>
                    <td className="p-2.5 text-center font-mono text-red-700 font-bold">
                      +{parcel.expectedDelayDays}d ({parcel.delayProbability}%)
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectParcel(parcel);
                        }}
                        className="text-blue-900 font-semibold hover:underline"
                      >
                        Inspect Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // All Projects Registry Table
  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-[#0f2942]" />
              <h1 className="font-serif text-xl font-bold text-slate-900">
                Infrastructure Projects Registry
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Central monitoring index of active highway, railway, metro, and industrial corridors
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            {filteredProjects.length} Projects Shown
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Search Corridors:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, name, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Filter Risk Level:</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
            >
              <option value="all">All Risk Levels</option>
              <option value="CRITICAL">Critical (81–100)</option>
              <option value="HIGH">High (61–80)</option>
              <option value="MEDIUM">Medium (31–60)</option>
              <option value="LOW">Low (0–30)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Executing Authority:</label>
            <select
              value={authorityFilter}
              onChange={(e) => setAuthorityFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
            >
              <option value="all">All Authorities</option>
              {authorities.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Sort By Metric:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
            >
              <option value="risk">Highest Risk Score</option>
              <option value="parcels">Most Total Parcels</option>
              <option value="progress">Lowest Progress %</option>
              <option value="budget">Highest Budget (₹ Cr)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Overview Table */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-3">Project ID & Title</th>
                <th className="p-3">Authority / State</th>
                <th className="p-3 text-center">Parcels (Crit/Tot)</th>
                <th className="p-3 text-center">Acquisition %</th>
                <th className="p-3 text-center">Budget (Cr)</th>
                <th className="p-3 text-center">Delay Risk</th>
                <th className="p-3 text-center">Predicted Delay</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.map(proj => (
                <tr
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className="hover:bg-blue-50/50 cursor-pointer transition"
                >
                  <td className="p-3">
                    <div className="font-bold text-slate-900 text-sm">{proj.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      {proj.id} • {proj.type}
                    </div>
                  </td>

                  <td className="p-3 text-slate-700">
                    <div className="font-semibold">{proj.executingAuthority}</div>
                    <div className="text-[11px] text-slate-500">{proj.district}, {proj.state}</div>
                  </td>

                  <td className="p-3 text-center font-mono">
                    <span className="text-red-700 font-bold">{proj.criticalRiskParcels} Crit</span> / {proj.totalParcels}
                  </td>

                  <td className="p-3 text-center">
                    <span className="font-bold text-slate-900">{proj.progressPercentage}%</span>
                    <div className="w-20 bg-slate-200 h-1.5 mx-auto mt-1">
                      <div
                        className="bg-[#0f2942] h-full"
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </td>

                  <td className="p-3 text-center font-mono text-slate-800">
                    ₹ {proj.budgetCr.toLocaleString('en-IN')}
                  </td>

                  <td className="p-3 text-center">
                    <RiskBadge level={proj.overallRisk} size="sm" score={proj.overallRiskScore} />
                  </td>

                  <td className="p-3 text-center font-mono font-bold text-red-700">
                    +{proj.predictedDelayDays} Days
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(proj);
                      }}
                      className="bg-[#0f2942] hover:bg-slate-800 text-white px-2.5 py-1 text-xs font-semibold rounded-xs transition inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
