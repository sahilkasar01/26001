import React, { useState, useEffect } from 'react';
import { UserRole, Project, Parcel, SystemAlert, RecommendationItem } from './types';
import { apiService } from './services/apiService';
import { TopNavbar } from './components/common/TopNavbar';
import { Sidebar, NavigationTab } from './components/common/Sidebar';
import { ParcelDetailModal } from './components/parcels/ParcelDetailModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { DemoWalkthroughModal } from './components/common/DemoWalkthroughModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GISMap } from './components/gis/GISMap';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { CriticalParcelsPage } from './pages/CriticalParcelsPage';
import { DependencyGraph } from './components/risk/DependencyGraph';
import { WhatIfSimulator } from './components/risk/WhatIfSimulator';
import { ObjectionPredictor } from './components/risk/ObjectionPredictor';
import { AlertsPage } from './pages/AlertsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { PublicOppositionPage } from './pages/PublicOppositionPage';
import { CoordinationPage } from './pages/CoordinationPage';
import { ReportsPage } from './pages/ReportsPage';
import { LandownerPortalPage } from './pages/LandownerPortalPage';
import { SettingsPage } from './pages/SettingsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { FeedbackSubmissionModal } from './components/feedback/FeedbackSubmissionModal';
import { FeedbackItem, FeedbackStatus } from './types/feedback';
import { getStoredFeedback, saveStoredFeedback } from './data/feedback';

export const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Pre-authenticate into Admin dashboard for review
  const [currentRole, setCurrentRole] = useState<UserRole>('System Administrator');
  const [currentUser, setCurrentUser] = useState<string>('admin.pune@nexora.io');

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => getStoredFeedback());

  // Selection & Modal States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [inspectedParcel, setInspectedParcel] = useState<Parcel | null>(null);
  const [simulatorParcelId, setSimulatorParcelId] = useState<string>('P-1042');

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    apiService.getProjects().then(setProjects);
    apiService.getParcels().then(setParcels);
    apiService.getAlerts().then(setAlerts);
    apiService.getRecommendations().then(setRecommendations);
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = (role: UserRole, user: string) => {
    setCurrentRole(role);
    setCurrentUser(user);
    setIsAuthenticated(true);
    if (role === 'Landowner') {
      setActiveTab('landowners');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'Landowner') {
      setActiveTab('landowners');
    } else if (newRole === 'Project Authority') {
      setActiveTab('projects');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleUpdateAlertStatus = (alertId: string, newStatus: SystemAlert['status']) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
  };

  const handleNavigateToWhatIf = (parcel?: Parcel) => {
    if (parcel) {
      setSimulatorParcelId(parcel.id);
    }
    setActiveTab('what-if');
  };

  const handleNavigateToDependency = (parcel?: Parcel) => {
    if (parcel) {
      setSimulatorParcelId(parcel.id);
    }
    setActiveTab('dependency-graph');
  };

  const handleNavigateToGIS = (parcel?: Parcel) => {
    if (parcel) {
      setSimulatorParcelId(parcel.id);
    }
    setActiveTab('gismap');
  };

  const handleDispatchIntervention = () => {
    // Demo step 11/12 trigger: change alert to Action Assigned
    setAlerts(prev => prev.map(a => a.id === 'ALT-8801' ? { ...a, status: 'Action Assigned' } : a));
  };

  // Feedback Handlers
  const handleAddFeedback = (newFb: Omit<FeedbackItem, 'id' | 'createdAt' | 'upvotes' | 'status'>) => {
    const newItem: FeedbackItem = {
      ...newFb,
      id: `FB-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 0,
      status: 'Under Review'
    };
    const updated = [newItem, ...feedbackList];
    setFeedbackList(updated);
    saveStoredFeedback(updated);
  };

  const handleUpvoteFeedback = (id: string) => {
    const updated = feedbackList.map(item =>
      item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
    );
    setFeedbackList(updated);
    saveStoredFeedback(updated);
  };

  const handleUpdateFeedbackStatus = (id: string, newStatus: FeedbackStatus, adminNote?: string) => {
    const updated = feedbackList.map(item =>
      item.id === id ? { ...item, status: newStatus, adminResponse: adminNote || item.adminResponse } : item
    );
    setFeedbackList(updated);
    saveStoredFeedback(updated);
  };

  // If not logged in, show the Login Page
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const activeAlertsCount = alerts.filter(a => a.status === 'Active' || a.status === 'Investigating').length;
  const criticalProject = projects.find(p => p.id === 'PRJ-NH48') || projects[0];
  const criticalParcel = parcels.find(p => p.id === simulatorParcelId) || parcels.find(p => p.id === 'P-1042') || parcels[0];

  return (
    <div className="min-h-screen bg-[#f5f3ec] text-stone-900 flex flex-col font-sans antialiased">
      {/* Top Navigation Bar (Search, Notifications, Role Switcher, Feedback) */}
      <TopNavbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAlerts={() => setActiveTab('alerts')}
        onLogout={handleLogout}
        onStartDemo={() => setIsDemoModalOpen(true)}
        activeAlertsCount={activeAlertsCount}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        onOpenFeedbackTab={() => setActiveTab('feedback')}
      />

      {/* Main Layout Container: Sidebar + Content Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={currentRole}
          activeAlertsCount={activeAlertsCount}
        />

        {/* Dynamic Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardPage
              projects={projects}
              parcels={parcels}
              alerts={alerts}
              onNavigateTab={setActiveTab}
              onSelectProject={(proj) => {
                setSelectedProject(proj);
                setActiveTab('projects');
              }}
              onSelectParcel={(parcel) => setInspectedParcel(parcel)}
              feedbackList={feedbackList}
              onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsPage
              projects={projects}
              parcels={parcels}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              onSelectParcel={(parcel) => setInspectedParcel(parcel)}
              onNavigateToGIS={handleNavigateToGIS}
              onNavigateToWhatIf={handleNavigateToWhatIf}
            />
          )}

          {activeTab === 'gismap' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-300 p-4 shadow-xs">
                <h1 className="text-xl font-bold font-serif text-slate-900">
                  Interactive GIS Corridor Risk Map
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Spatial visualization of parcels, villages, right-of-way alignments, and critical delay clustering zones
                </p>
              </div>

              <GISMap
                parcels={parcels}
                projects={projects}
                selectedParcelId={simulatorParcelId}
                onSelectParcel={(parcel) => setInspectedParcel(parcel)}
                highlightCriticalZones={true}
              />
            </div>
          )}

          {activeTab === 'risk-intelligence' && (
            <RiskIntelligencePage
              parcels={parcels}
              projects={projects}
              onSelectParcel={(parcel) => setInspectedParcel(parcel)}
              onNavigateToWhatIf={handleNavigateToWhatIf}
              onNavigateToDependency={handleNavigateToDependency}
            />
          )}

          {activeTab === 'critical-parcels' && (
            <CriticalParcelsPage
              parcels={parcels}
              projects={projects}
              onSelectParcel={(parcel) => setInspectedParcel(parcel)}
              onNavigateToWhatIf={handleNavigateToWhatIf}
              onNavigateToGIS={handleNavigateToGIS}
            />
          )}

          {activeTab === 'dependency-graph' && (
            <DependencyGraph
              parcel={criticalParcel}
              onOpenParcelModal={(parcel) => setInspectedParcel(parcel)}
            />
          )}

          {activeTab === 'what-if' && (
            <WhatIfSimulator
              projects={projects}
              parcels={parcels}
              initialParcelId={simulatorParcelId}
              onAssignAction={handleDispatchIntervention}
            />
          )}

          {activeTab === 'objection-predictor' && (
            <ObjectionPredictor
              parcels={parcels}
              onSelectParcelForInspection={(pid) => {
                const found = parcels.find(p => p.id === pid);
                if (found) setInspectedParcel(found);
              }}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              parcels={parcels}
              onSelectParcel={(parcel) => setInspectedParcel(parcel)}
              onNavigateToWhatIf={handleNavigateToWhatIf}
              onUpdateAlertStatus={handleUpdateAlertStatus}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsPage
              recommendations={recommendations}
              parcels={parcels}
              onSelectParcel={(parcel) => setInspectedParcel(parcel)}
              onNavigateToWhatIf={handleNavigateToWhatIf}
              onApplyRecommendation={handleDispatchIntervention}
            />
          )}

          {activeTab === 'public-opposition' && (
            <PublicOppositionPage />
          )}

          {activeTab === 'coordination' && (
            <CoordinationPage />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              projects={projects}
              parcels={parcels}
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackPage
              feedbackList={feedbackList}
              projects={projects}
              onAddFeedback={handleAddFeedback}
              onUpvoteFeedback={handleUpvoteFeedback}
              onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
              currentUserRole={currentRole}
            />
          )}

          {activeTab === 'landowners' && (
            <LandownerPortalPage
              parcels={parcels}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Global Modals & Dialogs */}
      {/* 1. Parcel Detailed Inspection Modal */}
      <ParcelDetailModal
        parcel={inspectedParcel}
        onClose={() => setInspectedParcel(null)}
        onNavigateToWhatIf={handleNavigateToWhatIf}
        onNavigateToDependency={handleNavigateToDependency}
        onNavigateToGIS={handleNavigateToGIS}
      />

      {/* 2. Global Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projects}
        parcels={parcels}
        onSelectProject={(proj) => {
          setSelectedProject(proj);
          setActiveTab('projects');
        }}
        onSelectParcel={(parcel) => setInspectedParcel(parcel)}
      />

      {/* 3. Guided Executive Demo Story Walkthrough Modal */}
      {criticalProject && criticalParcel && (
        <DemoWalkthroughModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
          onNavigateTab={setActiveTab}
          onSelectProject={setSelectedProject}
          onSelectParcel={setInspectedParcel}
          targetProject={criticalProject}
          targetParcel={criticalParcel}
          onDispatchIntervention={handleDispatchIntervention}
        />
      )}

      {/* 4. Global Stakeholder Feedback Submission Modal */}
      <FeedbackSubmissionModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleAddFeedback}
        projects={projects}
        defaultRole={(currentRole as any) || 'Landowner'}
      />

      {/* Footer */}
      <footer className="bg-[#161c18] text-stone-400 text-xs py-3 border-t border-[#263329] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-stone-300">
            <span className="text-amber-400">🚜</span>
            <span>NEXORA • Civil Construction Right-of-Way &amp; Farmer Land Intelligence System</span>
          </span>
          <span className="font-mono text-[11px] text-amber-400/80">
            🌾 Agrarian Solatium &amp; Concessionaire RoW Ground Clearance
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
