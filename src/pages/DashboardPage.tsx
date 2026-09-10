import React, { useState, useMemo } from 'react';
import { Project, Parcel, SystemAlert, AcquisitionStage } from '../types';
import { NavigationTab } from '../components/common/Sidebar';
import { KpiCard } from '../components/common/KpiCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  FolderGit2, 
  Layers, 
  AlertOctagon, 
  Clock, 
  TrendingUp, 
  BellRing, 
  ArrowRight, 
  MapPin, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  Lightbulb, 
  ExternalLink,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Pin,
  Sparkles,
  ArrowUpDown,
  Calculator,
  CheckSquare,
  Square,
  FileText,
  Filter,
  Plus,
  RotateCcw,
  UserCheck,
  AlertTriangle,
  MessageSquareQuote,
  Star,
  ThumbsUp
} from 'lucide-react';
import { FeedbackItem } from '../types/feedback';
import { calculateFeedbackStats, INITIAL_FEEDBACK_DATA } from '../data/feedback';

interface DashboardPageProps {
  projects: Project[];
  parcels: Parcel[];
  alerts: SystemAlert[];
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectProject: (project: Project) => void;
  onSelectParcel: (parcel: Parcel) => void;
  feedbackList?: FeedbackItem[];
  onOpenFeedbackModal?: () => void;
}

// 4 Handcrafted Executive Crisis Dossiers
interface DossierDetail {
  projectId: string;
  projectName: string;
  location: string;
  criticalParcelId: string;
  criticalSurvey: string;
  whatIsAtRisk: string;
  whereIsAtRisk: string;
  whyIsAtRisk: string;
  consequenceIfIgnored: string;
  recommendedIntervention: string;
  baseDelayDays: number;
  baseProbability: number;
  mitigatedDelayDays: number;
  mitigatedProbability: number;
  penaltyPerDayLakhs: number;
}

const DOSSIERS: DossierDetail[] = [
  {
    projectId: 'PRJ-NH48',
    projectName: 'NH-48 6-Lane Expansion',
    location: 'Pune & Raigad (Maval Taluka)',
    criticalParcelId: 'P-1042',
    criticalSurvey: 'Survey No. 104/2B',
    whatIsAtRisk: '140-day commissioning stall across 2.4 km contiguous highway stretch.',
    whereIsAtRisk: 'Talegaon Dabhade & Urse (Maval Taluka, Pune District).',
    whyIsAtRisk: 'Pending compensation fund release (31%) & coparcenary legal contest (24%).',
    consequenceIfIgnored: 'EPC Concessionaire claims idle machinery penalties of ₹4.2 Lakh/day; Package 3 deferred by 95 days.',
    recommendedIntervention: 'Execute Section 77 escrow deposit to vacate interim restraint; schedule joint SLAO conciliation.',
    baseDelayDays: 140,
    baseProbability: 82,
    mitigatedDelayDays: 52,
    mitigatedProbability: 44,
    penaltyPerDayLakhs: 4.2
  },
  {
    projectId: 'PRJ-DFC92',
    projectName: 'Western Freight Corridor (Package 3B)',
    location: 'Thane & Palghar (Dahanu Taluka)',
    criticalParcelId: 'P-2089',
    criticalSurvey: 'Survey No. 208/4',
    whatIsAtRisk: '95-day bridge abutment construction halt on electrified rail link.',
    whereIsAtRisk: 'Vangaon & Manor fringe forest zone (Palghar District).',
    whyIsAtRisk: 'Forest Rights Act (FRA 2006) community resolution deferred + Stage-II MoEFCC clearance backlog.',
    consequenceIfIgnored: 'Track-laying machinery mobilised on site stands idle; seasonal monsoon window missed.',
    recommendedIntervention: 'Convene expedited special Gram Sabha with Collector facilitation; grant advance tree-felling permit.',
    baseDelayDays: 95,
    baseProbability: 74,
    mitigatedDelayDays: 38,
    mitigatedProbability: 35,
    penaltyPerDayLakhs: 5.8
  },
  {
    projectId: 'PRJ-HSR01',
    projectName: 'High-Speed Rail Corridor',
    location: 'Surat & Navsari',
    criticalParcelId: 'P-3044',
    criticalSurvey: 'Survey No. 304/1A',
    whatIsAtRisk: '120-day viaduct pier construction freeze over agricultural plots.',
    whereIsAtRisk: 'Chikhli & Gandevi belt (Navsari District).',
    whyIsAtRisk: 'Multiple co-heirs contesting circle rate multiplier applied to irrigated orchard lands.',
    consequenceIfIgnored: 'Segmental launcher crane cannot advance; penalty surcharge triggered by international contractor.',
    recommendedIntervention: 'Constitute District Valuation Review panel; disburse 80% undisputed solatium directly.',
    baseDelayDays: 120,
    baseProbability: 78,
    mitigatedDelayDays: 45,
    mitigatedProbability: 38,
    penaltyPerDayLakhs: 7.5
  },
  {
    projectId: 'PRJ-EXP11',
    projectName: 'Bengaluru-Chennai Expressway',
    location: 'Kolar & Chittoor',
    criticalParcelId: 'P-4012',
    criticalSurvey: 'Survey No. 88/3',
    whatIsAtRisk: '85-day interchange embankment stoppage at industrial bypass.',
    whereIsAtRisk: 'Bangarapet & Mulbagal corridor (Kolar District).',
    whyIsAtRisk: 'Delayed underground water utility shifting + compensation escrow release dispute.',
    consequenceIfIgnored: 'Interchange ramp cannot tie into state highway; traffic diversion creates regional bottleneck.',
    recommendedIntervention: 'Execute tripartite escrow deed between Water Supply Board, NHAI, and Collectorate.',
    baseDelayDays: 85,
    baseProbability: 66,
    mitigatedDelayDays: 30,
    mitigatedProbability: 28,
    penaltyPerDayLakhs: 3.6
  }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  parcels,
  alerts,
  onNavigateTab,
  onSelectProject,
  onSelectParcel,
  feedbackList = INITIAL_FEEDBACK_DATA,
  onOpenFeedbackModal
}) => {
  // --- Feedback Overall Stats ---
  const feedbackStats = useMemo(() => {
    return calculateFeedbackStats(feedbackList);
  }, [feedbackList]);

  // --- Interactive State ---
  // 1. Executive Dossier Selector
  const [selectedDossierIndex, setSelectedDossierIndex] = useState<number>(0);
  const [isSimulatingRelief, setIsSimulatingRelief] = useState<boolean>(false);

  // 2. Lifecycle Stage Interactive Scrubber
  const [activeStageFilter, setActiveStageFilter] = useState<AcquisitionStage | null>(null);

  // 3. Corridor Ledger Table Controls
  const [corridorSearch, setCorridorSearch] = useState<string>('');
  const [corridorFilter, setCorridorFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'HIGHWAY' | 'RAILWAY'>('ALL');
  const [corridorSortBy, setCorridorSortBy] = useState<'risk' | 'progress' | 'criticalParcels' | 'landArea'>('risk');
  const [corridorSortAsc, setCorridorSortAsc] = useState<boolean>(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>('PRJ-NH48');

  // 4. Critical Parcels Workbench Controls
  const [parcelCategoryFilter, setParcelCategoryFilter] = useState<'ALL' | 'LEGAL' | 'COMPENSATION' | 'APPROVAL'>('ALL');
  const [parcelViewMode, setParcelViewMode] = useState<'cards' | 'table'>('cards');
  const [pinnedParcelIds, setPinnedParcelIds] = useState<Set<string>>(new Set(['P-1042']));

  // 5. On-Dashboard Delay Impact Sandbox
  const [simulatedDelayDays, setSimulatedDelayDays] = useState<number>(45);

  // 6. Interactive Analyst Field Checklist & Scratchpad
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: 'Verify Survey 104/2B boundary with electronic total station (ETS)', done: true, tag: 'Survey' },
    { id: 2, text: 'Draft Section 77 escrow deposit directive for SLAO Pune', done: true, tag: 'Legal' },
    { id: 3, text: 'Depute special conciliation team for Urse co-sharers', done: false, tag: 'Conciliation' },
    { id: 4, text: 'Clear Stage-II tree felling compensatory afforestation plan (DFCCIL)', done: false, tag: 'Forest' }
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Calculations
  const totalParcelsCount = projects.reduce((acc, p) => acc + p.totalParcels, 0);
  const highRiskParcelsCount = projects.reduce((acc, p) => acc + p.highRiskParcels + p.criticalRiskParcels, 0);
  const avgProgress = Math.round(projects.reduce((acc, p) => acc + p.progressPercentage, 0) / projects.length);
  const activeAlertsCount = alerts.filter(a => a.status === 'Active' || a.status === 'Investigating').length;

  const currentDossier = DOSSIERS[selectedDossierIndex];

  // Toggle Pinned status
  const togglePinParcel = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPinnedParcelIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle Checklist
  const toggleChecklist = (id: number) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklistItems(prev => [
      ...prev,
      { id: Date.now(), text: newChecklistText.trim(), done: false, tag: 'Field Memo' }
    ]);
    setNewChecklistText('');
  };

  // Filter & Sort Projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(corridorSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(corridorSearch.toLowerCase()) ||
        p.district.toLowerCase().includes(corridorSearch.toLowerCase());
      
      if (!matchesSearch) return false;

      if (corridorFilter === 'CRITICAL') return p.overallRisk === 'CRITICAL';
      if (corridorFilter === 'HIGH') return p.overallRisk === 'HIGH' || p.overallRisk === 'CRITICAL';
      if (corridorFilter === 'HIGHWAY') return p.type.toLowerCase().includes('highway') || p.type.toLowerCase().includes('expressway');
      if (corridorFilter === 'RAILWAY') return p.type.toLowerCase().includes('rail') || p.type.toLowerCase().includes('freight');
      return true;
    }).sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (corridorSortBy === 'risk') {
        valA = a.overallRiskScore;
        valB = b.overallRiskScore;
      } else if (corridorSortBy === 'progress') {
        valA = a.progressPercentage;
        valB = b.progressPercentage;
      } else if (corridorSortBy === 'criticalParcels') {
        valA = a.criticalRiskParcels;
        valB = b.criticalRiskParcels;
      } else if (corridorSortBy === 'landArea') {
        valA = a.totalLandRequiredHectares;
        valB = b.totalLandRequiredHectares;
      }
      return corridorSortAsc ? valA - valB : valB - valA;
    });
  }, [projects, corridorSearch, corridorFilter, corridorSortBy, corridorSortAsc]);

  // Filter Critical Parcels
  const filteredParcels = useMemo(() => {
    return parcels.filter(p => {
      if (p.riskCategory !== 'CRITICAL' && p.riskCategory !== 'HIGH') return false;
      if (activeStageFilter && p.stage !== activeStageFilter) return false;

      if (parcelCategoryFilter === 'LEGAL') {
        return p.topRiskFactors.some(f => f.category === 'Legal' || f.category === 'Dispute');
      }
      if (parcelCategoryFilter === 'COMPENSATION') {
        return p.topRiskFactors.some(f => f.category === 'Compensation');
      }
      if (parcelCategoryFilter === 'APPROVAL') {
        return p.topRiskFactors.some(f => f.category === 'Approval' || f.category === 'Survey');
      }
      return true;
    });
  }, [parcels, activeStageFilter, parcelCategoryFilter]);

  // Statutory lifecycle stages metadata
  const stagesList: { stage: AcquisitionStage; label: string; avgDays: string; count: number; delayRisk: 'low' | 'med' | 'high' }[] = [
    { stage: 'Project Initiated', label: '1. Initiated', avgDays: '45d', count: parcels.filter(p => p.stage === 'Project Initiated').length, delayRisk: 'low' },
    { stage: 'Landowner List Released', label: '2. List Released', avgDays: '60d', count: parcels.filter(p => p.stage === 'Landowner List Released').length, delayRisk: 'low' },
    { stage: 'Owner Notified', label: '3. Notified', avgDays: '90d', count: parcels.filter(p => p.stage === 'Owner Notified').length, delayRisk: 'med' },
    { stage: 'Consent/Objection', label: '4. Objections', avgDays: '140d', count: parcels.filter(p => p.stage === 'Consent/Objection').length, delayRisk: 'high' },
    { stage: 'Compensation', label: '5. Compensation', avgDays: '210d', count: parcels.filter(p => p.stage === 'Compensation').length, delayRisk: 'high' },
    { stage: 'Legal/Approval', label: '6. Legal / Regulatory', avgDays: '185d', count: parcels.filter(p => p.stage === 'Legal/Approval').length, delayRisk: 'high' },
    { stage: 'Acquisition Complete', label: '7. Handover', avgDays: '365d', count: parcels.filter(p => p.stage === 'Acquisition Complete').length, delayRisk: 'low' }
  ];

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. INTERACTIVE EXECUTIVE CRISIS DESK & DECISION BRIEFING                  */}
      {/* ========================================================================= */}
      <section className="bg-white border border-stone-300 shadow-xs p-4 sm:p-5">
        {/* Dossier Header & Corridor Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-red-50 border border-red-200 text-red-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                Executive Crisis Desk: Active Corridor Dossier
              </h2>
              <p className="text-xs text-stone-500">
                Interactive strategic briefing answering the 5 core decision mandates
              </p>
            </div>
          </div>

          {/* Corridor Dossier Tab Switcher */}
          <div className="flex items-center flex-wrap gap-1.5 bg-stone-100 p-1 border border-stone-200 text-xs">
            <span className="text-[10px] font-mono font-bold uppercase text-stone-500 px-2">
              Select Corridor:
            </span>
            {DOSSIERS.map((dossier, idx) => (
              <button
                key={dossier.projectId}
                onClick={() => {
                  setSelectedDossierIndex(idx);
                  setIsSimulatingRelief(false);
                }}
                className={`px-2.5 py-1 text-xs font-semibold transition flex items-center gap-1.5 ${
                  selectedDossierIndex === idx
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-300 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <span>{dossier.projectId}</span>
                {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Dossier Briefing: The 5 Strategic Questions */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {/* 1. What is at risk? */}
          <div className="p-3 bg-stone-50 border-t-3 border-t-red-600 border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-red-700 uppercase tracking-wide text-[10px] font-mono">
                  1. WHAT IS AT RISK?
                </span>
                <span className="font-mono text-[10px] bg-red-100 text-red-800 px-1 py-0.2 border border-red-200 font-bold">
                  CRITICAL
                </span>
              </div>
              <p className="font-semibold text-stone-900 leading-snug">
                {currentDossier.whatIsAtRisk}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-stone-200/80 text-[11px] font-mono text-stone-500">
              Corridor: <span className="font-bold text-stone-800">{currentDossier.projectName}</span>
            </div>
          </div>

          {/* 2. Where is it at risk? */}
          <div className="p-3 bg-stone-50 border-t-3 border-t-amber-600 border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-amber-900 uppercase tracking-wide text-[10px] font-mono">
                  2. WHERE IS IT AT RISK?
                </span>
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <p className="font-semibold text-stone-900 leading-snug">
                {currentDossier.whereIsAtRisk}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-600">
                {currentDossier.criticalSurvey}
              </span>
              <button
                onClick={() => {
                  const p = parcels.find(item => item.id === currentDossier.criticalParcelId);
                  if (p) onSelectParcel(p);
                }}
                className="text-[10px] font-bold font-mono text-amber-900 hover:text-amber-950 hover:underline bg-white px-1.5 py-0.5 border border-stone-300"
              >
                Inspect {currentDossier.criticalParcelId} →
              </button>
            </div>
          </div>

          {/* 3. Why is it at risk? */}
          <div className="p-3 bg-stone-50 border-t-3 border-t-amber-500 border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-amber-900 uppercase tracking-wide text-[10px] font-mono">
                  3. WHY IS IT AT RISK?
                </span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <p className="font-semibold text-stone-900 leading-snug">
                {currentDossier.whyIsAtRisk}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px]">
              <span className="text-stone-500 font-mono">Risk Probability:</span>
              <span className="font-mono font-bold text-red-700">
                {isSimulatingRelief ? currentDossier.mitigatedProbability : currentDossier.baseProbability}%
              </span>
            </div>
          </div>

          {/* 4. Consequence If Ignored */}
          <div className="p-3 bg-stone-50 border-t-3 border-t-stone-700 border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-stone-800 uppercase tracking-wide text-[10px] font-mono">
                  4. IF NOTHING IS DONE?
                </span>
                <Clock className="w-3.5 h-3.5 text-stone-600" />
              </div>
              <p className="font-semibold text-stone-900 leading-snug">
                {currentDossier.consequenceIfIgnored}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px]">
              <span className="text-stone-500 font-mono">Expected Delay:</span>
              <span className="font-mono font-bold text-red-700">
                +{isSimulatingRelief ? currentDossier.mitigatedDelayDays : currentDossier.baseDelayDays} Days
              </span>
            </div>
          </div>

          {/* 5. Recommended Action with Live Toggle */}
          <div className={`p-3 border-t-3 border flex flex-col justify-between transition-all ${
            isSimulatingRelief 
              ? 'bg-emerald-50/80 border-t-emerald-700 border-emerald-300' 
              : 'bg-amber-50/60 border-t-amber-500 border-amber-300'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-bold uppercase tracking-wide text-[10px] font-mono ${
                  isSimulatingRelief ? 'text-emerald-900' : 'text-stone-900'
                }`}>
                  5. RECOMMENDED ACTION
                </span>
                {isSimulatingRelief && (
                  <span className="bg-emerald-200 text-emerald-950 text-[9px] font-mono px-1 py-0.2 font-bold">
                    RELIEF APPLIED
                  </span>
                )}
              </div>
              <p className="font-semibold text-stone-900 leading-snug">
                {currentDossier.recommendedIntervention}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-300/60 space-y-1.5">
              {/* Interactive Simulation Toggle */}
              <button
                type="button"
                onClick={() => setIsSimulatingRelief(!isSimulatingRelief)}
                className={`w-full text-[11px] font-bold py-1.5 px-2 flex items-center justify-center gap-1.5 transition ${
                  isSimulatingRelief
                    ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isSimulatingRelief 
                    ? 'Relief Active (-' + (currentDossier.baseDelayDays - currentDossier.mitigatedDelayDays) + 'd) • Revert' 
                    : 'Simulate Intervention Impact'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('what-if')}
                className="w-full text-[10px] font-mono text-center text-stone-600 hover:text-amber-900 underline block"
              >
                Open Full What-If Simulator →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATUTORY LIFECYCLE STAGE-WISE SCRUBBER (CLICKABLE INSPECTOR)          */}
      {/* ========================================================================= */}
      <section className="bg-white border border-stone-300 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif text-base font-bold text-stone-900">
                Statutory Milestone Scrubber &amp; Bottleneck Filter
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Click any statutory milestone to filter stuck parcels and inspect stage-level friction
            </p>
          </div>

          {activeStageFilter && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-stone-600">
                Filter active: <strong className="text-amber-900">{activeStageFilter}</strong>
              </span>
              <button
                onClick={() => setActiveStageFilter(null)}
                className="text-xs font-mono text-red-700 hover:underline bg-red-50 px-2 py-0.5 border border-red-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Stage Filter
              </button>
            </div>
          )}
        </div>

        {/* 7 Stage Milestone Grid (Interactive Buttons) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {stagesList.map((item) => {
            const isSelected = activeStageFilter === item.stage;
            const borderColor = 
              item.delayRisk === 'high' 
                ? 'border-t-red-600' 
                : item.delayRisk === 'med' 
                ? 'border-t-amber-500' 
                : 'border-t-emerald-600';

            return (
              <button
                key={item.stage}
                type="button"
                onClick={() => setActiveStageFilter(isSelected ? null : item.stage)}
                className={`p-3 border-t-3 border text-left transition-all relative ${borderColor} ${
                  isSelected
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-900/30 shadow-xs'
                    : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-stone-900 block truncate">
                    {item.label}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  )}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-[10px] font-mono text-stone-500">Benchmark:</span>
                  <span className="text-xs font-mono font-bold text-stone-800">{item.avgDays}</span>
                </div>
                <div className="mt-1 pt-1.5 border-t border-stone-200 flex items-center justify-between text-[10px]">
                  <span className="text-stone-500">Parcels:</span>
                  <span className={`font-mono font-bold ${
                    item.delayRisk === 'high' ? 'text-red-700' : 'text-stone-700'
                  }`}>
                    {item.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Stage Drilldown Drawer */}
        {activeStageFilter && (
          <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-start space-x-2.5">
              <Layers className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-950 font-serif text-sm">
                  Active Milestone: {activeStageFilter}
                </span>
                <p className="text-stone-600 mt-0.5">
                  Showing {filteredParcels.length} critical parcels currently held at this milestone across monitored projects.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigateTab('critical-parcels')}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 text-xs transition"
              >
                Inspect All Parcels at this Stage →
              </button>
              <button
                onClick={() => setActiveStageFilter(null)}
                className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold px-2.5 py-1.5 text-xs transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE METRICS KPI STRIP                                                 */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <KpiCard
          id="kpi-total-projects"
          title="Total Corridors"
          value={projects.length}
          subtext="10 Active Infrastructures"
          icon={FolderGit2}
          trend="+2 New"
          trendDirection="neutral"
          onClick={() => onNavigateTab('projects')}
        />
        <KpiCard
          id="kpi-total-parcels"
          title="Total Parcels"
          value={totalParcelsCount.toLocaleString('en-IN')}
          subtext="Under monitoring"
          icon={Layers}
          trend="89% Notified"
          trendDirection="neutral"
          onClick={() => onNavigateTab('projects')}
        />
        <KpiCard
          id="kpi-critical-parcels"
          title="Critical / High Risk"
          value={highRiskParcelsCount}
          subtext="Parcels facing delay"
          icon={AlertOctagon}
          trend="Action Required"
          trendDirection="up"
          highlightLevel="danger"
          onClick={() => onNavigateTab('critical-parcels')}
        />
        <KpiCard
          id="kpi-predicted-delays"
          title="Predicted Delays"
          value="73"
          subtext="Overdue statutory stages"
          icon={Clock}
          trend="Critical path impact"
          trendDirection="up"
          highlightLevel="warning"
          onClick={() => onNavigateTab('risk-intelligence')}
        />
        <KpiCard
          id="kpi-avg-progress"
          title="Avg. Acquisition"
          value={`${avgProgress}%`}
          subtext="Across all corridors"
          icon={TrendingUp}
          trend="+3.2% this month"
          trendDirection="down"
          highlightLevel="success"
          onClick={() => onNavigateTab('projects')}
        />
        <KpiCard
          id="kpi-active-alerts"
          title="Active Alerts"
          value={activeAlertsCount}
          subtext="Pending resolutions"
          icon={BellRing}
          trend="8 Urgent"
          trendDirection="up"
          highlightLevel="danger"
          onClick={() => onNavigateTab('alerts')}
        />
      </section>

      {/* ========================================================================= */}
      {/* 4. MAIN WORKSPACE: CORRIDOR LEDGER & CRITICAL PARCELS WORKBENCH           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Interactive Corridor Risk Ledger */}
        <div className="lg:col-span-7 bg-white border border-stone-300 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Ledger Header & Search/Filter Controls */}
            <div className="border-b border-stone-200 pb-3 mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Infrastructure Corridor Risk Ledger
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Live operational register with expandable corridor blueprint drawers
                  </p>
                </div>

                <button
                  onClick={() => onNavigateTab('projects')}
                  className="text-xs text-amber-900 font-bold hover:text-amber-950 hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>All Projects Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interactive Search & Filter Chips Bar */}
              <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={corridorSearch}
                    onChange={(e) => setCorridorSearch(e.target.value)}
                    placeholder="Search corridor, ID or district..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                  {corridorSearch && (
                    <button
                      onClick={() => setCorridorSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
                  {(['ALL', 'CRITICAL', 'HIGH', 'HIGHWAY', 'RAILWAY'] as const).map(filterKey => (
                    <button
                      key={filterKey}
                      onClick={() => setCorridorFilter(filterKey)}
                      className={`px-2 py-1 font-mono text-[11px] whitespace-nowrap transition border ${
                        corridorFilter === filterKey
                          ? 'bg-stone-900 text-amber-400 border-stone-900 font-bold'
                          : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {filterKey}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Corridor Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-300">
                    <th className="p-2.5">Corridor / Identity</th>
                    <th className="p-2.5">District</th>
                    <th 
                      className="p-2.5 text-center cursor-pointer hover:bg-stone-200 select-none"
                      onClick={() => {
                        if (corridorSortBy === 'criticalParcels') setCorridorSortAsc(!corridorSortAsc);
                        else { setCorridorSortBy('criticalParcels'); setCorridorSortAsc(false); }
                      }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Parcels</span>
                        <ArrowUpDown className="w-3 h-3 text-stone-500" />
                      </div>
                    </th>
                    <th 
                      className="p-2.5 text-center cursor-pointer hover:bg-stone-200 select-none"
                      onClick={() => {
                        if (corridorSortBy === 'progress') setCorridorSortAsc(!corridorSortAsc);
                        else { setCorridorSortBy('progress'); setCorridorSortAsc(false); }
                      }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Progress</span>
                        <ArrowUpDown className="w-3 h-3 text-stone-500" />
                      </div>
                    </th>
                    <th 
                      className="p-2.5 text-center cursor-pointer hover:bg-stone-200 select-none"
                      onClick={() => {
                        if (corridorSortBy === 'risk') setCorridorSortAsc(!corridorSortAsc);
                        else { setCorridorSortBy('risk'); setCorridorSortAsc(false); }
                      }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Risk Score</span>
                        <ArrowUpDown className="w-3 h-3 text-stone-500" />
                      </div>
                    </th>
                    <th className="p-2.5 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-sans">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-stone-500">
                        No corridors match the search or filter query.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map(proj => {
                      const isExpanded = expandedProjectId === proj.id;
                      return (
                        <React.Fragment key={proj.id}>
                          <tr
                            className={`cursor-pointer transition ${
                              isExpanded ? 'bg-amber-50/50 font-semibold' : 'hover:bg-stone-50'
                            }`}
                            onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                          >
                            <td className="p-2.5">
                              <div className="flex items-center gap-2">
                                <span className="text-stone-400">
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-600" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </span>
                                <div>
                                  <div className="font-bold text-stone-900">{proj.name}</div>
                                  <div className="text-[11px] font-mono text-stone-500">
                                    {proj.id} • {proj.type}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-2.5 text-stone-700">{proj.district}</td>
                            <td className="p-2.5 text-center font-mono">
                              <span className="text-red-700 font-bold">{proj.criticalRiskParcels} Crit</span> / {proj.totalParcels}
                            </td>
                            <td className="p-2.5 text-center">
                              <div className="font-bold text-stone-900 font-mono">{proj.progressPercentage}%</div>
                              <div className="w-16 bg-stone-200 h-1.5 mx-auto mt-1">
                                <div
                                  className="bg-stone-900 h-full"
                                  style={{ width: `${proj.progressPercentage}%` }}
                                />
                              </div>
                            </td>
                            <td className="p-2.5 text-center">
                              <RiskBadge level={proj.overallRisk} size="sm" score={proj.overallRiskScore} />
                            </td>
                            <td className="p-2.5 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectProject(proj);
                                }}
                                className="text-amber-900 font-bold hover:underline font-mono text-[11px]"
                              >
                                View →
                              </button>
                            </td>
                          </tr>

                          {/* Expandable Corridor Blueprint Drawer */}
                          {isExpanded && (
                            <tr className="bg-stone-50/90">
                              <td colSpan={6} className="p-3.5 border-b-2 border-stone-300">
                                <div className="space-y-3">
                                  {/* Top details bar */}
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                                    <div className="bg-white p-2.5 border border-stone-200">
                                      <span className="text-stone-500 text-[10px] uppercase font-mono block">
                                        Managing Authority
                                      </span>
                                      <span className="font-semibold text-stone-900">
                                        {proj.leadDepartment}
                                      </span>
                                    </div>
                                    <div className="bg-white p-2.5 border border-stone-200">
                                      <span className="text-stone-500 text-[10px] uppercase font-mono block">
                                        Required Land & Area
                                      </span>
                                      <span className="font-semibold text-stone-900 font-mono">
                                        {proj.totalLandRequiredHectares} Ha ({proj.acquiredParcels} / {proj.totalParcels} plots)
                                      </span>
                                    </div>
                                    <div className="bg-white p-2.5 border border-stone-200">
                                      <span className="text-stone-500 text-[10px] uppercase font-mono block">
                                        Projected Commissioning
                                      </span>
                                      <span className="font-semibold text-red-700">
                                        {proj.expectedCompletion}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Timeline stage bar */}
                                  <div className="bg-white p-3 border border-stone-200">
                                    <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block mb-2">
                                      Statutory Milestone Completion Progress:
                                    </span>
                                    <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-mono">
                                      {proj.timeline.map((t, idx) => (
                                        <div
                                          key={t.stage}
                                          className={`p-1 border ${
                                            t.status === 'Completed'
                                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                              : t.status === 'Delayed'
                                              ? 'bg-red-50 border-red-300 text-red-900 font-bold'
                                              : 'bg-stone-100 border-stone-200 text-stone-600'
                                          }`}
                                        >
                                          <div className="truncate">{idx + 1}. {t.stage.split(' ')[0]}</div>
                                          <div>{t.progressPercentage}%</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Quick Action Bar */}
                                  <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-stone-500 italic">
                                      Status: {proj.status}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => onNavigateTab('what-if')}
                                        className="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                                      >
                                        Simulate Corridor Delays →
                                      </button>
                                      <button
                                        onClick={() => onSelectProject(proj)}
                                        className="px-2.5 py-1 text-xs bg-stone-900 hover:bg-stone-800 text-white font-bold"
                                      >
                                        Full Project Overview →
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Showing {filteredProjects.length} of {projects.length} monitored corridors</span>
            <span className="font-mono">Sort: {corridorSortBy} ({corridorSortAsc ? 'Asc' : 'Desc'})</span>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Critical Parcels Workbench */}
        <div className="lg:col-span-5 space-y-6">
          {/* Critical Parcels Panel */}
          <div className="bg-white border border-stone-300 shadow-xs p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Critical Parcels Workbench
                  </h3>
                  {pinnedParcelIds.size > 0 && (
                    <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-mono px-1.5 py-0.2 font-bold">
                      {pinnedParcelIds.size} Pinned
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Parcels scoring &ge; 70 requiring urgent administrative clearance
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 border border-stone-200 text-xs">
                <button
                  onClick={() => setParcelViewMode('cards')}
                  className={`px-2 py-0.5 font-mono text-[11px] ${
                    parcelViewMode === 'cards' ? 'bg-white font-bold shadow-xs border border-stone-300 text-stone-900' : 'text-stone-600'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setParcelViewMode('table')}
                  className={`px-2 py-0.5 font-mono text-[11px] ${
                    parcelViewMode === 'table' ? 'bg-white font-bold shadow-xs border border-stone-300 text-stone-900' : 'text-stone-600'
                  }`}
                >
                  Docket
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 mb-3 overflow-x-auto text-xs pb-1">
              {(['ALL', 'LEGAL', 'COMPENSATION', 'APPROVAL'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setParcelCategoryFilter(cat)}
                  className={`px-2 py-0.5 text-[11px] font-mono border transition ${
                    parcelCategoryFilter === cat
                      ? 'bg-stone-900 text-amber-400 border-stone-900 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cat === 'ALL' ? 'All Bottlenecks' : cat}
                </button>
              ))}
            </div>

            {/* Parcels Display */}
            {parcelViewMode === 'cards' ? (
              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                {filteredParcels.slice(0, 5).map(parcel => {
                  const isPinned = pinnedParcelIds.has(parcel.id);
                  return (
                    <div
                      key={parcel.id}
                      onClick={() => onSelectParcel(parcel)}
                      className={`p-3 border cursor-pointer transition text-xs relative ${
                        isPinned
                          ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                          : 'bg-stone-50/60 border-stone-200 hover:border-stone-400 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-stone-900 bg-white px-1.5 py-0.5 border border-stone-300">
                              {parcel.id}
                            </span>
                            <span className="font-semibold text-stone-800">{parcel.village}</span>
                            <span className="text-[10px] font-mono text-stone-500">
                              Survey #{parcel.surveyNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 mt-1">
                            {parcel.projectName} • {parcel.landownerName}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={(e) => togglePinParcel(e, parcel.id)}
                            title={isPinned ? 'Unpin from priority' : 'Pin for executive priority'}
                            className={`p-1 border transition ${
                              isPinned
                                ? 'bg-amber-500 text-stone-950 border-amber-600'
                                : 'bg-white text-stone-400 hover:text-stone-700 border-stone-200'
                            }`}
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <RiskBadge level={parcel.riskCategory} size="sm" score={parcel.riskScore} />
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
                        <div className="truncate max-w-[200px]">
                          <span className="text-stone-500">Bottleneck: </span>
                          <span className="font-semibold text-red-700">
                            {parcel.topRiskFactors[0]?.name || 'Pending Review'}
                          </span>
                        </div>
                        <div className="font-mono text-red-700 font-bold shrink-0">
                          +{parcel.expectedDelayDays}d ({parcel.delayProbability}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Compact Docket View */
              <div className="overflow-x-auto max-h-[440px] border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 font-bold border-b border-stone-200 sticky top-0 text-stone-800">
                    <tr>
                      <th className="p-2">Parcel / Village</th>
                      <th className="p-2">Stage</th>
                      <th className="p-2 text-right">Delay Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-mono">
                    {filteredParcels.slice(0, 8).map(parcel => (
                      <tr
                        key={parcel.id}
                        onClick={() => onSelectParcel(parcel)}
                        className="hover:bg-amber-50/50 cursor-pointer text-[11px]"
                      >
                        <td className="p-2 font-bold text-stone-900">
                          {parcel.id} • {parcel.village}
                        </td>
                        <td className="p-2 text-stone-600 font-sans">{parcel.stage}</td>
                        <td className="p-2 text-right text-red-700 font-bold">
                          +{parcel.expectedDelayDays}d ({parcel.delayProbability}%)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigateTab('critical-parcels')}
                className="text-amber-900 font-bold hover:text-amber-950 hover:underline"
              >
                Open Full Parcels Explorer ({parcels.length}) →
              </button>
              <span className="text-stone-500 font-mono text-[11px]">
                Showing {filteredParcels.slice(0, 5).length} of {filteredParcels.length}
              </span>
            </div>
          </div>

          {/* Mini On-Dashboard Delay Impact Sandbox */}
          <div className="bg-white border border-stone-300 shadow-xs p-4 sm:p-5">
            <div className="flex items-center space-x-2 border-b border-stone-200 pb-2 mb-3">
              <Calculator className="w-4 h-4 text-amber-700" />
              <h4 className="font-serif text-sm font-bold text-stone-900">
                Quick Right-of-Way Delay Estimator
              </h4>
            </div>

            <p className="text-xs text-stone-600 mb-3">
              Simulate contractor idling claims if critical corridor injunctions remain unresolved:
            </p>

            {/* Slider & Presets */}
            <div className="space-y-3 bg-stone-50 p-3 border border-stone-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-600 font-medium">Unresolved Latency:</span>
                <span className="font-mono font-bold text-red-700 text-sm">
                  +{simulatedDelayDays} Days
                </span>
              </div>

              <input
                type="range"
                min={15}
                max={180}
                step={15}
                value={simulatedDelayDays}
                onChange={(e) => setSimulatedDelayDays(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-300 rounded-none accent-amber-500 cursor-pointer"
              />

              <div className="flex items-center justify-between gap-1">
                {[15, 30, 60, 90, 120].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setSimulatedDelayDays(days)}
                    className={`px-2 py-0.5 font-mono text-[10px] border transition ${
                      simulatedDelayDays === days
                        ? 'bg-stone-900 text-amber-400 border-stone-900 font-bold'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    +{days}d
                  </button>
                ))}
              </div>

              {/* Calculated Outputs */}
              <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-500 block">Idle Machinery Penalty:</span>
                  <span className="font-mono font-bold text-red-700 text-xs">
                    ₹{(simulatedDelayDays * 4.2).toFixed(1)} Lakhs
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Corridor Slip:</span>
                  <span className="font-mono font-bold text-stone-900 text-xs">
                    +{Math.round(simulatedDelayDays * 0.8)} Comm. Days
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('what-if')}
              className="mt-3 w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-1.5 px-3 text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Load Into Comprehensive Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE ANALYST WORKING SCRATCHPAD & AUDIT CHECKLIST                */}
      {/* ========================================================================= */}
      <section className="bg-white border border-stone-300 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-700" />
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Executive Field Action Scratchpad &amp; Statutory Log
              </h3>
              <p className="text-xs text-stone-500">
                Interactive checklist for field officers and project authorities
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 border border-stone-200">
            {checklistItems.filter(i => i.done).length} / {checklistItems.length} Milestones Cleared
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Checklist items */}
          <div className="lg:col-span-8 space-y-2">
            {checklistItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-2.5 border cursor-pointer transition flex items-start space-x-3 text-xs ${
                  item.done ? 'bg-stone-50 border-stone-200 text-stone-500 line-through' : 'bg-white border-stone-300 text-stone-900 hover:border-stone-400'
                }`}
              >
                <div className="mt-0.5 text-stone-900">
                  {item.done ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-stone-400" />}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className={item.done ? 'line-through text-stone-500' : 'font-medium'}>
                    {item.text}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-stone-100 text-stone-600 border border-stone-200 ml-2 shrink-0">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}

            {/* Quick add custom note */}
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Log a new field audit memo or directive..."
                className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:border-amber-500 font-sans"
              />
              <button
                type="submit"
                className="bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold px-3 py-1.5 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Memo</span>
              </button>
            </form>
          </div>

          {/* Field Dispatch Summary Box */}
          <div className="lg:col-span-4 bg-stone-50 p-3.5 border border-stone-200 text-xs flex flex-col justify-between">
            <div>
              <span className="font-bold text-stone-800 font-mono text-[11px] block mb-1">
                COORDINATION DIRECTIVE PROTOCOL
              </span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Tasks logged in this workbench synchronize with the Inter-Department Coordination module. Clearing items updates statutory latency metrics across monitored survey plots.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('coordination')}
              className="mt-3 w-full bg-white hover:bg-stone-100 text-stone-900 border border-stone-400 font-bold py-1.5 px-3 text-xs transition text-center"
            >
              Open Inter-Department Coordination Hub →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: OVERALL STAKEHOLDER FEEDBACK & SENTIMENT OBSERVATORY */}
      <section className="bg-white border border-stone-300 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800">
              <MessageSquareQuote className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-950 px-1.5 py-0.2 border border-amber-300">
                  SECTION 6
                </span>
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Overall Stakeholder Feedback &amp; Sentiment Observatory
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Transparent multi-role feedback channel from landowners, field surveyors, and project directors
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenFeedbackModal || (() => onNavigateTab('feedback'))}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs py-1.5 px-3 shadow-xs transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-stone-950" />
              <span>Submit Feedback</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('feedback')}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-1.5 px-3 border border-stone-300 transition flex items-center space-x-1"
            >
              <span>View All ({feedbackList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 text-xs">
          {/* 1. Satisfaction Index */}
          <div className="p-3 bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block mb-1">
              Overall Satisfaction Index
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-serif font-bold text-stone-900">
                {feedbackStats.averageRating}
              </span>
              <span className="text-stone-500 font-mono text-xs">/ 5.0</span>
            </div>
            <div className="flex items-center space-x-0.5 my-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(feedbackStats.averageRating)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-stone-600 font-mono">
              {feedbackStats.positivePercentage}% Favorable Sentiment
            </span>
          </div>

          {/* 2. Total Verified Submissions */}
          <div className="p-3 bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block mb-1">
              Verified Feedback Submissions
            </span>
            <div className="text-2xl font-serif font-bold text-stone-900">
              {feedbackStats.totalCount}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(feedbackStats.roleDistribution).slice(0, 3).map(([role, cnt]) => (
                <span key={role} className="text-[10px] bg-white border border-stone-200 text-stone-700 px-1 font-mono">
                  {role.split(' ')[0]}: {cnt}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Action & Resolution Rate */}
          <div className="p-3 bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block mb-1">
              Administrative Action Rate
            </span>
            <div className="text-2xl font-serif font-bold text-emerald-700">
              {feedbackStats.totalCount > 0 
                ? Math.round(((feedbackStats.resolvedCount + feedbackStats.actionPlannedCount) / feedbackStats.totalCount) * 100) 
                : 0}%
            </div>
            <span className="text-[11px] text-stone-600 font-mono">
              {feedbackStats.resolvedCount} Resolved · {feedbackStats.actionPlannedCount} Action Planned
            </span>
          </div>

          {/* 4. Top Active Category */}
          <div className="p-3 bg-stone-50 border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block mb-1">
                Top Discussion Focus
              </span>
              <span className="text-xs font-bold text-stone-800 block">
                Valuation &amp; Solatium Rate
              </span>
              <span className="text-[11px] text-stone-600">
                Most raised in Urse, Talegaon &amp; Manor
              </span>
            </div>
            <span className="text-[10px] text-amber-800 font-mono font-semibold">
              SLAO Valuations in review
            </span>
          </div>
        </div>

        {/* Latest 3 Feedback Snippets */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-600 font-mono">
            <span>Recent Stakeholder Testimonials &amp; Grievances:</span>
            <button
              onClick={() => onNavigateTab('feedback')}
              className="text-amber-900 hover:text-amber-950 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Explore All Stakeholder Feedbacks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {feedbackList.slice(0, 3).map(item => (
              <div
                key={item.id}
                onClick={() => onNavigateTab('feedback')}
                className="p-3 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white border border-stone-300 text-stone-700 font-semibold">
                      {item.authorRole}
                    </span>
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= item.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h5 className="font-bold text-stone-900 text-xs line-clamp-1 mb-1 font-sans">
                    {item.title}
                  </h5>

                  <p className="text-[11px] text-stone-600 line-clamp-3 leading-relaxed">
                    &quot;{item.comment}&quot;
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span>{item.authorName}</span>
                  <span className="flex items-center gap-1 text-stone-700">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{item.upvotes}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
