import React from 'react';
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  Landmark, 
  LogOut, 
  PlayCircle, 
  AlertTriangle,
  MessageSquareQuote
} from 'lucide-react';
import { UserRole } from '../../types';

interface TopNavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  onLogout: () => void;
  onStartDemo: () => void;
  activeAlertsCount: number;
  onOpenFeedbackModal?: () => void;
  onOpenFeedbackTab?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenSearch,
  onOpenAlerts,
  onLogout,
  onStartDemo,
  activeAlertsCount,
  onOpenFeedbackModal,
  onOpenFeedbackTab
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  return (
    <nav className="bg-[#18201a] text-stone-100 sticky top-0 z-40 shadow-sm border-b-2 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 text-stone-950 p-2 rounded-xs font-bold flex items-center justify-center shadow-xs">
              <Landmark className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight font-serif text-white">NEXORA</span>
                <span className="bg-[#263329] text-amber-300 text-[10px] uppercase font-mono px-1.5 py-0.5 border border-amber-500/40 font-bold">
                  CIVIL & AGRI PORTAL
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-mono bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  🌾 Agrarian Land &amp; 🚜 Machinery Sync
                </span>
              </div>
              <p className="text-[11px] text-stone-300 hidden md:block leading-tight">
                Right-of-Way Risk Intelligence for Constructors, EPC Contractors &amp; Farming Communities
              </p>
            </div>
          </div>

          {/* Center / Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Global Search trigger */}
            <button
              id="btn-global-search"
              onClick={onOpenSearch}
              className="flex items-center space-x-2 bg-stone-800/90 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white px-3 py-1.5 rounded-xs text-xs transition"
              title="Search by Project ID, Parcel, Village, or Landowner"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Search parcels, surveys...</span>
              <kbd className="hidden md:inline bg-stone-700 text-[10px] px-1.5 py-0.5 rounded text-stone-300 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Feedback Observatory button */}
            <button
              id="btn-nav-feedback"
              onClick={onOpenFeedbackTab || onOpenFeedbackModal}
              className="flex items-center space-x-1.5 bg-stone-800/90 hover:bg-stone-700 border border-stone-700 text-amber-400 hover:text-amber-300 px-2.5 py-1.5 rounded-xs text-xs shadow-xs transition"
              title="Stakeholder Feedback & Sentiment Observatory"
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-semibold">Farmer &amp; Site Feedback</span>
            </button>

            {/* Quick Demo Story button */}
            <button
              id="btn-nav-demo-story"
              onClick={onStartDemo}
              className="hidden lg:flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-2.5 py-1.5 rounded-xs text-xs shadow-xs transition"
            >
              <PlayCircle className="w-3.5 h-3.5 text-stone-950" />
              <span>Site Tour</span>
            </button>

            {/* Alert Notifications */}
            <button
              id="btn-nav-alerts"
              onClick={onOpenAlerts}
              className="relative p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xs transition"
              title="Active Risk Alerts"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {activeAlertsCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full">
                  {activeAlertsCount}
                </span>
              )}
            </button>

            {/* Role indicator & switcher dropdown */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white px-2.5 py-1.5 rounded-xs text-xs font-medium transition"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-amber-400/80 uppercase font-mono">Perspective</div>
                  <div className="font-semibold leading-none">{currentRole}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-1" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-stone-900 border border-stone-300 shadow-xl rounded-xs py-1 z-50">
                  <div className="px-3 py-2 border-b border-stone-200 bg-[#f7f5ef] text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Switch Active Role Perspective
                  </div>
                  {(['System Administrator', 'Project Authority', 'Landowner'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-100 flex items-center justify-between ${
                        currentRole === r ? 'font-bold text-[#18201a] bg-amber-100/70 border-l-4 border-amber-600' : 'text-stone-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {r === 'Landowner' && <span>🌾</span>}
                        {r === 'Project Authority' && <span>🚜</span>}
                        {r === 'System Administrator' && <span>🏛️</span>}
                        <span>{r}</span>
                      </span>
                      {currentRole === r && <span className="text-[11px] text-amber-800 font-mono font-bold">Active</span>}
                    </button>
                  ))}
                  <div className="border-t border-stone-200 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-700 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout icon */}
            <button
              id="btn-logout"
              onClick={onLogout}
              className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-xs transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
