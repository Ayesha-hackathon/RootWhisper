/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldCheck, AlertTriangle, Cpu, Compass } from 'lucide-react';
import { PlantTelemetry } from '../../types';

interface AiScreeningSummaryProps {
  plants: PlantTelemetry[];
  onSelectPlant: (plant: PlantTelemetry) => void;
}

export const AiScreeningSummary: React.FC<AiScreeningSummaryProps> = ({
  plants,
  onSelectPlant,
}) => {
  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-[#D9F0EA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
              AI Water-Stress Screening Engine
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#D9F0EA] text-[#123B36]">
              Adaptive Fingerprints
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Species-calibrated Crop Water Stress Index (CWSI) derived from real-time radiometric leaf thermometry.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F5FAF8] border border-[#D4E7E1] text-xs font-mono text-[#087E75]">
          <Cpu className="w-3.5 h-3.5" />
          <span>Antigravity AI Core</span>
        </div>
      </div>

      {/* Comparative CWSI Stress Scale */}
      <div className="space-y-4">
        {plants.map((plant) => {
          const isStress = plant.stressLevel === 'mild_stress' || plant.stressLevel === 'high_stress';
          const hasData = plant.hasReceivedData !== false && plant.leafTemperature !== null;

          return (
            <div
              key={plant.id}
              onClick={() => onSelectPlant(plant)}
              className="p-3.5 rounded-lg border border-[#D9F0EA] hover:border-[#55B6A3] bg-[#EEF7F4] hover:bg-[#F5FAF8] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#123B36]">
                    {plant.commonName}
                  </span>
                  <span className="text-[10px] font-mono text-[#78847C]">
                    [{plant.code}]
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#78847C]">
                    CWSI Index:
                  </span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      !hasData
                        ? 'text-[#78847C]'
                        : isStress
                        ? 'text-[#C95D58]'
                        : 'text-[#087E75]'
                    }`}
                  >
                    {hasData ? plant.stressIndex.toFixed(2) : '--'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium ${
                      !hasData
                        ? 'bg-[#FAF9F3] text-[#78847C] border border-[#D4E7E1]'
                        : isStress
                        ? 'bg-[#FFF2F0] text-[#C95D58]'
                        : 'bg-[#D9F0EA] text-[#087E75]'
                    }`}
                  >
                    {!hasData
                      ? 'Awaiting Telemetry'
                      : isStress
                      ? 'Water Stress Alert'
                      : 'Hydration Optimal'}
                  </span>
                </div>
              </div>

              {/* CWSI Visual Progress Track */}
              <div className="w-full bg-[#D9F0EA] h-2 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    !hasData
                      ? 'bg-[#A8C3A0]/30'
                      : isStress
                      ? 'bg-[#C95D58]'
                      : 'bg-[#087E75]'
                  }`}
                  style={{ width: `${hasData ? Math.min(100, plant.stressIndex * 100) : 0}%` }}
                />
              </div>

              {/* Diagnosis & Stomatal Conductance row */}
              <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#78847C] pt-2 border-t border-[#D9F0EA]/70">
                <p className="line-clamp-1 italic">
                  &ldquo;
                  {hasData
                    ? plant.physiologicalFingerprint.diagnosis
                    : 'Awaiting hardware telemetry stream to initialize screening pipeline.'}
                  &rdquo;
                </p>
                <div className="flex items-center gap-3 shrink-0 font-mono text-[10px]">
                  <span>
                    Stomatal Proxy: {hasData ? `${plant.stomatalConductanceProxy} mmol` : 'N/A'}
                  </span>
                  <span className="text-[#55B6A3]">·</span>
                  <span className="text-[#123B36] font-semibold">
                    {hasData
                      ? `Early lead: +${plant.physiologicalFingerprint.hoursBeforeVisualWilting}h`
                      : 'Node offline'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Callout on Adaptive Fingerprinting */}
      <div className="mt-4 p-3 bg-[#D9F0EA]/70 rounded-lg border border-[#55B6A3]/30 flex items-start gap-2.5 text-xs text-[#26342D]">
        <Compass className="w-4 h-4 text-[#123B36] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-[#123B36]">
            Why Thermal Fingerprinting Beats Simple Soil Probes
          </p>
          <p className="text-[#78847C] leading-relaxed text-[11px]">
            Soil probes only measure moisture in the substrate around the sensor; RootWhisper evaluates how much water the plant actually draws and transpires. When stomata constrict under root tension, evaporative cooling ceases and leaf temperature climbs +1.5°C to +3.0°C above ambient air up to 4+ hours before visible wilting.
          </p>
        </div>
      </div>
    </div>
  );
};
