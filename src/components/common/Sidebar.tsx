import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  MapPin,
  BrainCircuit,
  AlertOctagon,
  Network,
  BellRing,
  Lightbulb,
  Sliders,
  Scale,
  Users,
  Building2,
  FileSpreadsheet,
  UserCheck,
  Settings,
  Sparkles,
  MessageSquareQuote
} from 'lucide-react';
import { UserRole } from '../../types';

export type NavigationTab = 
  | 'dashboard'
  | 'projects'
  | 'gismap'
  | 'risk-intelligence'
  | 'critical-parcels'
  | 'dependency-graph'
  | 'alerts'
  | 'recommendations'
  | 'what-if'
  | 'objection-predictor'
  | 'public-opposition'
  | 'coordination'
  | 'reports'
  | 'feedback'
  | 'landowners'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  userRole: UserRole;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  activeAlertsCount
}) => {
  const adminNavItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects Registry', icon: FolderGit2 },
    { id: 'gismap', label: 'GIS Risk Map', icon: MapPin, badge: 'Interactive' },
    { id: 'risk-intelligence', label: 'Risk Intelligence', icon: BrainCircuit },
    { id: 'critical-parcels', label: 'Critical Parcels', icon: AlertOctagon, highlight: true },
    { id: 'dependency-graph', label: 'Delay Dependency', icon: Network, highlight: true },
    { id: 'alerts', label: 'Alert Center', icon: BellRing, badgeCount: activeAlertsCount },
    { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb },
    { id: 'what-if', label: 'What-If Simulator', icon: Sliders, highlight: true },
    { id: 'objection-predictor', label: 'Objection Predictor', icon: Scale },
    { id: 'public-opposition', label: 'Public Opposition', icon: Users },
    { id: 'coordination', label: 'Inter-Department', icon: Building2 },
    { id: 'reports', label: 'Official Reports', icon: FileSpreadsheet },
    { id: 'feedback', label: 'Feedback Observatory', icon: MessageSquareQuote, highlight: true, badge: 'Live Feed' },
    { id: 'landowners', label: 'Landowners Portal', icon: UserCheck },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#161c18] text-stone-300 flex flex-col shrink-0 border-r border-[#263329] min-h-[calc(100vh-4.25rem)]">
      {/* System Status sub-badge */}
      <div className="p-3 border-b border-[#263329] bg-[#0f1411]">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-stone-400 font-medium flex items-center gap-1">
            <span>🚜</span>
            <span>Site &amp; Field Grid</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span>
            SURVEY ACTIVE
          </span>
        </div>
        <div className="text-[10px] text-amber-400/90 font-mono mt-0.5 truncate">
          🌾 7/12 Land Records &amp; RoW: Live
        </div>
      </div>

      {/* Navigation menu list */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-1 text-[10px] font-bold text-amber-400/80 uppercase tracking-widest flex items-center justify-between">
          <span>OPERATIONAL MODULES</span>
          <span className="text-[9px] text-stone-300 font-mono">SITE &amp; AGRI</span>
        </div>

        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => onTabChange(item.id as NavigationTab)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xs transition-all ${
                isActive
                  ? 'bg-[#2d6a4f] text-white shadow-xs font-bold border-l-4 border-[#b45309]'
                  : 'text-stone-300 hover:text-white hover:bg-[#223126]'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Key Innovation Feature"></span>
                )}
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${
                    isActive 
                      ? 'bg-[#1b4332] text-amber-300 border-emerald-600'
                      : 'bg-[#1b2b20] text-emerald-300 border-emerald-700/60'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                    {item.badgeCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Banner for Demo */}
      <div className="p-3 border-t border-[#263329] bg-[#0f1411] text-xs">
        <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cadastral &amp; Civil Engine</span>
        </div>
        <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
          Predictive delay mitigation for EPC civil machinery mobilization, crop solatium &amp; village consensus.
        </p>
      </div>
    </aside>
  );
};
