import React, { useState } from 'react';
import { Project, Parcel } from '../types';
import { FileSpreadsheet, Download, Printer, BarChart3, PieChart, Table, CheckCircle2 } from 'lucide-react';

interface ReportsPageProps {
  projects: Project[];
  parcels: Parcel[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ projects, parcels }) => {
  const [reportType, setReportType] = useState<'monthly' | 'critical' | 'compensation'>('monthly');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === 'critical') {
      headers = ['Parcel ID', 'Project ID', 'Project Name', 'Village', 'District', 'Landowner', 'Risk Score', 'Delay Probability %', 'Expected Delay Days', 'Top Risk Factor'];
      rows = parcels
        .filter(p => p.riskCategory === 'CRITICAL' || p.riskScore >= 70)
        .map(p => [
          p.id,
          p.projectId,
          `"${p.projectName}"`,
          p.village,
          p.district,
          `"${p.landownerName}"`,
          p.riskScore.toString(),
          p.delayProbability.toString(),
          p.expectedDelayDays.toString(),
          `"${p.topRiskFactors[0]?.name || ''}"`
        ]);
    } else if (reportType === 'compensation') {
      headers = ['Parcel ID', 'Project', 'Village', 'Landowner', 'Area (Ha)', 'Compensation (Lakhs)', 'Disbursement Status', 'Stage'];
      rows = parcels.map(p => [
        p.id,
        `"${p.projectName}"`,
        p.village,
        `"${p.landownerName}"`,
        p.areaHectares.toString(),
        p.compensationAmountLakhs.toString(),
        p.compensationStatus,
        p.stage
      ]);
    } else {
      headers = ['Project ID', 'Project Name', 'Authority', 'District', 'Total Parcels', 'Acquired Parcels', 'Critical Parcels', 'Progress %', 'Budget Cr', 'Overall Risk', 'Predicted Delay Days'];
      rows = projects.map(p => [
        p.id,
        `"${p.name}"`,
        p.executingAuthority,
        p.district,
        p.totalParcels.toString(),
        p.acquiredParcels.toString(),
        p.criticalRiskParcels.toString(),
        p.progressPercentage.toString(),
        p.budgetCr.toString(),
        p.overallRisk,
        p.predictedDelayDays.toString()
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NEXORA_${reportType.toUpperCase()}_REPORT_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Exported ${reportType.toUpperCase()} CSV report successfully.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-[#0f2942]" />
              <h1 className="font-serif text-xl font-bold text-slate-900">
                Official Analytical Reports & Data Export Engine
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate standardized analytical dossiers for Executive Leadership, Strategic Oversight, and Project Directors
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-semibold rounded-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 bg-[#0f2942] hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold rounded-xs shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Official CSV</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 mb-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Report Selector Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 text-xs">
          <button
            onClick={() => setReportType('monthly')}
            className={`pb-2 px-3 font-semibold transition ${
              reportType === 'monthly'
                ? 'border-b-2 border-blue-900 text-blue-950'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Monthly Corridor Delay Risk Report
          </button>
          <button
            onClick={() => setReportType('critical')}
            className={`pb-2 px-3 font-semibold transition ${
              reportType === 'critical'
                ? 'border-b-2 border-blue-900 text-blue-950'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Critical Parcels Bottleneck Summary
          </button>
          <button
            onClick={() => setReportType('compensation')}
            className={`pb-2 px-3 font-semibold transition ${
              reportType === 'compensation'
                ? 'border-b-2 border-blue-900 text-blue-950'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Compensation Fund Flow & Escrow Audit
          </button>
        </div>
      </div>

      {/* Report Preview Surface */}
      <div className="bg-white border border-slate-300 shadow-xs p-6">
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            NEXORA Infrastructure Intelligence • Corridor Risk Management Directorate
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900 mt-1">
            {reportType === 'monthly' && 'INFRASTRUCTURE CORRIDOR ACQUISITION RISK REPORT'}
            {reportType === 'critical' && 'STATUTORY BOTTLENECK & CRITICAL PARCEL AUDIT'}
            {reportType === 'compensation' && 'COMPENSATION DISBURSEMENT & ESCROW COMPLIANCE DOSSIER'}
          </h2>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • Executive Decision Support Extract
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto text-xs">
          {reportType === 'monthly' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2">ID</th>
                  <th className="p-2">Project Corridor</th>
                  <th className="p-2">Authority</th>
                  <th className="p-2 text-center">Parcels</th>
                  <th className="p-2 text-center">Progress</th>
                  <th className="p-2 text-center">Risk</th>
                  <th className="p-2 text-center">Expected Delay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map(p => (
                  <tr key={p.id}>
                    <td className="p-2 font-mono font-bold text-blue-950">{p.id}</td>
                    <td className="p-2 font-medium">{p.name}</td>
                    <td className="p-2">{p.executingAuthority}</td>
                    <td className="p-2 text-center font-mono">{p.totalParcels}</td>
                    <td className="p-2 text-center font-semibold">{p.progressPercentage}%</td>
                    <td className="p-2 text-center font-bold">{p.overallRisk} ({p.overallRiskScore})</td>
                    <td className="p-2 text-center font-mono text-red-700 font-bold">+{p.predictedDelayDays}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'critical' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2">Parcel</th>
                  <th className="p-2">Corridor</th>
                  <th className="p-2">Village / Survey</th>
                  <th className="p-2">Landowner</th>
                  <th className="p-2 text-center">Risk Score</th>
                  <th className="p-2 text-center">Delay Days</th>
                  <th className="p-2">Primary Bottleneck</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {parcels.filter(p => p.riskScore >= 70).map(p => (
                  <tr key={p.id}>
                    <td className="p-2 font-mono font-bold text-blue-950">{p.id}</td>
                    <td className="p-2">{p.projectName}</td>
                    <td className="p-2">{p.village} (#{p.surveyNumber})</td>
                    <td className="p-2 font-medium">{p.landownerName}</td>
                    <td className="p-2 text-center font-bold text-red-700">{p.riskScore}/100</td>
                    <td className="p-2 text-center font-mono font-bold text-red-700">+{p.expectedDelayDays}d</td>
                    <td className="p-2 text-slate-700">{p.topRiskFactors[0]?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'compensation' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2">Parcel</th>
                  <th className="p-2">Project</th>
                  <th className="p-2">Title Holder</th>
                  <th className="p-2 text-right">Area (Ha)</th>
                  <th className="p-2 text-right">Award (₹ Lakhs)</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {parcels.map(p => (
                  <tr key={p.id}>
                    <td className="p-2 font-mono font-bold text-blue-950">{p.id}</td>
                    <td className="p-2">{p.projectName}</td>
                    <td className="p-2 font-medium">{p.landownerName}</td>
                    <td className="p-2 text-right font-mono">{p.areaHectares}</td>
                    <td className="p-2 text-right font-mono font-bold">₹ {p.compensationAmountLakhs}L</td>
                    <td className="p-2 text-center font-semibold">{p.compensationStatus}</td>
                    <td className="p-2">{p.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
