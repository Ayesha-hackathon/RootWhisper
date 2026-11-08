/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AnalyticsFilters,
  AnalyticsPlantFilter,
  AnalyticsDateRange,
  AnalyticsMetricFilter,
  AnalyticsTimeInterval,
} from './AnalyticsFilters';
import { PlantComparisonSection } from './PlantComparisonSection';
import { TemporalAnalyticsSection } from './TemporalAnalyticsSection';
import { EnvironmentalCorrelationSection } from './EnvironmentalCorrelationSection';
import { AiAnalyticsSection } from './AiAnalyticsSection';
import { ArrowLeft, Download, RefreshCw, BarChart2, Database } from 'lucide-react';

interface AnalyticsViewProps {
  onBackToDashboard: () => void;
  onExportData: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onBackToDashboard,
  onExportData,
}) => {
  const [plantFilter, setPlantFilter] = useState<AnalyticsPlantFilter>('all');
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('24h');
  const [metricFilter, setMetricFilter] = useState<AnalyticsMetricFilter>('all');
  const [timeInterval, setTimeInterval] = useState<AnalyticsTimeInterval>('15m');

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EEF3ED]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5EBE3] bg-white text-xs font-medium text-[#26342D] hover:text-[#173F32] hover:bg-[#F8F8F4] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78847C] font-mono">
              Advanced Biophysical Analytics & Model Verification
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportData}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#173F32] hover:bg-[#245640] text-[#FFFFFF] rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics CSV / JSON</span>
          </button>
        </div>
      </div>

      {/* 1. Global Analytics Filters */}
      <AnalyticsFilters
        plantFilter={plantFilter}
        onPlantFilterChange={setPlantFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        metricFilter={metricFilter}
        onMetricFilterChange={setMetricFilter}
        timeInterval={timeInterval}
        onTimeIntervalChange={setTimeInterval}
      />

      {/* 2. Plant Comparison Across All Five Sensors */}
      <PlantComparisonSection />

      {/* 3. Temporal Analytics: Time-Series for All Five Sensors */}
      <TemporalAnalyticsSection
        dateRange={dateRange}
        plantFilter={plantFilter}
      />

      {/* 4. Environmental Analysis & Correlations */}
      <EnvironmentalCorrelationSection />

      {/* 5. AI Analytics: Residuals, Baseline Thresholds, Anomalies & Outcomes */}
      <AiAnalyticsSection />
    </div>
  );
};
