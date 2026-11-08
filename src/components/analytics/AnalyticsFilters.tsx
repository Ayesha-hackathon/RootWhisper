/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Filter, Calendar, Sprout, Activity, Clock, Database } from 'lucide-react';

export type AnalyticsPlantFilter = 'all' | 'tulsi-01' | 'hibiscus-01' | 'moneyplant-01';
export type AnalyticsDateRange = '24h' | '7d' | '30d';
export type AnalyticsMetricFilter = 'all' | 'leaf_temp' | 'moisture' | 'ambient' | 'light';
export type AnalyticsTimeInterval = '15m' | '1h' | 'daily';

interface AnalyticsFiltersProps {
  plantFilter: AnalyticsPlantFilter;
  onPlantFilterChange: (p: AnalyticsPlantFilter) => void;
  dateRange: AnalyticsDateRange;
  onDateRangeChange: (d: AnalyticsDateRange) => void;
  metricFilter: AnalyticsMetricFilter;
  onMetricFilterChange: (m: AnalyticsMetricFilter) => void;
  timeInterval: AnalyticsTimeInterval;
  onTimeIntervalChange: (i: AnalyticsTimeInterval) => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  plantFilter,
  onPlantFilterChange,
  dateRange,
  onDateRangeChange,
  metricFilter,
  onMetricFilterChange,
  timeInterval,
  onTimeIntervalChange,
}) => {
  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-4 shadow-xs space-y-3">
      {/* Top Filter Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#EEF3ED]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#173F32]">
          <Filter className="w-3.5 h-3.5 text-[#245640]" />
          <span>Multivariate Analytics Controls</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-mono text-[10px] bg-[#EEF3ED] text-[#245640] px-2 py-0.5 rounded font-semibold border border-[#A8BDA8]/40">
            <Database className="w-2.5 h-2.5" />
            SAMPLE DATA REPOSITORY
          </span>
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* 1. Plant Selector */}
        <div>
          <label className="block text-[11px] font-medium text-[#78847C] mb-1">
            Species Fleet Filter
          </label>
          <div className="flex items-center gap-1 p-0.5 bg-[#F4F7F3] rounded-lg border border-[#E5EBE3]">
            <button
              onClick={() => onPlantFilterChange('all')}
              className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                plantFilter === 'all'
                  ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              All (3)
            </button>
            <button
              onClick={() => onPlantFilterChange('tulsi-01')}
              className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                plantFilter === 'tulsi-01'
                  ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              Tulsi
            </button>
            <button
              onClick={() => onPlantFilterChange('hibiscus-01')}
              className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                plantFilter === 'hibiscus-01'
                  ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              Hibiscus
            </button>
            <button
              onClick={() => onPlantFilterChange('moneyplant-01')}
              className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                plantFilter === 'moneyplant-01'
                  ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              Pothos
            </button>
          </div>
        </div>

        {/* 2. Date Range Filter */}
        <div>
          <label className="block text-[11px] font-medium text-[#78847C] mb-1">
            Temporal Window
          </label>
          <div className="flex items-center gap-1 p-0.5 bg-[#F4F7F3] rounded-lg border border-[#E5EBE3]">
            {(
              [
                { id: '24h', label: '24 Hours' },
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
              ] as const
            ).map((d) => (
              <button
                key={d.id}
                onClick={() => onDateRangeChange(d.id)}
                className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  dateRange === d.id
                    ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Metric Focus Selector */}
        <div>
          <label className="block text-[11px] font-medium text-[#78847C] mb-1">
            Target Metric Focus
          </label>
          <select
            value={metricFilter}
            onChange={(e) => onMetricFilterChange(e.target.value as AnalyticsMetricFilter)}
            className="w-full py-1 px-2.5 text-xs font-medium bg-[#F4F7F3] border border-[#E5EBE3] rounded-lg text-[#26342D] focus:outline-none focus:border-[#A8BDA8] cursor-pointer"
          >
            <option value="all">All 5 Sensor Telemetry Streams</option>
            <option value="leaf_temp">Leaf Temperature (MLX90614)</option>
            <option value="moisture">Soil Moisture (Capacitive)</option>
            <option value="ambient">Ambient Temp & RH (AHT25)</option>
            <option value="light">Light Irradiance (BH1750)</option>
          </select>
        </div>

        {/* 4. Aggregation Interval */}
        <div>
          <label className="block text-[11px] font-medium text-[#78847C] mb-1">
            Sampling Interval
          </label>
          <div className="flex items-center gap-1 p-0.5 bg-[#F4F7F3] rounded-lg border border-[#E5EBE3]">
            {(
              [
                { id: '15m', label: '15 min' },
                { id: '1h', label: '1 hour' },
                { id: 'daily', label: 'Daily' },
              ] as const
            ).map((i) => (
              <button
                key={i.id}
                onClick={() => onTimeIntervalChange(i.id)}
                className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  timeInterval === i.id
                    ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
