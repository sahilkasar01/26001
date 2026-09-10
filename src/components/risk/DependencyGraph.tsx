import React, { useState } from 'react';
import { Parcel } from '../../types';
import { ArrowDown, AlertOctagon, Network, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface DependencyGraphProps {
  parcel: Parcel;
  onOpenParcelModal?: (parcel: Parcel) => void;
}

interface NodeDetail {
  id: string;
  title: string;
  stageName: string;
  status: 'Critical Bottleneck' | 'Delayed' | 'Impact Zone' | 'Downstream Risk';
  delayDays: string;
  owner: string;
  description: string;
  actionRequired: string;
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({ parcel, onOpenParcelModal }) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);

  const nodes: NodeDetail[] = [
    {
      id: 'node-parcel',
      title: `Critical Parcel: ${parcel.id}`,
      stageName: parcel.village + ' (' + parcel.district + ')',
      status: 'Critical Bottleneck',
      delayDays: `+${parcel.expectedDelayDays} Days`,
      owner: 'Special Land Acquisition Officer (SLAO)',
      description: `Survey No. ${parcel.surveyNumber} (${parcel.areaHectares} Ha) under coparcenary ownership dispute and pending fund disbursement. Anchors contiguity for 2.4 km stretch.`,
      actionRequired: 'Joint conciliation and deposit in court under Section 77(2).'
    },
    {
      id: 'node-stage-comp',
      title: 'Compensation Disbursement Pending',
      stageName: 'Statutory Stage: Compensation (LARR Sec 38)',
      status: 'Delayed',
      delayDays: '+14 Days Overdue',
      owner: 'Sub-Divisional Treasury Office',
      description: 'Award approved on 14-Aug-2024 but fund disbursement stalled in treasury verification. Disputed coparceners refuse physical vacation without realized account credit.',
      actionRequired: 'Authorize SLAO emergency escrow account release.'
    },
    {
      id: 'node-stage-legal',
      title: 'Legal Clearance Delayed',
      stageName: 'Statutory Stage: Civil Court Injunction',
      status: 'Delayed',
      delayDays: '+45 Days Latency',
      owner: 'Legal Advisory Council / Civil Court',
      description: 'Coparcenary partition suit filed in Civil Court prevents sub-collector from issuing vacant possession certificate under Section 40.',
      actionRequired: 'File urgent civil interim relief application to ring-fence undisputed corridor.'
    },
    {
      id: 'node-contract-pkg',
      title: 'Package 3 Civil Execution Delayed',
      stageName: 'Corridor Construction: Ch. 64+200 to 66+800',
      status: 'Impact Zone',
      delayDays: '+95 Days Projected',
      owner: 'EPC Concessionaire / Field Project Implementation Unit',
      description: 'Contractor machinery mobilised on site cannot commence earthwork or bridge pier foundation due to contiguous 800m missing right-of-way.',
      actionRequired: 'Contractor claiming idle machinery standing charges of Rs 4.2 Lakh/day.'
    },
    {
      id: 'node-proj-risk',
      title: 'Overall Project Completion Risk',
      stageName: parcel.projectName,
      status: 'Downstream Risk',
      delayDays: '+140 Days Commercial Delay',
      owner: 'Project Steering Committee / Executive Board',
      description: 'Interconnected delay cascades to statutory target completion date. Violates commissioning window for freight corridor timeline.',
      actionRequired: 'Escalate to Project Empowered Committee.'
    }
  ];

  const activeNode = nodes[selectedNodeIndex];

  return (
    <div className="bg-white border border-slate-300 shadow-xs p-5">
      {/* Official Header */}
      <div className="border-b border-slate-200 pb-3 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-[#0f2942]" />
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Delay Dependency Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Identifies critical parcels and stages capable of triggering cascading project delays.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-mono">Anchor Parcel:</span>
            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-900 px-2 py-0.5 border border-slate-300">
              {parcel.id}
            </span>
            <RiskBadge level={parcel.riskCategory} size="sm" score={parcel.riskScore} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Cascading Flow Nodes */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full space-y-2">
            {nodes.map((node, index) => {
              const isSelected = selectedNodeIndex === index;
              const isLast = index === nodes.length - 1;

              let borderAccent = 'border-slate-300';
              let badgeColor = 'bg-slate-100 text-slate-700';

              if (index === 0) {
                borderAccent = 'border-red-500 bg-red-50/40';
                badgeColor = 'bg-red-100 text-red-800 border-red-300 font-bold';
              } else if (index === 1 || index === 2) {
                borderAccent = 'border-orange-400 bg-orange-50/30';
                badgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
              } else if (index === 3) {
                borderAccent = 'border-amber-400 bg-amber-50/20';
                badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
              } else {
                borderAccent = 'border-blue-900 bg-blue-50/30';
                badgeColor = 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
              }

              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => setSelectedNodeIndex(index)}
                    className={`w-full p-3.5 border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'ring-2 ring-[#0f2942] shadow-sm ' + borderAccent
                        : 'hover:border-slate-400 ' + borderAccent
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            STEP 0{index + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{node.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{node.stageName}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${badgeColor}`}>
                          {node.status}
                        </span>
                        <div className="text-xs font-mono font-bold text-red-700 mt-1">
                          {node.delayDays}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isLast && (
                    <div className="flex justify-center py-0.5">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-3 bg-slate-400"></div>
                        <ArrowDown className="w-4 h-4 text-slate-600" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                          Cascades To
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Node Inspection Panel */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-300 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 mb-3">
              <Info className="w-4 h-4 text-[#0f2942]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Node Diagnostic Details
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px]">Selected Bottleneck Node:</span>
                <div className="font-bold text-slate-900 text-sm">{activeNode.title}</div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px]">Sub-system / Location:</span>
                <div className="font-medium text-slate-800">{activeNode.stageName}</div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px]">Responsible Authority:</span>
                <div className="font-semibold text-slate-900">{activeNode.owner}</div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px]">Delay Assessment:</span>
                <div className="font-mono font-bold text-red-700">{activeNode.delayDays}</div>
              </div>

              <div className="p-3 bg-white border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Cause & Propagation Mechanism:
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {activeNode.description}
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-semibold text-amber-900 block mb-1">
                  Required Action to Break Delay Chain:
                </span>
                <p className="text-slate-800 text-xs font-medium leading-relaxed">
                  {activeNode.actionRequired}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-right">
            <span className="text-[11px] text-slate-500 block mb-2">
              Select any node on the left to inspect propagation variables
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
