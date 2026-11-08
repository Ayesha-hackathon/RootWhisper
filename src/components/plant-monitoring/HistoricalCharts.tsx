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
import { getPlantSensorHistory, PlantSensorHistoryPoint } from '../../data/sampleData';
import { Droplet, Thermometer, Flame, CloudRain, Sun, Calendar } from 'lucide-react';

interface HistoricalChartsProps {
  plantId: string;
}

type ChartMetric = 'all' | 'soil_moisture' | 'temperatures' | 'humidity' | 'light';
type TimeframeOption = '1h' | '24h' | '7d' | '30d';

export const HistoricalCharts: React.FC<HistoricalChartsProps> = ({ plantId }) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('24h');
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('temperatures');

  const historyData: PlantSensorHistoryPoint[] = getPlantSensorHistory(plantId, timeframe);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E5EBE3] shadow-md text-xs">
          <p className="font-semibold text-[#173F32] mb-1.5 border-b border-[#EEF3ED] pb-1 font-mono">
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
                  {entry.unit || ''}
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
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-5 shadow-xs space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EEF3ED]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#173F32] tracking-tight">
              Sensor Telemetry Historical Trends
            </h2>
            <span className="font-mono text-[10px] text-[#78847C] bg-[#F8F8F4] border border-[#E5EBE3] px-2 py-0.5 rounded">
              High Resolution Time Series
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Synchronized readings across capacitive probe, MLX90614, AHT25, and BH1750 sensors.
          </p>
        </div>

        {/* Filters: Metric selector + Timeframe selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector: 1h, 24h, 7d, 30d */}
          <div className="flex items-center gap-1 p-1 bg-[#F4F7F3] rounded-lg border border-[#E5EBE3]">
            {(['1h', '24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  timeframe === t
                    ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveMetric('temperatures')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeMetric === 'temperatures'
              ? 'bg-[#173F32] text-white'
              : 'bg-[#F8F8F4] text-[#78847C] hover:text-[#26342D] border border-[#E5EBE3]'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5" />
          <span>Leaf vs Ambient Temp (°C)</span>
        </button>

        <button
          onClick={() => setActiveMetric('soil_moisture')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeMetric === 'soil_moisture'
              ? 'bg-[#173F32] text-white'
              : 'bg-[#F8F8F4] text-[#78847C] hover:text-[#26342D] border border-[#E5EBE3]'
          }`}
        >
          <Droplet className="w-3.5 h-3.5" />
          <span>Soil Moisture (%)</span>
        </button>

        <button
          onClick={() => setActiveMetric('humidity')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeMetric === 'humidity'
              ? 'bg-[#173F32] text-white'
              : 'bg-[#F8F8F4] text-[#78847C] hover:text-[#26342D] border border-[#E5EBE3]'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>Relative Humidity (%)</span>
        </button>

        <button
          onClick={() => setActiveMetric('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeMetric === 'light'
              ? 'bg-[#173F32] text-white'
              : 'bg-[#F8F8F4] text-[#78847C] hover:text-[#26342D] border border-[#E5EBE3]'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light Intensity (lux)</span>
        </button>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF3ED" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              tickLine={false}
              stroke="#A8BDA8"
              tick={{ fill: '#78847C', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              stroke="#A8BDA8"
              tick={{ fill: '#78847C', fontSize: 11, fontFamily: 'monospace' }}
              domain={
                activeMetric === 'temperatures'
                  ? [18, 30]
                  : activeMetric === 'soil_moisture'
                  ? [20, 80]
                  : activeMetric === 'humidity'
                  ? [40, 80]
                  : ['auto', 'auto']
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#78847C' }} />

            {/* Temperatures View */}
            {activeMetric === 'temperatures' && (
              <>
                <Line
                  type="monotone"
                  dataKey="leafTemperature"
                  name="Observed Leaf Temp (MLX90614)"
                  stroke="#C95D58"
                  strokeWidth={2.4}
                  dot={{ r: 3, fill: '#C95D58' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="ambientTemperature"
                  name="Ambient Chamber Temp (AHT25)"
                  stroke="#173F32"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#173F32' }}
                  strokeDasharray="4 2"
                />
                <Line
                  type="monotone"
                  dataKey="expectedLeafTemp"
                  name="AI Expected Leaf Temp"
                  stroke="#245640"
                  strokeWidth={1.8}
                  strokeDasharray="2 2"
                  dot={false}
                />
                <ReferenceLine
                  y={27.0}
                  stroke="#C95D58"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Stress Threshold (27.0°C)',
                    fill: '#C95D58',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
              </>
            )}

            {/* Soil Moisture View */}
            {activeMetric === 'soil_moisture' && (
              <>
                <Line
                  type="monotone"
                  dataKey="soilMoisture"
                  name="Substrate Moisture (Capacitive)"
                  stroke="#245640"
                  strokeWidth={2.4}
                  dot={{ r: 3, fill: '#245640' }}
                  activeDot={{ r: 5 }}
                />
                <ReferenceLine
                  y={30.0}
                  stroke="#C58A35"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Wilting Threshold (30%)',
                    fill: '#C58A35',
                    fontSize: 10,
                    position: 'insideBottomRight',
                  }}
                />
              </>
            )}

            {/* Relative Humidity View */}
            {activeMetric === 'humidity' && (
              <>
                <Line
                  type="monotone"
                  dataKey="relativeHumidity"
                  name="Chamber RH (AHT25)"
                  stroke="#78847C"
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: '#78847C' }}
                  activeDot={{ r: 5 }}
                />
                <ReferenceLine
                  y={50.0}
                  stroke="#A8BDA8"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Min Desirable RH (50%)',
                    fill: '#78847C',
                    fontSize: 10,
                    position: 'insideBottomLeft',
                  }}
                />
              </>
            )}

            {/* Light Intensity View */}
            {activeMetric === 'light' && (
              <Line
                type="monotone"
                dataKey="lightIntensity"
                name="Ambient Light Lux (BH1750)"
                stroke="#C58A35"
                strokeWidth={2.2}
                dot={{ r: 3, fill: '#C58A35' }}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-[#EEF3ED] flex items-center justify-between text-[11px] text-[#78847C]">
        <span>
          Viewing {timeframe.toUpperCase()} window for species calibration.
        </span>
        <span className="font-mono text-[#245640]">
          Sample Telemetry Dataset
        </span>
      </div>
    </div>
  );
};
