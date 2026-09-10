import React, { useState } from 'react';
import { SystemAlert, Parcel } from '../types';
import { BellRing, CheckCircle2, Clock, AlertTriangle, Filter, Search, ArrowRight } from 'lucide-react';

interface AlertsPageProps {
  alerts: SystemAlert[];
  parcels: Parcel[];
  onSelectParcel: (parcel: Parcel) => void;
  onNavigateToWhatIf: (parcel: Parcel) => void;
  onUpdateAlertStatus: (alertId: string, newStatus: SystemAlert['status']) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  parcels,
  onSelectParcel,
  onNavigateToWhatIf,
  onUpdateAlertStatus
}) => {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter(a => {
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchSearch =
      searchQuery === '' ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.parcelId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.projectId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchSeverity && matchStatus && matchSearch;
  });

  const getSeverityBadge = (sev: SystemAlert['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-900 border-red-300 font-bold';
      case 'HIGH':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'INFO':
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  const getStatusBadge = (status: SystemAlert['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Investigating':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Action Assigned':
        return 'bg-blue-50 text-blue-900 border-blue-200 font-bold';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <BellRing className="w-5 h-5 text-[#0f2942]" />
              <h1 className="font-serif text-xl font-bold text-slate-900">
                Statutory Delay Alert Center & Notification Console
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated anomaly detection triggering alerts on statutory deadline slippages and legal obstacles
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-300">
              {alerts.length} Total Alerts Logged
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Search Alert Text / Parcel:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ALT-8801, P-1042, legal dispute..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Filter Severity:</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="INFO">Informational</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Filter Workflow Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Investigating">Investigating</option>
              <option value="Action Assigned">Action Assigned</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-3">Alert ID & Time</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Project / Parcel</th>
                <th className="p-3">Alert Description</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAlerts.map(alert => {
                const targetParcel = alert.parcelId ? parcels.find(p => p.id === alert.parcelId) : null;

                return (
                  <tr key={alert.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-mono font-bold text-slate-900">{alert.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{alert.timestamp}</div>
                    </td>

                    <td className="p-3">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{alert.projectId}</div>
                      {alert.parcelId && (
                        <div className="text-[11px] font-mono text-blue-900 font-semibold">
                          Parcel: {alert.parcelId}
                        </div>
                      )}
                    </td>

                    <td className="p-3 text-slate-800">
                      <div className="font-medium text-slate-900">{alert.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Trigger: {alert.cause}
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <select
                        value={alert.status}
                        onChange={(e) => onUpdateAlertStatus(alert.id, e.target.value as any)}
                        className={`text-[11px] font-semibold p-1 border rounded-xs ${getStatusBadge(alert.status)}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Investigating">Investigating</option>
                        <option value="Action Assigned">Action Assigned</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {targetParcel && (
                          <button
                            onClick={() => onSelectParcel(targetParcel)}
                            className="text-blue-900 hover:underline font-semibold text-[11px]"
                          >
                            Inspect Parcel →
                          </button>
                        )}
                        {targetParcel && (
                          <button
                            onClick={() => onNavigateToWhatIf(targetParcel)}
                            className="bg-[#0f2942] hover:bg-slate-800 text-white px-2 py-1 text-[11px] font-semibold"
                          >
                            Simulate
                          </button>
                        )}
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
