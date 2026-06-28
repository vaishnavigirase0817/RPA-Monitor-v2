import { useState, useEffect, useMemo, useCallback } from 'react';
import { EnterpriseHeader } from '../components/EnterpriseHeader';
import { Sidebar } from '../components/Sidebar';
import { useRPAData } from '../hooks/useRPAData';
import { useSortAndFilter } from '../hooks/useSortAndFilter';
import { useLayoutPreferences } from '../hooks/useLayoutPreferences';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { useColumnManager } from '../hooks/useColumnManager';
import { useSelection } from '../hooks/useSelection';
import { BootSequenceOverlay } from '../components/BootSequenceOverlay';
import { CursorSpotlight } from '../components/CursorSpotlight';
import { CommandPalette } from '../components/CommandPalette';
import { OnboardingModal } from '../components/OnboardingModal';
import { InspectorPanel } from '../components/InspectorPanel';
import { NotificationDrawer } from '../components/NotificationDrawer';
import { PerformanceOverlay } from '../components/PerformanceOverlay';
import { useToast } from '../components/ToastProvider';
import { exportToCSV, exportToJSON } from '../utils/exportToCSV';
import { AnalyticsPanel } from '../components/AnalyticsOverlay/AnalyticsPanel';
import type { TabId } from '../components/Sidebar';

// Views
import { DashboardView } from '../views/DashboardView';
import { LiveTelemetryView } from '../views/LiveTelemetryView';
import { BotManagementView } from '../views/BotManagementView';
import { ProcessMonitoringView } from '../views/ProcessMonitoringView';
import { AnalyticsView } from '../views/AnalyticsView';
import { ActivityLogsView } from '../views/ActivityLogsView';
import { AlertsView } from '../views/AlertsView';
import { InfrastructureView } from '../views/InfrastructureView';
import { SettingsView } from '../views/SettingsView';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>('Dashboard');
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showPerfOverlay, setShowPerfOverlay] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const { kpiData, streamData, queueSize, telemetry, notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useRPAData(isPaused);
  const { processedData, sortCriteria, handleSort, filters, setFilters } = useSortAndFilter(streamData);
  const { preferences, togglePreference } = useLayoutPreferences();
  const { fps, rps } = usePerformanceMetrics(kpiData.totalStreamedRows);
  const { columns, toggleColumnVisibility, resizeColumn } = useColumnManager();
  const { selectedIds, toggleSelection, selectAll, clearSelection } = useSelection();
  const { showToast } = useToast();

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    if (!localStorage.getItem('rpa_onboarded')) {
      setIsOnboardingOpen(true);
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleCloseOnboarding = useCallback(() => {
    setIsOnboardingOpen(false);
    localStorage.setItem('rpa_onboarded', 'true');
  }, []);

  useKeyboardShortcuts({
    onTogglePause: () => {
      setIsPaused(p => {
        showToast(p ? 'Stream Resumed' : 'Stream Paused', p ? 'success' : 'warning');
        return !p;
      });
    },
    onToggleFullscreen: () => setIsFullscreen(f => !f)
  });

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === '?' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setIsOnboardingOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const commandActions = [
    { id: '1', label: isPaused ? 'Resume Stream' : 'Pause Stream', onExecute: () => setIsPaused(!isPaused) },
    { id: '2', label: 'Export All to CSV', onExecute: () => { exportToCSV(processedData); showToast('CSV Export Started', 'success'); } },
    { id: '3', label: 'Export All to JSON', onExecute: () => { exportToJSON(processedData); showToast('JSON Export Started', 'success'); } },
    { id: '4', label: 'Export Selected to CSV', onExecute: () => { 
        if (selectedIds.size === 0) { showToast('No rows selected', 'warning'); return; }
        exportToCSV(processedData.filter(d => selectedIds.has(d.id))); 
        showToast('Selected Export Started', 'success'); 
    } },
    { id: '5', label: 'Clear Selection', onExecute: () => { clearSelection(); showToast('Selection cleared', 'success'); } },
    { id: '6', label: 'Toggle Fullscreen Mode', onExecute: () => setIsFullscreen(!isFullscreen) },
    { id: '7', label: 'Toggle KPI Panel', onExecute: () => togglePreference('showKPIs') },
    { id: '8', label: 'Toggle Grid Panel', onExecute: () => togglePreference('showGrid') },
    { id: '9', label: 'Toggle Performance Monitor', onExecute: () => setShowPerfOverlay(p => !p) },
    { id: '10', label: 'Open Notifications', onExecute: () => setIsNotificationsOpen(true) },
    { id: '11', label: 'Show Keyboard Shortcuts', onExecute: () => setIsOnboardingOpen(true) },
    { id: '12', label: 'Analytics View', onExecute: () => {
        if (!isPaused) {
          showToast('Pause stream to analyze frozen telemetry data', 'warning');
        } else {
          setIsAnalyticsOpen(true);
        }
    } },
  ];

  return (
    <div className={`min-h-screen h-screen bg-black relative overflow-hidden flex ${isFullscreen ? 'fixed inset-0 z-50 p-2 bg-navy/90 backdrop-blur-2xl' : ''}`}>
      <BootSequenceOverlay />
      <CursorSpotlight />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} actions={commandActions} />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={handleCloseOnboarding} />
      <InspectorPanel />
      <NotificationDrawer 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
        notifications={notifications}
        onMarkRead={markNotificationRead}
        onMarkAllRead={markAllNotificationsRead}
        onClear={clearNotifications}
      />
      <AnalyticsPanel 
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        data={processedData}
      />

      {!isFullscreen && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          {/* Hero Image Overlay */}
          <div 
            className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/src/assets/hero_bg.png')" }}
          />
          <div className="absolute inset-0 bg-grid opacity-30"></div>
          <div className="radar"></div>
          <div className="scanning-line"></div>
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }} 
            />
          ))}
        </div>
      )}

      {!isFullscreen && <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />}

      <div className="relative z-10 flex flex-col flex-1 h-full max-w-[1920px] w-full overflow-hidden">
        {!isFullscreen && (
          <EnterpriseHeader 
            connectionStatus={telemetry.connectionStatus}
            unreadNotifications={unreadCount}
            onNotificationClick={() => setIsNotificationsOpen(true)}
          />
        )}
        
        {/* VIEW ROUTER */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'Dashboard' && <DashboardView />}
          {activeTab === 'Bot Management' && <BotManagementView />}
          {activeTab === 'Processes' && <ProcessMonitoringView />}
          {activeTab === 'Analytics' && <AnalyticsView />}
          {activeTab === 'Activity Logs' && <ActivityLogsView />}
          {activeTab === 'Alerts' && <AlertsView />}
          {activeTab === 'Infrastructure' && <InfrastructureView />}
          {activeTab === 'Settings' && <SettingsView />}
          
          {/* We always keep LiveTelemetry mounted if it's the active tab, but we hide it via CSS if not, or we can just conditionally render it if state retention is not an issue (useRPAData is at top level, so stream engine continues anyway!) */}
          {activeTab === 'Live Telemetry' && (
            <LiveTelemetryView 
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              queueSize={queueSize}
              preferences={preferences}
              togglePreference={togglePreference}
              filters={filters}
              setFilters={setFilters}
              columns={columns}
              toggleColumnVisibility={toggleColumnVisibility}
              resizeColumn={resizeColumn}
              processedData={processedData}
              streamDataLength={streamData.length}
              sortCriteria={sortCriteria}
              handleSort={handleSort}
              isLoading={isLoading}
              selectedIds={selectedIds}
              toggleSelection={toggleSelection}
              selectAll={selectAll}
              clearSelection={clearSelection}
              fps={fps}
              rps={rps}
              telemetry={telemetry}
              kpiData={kpiData}
              onOpenAnalytics={() => {
                if (!isPaused) showToast('Pause stream to analyze frozen telemetry data', 'warning');
                else setIsAnalyticsOpen(true);
              }}
              showToast={showToast}
            />
          )}
        </div>
      </div>

      {showPerfOverlay && (
        <PerformanceOverlay 
          telemetry={telemetry} 
          fps={fps} 
          rps={rps} 
          queueSize={queueSize}
          totalRows={streamData.length}
        />
      )}
    </div>
  );
};
