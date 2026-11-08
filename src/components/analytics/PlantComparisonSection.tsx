/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { PLANT_COMPARISON_MATRIX, PlantComparisonMetric } from '../../data/sampleData';
import { Sprout, BarChart3, Info } from 'lucide-react';

interface PlantComparisonSectionProps {
  metrics?: PlantComparisonMetric[];
}

export const PlantComparisonSection: React.FC<PlantComparisonSectionProps> = ({
  metrics = PLANT_COMPARISON_MATRIX,
}) => {
  // Chart data formatted for Recharts
  const chartData = [
    {
      metric: 'Soil Moisture (%)',
      tulsi: 34.2,
      hibiscus: 62.8,
      moneyPlant: 48.6,
      unit: '%',
    },
    {
      metric: 'Leaf Temp (°C)',
      tulsi: 26.8,
      hibiscus: 23.4,
      moneyPlant: 24.1,
      unit: '°C',
    },
    {
      metric: 'Ambient Temp (°C)',
      tulsi: 24.2,
      hibiscus: 24.0,
      moneyPlant: 24.2,
      unit: '°C',
    },
    {
      metric: 'Humidity (%)',
      tulsi: 58.4,
      hibiscus: 61.2,
      moneyPlant: 59.0,
      unit: '%',
    },
  ];

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
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D9F0EA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
              Cross-Species Comparative Baseline
            </h2>
            <span className="font-mono text-[10px] text-[#087E75] bg-[#D9F0EA] px-2 py-0.5 rounded font-semibold">
              3 Species Calibration
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Inter-species physiological variance across capacitive probes, MLX90614 radiometric IR, AHT25, and BH1750 sensors.
          </p>
        </div>
        <span className="text-xs font-mono text-[#78847C]">
          Dataset: SAMPLE DATA
        </span>
      </div>

      {/* Grouped Comparative Bar Visualization */}
      <div>
        <h3 className="text-xs font-semibold text-[#123B36] mb-2 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#087E75]" />
          Sensor Telemetry Distribution Comparison
        </h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9F0EA" vertical={false} />
              <XAxis
                dataKey="metric"
                tickLine={false}
                stroke="#55B6A3"
                tick={{ fill: '#78847C', fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                stroke="#55B6A3"
                tick={{ fill: '#78847C', fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#78847C' }} />
              <Bar dataKey="tulsi" name="Tulsi (TULSI_01)" fill="#C95D58" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hibiscus" name="Hibiscus (HIBISCUS_01)" fill="#087E75" radius={[4, 4, 0, 0]} />
              <Bar dataKey="moneyPlant" name="Money Plant (MONEYPLANT_01)" fill="#55B6A3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* High-Density Cross-Species Telemetry Table */}
      <div className="border border-[#D4E7E1] rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[650px]">
          <thead className="bg-[#F5FAF8] border-b border-[#D4E7E1] text-[#78847C] font-mono text-[11px]">
            <tr>
              <th className="p-3">Measurement</th>
              <th className="p-3">Sensor Model</th>
              <th className="p-3 text-right">Tulsi (TULSI_01)</th>
              <th className="p-3 text-right">Hibiscus (HIBISCUS_01)</th>
              <th className="p-3 text-right">Money Plant (MONEYPLANT_01)</th>
              <th className="p-3">Physiological Variance Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9F0EA] text-[#26342D]">
            {metrics.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#EEF7F4] transition-colors">
                <td className="p-3 font-semibold text-[#123B36]">
                  {row.sensorName} <span className="font-mono text-[#78847C] font-normal">({row.unit})</span>
                </td>
                <td className="p-3 font-mono text-[11px] text-[#78847C]">
                  {row.sensorModel}
                </td>
                <td className="p-3 text-right font-mono font-bold tabular-nums text-[#C95D58]">
                  {row.tulsiVal.toLocaleString()} {row.unit}
                </td>
                <td className="p-3 text-right font-mono font-bold tabular-nums text-[#087E75]">
                  {row.hibiscusVal.toLocaleString()} {row.unit}
                </td>
                <td className="p-3 text-right font-mono font-bold tabular-nums text-[#123B36]">
                  {row.moneyPlantVal.toLocaleString()} {row.unit}
                </td>
                <td className="p-3 text-[11px] text-[#78847C]">
                  {row.varianceNote}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparative Insight Notice */}
      <div className="p-3 bg-[#D9F0EA]/70 rounded-lg border border-[#55B6A3]/30 flex items-start gap-2 text-xs text-[#26342D]">
        <Info className="w-4 h-4 text-[#123B36] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-[#123B36]">Key Cross-Species Observation:</span>{' '}
          Ambient temperature and relative humidity remain uniform across all plant zones (difference &le; 0.2°C), isolating leaf radiometric temperature differences solely to individual transpirational cooling and root-zone capacitive hydration levels.
        </p>
      </div>
    </div>
  );
};
