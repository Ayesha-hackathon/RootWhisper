/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Cpu,
  Sprout,
  SunMedium,
  TrendingUp,
  Clock,
  Layers,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ModelArchitectureCard: React.FC = () => {
  const modelPillars = [
    {
      title: 'Random Forest Regression',
      icon: Cpu,
      description: 'Ensemble learning architecture predicting non-linear leaf surface energy balance across varying light and thermal gradients.',
    },
    {
      title: 'Individual-Plant Baseline Learning',
      icon: Sprout,
      description: 'Calibrates each plant’s unique transpiration baseline over 14–21 diurnal cycles under nominal hydration.',
    },
    {
      title: 'Environmental Compensation',
      icon: SunMedium,
      description: 'Dynamically accounts for ambient vapor pressure deficit (VPD), radiative PAR flux, and background temperature.',
    },
    {
      title: 'Adaptive Anomaly Thresholds',
      icon: TrendingUp,
      description: 'Replaces rigid static thresholds with confidence-bounded residual envelopes that adjust to photoperiod shifts.',
    },
    {
      title: 'Temporal Persistence',
      icon: Clock,
      description: 'Requires anomalous positive residuals to persist beyond 15 minutes, rejecting transient environmental flutter.',
    },
    {
      title: 'Multi-Sensor Evidence Fusion',
      icon: Layers,
      description: 'Corroborates foliar thermal restriction with rhizosphere capacitive moisture data to differentiate water stress from other stressors.',
    },
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EEF3ED]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#173F32] tracking-tight">
              Screening Model Architecture & Principles
            </h2>
            <span className="font-mono text-[10px] text-[#245640] bg-[#EEF3ED] px-2 py-0.5 rounded font-semibold">
              Biophysical Framework
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Core methodology governing adaptive physiological fingerprinting and responsible screening.
          </p>
        </div>

        <span className="text-xs font-mono text-[#78847C]">
          Antigravity Engine
        </span>
      </div>

      {/* 6 Core Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {modelPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-md bg-white border border-[#E5EBE3] flex items-center justify-center text-[#173F32]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-semibold text-[#173F32] leading-tight">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-[11px] text-[#78847C] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Scientific Rule Banner */}
      <div className="p-4 rounded-xl bg-[#FFF8EB] border border-[#C58A35]/30 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#C58A35]">
          <AlertOctagon className="w-4 h-4 text-[#C58A35] shrink-0" />
          <span>IMPORTANT SCIENTIFIC INTEGRITY RULE</span>
        </div>
        <p className="text-xs text-[#26342D] leading-relaxed">
          <strong>Decoupled Environmental Prediction:</strong> Expected leaf-temperature prediction strictly uses environmental features (ambient temperature, relative humidity, and light intensity) as inputs. Soil moisture is <em>never</em> fed into the temperature prediction model; rather, substrate moisture serves as <strong>separate corroborating evidence</strong> during the final evidence fusion stage.
        </p>
        <p className="text-[11px] text-[#78847C] pt-1 border-t border-[#C58A35]/20">
          <strong>Screening vs. Clinical Diagnosis:</strong> RootWhisper provides early physiological risk screening to alert growers hours before visible wilting. It is not a definitive pathological plant diagnosis, and model outputs are presented with transparent physical residuals rather than fabricated confidence percentages.
        </p>
      </div>
    </div>
  );
};
