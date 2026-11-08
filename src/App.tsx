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
import { SampleDataModal } from './components/dashboard/SampleDataModal';

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
import { useToast } from './hooks/useToast';
import { useTelemetryStream } from './hooks/useTelemetryStream';

export default function App() {
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
  const [isSampleDataModalOpen, setIsSampleDataModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Toast Hook
  const { toastMessage, showToast } = useToast();

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const refreshedPlants = await antigravityApi.fetchPlants();
      const refreshedEnv = await antigravityApi.fetchEnvironment();
      const refreshedNodes = await antigravityApi.fetchNodes();
      const refreshedLogs = await antigravityApi.fetchActivityLogs();
      const refreshedSeries = await antigravityApi.fetchTimeSeries(timeframe);

      setPlants(refreshedPlants);
      setEnvironment(refreshedEnv);
      setNodes(refreshedNodes);
      setActivityLogs(refreshedLogs);
      setTimeSeries(refreshedSeries);
      showToast('Telemetry refreshed from Antigravity buffer.');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

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
        onOpenSampleDataModal={() => setIsSampleDataModalOpen(true)}
        toastMessage={toastMessage}
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

      {/* Sample Data Architecture Inspector Modal */}
      <SampleDataModal
        isOpen={isSampleDataModalOpen}
        onClose={() => setIsSampleDataModalOpen(false)}
        rawSampleJson={{
          metadata: antigravityApi.getMetadata(),
          plants,
          environment,
          nodes,
        }}
      />
    </>
  );
}
