/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { PlantMonitoringPage } from './pages/PlantMonitoringPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiScreeningPage } from './pages/AiScreeningPage';
import { SensorDiagnosticsPage } from './pages/SensorDiagnosticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

import { PlantDetailModal } from './components/dashboard/PlantDetailModal';

import {
  PlantTelemetry,
  EnvironmentalConditions,
  KpiSummary,
  ESP32Node,
  ActivityEvent,
  TimeSeriesReading,
} from './types';
import {
  INITIAL_PLANTS,
  INITIAL_ENVIRONMENT,
  INITIAL_KPIS,
  INITIAL_NODES,
  INITIAL_ACTIVITY_LOGS,
  SAMPLE_TIME_SERIES,
} from './data/sampleData';
import { antigravityApi } from './services/antigravityApi';
import { authApi, AuthUser } from './services/authApi';
import { AuthPage } from './components/auth/AuthPage';
import { useToast } from './hooks/useToast';
import { useTelemetryStream } from './hooks/useTelemetryStream';

export default function App() {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [timeframe, setTimeframe] = useState<'6h' | '12h' | '24h' | '7d'>('24h');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Core Data State
  const { plants, setPlants } = useTelemetryStream(INITIAL_PLANTS, isStreaming);
  const [environment, setEnvironment] = useState<EnvironmentalConditions>(INITIAL_ENVIRONMENT);
  const [kpis, setKpis] = useState<KpiSummary>(INITIAL_KPIS);
  const [nodes, setNodes] = useState<ESP32Node[]>(INITIAL_NODES);
  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>(INITIAL_ACTIVITY_LOGS);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesReading[]>(SAMPLE_TIME_SERIES);

  // Modals & Navigation
  const [selectedMonitoringPlantId, setSelectedMonitoringPlantId] = useState<string>('tulsi-01');
  const [selectedPlant, setSelectedPlant] = useState<PlantTelemetry | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Toast Hook
  const { toastMessage, showToast } = useToast();

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [refreshedPlants, refreshedEnv, refreshedKpis, refreshedNodes, refreshedLogs, refreshedSeries] = await Promise.all([
        antigravityApi.fetchPlants(),
        antigravityApi.fetchEnvironment(),
        antigravityApi.fetchKpis(),
        antigravityApi.fetchNodes(),
        antigravityApi.fetchActivityLogs(),
        antigravityApi.fetchTimeSeries(timeframe),
      ]);

      setPlants(refreshedPlants);
      setEnvironment(refreshedEnv);
      setKpis(refreshedKpis);
      setNodes(refreshedNodes);
      setActivityLogs(refreshedLogs);
      setTimeSeries(refreshedSeries);
      showToast('Telemetry refreshed from RootWhisper backend.');
    } catch (err) {
      console.warn('[RootWhisper App] Refresh error:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Check existing session on mount
  React.useEffect(() => {
    authApi
      .getMe()
      .then((user) => {
        setCurrentUser(user);
        setIsAuthChecking(false);
        if (user) {
          handleRefresh();
        }
      })
      .catch(() => {
        setIsAuthChecking(false);
      });
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    setCurrentUser(null);
    showToast('Signed out of RootWhisper station.');
  };

  // Sync KPIs whenever plant telemetry updates
  React.useEffect(() => {
    if (plants && plants.length > 0) {
      antigravityApi.fetchKpis().then((k) => setKpis(k)).catch(() => {});
    }
  }, [plants]);

  // Timeframe change
  const handleTimeframeChange = async (t: '6h' | '12h' | '24h' | '7d') => {
    setTimeframe(t);
    const series = await antigravityApi.fetchTimeSeries(t);
    setTimeSeries(series);
  };

  // Export dataset
  const handleExportData = () => {
    const exportPayload = {
      meta: antigravityApi.getMetadata(),
      exportedAt: new Date().toISOString(),
      chamber: environment,
      speciesFleet: plants,
      nodes,
      recentActivity: activityLogs,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rootwhisper-telemetry-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Telemetry JSON dataset exported successfully.');
  };

  // Trigger manual AI screening
  const handleTriggerScreening = async (plantId: string) => {
    const res = await antigravityApi.triggerManualScreening(plantId);
    const updatedLogs = await antigravityApi.fetchActivityLogs();
    setActivityLogs(updatedLogs);
    showToast(res.message);
  };

  // Trigger simulated micro-irrigation
  const handleTriggerIrrigation = async (plantId: string) => {
    const res = await antigravityApi.triggerMicroIrrigation(plantId, 15);
    const updatedPlants = await antigravityApi.fetchPlants();
    const updatedLogs = await antigravityApi.fetchActivityLogs();
    setPlants(updatedPlants);
    setActivityLogs(updatedLogs);

    const updatedCurrent = updatedPlants.find((p) => p.id === plantId);
    if (updatedCurrent) {
      setSelectedPlant(updatedCurrent);
    }
    showToast(res.message);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F8F8F4] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-[#245640] border border-[#55B6A3]/30 flex items-center justify-center animate-pulse mb-3">
          <span className="text-[#A8C3A0] text-xl font-bold">🌿</span>
        </div>
        <p className="text-xs font-semibold text-[#173F32] tracking-wider uppercase">
          Verifying RootWhisper Security Session...
        </p>
      </div>
    );
  }

  const hasResetToken =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).has('token') ||
      new URLSearchParams(window.location.search).has('reset_token') ||
      (window.location.hash.includes('?') &&
        (new URLSearchParams(window.location.hash.split('?')[1]).has('token') ||
          new URLSearchParams(window.location.hash.split('?')[1]).has('reset_token'))));

  if (!currentUser || hasResetToken) {
    return (
      <AuthPage
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.full_name}!`);
          handleRefresh();
        }}
      />
    );
  }

  return (
    <>
      <AppLayout
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        isStreaming={isStreaming}
        onToggleStreaming={() => {
          setIsStreaming(!isStreaming);
          showToast(!isStreaming ? 'Live telemetry pulse resumed.' : 'Live telemetry stream paused.');
        }}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onExportData={handleExportData}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        toastMessage={toastMessage}
        currentUser={currentUser}
        onLogout={handleLogout}
      >
        {/* Render Selected View */}
        {currentTab === 'settings' ? (
          <SettingsPage onBackToDashboard={() => setCurrentTab('dashboard')} />
        ) : currentTab === 'reports' ? (
          <ReportsPage onBackToDashboard={() => setCurrentTab('dashboard')} />
        ) : currentTab === 'sensor-diagnostics' || currentTab === 'esp32-nodes' ? (
          <SensorDiagnosticsPage
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onExportDiagnostics={handleExportData}
          />
        ) : currentTab === 'ai-screening' ? (
          <AiScreeningPage
            plants={plants}
            selectedPlantId={selectedMonitoringPlantId}
            onSelectPlant={(id) => setSelectedMonitoringPlantId(id)}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onTriggerScreening={handleTriggerScreening}
          />
        ) : currentTab === 'analytics' ? (
          <AnalyticsPage
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onExportData={handleExportData}
          />
        ) : currentTab === 'plant-monitoring' ? (
          <PlantMonitoringPage
            plants={plants}
            selectedPlantId={selectedMonitoringPlantId}
            onSelectPlant={(id) => setSelectedMonitoringPlantId(id)}
            environment={environment}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onTriggerScreening={handleTriggerScreening}
            onTriggerIrrigation={handleTriggerIrrigation}
          />
        ) : (
          <DashboardPage
            plants={plants}
            environment={environment}
            kpis={kpis}
            nodes={nodes}
            activityLogs={activityLogs}
            timeSeries={timeSeries}
            onViewDetails={(plant) => setSelectedPlant(plant)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}
      </AppLayout>

      {/* Plant Deep-Dive Modal */}
      <PlantDetailModal
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onTriggerScreening={handleTriggerScreening}
        onTriggerIrrigation={handleTriggerIrrigation}
        onOpenMonitoring={(plantId) => {
          setSelectedMonitoringPlantId(plantId);
          setCurrentTab('plant-monitoring');
        }}
      />
    </>
  );
}
