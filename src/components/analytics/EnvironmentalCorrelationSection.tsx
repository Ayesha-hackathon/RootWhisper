/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { SAMPLE_ENVIRONMENTAL_CORRELATIONS, EnvironmentalCorrelationPoint } from '../../data/sampleData';
import { Flame, Droplets, Sun, Activity, HelpCircle } from 'lucide-react';

type CorrelationMode = 'ambient_vs_leaf' | 'humidity_vs_leaf' | 'light_vs_leaf' | 'moisture_vs_cwsi';

export const EnvironmentalCorrelationSection: React.FC = () => {
  const [mode, setMode] = useState<CorrelationMode>('ambient_vs_leaf');

  const data = SAMPLE_ENVIRONMENTAL_CORRELATIONS;

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
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9F0EA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
              Environmental & Physiological Correlations
            </h2>
            <span className="font-mono text-[10px] text-[#123B36] bg-[#D9F0EA] px-2 py-0.5 rounded font-semibold">
              Energy Balance Analytics
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Interactions between chamber microclimate drivers and foliar thermal responses.
          </p>
        </div>

        <span className="text-xs font-mono text-[#78847C]">
          SAMPLE DATA CORRELATION
        </span>
      </div>

      {/* 4 Mode Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <button
          onClick={() => setMode('ambient_vs_leaf')}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            mode === 'ambient_vs_leaf'
              ? 'bg-[#D9F0EA] border-[#123B36] text-[#123B36] shadow-xs'
              : 'bg-[#F5FAF8] border-[#D4E7E1] text-[#78847C] hover:text-[#26342D]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1 font-semibold text-xs">
            <Flame className="w-3.5 h-3.5 text-[#123B36]" />
            <span>Ambient vs Leaf Temp</span>
          </div>
          <p className="text-[10px] text-[#78847C] line-clamp-1">
            Thermal decoupling & latent cooling
          </p>
        </button>

        <button
          onClick={() => setMode('humidity_vs_leaf')}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            mode === 'humidity_vs_leaf'
              ? 'bg-[#D9F0EA] border-[#123B36] text-[#123B36] shadow-xs'
              : 'bg-[#F5FAF8] border-[#D4E7E1] text-[#78847C] hover:text-[#26342D]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1 font-semibold text-xs">
            <Droplets className="w-3.5 h-3.5 text-[#087E75]" />
            <span>Humidity vs Leaf Temp</span>
          </div>
          <p className="text-[10px] text-[#78847C] line-clamp-1">
            Vapor pressure deficit dynamics
          </p>
        </button>

        <button
          onClick={() => setMode('light_vs_leaf')}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            mode === 'light_vs_leaf'
              ? 'bg-[#D9F0EA] border-[#123B36] text-[#123B36] shadow-xs'
              : 'bg-[#F5FAF8] border-[#D4E7E1] text-[#78847C] hover:text-[#26342D]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1 font-semibold text-xs">
            <Sun className="w-3.5 h-3.5 text-[#C58A35]" />
            <span>Light vs Leaf Temp</span>
          </div>
          <p className="text-[10px] text-[#78847C] line-clamp-1">
            Solar irradiance heat flux load
          </p>
        </button>

        <button
          onClick={() => setMode('moisture_vs_cwsi')}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            mode === 'moisture_vs_cwsi'
              ? 'bg-[#D9F0EA] border-[#123B36] text-[#123B36] shadow-xs'
              : 'bg-[#F5FAF8] border-[#D4E7E1] text-[#78847C] hover:text-[#26342D]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1 font-semibold text-xs">
            <Activity className="w-3.5 h-3.5 text-[#C95D58]" />
            <span>Moisture vs CWSI Score</span>
          </div>
          <p className="text-[10px] text-[#78847C] line-clamp-1">
            Hydraulic threshold screening curve
          </p>
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9F0EA" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              stroke="#55B6A3"
              tick={{ fill: '#78847C', fontSize: 10 }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              stroke="#55B6A3"
              tick={{ fill: '#78847C', fontSize: 11, fontFamily: 'monospace' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              stroke="#55B6A3"
              tick={{ fill: '#78847C', fontSize: 11, fontFamily: 'monospace' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#78847C' }} />

            {/* Mode 1: Ambient Temp vs Leaf Temp */}
            {mode === 'ambient_vs_leaf' && (
              <>
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ambientTemp"
                  name="Ambient Temp (°C)"
                  stroke="#123B36"
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="leafTemp"
                  name="Observed Leaf Temp (°C)"
                  stroke="#C95D58"
                  strokeWidth={2.4}
                  dot={{ r: 4, fill: '#C95D58' }}
                />
              </>
            )}

            {/* Mode 2: Humidity vs Leaf Temp */}
            {mode === 'humidity_vs_leaf' && (
              <>
                <Bar
                  yAxisId="right"
                  dataKey="humidity"
                  name="Relative Humidity (%)"
                  fill="#55B6A3"
                  opacity={0.4}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="leafTemp"
                  name="Leaf Temperature (°C)"
                  stroke="#C95D58"
                  strokeWidth={2.4}
                  dot={{ r: 4 }}
                />
              </>
            )}

            {/* Mode 3: Light vs Leaf Temp */}
            {mode === 'light_vs_leaf' && (
              <>
                <Bar
                  yAxisId="right"
                  dataKey="lightLux"
                  name="Light Irradiance (lux)"
                  fill="#C58A35"
                  opacity={0.35}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="leafTemp"
                  name="Leaf Temperature (°C)"
                  stroke="#C95D58"
                  strokeWidth={2.4}
                  dot={{ r: 4 }}
                />
              </>
            )}

            {/* Mode 4: Soil Moisture vs CWSI Score */}
            {mode === 'moisture_vs_cwsi' && (
              <>
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="soilMoisture"
                  name="Soil Moisture (%)"
                  stroke="#087E75"
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cwsiScore"
                  name="CWSI Stress Score (0-1)"
                  stroke="#C95D58"
                  strokeWidth={2.6}
                  dot={{ r: 4, fill: '#C95D58' }}
                />
                <ReferenceLine
                  yAxisId="right"
                  y={0.5}
                  stroke="#C58A35"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Stress Threshold (CWSI 0.50)',
                    fill: '#C58A35',
                    fontSize: 10,
                  }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Domain Scientific Footnote */}
      <div className="p-3 bg-[#F5FAF8] rounded-lg border border-[#D9F0EA] text-xs text-[#26342D] leading-relaxed">
        {mode === 'ambient_vs_leaf' && (
          <p>
            <span className="font-semibold text-[#123B36]">Analytical Note:</span> Under nominal hydration, leaf temperature operates 0.5°C to 1.5°C below ambient air due to latent cooling. As root moisture declines, stomatal constriction forces leaf temperature above ambient air (+2.6°C delta).
          </p>
        )}
        {mode === 'humidity_vs_leaf' && (
          <p>
            <span className="font-semibold text-[#123B36]">Analytical Note:</span> Lower chamber relative humidity increases atmospheric vapor pressure deficit (VPD), elevating transpiration demand and accelerating stomatal fatigue when substrate reserves fall below 35%.
          </p>
        )}
        {mode === 'light_vs_leaf' && (
          <p>
            <span className="font-semibold text-[#123B36]">Analytical Note:</span> High illumination (&gt;15,000 lux) creates radiant surface heating. Hydrated canopies dissipate this heat seamlessly through stomatal conductance, whereas stressed leaves overheat rapidly.
          </p>
        )}
        {mode === 'moisture_vs_cwsi' && (
          <p>
            <span className="font-semibold text-[#123B36]">Analytical Note:</span> The non-linear hydraulic inflection occurs around 35% soil moisture for Tulsi, where the Crop Water Stress Index rises sharply from 0.22 to &gt;0.64 before visible wilting appears.
          </p>
        )}
      </div>
    </div>
  );
};
