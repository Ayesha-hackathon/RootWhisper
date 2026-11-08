/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlantTelemetry } from '../../types';
import {
  Activity,
  Thermometer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface AiBaselinePanelProps {
  plant: PlantTelemetry;
}

export const AiBaselinePanel: React.FC<AiBaselinePanelProps> = ({ plant }) => {
  const { aiBaseline, hasReceivedData } = plant;
  const isStressResidual = hasReceivedData && aiBaseline.temperatureResidual > aiBaseline.adaptiveThreshold;

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D9F0EA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
              AI Baseline & Physiological Residual Engine
            </h2>
            <span className="font-mono text-[10px] font-semibold text-[#087E75] bg-[#D9F0EA] px-2 py-0.5 rounded">
              Species-Aware Model
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Continuously compares radiometric MLX90614 leaf temperature with species-specific energy balance expectations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#78847C]">
          <span>Model: PhysioFingerprint-v2.4</span>
        </div>
      </div>

      {/* 4 Core AI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* 1. Expected Leaf Temperature */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
          <span className="text-[11px] text-[#78847C] block font-medium">
            Expected Leaf Temp
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-[#123B36] tabular-nums">
              {hasReceivedData ? `${aiBaseline.expectedLeafTemp.toFixed(1)}` : 'N/A'}
            </span>
            {hasReceivedData && <span className="text-xs font-mono text-[#78847C]">°C</span>}
          </div>
          <p className="text-[10px] text-[#78847C] mt-1">
            Simulated under full hydration
          </p>
        </div>

        {/* 2. Observed Leaf Temperature */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
          <span className="text-[11px] text-[#78847C] block font-medium">
            Observed Leaf Temp
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-[#26342D] tabular-nums">
              {hasReceivedData ? `${aiBaseline.observedLeafTemp.toFixed(1)}` : 'N/A'}
            </span>
            {hasReceivedData && <span className="text-xs font-mono text-[#78847C]">°C</span>}
          </div>
          <p className="text-[10px] text-[#78847C] mt-1 font-mono">
            MLX90614 Contactless IR
          </p>
        </div>

        {/* 3. Temperature Residual (T_observed - T_expected) */}
        <div
          className={`p-3.5 rounded-lg border ${isStressResidual
              ? 'bg-[#FFF8F7] border-[#C95D58]/40'
              : 'bg-[#EDF7F4] border-[#55B6A3]/50'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#78847C] font-medium">
              Temperature Residual (ΔT)
            </span>
            {isStressResidual ? (
              <AlertCircle className="w-3.5 h-3.5 text-[#C95D58]" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#087E75]" />
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${isStressResidual ? 'text-[#C95D58]' : 'text-[#087E75]'
                }`}
            >
              {hasReceivedData
                ? (aiBaseline.temperatureResidual > 0 ? `+${aiBaseline.temperatureResidual.toFixed(1)}` : aiBaseline.temperatureResidual.toFixed(1))
                : 'N/A'}
            </span>
            {hasReceivedData && <span className="text-xs font-mono text-[#78847C]">°C</span>}
          </div>
          <p className="text-[10px] text-[#78847C] mt-1">
            T_observed − T_expected
          </p>
        </div>

        {/* 4. Adaptive Threshold */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
          <span className="text-[11px] text-[#78847C] block font-medium">
            Adaptive Trigger Threshold
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-[#123B36] tabular-nums">
              +{aiBaseline.adaptiveThreshold.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#78847C]">°C</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-1">
            Species-calibrated limit ({aiBaseline.confidenceInterval})
          </p>
        </div>
      </div>

      {/* Residual Visual Scale Bar */}
      <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D9F0EA] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#26342D]">
            Residual vs Stress Threshold Scale
          </span>
          <span
            className={`font-mono text-[11px] font-semibold ${isStressResidual ? 'text-[#C95D58]' : 'text-[#087E75]'
              }`}
          >
            {isStressResidual
              ? `Stress Detected (+${(aiBaseline.temperatureResidual - aiBaseline.adaptiveThreshold).toFixed(1)}°C over threshold)`
              : `Safe (Within ±${aiBaseline.adaptiveThreshold}°C nominal envelope)`}
          </span>
        </div>

        {/* Track Bar */}
        <div className="w-full bg-[#D4E7E1] h-2.5 rounded-full relative overflow-hidden flex">
          {/* Safe zone */}
          <div className="w-1/2 bg-[#087E75]/30 h-full border-r border-[#123B36]/20" />
          {/* Alert zone */}
          <div className="w-1/2 bg-[#C95D58]/30 h-full" />

          {/* Current Needle Position */}
          <div
            className={`absolute top-0 bottom-0 w-2.5 rounded-full shadow-sm transition-all duration-500 ${isStressResidual ? 'bg-[#C95D58]' : 'bg-[#087E75]'
              }`}
            style={{
              left: `${Math.min(
                95,
                Math.max(
                  5,
                  ((aiBaseline.temperatureResidual + 1.0) / (aiBaseline.adaptiveThreshold * 2.5)) * 100
                )
              )}%`,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#78847C]">
          <span>-1.0°C (Hyper-cooling)</span>
          <span>0.0°C (Model Expectation)</span>
          <span className="text-[#C95D58]">+{aiBaseline.adaptiveThreshold}°C (Threshold)</span>
          <span>+4.0°C (Severe Stress)</span>
        </div>
      </div>

      {/* AI Synthesis Statement */}
      <div className="mt-3.5 p-3 rounded-lg bg-[#D9F0EA]/70 border border-[#55B6A3]/30 text-xs text-[#26342D] leading-relaxed flex items-start gap-2.5">
        <Activity className="w-4 h-4 text-[#123B36] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#123B36]">
            AI Physiological Fingerprint Assessment:
          </span>{' '}
          <span className="text-[#26342D]">{aiBaseline.summaryInsight}</span>
        </div>
      </div>
    </div>
  );
};
