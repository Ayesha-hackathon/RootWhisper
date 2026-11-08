/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  SAMPLE_ANOMALY_PERIODS,
  SCREENING_OUTCOME_DISTRIBUTION,
  getPlantSensorHistory,
} from '../../data/sampleData';
import { Activity, AlertTriangle, CheckCircle2, Clock, PieChart as PieIcon, ShieldAlert } from 'lucide-react';

export const AiAnalyticsSection: React.FC = () => {
  // Use Tulsi sample history as primary demonstration of predicted vs observed
  const tulsiHistory = getPlantSensorHistory('tulsi-01', '24h');

  const residualChartData = tulsiHistory.map((pt) => ({
    timeLabel: pt.timeLabel,
    observedTemp: pt.leafTemperature,
    predictedTemp: pt.expectedLeafTemp,
    residualDelta: pt.temperatureResidual,
    adaptiveThreshold: pt.adaptiveThreshold,
  }));

  const CustomLineTooltip = ({ active, payload, label }: any) => {
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
                  {entry.value}°C
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9F0EA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
              AI Adaptive Baseline & Anomaly Analytics
            </h2>
            <span className="font-mono text-[10px] text-[#087E75] bg-[#D9F0EA] px-2 py-0.5 rounded font-semibold">
              Residual Tracking
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Model residual trajectories, dynamic stomatal thresholds, and persistent water-stress anomalies.
          </p>
        </div>

        <span className="text-xs font-mono text-[#78847C]">
          SAMPLE DATA ANALYTICS
        </span>
      </div>

      {/* Top Grid: Residual Dynamics (Left 7 cols) & Screening Outcome Distribution (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Predicted vs Observed & Residual Trend */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#123B36] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#087E75]" />
              Predicted vs. Observed Leaf Temp & Residual (ΔT)
            </h3>
            <span className="text-[11px] font-mono text-[#78847C]">
              Species Focus: Tulsi (TULSI_01)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={residualChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9F0EA" vertical={false} />
                <XAxis
                  dataKey="timeLabel"
                  tickLine={false}
                  stroke="#55B6A3"
                  tick={{ fill: '#78847C', fontSize: 10 }}
                />
                <YAxis
                  tickLine={false}
                  stroke="#55B6A3"
                  tick={{ fill: '#78847C', fontSize: 11, fontFamily: 'monospace' }}
                  domain={[-1, 30]}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#78847C' }} />

                <Line
                  type="monotone"
                  dataKey="observedTemp"
                  name="Observed Leaf Temp (°C)"
                  stroke="#C95D58"
                  strokeWidth={2.4}
                  dot={{ r: 3, fill: '#C95D58' }}
                />
                <Line
                  type="monotone"
                  dataKey="predictedTemp"
                  name="AI Expected Hydrated Baseline (°C)"
                  stroke="#087E75"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="residualDelta"
                  name="Temperature Residual (Observed - Expected)"
                  stroke="#C58A35"
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                />

                <ReferenceLine
                  y={1.8}
                  stroke="#C95D58"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Adaptive Threshold (+1.8°C)',
                    fill: '#C95D58',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Screening Outcome Distribution (Donut Chart) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#F5FAF8] border border-[#D4E7E1] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-[#123B36] flex items-center gap-1.5">
                <PieIcon className="w-3.5 h-3.5 text-[#123B36]" />
                Screening Outcome Distribution
              </h3>
            </div>
            <p className="text-[11px] text-[#78847C] mb-2">
              Historical sample proportion across 8,640 screening evaluations.
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SCREENING_OUTCOME_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="percentage"
                  >
                    {SCREENING_OUTCOME_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val}%`, name]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#D4E7E1',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-1.5 pt-2 border-t border-[#D9F0EA] text-[10px]">
            {SCREENING_OUTCOME_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#26342D]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-semibold text-[#123B36]">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Persistent Anomaly Periods Table */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#123B36] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#C95D58]" />
            Persistent Physiological Anomaly Periods
          </h3>
          <span className="text-[11px] font-mono text-[#78847C]">
            Trigger: Residual &gt; Adaptive Threshold for &ge; 15 mins
          </span>
        </div>

        <div className="border border-[#D4E7E1] rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#F5FAF8] border-b border-[#D4E7E1] text-[#78847C] font-mono text-[11px]">
              <tr>
                <th className="p-3">Period ID</th>
                <th className="p-3">Target Plant</th>
                <th className="p-3">Onset Timestamp</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Peak Residual</th>
                <th className="p-3">Status</th>
                <th className="p-3">Physiological Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9F0EA] text-[#26342D]">
              {SAMPLE_ANOMALY_PERIODS.map((anom) => {
                const isActive = anom.status === 'active';
                return (
                  <tr key={anom.id} className="hover:bg-[#EEF7F4] transition-colors">
                    <td className="p-3 font-mono font-semibold text-[#123B36]">
                      {anom.id}
                    </td>
                    <td className="p-3 font-medium text-[#26342D]">
                      {anom.plantName}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#78847C]">
                      {anom.startTime}
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      {anom.duration}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#C95D58]">
                      +{anom.peakResidual.toFixed(1)}°C{' '}
                      <span className="text-[10px] text-[#78847C] font-normal">
                        (limit +{anom.adaptiveThreshold}°C)
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#FFF2F0] text-[#C95D58] border border-[#C95D58]/30'
                            : 'bg-[#D9F0EA] text-[#087E75] border border-[#55B6A3]/40'
                        }`}
                      >
                        {isActive ? 'ACTIVE' : 'RESOLVED'}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-[#78847C]">
                      {anom.interpretation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
