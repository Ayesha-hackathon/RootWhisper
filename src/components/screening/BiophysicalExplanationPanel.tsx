/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  Thermometer,
  Droplets,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const BiophysicalExplanationPanel: React.FC = () => {
  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D9F0EA]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#123B36]" />
          <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
            Scientific Rationale: Understanding Adaptive Physiological Fingerprinting
          </h2>
        </div>
        <span className="font-mono text-xs text-[#087E75] bg-[#D9F0EA] px-2.5 py-0.5 rounded-md">
          Scientific Transparency
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#26342D] leading-relaxed">
        {/* Pillar 1: Why Leaf Temperature Whispers */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#123B36]">
            <Thermometer className="w-3.5 h-3.5 text-[#123B36]" />
            <span>Evaporative Cooling Physics</span>
          </div>
          <p className="text-[#78847C] text-[11px]">
            Plants cool themselves through transpirational water loss via microscopic foliar pores (stomata). When ample water is available, latent heat dissipation keeps healthy leaves 0.5°C to 1.5°C cooler than the surrounding ambient air.
          </p>
          <p className="text-[#78847C] text-[11px] pt-1 border-t border-[#D9F0EA]">
            When soil moisture declines or roots experience water tension, stomata constrict to prevent desiccation. Evaporative cooling drops immediately, and leaf temperature rises +1.5°C to +3.5°C above ambient air up to 4+ hours before physical leaf wilting becomes visible to the human eye.
          </p>
        </div>

        {/* Pillar 2: Why Soil Moisture is Decoupled from Prediction */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#123B36]">
            <Droplets className="w-3.5 h-3.5 text-[#087E75]" />
            <span>Separation of Model Inputs & Evidence</span>
          </div>
          <p className="text-[#78847C] text-[11px]">
            The Random Forest model predicts expected leaf temperature purely from ambient temperature, relative humidity, and light intensity. Soil moisture is intentionally excluded from the input vector to avoid circular reasoning.
          </p>
          <p className="text-[#78847C] text-[11px] pt-1 border-t border-[#D9F0EA]">
            Instead, substrate capacitive moisture is treated as independent supporting evidence during the Evidence Fusion stage: a thermal anomaly accompanied by dry soil confirms water stress, whereas a thermal anomaly in moist soil signals root rot, disease, or sensor occlusion.
          </p>
        </div>

        {/* Pillar 3: Responsible Screening Boundaries */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#123B36]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#123B36]" />
            <span>Screening vs. Clinical Diagnosis</span>
          </div>
          <p className="text-[#78847C] text-[11px]">
            RootWhisper is an early physiological screening framework, not a definitive plant diagnosis. Its purpose is to provide preemptive awareness to growers and automated irrigation systems before irreversible cavitation occurs.
          </p>
          <p className="text-[#78847C] text-[11px] pt-1 border-t border-[#D9F0EA]">
            RootWhisper rejects fabricated confidence scores (e.g. &ldquo;98% AI Certainty&rdquo;) in favor of transparent physical units: observed leaf temperature, model-predicted baseline, and temperature residual in degrees Celsius.
          </p>
        </div>
      </div>
    </div>
  );
};
