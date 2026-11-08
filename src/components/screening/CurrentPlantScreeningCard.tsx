/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlantTelemetry } from '../../types';
import { ScreeningOutcomeCategory } from '../../data/sampleData';
import { OUTCOME_DEFINITIONS } from './OutcomeCategoryBadges';
import {
  Thermometer,
  Droplet,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface CurrentPlantScreeningCardProps {
  plants: PlantTelemetry[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
}

export const CurrentPlantScreeningCard: React.FC<CurrentPlantScreeningCardProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
}) => {
  const [simulatedOutcome, setSimulatedOutcome] = useState<ScreeningOutcomeCategory | 'auto'>('auto');
  const [dataQualityState, setDataQualityState] = useState<'Valid' | 'Stale' | 'Unreliable' | 'Missing'>('Valid');

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  // Derive outcome: If simulatedOutcome is auto, use real plant state; if dataQuality is missing or unreliable, force INCONCLUSIVE
  let effectiveOutcome: ScreeningOutcomeCategory;
  if (dataQualityState === 'Missing' || dataQualityState === 'Unreliable' || dataQualityState === 'Stale') {
    effectiveOutcome = 'INCONCLUSIVE';
  } else if (simulatedOutcome !== 'auto') {
    effectiveOutcome = simulatedOutcome;
  } else {
    effectiveOutcome =
      selectedPlant.id === 'tulsi-01'
        ? 'POSSIBLE WATER STRESS'
        : selectedPlant.stressLevel === 'mild_stress'
        ? 'WATCH'
        : 'NORMAL';
  }

  const outcomeDef = OUTCOME_DEFINITIONS[effectiveOutcome];
  const OutcomeIcon = outcomeDef.icon;

  const isDataInconclusive = effectiveOutcome === 'INCONCLUSIVE';

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-5 shadow-xs space-y-4">
      {/* Plant Selector Bar & Diagnostic Simulation Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EEF3ED]">
        {/* Plant Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F7F3] rounded-lg border border-[#E5EBE3]">
          {plants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => onSelectPlant(plant.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedPlant.id === plant.id
                  ? 'bg-white text-[#173F32] shadow-xs'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              <span>{plant.commonName}</span>
              <span className="font-mono text-[10px] text-[#78847C]">[{plant.code}]</span>
            </button>
          ))}
        </div>

        {/* Diagnostic Simulator for testing all 4 categories */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-[#78847C] font-mono">Test Outcome:</span>
          <div className="flex items-center gap-1 p-0.5 bg-[#F4F7F3] rounded border border-[#E5EBE3]">
            <button
              onClick={() => {
                setSimulatedOutcome('auto');
                setDataQualityState('Valid');
              }}
              className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
                simulatedOutcome === 'auto' && dataQualityState === 'Valid'
                  ? 'bg-[#173F32] text-white font-semibold'
                  : 'text-[#78847C]'
              }`}
            >
              Live State
            </button>
            <button
              onClick={() => {
                setSimulatedOutcome('NORMAL');
                setDataQualityState('Valid');
              }}
              className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
                effectiveOutcome === 'NORMAL' && dataQualityState === 'Valid'
                  ? 'bg-[#245640] text-white font-semibold'
                  : 'text-[#78847C]'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => {
                setSimulatedOutcome('WATCH');
                setDataQualityState('Valid');
              }}
              className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
                effectiveOutcome === 'WATCH' && dataQualityState === 'Valid'
                  ? 'bg-[#C58A35] text-white font-semibold'
                  : 'text-[#78847C]'
              }`}
            >
              Watch
            </button>
            <button
              onClick={() => {
                setSimulatedOutcome('POSSIBLE WATER STRESS');
                setDataQualityState('Valid');
              }}
              className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
                effectiveOutcome === 'POSSIBLE WATER STRESS' && dataQualityState === 'Valid'
                  ? 'bg-[#C95D58] text-white font-semibold'
                  : 'text-[#78847C]'
              }`}
            >
              Stress
            </button>
            <button
              onClick={() => {
                setDataQualityState('Missing');
              }}
              className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
                effectiveOutcome === 'INCONCLUSIVE'
                  ? 'bg-[#78847C] text-white font-semibold'
                  : 'text-[#78847C]'
              }`}
            >
              Inconclusive
            </button>
          </div>
        </div>
      </div>

      {/* Main Screening Banner for Active Plant */}
      <div className={`p-4 rounded-xl border ${outcomeDef.badgeStyle} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 w-10 h-10 rounded-xl bg-white/90 border border-current/20 flex items-center justify-center shrink-0">
            <OutcomeIcon className="w-5 h-5 text-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/80 border border-current/30 text-current">
                {outcomeDef.label}
              </span>
              <span className="text-xs text-[#78847C]">·</span>
              <span className="text-xs font-mono font-medium text-[#26342D]">
                Node {selectedPlant.nodeId}
              </span>
              <span className="text-xs text-[#78847C]">·</span>
              <span className="text-xs font-mono text-[#78847C]">
                Data Quality: {dataQualityState}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#173F32]">
              {outcomeDef.description}
            </h3>
            <p className="text-xs text-[#26342D] mt-0.5 max-w-2xl leading-relaxed">
              {isDataInconclusive
                ? 'Telemetry packets are missing, stale (>40m), or sensor ADC values are out of physical bounds. Screening pipeline suspended.'
                : outcomeDef.criteria}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right font-mono text-xs text-[#78847C]">
          <span>Screened: {selectedPlant.lastUpdated}</span>
        </div>
      </div>

      {/* 4 Crucial Display Metrics Required by User */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Expected Leaf Temperature */}
        <div className="p-3.5 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3]">
          <div className="flex items-center justify-between text-[#78847C] text-[11px] mb-1">
            <span className="font-medium">Expected Leaf Temp</span>
            <span className="font-mono text-[10px] text-[#245640]">Model Output</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#173F32] tabular-nums">
              {isDataInconclusive ? '--' : selectedPlant.aiBaseline.expectedLeafTemp.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#78847C]">°C</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-1">
            Predicted from ambient temp, RH & light
          </p>
        </div>

        {/* 2. Observed Leaf Temperature */}
        <div className="p-3.5 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3]">
          <div className="flex items-center justify-between text-[#78847C] text-[11px] mb-1">
            <span className="font-medium">Observed Leaf Temp</span>
            <span className="font-mono text-[10px] text-[#78847C]">MLX90614</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#26342D] tabular-nums">
              {isDataInconclusive ? '--' : selectedPlant.aiBaseline.observedLeafTemp.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#78847C]">°C</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-1">
            Contactless radiometric IR sensor
          </p>
        </div>

        {/* 3. Temperature Residual */}
        <div className="p-3.5 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3]">
          <div className="flex items-center justify-between text-[#78847C] text-[11px] mb-1">
            <span className="font-medium">Temperature Residual</span>
            <span className="font-mono text-[10px] text-[#C95D58]">T_obs − T_exp</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                isDataInconclusive
                  ? 'text-[#78847C]'
                  : selectedPlant.aiBaseline.temperatureResidual > 1.8
                  ? 'text-[#C95D58]'
                  : 'text-[#245640]'
              }`}
            >
              {isDataInconclusive
                ? '--'
                : selectedPlant.aiBaseline.temperatureResidual > 0
                ? `+${selectedPlant.aiBaseline.temperatureResidual.toFixed(1)}`
                : selectedPlant.aiBaseline.temperatureResidual.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#78847C]">°C</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-1">
            Adaptive limit: +{selectedPlant.aiBaseline.adaptiveThreshold.toFixed(1)}°C
          </p>
        </div>

        {/* 4. Supporting Soil-Moisture Evidence */}
        <div className="p-3.5 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3]">
          <div className="flex items-center justify-between text-[#78847C] text-[11px] mb-1">
            <span className="font-medium">Soil Moisture Evidence</span>
            <span className="font-mono text-[10px] text-[#173F32]">Separate Evidence</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#173F32] tabular-nums">
              {isDataInconclusive ? '--' : selectedPlant.soilMoisture.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#78847C]">%</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-1">
            Corroborates root-zone water availability
          </p>
        </div>
      </div>
    </div>
  );
};
