/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Radio,
  CheckCircle,
  SunMedium,
  Sprout,
  Cpu,
  TrendingUp,
  Clock,
  Layers,
  Activity,
  ArrowRight,
  Info,
} from 'lucide-react';

export interface PipelineStage {
  step: number;
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  scientificDetail: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: 1,
    id: 'collection',
    title: 'Sensor Data Collection',
    subtitle: 'Edge Telemetry Ingestion',
    icon: Radio,
    description: 'Raw readings polled every 10 seconds from ESP32 edge node via contactless MLX90614 IR, AHT25, and BH1750.',
    scientificDetail: 'Acquires raw radiometric leaf brightness temperature, ambient air temperature, relative humidity, and photoperiod lux.',
  },
  {
    step: 2,
    id: 'validation',
    title: 'Data Quality Validation',
    subtitle: 'Sanity & Staleness Filter',
    icon: CheckCircle,
    description: 'Validates packet integrity, checks timestamp freshness, and filters out physical optical occlusions or out-of-range ADC noise.',
    scientificDetail: 'If data is stale (>40m), missing, or out of bounds, the pipeline terminates immediately with an INCONCLUSIVE outcome.',
  },
  {
    step: 3,
    id: 'environmental',
    title: 'Environmental Feature Extraction',
    subtitle: 'VPD & Solar Irradiance',
    icon: SunMedium,
    description: 'Computes Vapor Pressure Deficit (VPD) and radiant thermal load from ambient temperature, relative humidity, and light intensity.',
    scientificDetail: 'These environmental variables form the exclusive input vector for the thermodynamic leaf temperature prediction.',
  },
  {
    step: 4,
    id: 'baseline',
    title: 'Individual Plant Baseline',
    subtitle: 'Species Adaptation',
    icon: Sprout,
    description: 'Retrieves the calibrated physiological profile learned specifically for this plant under nominal hydration.',
    scientificDetail: 'Accounts for canopy geometry, leaf thickness, and diurnal circadian stomatal opening rhythms unique to this specimen.',
  },
  {
    step: 5,
    id: 'prediction',
    title: 'Expected Leaf Temp Prediction',
    subtitle: 'Random Forest Regression',
    icon: Cpu,
    description: 'Predicts the leaf temperature expected if the plant is transpiring normally under current ambient conditions.',
    scientificDetail: 'Strictly driven by environmental microclimate features. Soil moisture is intentionally excluded from this model.',
  },
  {
    step: 6,
    id: 'residual',
    title: 'Residual Analysis',
    subtitle: 'ΔT = T_observed − T_expected',
    icon: TrendingUp,
    description: 'Calculates the difference between observed radiometric leaf temperature and model expectation.',
    scientificDetail: 'A positive residual indicates impaired evaporative cooling, suggesting stomata are constricting to prevent dehydration.',
  },
  {
    step: 7,
    id: 'persistence',
    title: 'Temporal Persistence Assessment',
    subtitle: 'Transient vs Sustained',
    icon: Clock,
    description: 'Filters out transient thermal noise (such as brief lighting shifts or airflow gusts) by requiring sustained elevation.',
    scientificDetail: 'Anomalies must persist for at least 15 consecutive minutes to progress beyond the WATCH category.',
  },
  {
    step: 8,
    id: 'fusion',
    title: 'Evidence Fusion',
    subtitle: 'Corroborating Soil Moisture',
    icon: Layers,
    description: 'Fuses thermal residual persistence with separate capacitive soil moisture measurements.',
    scientificDetail: 'Declining substrate moisture corroborates that foliar stomatal constriction is caused by root-zone water tension.',
  },
  {
    step: 9,
    id: 'outcome',
    title: 'Screening Outcome',
    subtitle: 'Actionable Screening State',
    icon: Activity,
    description: 'Categorizes current state into NORMAL, WATCH, POSSIBLE WATER STRESS, or INCONCLUSIVE.',
    scientificDetail: 'Communicates physiological status responsibly as an early screening alert rather than a clinical plant diagnosis.',
  },
];

export const ProcessingPipeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(PIPELINE_STAGES[4]); // default to Expected Leaf Temp Prediction

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EEF3ED]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#173F32] tracking-tight">
              Biophysical Processing Pipeline
            </h2>
            <span className="font-mono text-[10px] text-[#245640] bg-[#EEF3ED] px-2 py-0.5 rounded font-semibold">
              9-Stage Screening Architecture
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Step-by-step transformation from edge telemetry to responsible screening outcomes. Click any stage to inspect.
          </p>
        </div>

        <span className="text-xs font-mono text-[#78847C]">
          MODEL: RANDOM FOREST REGRESSION
        </span>
      </div>

      {/* 9-Step Horizontal Pipeline Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        {PIPELINE_STAGES.map((stage) => {
          const Icon = stage.icon;
          const isSelected = selectedStage.id === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage)}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between h-full min-h-[96px] sm:min-h-[105px] cursor-pointer ${
                isSelected
                  ? 'bg-[#173F32] text-white border-[#173F32] shadow-sm'
                  : 'bg-[#F8F8F4] border-[#E5EBE3] hover:border-[#A8BDA8] text-[#26342D]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#78847C] border border-[#E5EBE3]'
                    }`}
                  >
                    0{stage.step}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#A8BDA8]' : 'text-[#173F32]'}`} />
                </div>
                <p className={`text-[11px] font-semibold line-clamp-2 leading-tight ${isSelected ? 'text-white' : 'text-[#173F32]'}`}>
                  {stage.title}
                </p>
              </div>
              <p className={`text-[9px] mt-2 line-clamp-1 font-mono ${isSelected ? 'text-white/70' : 'text-[#78847C]'}`}>
                {stage.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Drawer / Callout */}
      <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#173F32] bg-[#EEF3ED] px-2 py-0.5 rounded">
              Stage 0{selectedStage.step}: {selectedStage.title}
            </span>
            <span className="text-xs text-[#78847C]">·</span>
            <span className="text-xs font-semibold text-[#245640]">{selectedStage.subtitle}</span>
          </div>
          <p className="text-xs text-[#26342D] leading-relaxed">
            {selectedStage.description}
          </p>
          <p className="text-[11px] text-[#78847C] pt-1">
            <strong className="text-[#173F32]">Biophysical Protocol:</strong> {selectedStage.scientificDetail}
          </p>
        </div>
      </div>
    </div>
  );
};
