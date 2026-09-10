import React, { useState } from 'react';
import { CoordinationTask } from '../types';
import { mockCoordinationTasks } from '../data/departments';
import { Building2, CheckCircle2, Clock, AlertTriangle, Plus, Filter, Send, ShieldAlert } from 'lucide-react';

interface CoordinationPageProps {
  onTaskCountChange?: (count: number) => void;
}

export const CoordinationPage: React.FC<CoordinationPageProps> = () => {
  const [tasks, setTasks] = useState<CoordinationTask[]>(mockCoordinationTasks);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // New task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState<CoordinationTask['department']>('Revenue');
  const [newOfficer, setNewOfficer] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-10-15');
  const [newPriority, setNewPriority] = useState<CoordinationTask['priority']>('CRITICAL');

  const departments: CoordinationTask['department'][] = [
    'Revenue',
    'Legal',
    'District Administration',
    'PWD',
    'R&R',
    'Railways',
    'Project Authority'
  ];

  const filteredTasks = tasks.filter(t => {
    const matchDept = departmentFilter === 'all' || t.department === departmentFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchDept && matchStatus;
  });

  const handleStatusChange = (taskId: string, newStatus: CoordinationTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const created: CoordinationTask = {
      id: `TASK-${Math.floor(500 + Math.random() * 400)}`,
      projectId: 'PRJ-NH48',
      parcelId: 'P-1042',
      department: newDepartment,
      assignedOfficer: newOfficer || 'Designated Nodal Officer',
      taskTitle: newTaskTitle.trim(),
      status: 'Pending',
      deadline: newDeadline,
      priority: newPriority,
      notes: 'Directive dispatched via central administrative coordination console.'
    };

    setTasks([created, ...tasks]);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const getStatusBadge = (status: CoordinationTask['status']) => {
    switch (status) {
      case 'Escalated':
        return 'bg-red-100 text-red-900 border-red-300 font-bold';
      case 'In Progress':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  const getPriorityBadge = (priority: CoordinationTask['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-700 font-bold';
      case 'HIGH':
        return 'text-amber-700 font-semibold';
      case 'MEDIUM':
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
              <Building2 className="w-5 h-5 text-[#0f2942]" />
              <h1 className="font-serif text-xl font-bold text-slate-900">
                Inter-Departmental Statutory Coordination Console
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Task assignment, clearance tracking, and SLA escalation across Revenue, Forest, Judiciary, PWD, and MSEDCL
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0f2942] hover:bg-slate-800 text-white font-semibold text-xs px-3 py-1.5 rounded-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Departmental Directive</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Filter Line Department:</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Filter Compliance Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-blue-900"
            >
              <option value="all">All Task Statuses</option>
              <option value="Escalated">Escalated</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-3">Task ID & Directive</th>
                <th className="p-3">Department</th>
                <th className="p-3">Assigned Officer</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Priority</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 transition">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{task.taskTitle}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      {task.id} • {task.projectId} {task.parcelId && `(Parcel ${task.parcelId})`}
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-slate-800">
                    {task.department}
                  </td>

                  <td className="p-3 text-slate-700">
                    <div>{task.assignedOfficer}</div>
                  </td>

                  <td className="p-3 font-mono text-slate-800">
                    {task.deadline}
                  </td>

                  <td className="p-3">
                    <span className={`text-[11px] ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                      className={`text-[11px] font-semibold p-1 border rounded-xs ${getStatusBadge(task.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Escalated">Escalated</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Directive Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white border border-slate-300 shadow-xl max-w-lg w-full p-6">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">
              Issue Official Administrative Directive
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Directive Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule joint survey measurement with Talathi"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xs text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Department:</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xs text-xs"
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Officer Designation:</label>
                <input
                  type="text"
                  placeholder="e.g. SLAO Pune / Deputy Collector (LA)"
                  value={newOfficer}
                  onChange={(e) => setNewOfficer(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xs text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Deadline:</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xs text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority Tier:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xs text-xs"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0f2942] text-white hover:bg-slate-800 text-xs font-bold"
                >
                  Dispatch Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
