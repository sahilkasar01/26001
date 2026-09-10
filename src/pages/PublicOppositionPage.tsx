import React, { useState } from 'react';
import { StakeholderGroup } from '../types';
import { mockStakeholders } from '../data/stakeholders';
import { Users, AlertTriangle, Shield, CheckCircle2, MessageSquare, Building, ArrowRight } from 'lucide-react';

export const PublicOppositionPage: React.FC = () => {
  const [stakeholders, setStakeholders] = useState<StakeholderGroup[]>(mockStakeholders);
  const [selectedGroup, setSelectedGroup] = useState<StakeholderGroup>(mockStakeholders[0]);
  const [engagementLog, setEngagementLog] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');

  const handleLogEngagement = () => {
    if (!noteInput.trim()) return;
    setEngagementLog(prev => [
      `[${new Date().toLocaleDateString('en-IN')}] Official Conciliation Minute: ${noteInput.trim()}`,
      ...prev
    ]);
    setNoteInput('');
  };

  const getSentimentBadge = (sentiment: StakeholderGroup['sentimentStatus']) => {
    switch (sentiment) {
      case 'Adverse Opposition':
        return 'bg-red-100 text-red-900 border-red-300 font-bold';
      case 'Conditional Agreement':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Grievance Pending':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Cooperative':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  const getEscalationBadge = (esc: StakeholderGroup['escalationLevel']) => {
    switch (esc) {
      case 'Level 3 - District Collector':
        return 'text-red-700 font-bold';
      case 'Level 2 - Sub-Divisional Magistrate':
        return 'text-amber-700 font-semibold';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#0f2942]" />
              <h1 className="font-serif text-xl font-bold text-slate-900">
                Civic Opposition & Stakeholder Risk Monitoring Console
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured administrative tracking of collective landowner unions, tribal councils, and environmental grievance committees
            </p>
          </div>

          <span className="bg-slate-100 text-slate-700 text-xs font-mono font-medium px-2.5 py-1 border border-slate-300">
            Social Impact Intelligence
          </span>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Tracked Collective Groups</span>
            <span className="text-lg font-bold font-mono text-slate-900">{stakeholders.length}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Adverse Opposition</span>
            <span className="text-lg font-bold font-mono text-red-700">3 Groups</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Total Registered Objections</span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {stakeholders.reduce((acc, s) => acc + s.totalObjections, 0)}
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Proactive Conciliation Protocol</span>
            <span className="text-xs font-bold text-emerald-700 mt-1 block">Active RFCTLARR Sec 15</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Group Cards, Right = Strategic Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Groups List */}
        <div className="lg:col-span-6 space-y-3">
          {stakeholders.map(group => {
            const isSelected = selectedGroup.id === group.id;

            return (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`p-4 bg-white border cursor-pointer transition text-xs ${
                  isSelected
                    ? 'border-[#0f2942] ring-1 ring-[#0f2942] shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      {group.id} • {group.projectId} • {group.type}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{group.entityName}</h3>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {group.village}, {group.district}
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${getSentimentBadge(group.sentimentStatus)}`}>
                    {group.sentimentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-2">
                  <div>
                    <span className="text-slate-500">Objection Petitions: </span>
                    <strong className="text-slate-900">{group.totalObjections} ({group.unresolvedComplaints} pending)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Escalation: </span>
                    <strong className={getEscalationBadge(group.escalationLevel)}>
                      {group.escalationLevel.split('-')[1] || group.escalationLevel}
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 italic bg-slate-50 p-2 border border-slate-100 line-clamp-2">
                  &quot;{group.primaryIssue}&quot;
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Strategic Engagement Panel */}
        <div className="lg:col-span-6 bg-white border border-slate-300 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {selectedGroup.id} • {selectedGroup.projectId} • {selectedGroup.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-serif mt-0.5">
                  {selectedGroup.entityName}
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedGroup.village}, District {selectedGroup.district}
                </span>
              </div>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${getSentimentBadge(selectedGroup.sentimentStatus)}`}>
                {selectedGroup.sentimentStatus}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Primary Grievance */}
              <div className="p-3.5 bg-red-50/60 border border-red-200">
                <span className="text-[11px] font-bold text-red-900 block mb-1">
                  Core Grievance & Collective Demand:
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {selectedGroup.primaryIssue}
                </p>
              </div>

              {/* Statutory Escalation Tier */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[11px] block">Statutory Escalation Level:</span>
                  <span className={`font-semibold ${getEscalationBadge(selectedGroup.escalationLevel)}`}>
                    {selectedGroup.escalationLevel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Last Formal Hearing Date:</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedGroup.lastMeetingDate}</span>
                </div>
              </div>

              {/* Recommended Conciliation Strategy */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200">
                <span className="text-[11px] font-bold text-blue-950 block mb-1">
                  Mandated Administrative Conciliation Protocol:
                </span>
                <p className="text-slate-800 leading-relaxed">
                  Convene tri-partite session headed by {selectedGroup.escalationLevel.includes('Collector') ? 'District Collector' : 'Sub-Divisional Magistrate (SDM)'} with village representatives. Verify land measurement survey records and explain 100% Solatium provisions under RFCTLARR 2013 First Schedule.
                </p>
              </div>

              {/* Log Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Log Official Conciliation / Hearing Minute:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Record outcomes or consensus reached with delegation..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 p-2 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
                  />
                  <button
                    onClick={handleLogEngagement}
                    className="bg-[#0f2942] hover:bg-slate-800 text-white font-semibold px-3 py-1 text-xs rounded-xs"
                  >
                    Log Minute
                  </button>
                </div>

                {engagementLog.length > 0 && (
                  <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto">
                    {engagementLog.map((log, i) => (
                      <div key={i} className="text-[11px] text-slate-600 bg-slate-50 p-1.5 border border-slate-200">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 text-right">
            <span className="text-[11px] text-slate-500">
              Compliant with Section 15(1) public consultation protocols under RFCTLARR Act
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
