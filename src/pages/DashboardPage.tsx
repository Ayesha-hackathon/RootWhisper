/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HeaderBanner } from '../components/dashboard/HeaderBanner';
import { KpiOverview } from '../components/dashboard/KpiOverview';
import { PlantCardGrid } from '../components/dashboard/PlantCardGrid';
import { SensorTrendChart } from '../components/dashboard/SensorTrendChart';
import { AiScreeningSummary } from '../components/dashboard/AiScreeningSummary';
import { EnvironmentalOverview } from '../components/dashboard/EnvironmentalOverview';
import { NodeConnectionOverview } from '../components/dashboard/NodeConnectionOverview';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import {
  PlantTelemetry,
  EnvironmentalConditions,
  KpiSummary,
  ESP32Node,
  ActivityEvent,
  TimeSeriesReading,
} from '../types';

interface DashboardPageProps {
  plants: PlantTelemetry[];
  environment: EnvironmentalConditions;
  kpis: KpiSummary;
  nodes: ESP32Node[];
  activityLogs: ActivityEvent[];
  timeSeries: TimeSeriesReading[];
  onViewDetails: (plant: PlantTelemetry) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  plants,
  environment,
  kpis,
  nodes,
  activityLogs,
  timeSeries,
  onViewDetails,
  onNavigateTab,
}) => {
  const stressCount = plants.filter(
    (p) => p.stressLevel === 'mild_stress' || p.stressLevel === 'high_stress'
  ).length;

  return (
    <>
      {/* Header Banner */}
      <section id="dashboard">
        <HeaderBanner
          activeScreenings={kpis.activeScreenings}
          stressAlertCount={stressCount}
        />
      </section>

      {/* 4 Compact KPI Cards */}
      <section>
        <KpiOverview
          kpis={kpis}
          onFilterNodes={() => onNavigateTab('sensor-diagnostics')}
          onViewScreenings={() => onNavigateTab('ai-screening')}
        />
      </section>

      {/* 3 Premium Plant Cards */}
      <section id="plants">
        <PlantCardGrid
          plants={plants}
          onViewDetails={onViewDetails}
        />
      </section>

      {/* Environmental Chamber Overview */}
      <section>
        <EnvironmentalOverview environment={environment} />
      </section>

      {/* Multi-Metric Sensor Trend Chart */}
      <section>
        <SensorTrendChart data={timeSeries} />
      </section>

      {/* AI Screening Summary (Adaptive Fingerprinting & CWSI) */}
      <section id="ai-screening">
        <AiScreeningSummary
          plants={plants}
          onSelectPlant={onViewDetails}
        />
      </section>

      {/* Node Connection Overview (ESP32 Fleet) */}
      <section id="esp32-nodes">
        <NodeConnectionOverview
          nodes={nodes}
          onOpenDiagnostics={() => onNavigateTab('sensor-diagnostics')}
        />
      </section>

      {/* Recent System Activity Log */}
      <section id="irrigation">
        <RecentActivity events={activityLogs} />
      </section>
    </>
  );
};
