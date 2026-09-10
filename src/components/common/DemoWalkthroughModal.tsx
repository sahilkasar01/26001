import React, { useState } from 'react';
import { NavigationTab } from './Sidebar';
import { Parcel, Project } from '../../types';
import { Sparkles, ChevronRight, ChevronLeft, Check, Play, X, ExternalLink } from 'lucide-react';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectProject: (project: Project) => void;
  onSelectParcel: (parcel: Parcel) => void;
  targetProject: Project;
  targetParcel: Parcel;
  onDispatchIntervention: () => void;
}

interface DemoStep {
  step: number;
  title: string;
  narrative: string;
  recommendedTab: NavigationTab;
  actionText: string;
  actionPayload?: 'openProject' | 'openParcel' | 'openWhatIf' | 'dispatchAction';
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectProject,
  onSelectParcel,
  targetProject,
  targetParcel,
  onDispatchIntervention
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const steps: DemoStep[] = [
    {
      step: 1,
      title: '1. Administrator Opens Executive Monitoring Dashboard',
      narrative: 'The central administration logs into NEXORA. The system instantly aggregates real-time data across 10 active infrastructure corridors, presenting 5 high-level decision pillars: What is at risk, Where, Why, Consequences of inaction, and Recommended interventions.',
      recommendedTab: 'dashboard',
      actionText: 'Go to Executive Dashboard'
    },
    {
      step: 2,
      title: '2. Dashboard Flags Critical Project (NH-48 Corridor)',
      narrative: 'Among active corridors, "NH-48 Golden Quadrilateral 6-Lane Expansion" is flagged with an Overall Risk Score of 84/100 (CRITICAL), having 12 critical parcels threatening a projected 140-day commissioning delay.',
      recommendedTab: 'projects',
      actionText: 'View Projects Registry'
    },
    {
      step: 3,
      title: '3. Administrator Inspects Project Details & Timeline',
      narrative: 'Opening NH-48 reveals stage-wise bottlenecks: while Landowner Notification is at 94%, Compensation Disbursement is severely stalled at 58% and Legal Clearance at 46%.',
      recommendedTab: 'projects',
      actionText: 'Open NH-48 Project Details',
      actionPayload: 'openProject'
    },
    {
      step: 4,
      title: '4. System Pinpoints Epicenter: Critical Parcel P-1042',
      narrative: 'The AI risk ranking engine flags Survey No. 104/2B (Parcel P-1042, Talegaon Dabhade) as the highest delay hotspot with a risk score of 87/100 and an 82% delay probability.',
      recommendedTab: 'critical-parcels',
      actionText: 'Inspect Parcel P-1042',
      actionPayload: 'openParcel'
    },
    {
      step: 5,
      title: '5. Explainable AI Decomposes Risk Drivers (SHAP)',
      narrative: 'Instead of an unexplainable "black box", NEXORA isolates top contributing factors: Compensation Pending (31%), Legal Objection (24%), and Unreachable Heirs (18%). Clear diagnosis: coparcenary inheritance contest.',
      recommendedTab: 'risk-intelligence',
      actionText: 'View Explainable AI Attribution'
    },
    {
      step: 6,
      title: '6. GIS Map Reveals Contiguous Corridor Freeze',
      narrative: 'Viewing the GIS risk layer shows that Parcel P-1042 sits directly in the Maval Hotspot Zone, arresting right-of-way connectivity across 8 adjacent parcels (P-1043 through P-1049).',
      recommendedTab: 'gismap',
      actionText: 'View GIS Critical Hotspot Zone'
    },
    {
      step: 7,
      title: '7. Dependency Graph Visualizes Cascading Impact',
      narrative: 'The Delay Dependency Graph shows the chain reaction: Parcel P-1042 delay → Compensation Stall → Injunction in Civil Court → EPC Contractor Package 3 Stoppage → Corridor Commissioning Delay (+140 days).',
      recommendedTab: 'dependency-graph',
      actionText: 'Examine Dependency Cascade'
    },
    {
      step: 8,
      title: '8. AI Recommendation Engine Suggests Resolution',
      narrative: 'The recommendation engine proposes a legally sound administrative solution: Schedule joint conciliation with SLAO and co-sharers, and deposit the disputed portion in court escrow under Section 77(2) to vacate the civil stay.',
      recommendedTab: 'recommendations',
      actionText: 'Review AI Recommendations'
    },
    {
      step: 9,
      title: '9. Administrator Launches What-If Action Simulator',
      narrative: 'The administrator opens the What-If Simulator to test the effectiveness of this policy intervention before committing departmental resources.',
      recommendedTab: 'what-if',
      actionText: 'Open What-If Simulator',
      actionPayload: 'openWhatIf'
    },
    {
      step: 10,
      title: '10. Simulator Computes Quantitative Risk Reduction',
      narrative: 'Selecting "Resolve Legal Objection" (-21 pts) and "Complete Compensation" (-18 pts) immediately drives the projected risk score down from 87 to 52 (CRITICAL → MEDIUM) and saves ~24 days of latency.',
      recommendedTab: 'what-if',
      actionText: 'View Simulated Risk Drop'
    },
    {
      step: 11,
      title: '11. Administrator Assigns Action to Revenue & Legal Wings',
      narrative: 'With one click, the executive issues a directive to SLAO Pune and the Chief Legal Counsel in the Inter-Department Coordination module with strict statutory deadlines.',
      recommendedTab: 'coordination',
      actionText: 'Dispatch Action to Departments',
      actionPayload: 'dispatchAction'
    },
    {
      step: 12,
      title: '12. Alert Center Updates to "Action Assigned"',
      narrative: 'The system updates Alert ALT-8801 to "Action Assigned", closing the loop between AI delay detection and timely executive intervention.',
      recommendedTab: 'alerts',
      actionText: 'Verify Alert Status in Alert Center'
    }
  ];

  const currentStep = steps[currentStepIndex];

  const handleExecuteStep = () => {
    onNavigateTab(currentStep.recommendedTab);
    if (currentStep.actionPayload === 'openProject') {
      onSelectProject(targetProject);
    } else if (currentStep.actionPayload === 'openParcel') {
      onSelectParcel(targetParcel);
    } else if (currentStep.actionPayload === 'dispatchAction') {
      onDispatchIntervention();
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const nextStep = steps[nextIdx];
      onNavigateTab(nextStep.recommendedTab);
      if (nextStep.actionPayload === 'openProject') {
        onSelectProject(targetProject);
      } else if (nextStep.actionPayload === 'openParcel') {
        onSelectParcel(targetParcel);
      } else if (nextStep.actionPayload === 'dispatchAction') {
        onDispatchIntervention();
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onNavigateTab(steps[prevIdx].recommendedTab);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-lg w-full bg-slate-900 text-white border-2 border-amber-500 shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-5">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-1.5 py-0.5 rounded-xs">
            EXECUTIVE DEMO
          </span>
          <span className="text-xs font-bold text-amber-400">
            Interactive Guided Walkthrough (Step {currentStep.step} of 12)
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1"
          title="Minimize Demo Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Narrative Body */}
      <div className="space-y-2 mb-4">
        <h3 className="text-sm font-bold text-white font-serif">
          {currentStep.title}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {currentStep.narrative}
        </p>
      </div>

      {/* Step Action Button */}
      <div className="mb-3">
        <button
          onClick={handleExecuteStep}
          className="w-full bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold py-1.5 px-3 rounded-xs flex items-center justify-center space-x-1.5 transition"
        >
          <span>{currentStep.actionText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress & Pagination Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className={`flex items-center space-x-1 px-2 py-1 rounded-xs ${
            currentStepIndex === 0
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-1">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStepIndex(idx);
                onNavigateTab(s.recommendedTab);
              }}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentStepIndex
                  ? 'bg-amber-400 scale-125'
                  : idx < currentStepIndex
                  ? 'bg-emerald-500'
                  : 'bg-slate-700'
              }`}
              title={`Jump to step ${s.step}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          className={`flex items-center space-x-1 px-2 py-1 rounded-xs font-bold ${
            currentStepIndex === steps.length - 1
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
          }`}
        >
          <span>Next Step</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
