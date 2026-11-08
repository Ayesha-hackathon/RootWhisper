/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TimeSeriesReading } from '../../types';
import { TrendingUp, Info } from 'lucide-react';

interface SensorTrendChartProps {
  data: TimeSeriesReading[];
}

type MetricMode = 'moisture' | 'delta_temp' | 'cwsi' | 'ambient';

export const SensorTrendChart: React.FC<SensorTrendChartProps> = ({ data }) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('delta_temp');
  const [selectedPlant, setSelectedPlant] = useState<'all' | 'tulsi' | 'hibiscus' | 'moneyPlant'>('all');

  // Custom clean tooltip matching botanical design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#D4E7E1] shadow-md text-xs">
          <p className="font-semibold text-[#123B36] mb-1.5 border-b border-[#D9F0EA] pb-1 font-mono">
            {label}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-mono font-semibold text-[#26342D] tabular-nums">
                  {entry.value}
                  {metricMode === 'moisture'
                    ? '%'
                    : metricMode === 'delta_temp'
                    ? '°C'
                    : metricMode === 'cwsi'
                    ? ''
                    : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#D9F0EA]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
                Physiological & Environmental Dynamics
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#FFF8EB] text-[#C58A35] border border-[#C58A35]/30">
                Awaiting Hardware Telemetry
              </span>
            </div>
            <p className="text-xs text-[#78847C] mt-0.5">
              Continuous canopy microclimate, capacitive substrate moisture, and physiological leaf-air differentials.
            </p>
          </div>
        </div>

        <div className="py-14 text-center">
          <div className="w-12 h-12 rounded-full bg-[#EDF7F4] border border-[#D4E7E1] flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-[#78847C]" />
          </div>
          <h3 className="text-sm font-semibold text-[#123B36] mb-1">
            No historical sensor data available yet
          </h3>
          <p className="text-xs text-[#78847C] max-w-md mx-auto">
            Waiting for sensor data. Connect your ESP32 node to start live monitoring.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#D9F0EA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
              Physiological & Environmental Dynamics
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#D9F0EA] text-[#087E75]">
              24-Hour Telemetry
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            {metricMode === 'delta_temp' && 'Leaf-to-air differential (ΔT = T_leaf - T_ambient): key physiological fingerprint for stomatal closure.'}
            {metricMode === 'moisture' && 'Continuous volumetric substrate moisture levels across capacitive rhizosphere probes.'}
            {metricMode === 'cwsi' && 'Empirical Crop Water Stress Index: 0.0 (fully transpired) to 1.0 (complete stomatal shutdown).'}
            {metricMode === 'ambient' && 'Chamber baseline microclimate tracking ambient temperature, humidity, and PAR light.'}
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EDF7F4] rounded-lg border border-[#D4E7E1]">
          <button
            onClick={() => setMetricMode('delta_temp')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              metricMode === 'delta_temp'
                ? 'bg-white text-[#123B36] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            Leaf-Air ΔT
          </button>
          <button
            onClick={() => setMetricMode('moisture')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              metricMode === 'moisture'
                ? 'bg-white text-[#123B36] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            Soil Moisture
          </button>
          <button
            onClick={() => setMetricMode('cwsi')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              metricMode === 'cwsi'
                ? 'bg-white text-[#123B36] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            CWSI Stress Index
          </button>
          <button
            onClick={() => setMetricMode('ambient')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              metricMode === 'ambient'
                ? 'bg-white text-[#123B36] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            Ambient Chamber
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9F0EA" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              tickLine={false}
              stroke="#55B6A3"
              tick={{ fill: '#78847C', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              stroke="#55B6A3"
              tick={{ fill: '#78847C', fontSize: 11, fontFamily: 'monospace' }}
              domain={
                metricMode === 'delta_temp'
                  ? [-1.5, 3.5]
                  : metricMode === 'moisture'
                  ? [20, 80]
                  : metricMode === 'cwsi'
                  ? [0, 1]
                  : ['auto', 'auto']
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '12px', color: '#78847C' }}
            />

            {/* Threshold line for water-stress warning */}
            {metricMode === 'delta_temp' && (
              <ReferenceLine
                y={1.5}
                stroke="#C95D58"
                strokeDasharray="4 4"
                label={{
                  value: 'Stress Onset Threshold (+1.5°C)',
                  fill: '#C95D58',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {metricMode === 'cwsi' && (
              <ReferenceLine
                y={0.5}
                stroke="#C58A35"
                strokeDasharray="4 4"
                label={{
                  value: 'Mild Water Deficit (0.50 CWSI)',
                  fill: '#C58A35',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {/* Render lines depending on metric */}
            {metricMode === 'delta_temp' && (
              <>
                <Line
                  type="monotone"
                  dataKey="tulsiDelta"
                  name="Tulsi Leaf ΔT"
                  stroke="#C95D58"
                  strokeWidth={2.4}
                  dot={{ r: 3, fill: '#C95D58' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="hibiscusDelta"
                  name="Hibiscus Leaf ΔT"
                  stroke="#087E75"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#087E75' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="moneyPlantDelta"
                  name="Money Plant Leaf ΔT"
                  stroke="#55B6A3"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#55B6A3' }}
                  activeDot={{ r: 5 }}
                />
              </>
            )}

            {metricMode === 'moisture' && (
              <>
                <Line
                  type="monotone"
                  dataKey="tulsiMoisture"
                  name="Tulsi Soil Moisture"
                  stroke="#C58A35"
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="hibiscusMoisture"
                  name="Hibiscus Soil Moisture"
                  stroke="#087E75"
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="moneyPlantMoisture"
                  name="Money Plant Soil Moisture"
                  stroke="#123B36"
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                />
              </>
            )}

            {metricMode === 'cwsi' && (
              <>
                <Line
                  type="monotone"
                  dataKey="tulsiCwsi"
                  name="Tulsi CWSI"
                  stroke="#C95D58"
                  strokeWidth={2.4}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="hibiscusCwsi"
                  name="Hibiscus CWSI"
                  stroke="#087E75"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="moneyPlantCwsi"
                  name="Money Plant CWSI"
                  stroke="#55B6A3"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </>
            )}

            {metricMode === 'ambient' && (
              <>
                <Line
                  type="monotone"
                  dataKey="ambientTemp"
                  name="Ambient Temp (°C)"
                  stroke="#123B36"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="ambientRh"
                  name="Ambient RH (%)"
                  stroke="#78847C"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Insight */}
      <div className="mt-3 pt-3 border-t border-[#D9F0EA] flex items-center justify-between text-xs text-[#78847C]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#123B36]" />
          <span>
            Antigravity Invariant: Tulsi shows stomatal restriction commencing at 08:00 as leaf temperature surpasses ambient air (+2.6°C).
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#087E75]">
          Sample Data Feed
        </span>
      </div>
    </div>
  );
};
