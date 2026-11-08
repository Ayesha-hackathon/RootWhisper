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
import { Clock, LineChart as ChartIcon, Droplet, Thermometer, Flame, CloudRain, Sun } from 'lucide-react';
import { AnalyticsDateRange, AnalyticsPlantFilter } from './AnalyticsFilters';

interface TemporalAnalyticsSectionProps {
  dateRange: AnalyticsDateRange;
  plantFilter: AnalyticsPlantFilter;
}

type SensorTab = 'leaf_temp' | 'moisture' | 'ambient_temp' | 'humidity' | 'light';

export const TemporalAnalyticsSection: React.FC<TemporalAnalyticsSectionProps> = ({
  dateRange,
  plantFilter,
}) => {
  const [activeSensor, setActiveSensor] = useState<SensorTab>('leaf_temp');

  const tulsiHistory = getPlantSensorHistory('tulsi-01', dateRange);
  const hibiscusHistory = getPlantSensorHistory('hibiscus-01', dateRange);
  const moneyPlantHistory = getPlantSensorHistory('moneyplant-01', dateRange);

  // Merge the time points for cross-plant comparison in one time series chart
  const mergedSeries = tulsiHistory.map((pt, idx) => {
    const hibPt = hibiscusHistory[idx] || pt;
    const mpPt = moneyPlantHistory[idx] || pt;

    return {
      timeLabel: pt.timeLabel,
      // Soil Moisture
      tulsiMoisture: pt.soilMoisture,
      hibiscusMoisture: hibPt.soilMoisture,
      moneyPlantMoisture: mpPt.soilMoisture,
      // Leaf Temp
      tulsiLeafTemp: pt.leafTemperature,
      hibiscusLeafTemp: hibPt.leafTemperature,
      moneyPlantLeafTemp: mpPt.leafTemperature,
      // Ambient Temp
      ambientTemp: pt.ambientTemperature,
      // Humidity
      relativeHumidity: pt.relativeHumidity,
      // Light
      tulsiLight: pt.lightIntensity,
      hibiscusLight: hibPt.lightIntensity,
      moneyPlantLight: mpPt.lightIntensity,
    };
  });

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
                  {activeSensor === 'leaf_temp' || activeSensor === 'ambient_temp'
                    ? '°C'
                    : activeSensor === 'moisture' || activeSensor === 'humidity'
                    ? '%'
                    : ' lux'}
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
              Temporal Multi-Sensor Dynamics
            </h2>
            <span className="font-mono text-[10px] text-[#087E75] bg-[#D9F0EA] px-2 py-0.5 rounded font-semibold">
              {dateRange.toUpperCase()} Window
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Continuous calibrated time-series comparing physiological kinetics across species.
          </p>
        </div>

        <span className="text-xs font-mono text-[#78847C]">
          SAMPLE DATA FEED
        </span>
      </div>

      {/* Sensor Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveSensor('leaf_temp')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeSensor === 'leaf_temp'
              ? 'bg-[#123B36] text-white'
              : 'bg-[#F5FAF8] text-[#78847C] hover:text-[#26342D] border border-[#D4E7E1]'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5" />
          <span>Leaf Temp (°C) [MLX90614]</span>
        </button>

        <button
          onClick={() => setActiveSensor('moisture')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeSensor === 'moisture'
              ? 'bg-[#123B36] text-white'
              : 'bg-[#F5FAF8] text-[#78847C] hover:text-[#26342D] border border-[#D4E7E1]'
          }`}
        >
          <Droplet className="w-3.5 h-3.5" />
          <span>Soil Moisture (%) [Capacitive]</span>
        </button>

        <button
          onClick={() => setActiveSensor('ambient_temp')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeSensor === 'ambient_temp'
              ? 'bg-[#123B36] text-white'
              : 'bg-[#F5FAF8] text-[#78847C] hover:text-[#26342D] border border-[#D4E7E1]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Ambient Temp (°C) [AHT25]</span>
        </button>

        <button
          onClick={() => setActiveSensor('humidity')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeSensor === 'humidity'
              ? 'bg-[#123B36] text-white'
              : 'bg-[#F5FAF8] text-[#78847C] hover:text-[#26342D] border border-[#D4E7E1]'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>Relative Humidity (%) [AHT25]</span>
        </button>

        <button
          onClick={() => setActiveSensor('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeSensor === 'light'
              ? 'bg-[#123B36] text-white'
              : 'bg-[#F5FAF8] text-[#78847C] hover:text-[#26342D] border border-[#D4E7E1]'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light Intensity (lux) [BH1750]</span>
        </button>
      </div>

      {/* Chart Canvas */}
      {mergedSeries.length === 0 ? (
        <div className="h-72 w-full flex flex-col items-center justify-center rounded-lg bg-[#FAF9F3] border border-dashed border-[#D4E7E1] p-6 text-center">
          <Clock className="w-8 h-8 text-[#A8C3A0] mb-2" />
          <p className="text-xs font-semibold text-[#123B36]">No historical sensor data available yet.</p>
          <p className="text-[11px] text-[#78847C] mt-1 max-w-sm">
            Waiting for sensor data. Connect your ESP32 node to start logging high-resolution telemetry.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedSeries} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
                activeSensor === 'leaf_temp' || activeSensor === 'ambient_temp'
                  ? [19, 30]
                  : activeSensor === 'moisture'
                  ? [20, 80]
                  : activeSensor === 'humidity'
                  ? [45, 80]
                  : ['auto', 'auto']
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#78847C' }} />

            {/* Leaf Temp Lines */}
            {activeSensor === 'leaf_temp' && (
              <>
                {(plantFilter === 'all' || plantFilter === 'tulsi-01') && (
                  <Line
                    type="monotone"
                    dataKey="tulsiLeafTemp"
                    name="Tulsi Leaf Temp (°C)"
                    stroke="#C95D58"
                    strokeWidth={2.4}
                    dot={{ r: 3, fill: '#C95D58' }}
                  />
                )}
                {(plantFilter === 'all' || plantFilter === 'hibiscus-01') && (
                  <Line
                    type="monotone"
                    dataKey="hibiscusLeafTemp"
                    name="Hibiscus Leaf Temp (°C)"
                    stroke="#087E75"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#087E75' }}
                  />
                )}
                {(plantFilter === 'all' || plantFilter === 'moneyplant-01') && (
                  <Line
                    type="monotone"
                    dataKey="moneyPlantLeafTemp"
                    name="Money Plant Leaf Temp (°C)"
                    stroke="#55B6A3"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#55B6A3' }}
                  />
                )}
                <ReferenceLine
                  y={26.5}
                  stroke="#C95D58"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Thermal Threshold (26.5°C)',
                    fill: '#C95D58',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
              </>
            )}

            {/* Soil Moisture Lines */}
            {activeSensor === 'moisture' && (
              <>
                {(plantFilter === 'all' || plantFilter === 'tulsi-01') && (
                  <Line
                    type="monotone"
                    dataKey="tulsiMoisture"
                    name="Tulsi Moisture (%)"
                    stroke="#C58A35"
                    strokeWidth={2.4}
                    dot={{ r: 3 }}
                  />
                )}
                {(plantFilter === 'all' || plantFilter === 'hibiscus-01') && (
                  <Line
                    type="monotone"
                    dataKey="hibiscusMoisture"
                    name="Hibiscus Moisture (%)"
                    stroke="#087E75"
                    strokeWidth={2.2}
                    dot={{ r: 3 }}
                  />
                )}
                {(plantFilter === 'all' || plantFilter === 'moneyplant-01') && (
                  <Line
                    type="monotone"
                    dataKey="moneyPlantMoisture"
                    name="Money Plant Moisture (%)"
                    stroke="#123B36"
                    strokeWidth={2.2}
                    dot={{ r: 3 }}
                  />
                )}
                <ReferenceLine
                  y={30.0}
                  stroke="#C95D58"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Lower Moisture Limit (30%)',
                    fill: '#C95D58',
                    fontSize: 10,
                    position: 'insideBottomRight',
                  }}
                />
              </>
            )}

            {/* Ambient Temp */}
            {activeSensor === 'ambient_temp' && (
              <Line
                type="monotone"
                dataKey="ambientTemp"
                name="Chamber Ambient Temperature (°C)"
                stroke="#123B36"
                strokeWidth={2.4}
                dot={{ r: 3, fill: '#123B36' }}
              />
            )}

            {/* Humidity */}
            {activeSensor === 'humidity' && (
              <Line
                type="monotone"
                dataKey="relativeHumidity"
                name="Chamber Relative Humidity (%)"
                stroke="#78847C"
                strokeWidth={2.4}
                dot={{ r: 3, fill: '#78847C' }}
              />
            )}

            {/* Light */}
            {activeSensor === 'light' && (
              <>
                {(plantFilter === 'all' || plantFilter === 'tulsi-01') && (
                  <Line
                    type="monotone"
                    dataKey="tulsiLight"
                    name="Tulsi Canopy Light (lux)"
                    stroke="#C58A35"
                    strokeWidth={2.2}
                    dot={{ r: 3 }}
                  />
                )}
                {(plantFilter === 'all' || plantFilter === 'hibiscus-01') && (
                  <Line
                    type="monotone"
                    dataKey="hibiscusLight"
                    name="Hibiscus Canopy Light (lux)"
                    stroke="#087E75"
                    strokeWidth={2.2}
                    dot={{ r: 3 }}
                  />
                )}
                {(plantFilter === 'all' || plantFilter === 'moneyplant-01') && (
                  <Line
                    type="monotone"
                    dataKey="moneyPlantLight"
                    name="Money Plant Light (lux)"
                    stroke="#55B6A3"
                    strokeWidth={2.2}
                    dot={{ r: 3 }}
                  />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      )}

      <div className="pt-2 border-t border-[#D9F0EA] flex items-center justify-between text-[11px] text-[#78847C]">
        <span>Sampling interval: 15 minutes. High-precision continuous data logging.</span>
        <span className="font-mono text-[#087E75]">Real-Time Sensor Telemetry Records</span>
      </div>
    </div>
  );
};
