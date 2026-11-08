/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  // Derive outcome strictly from genuine live hardware telemetry
  const isDataInconclusive =
    !selectedPlant.hasReceivedData ||
    selectedPlant.leafTemperature === null ||
    selectedPlant.ambientTemperature === null ||
    selectedPlant.stressLevel === 'calibrating';

  const dataQualityState = !selectedPlant.hasReceivedData
    ? 'Awaiting Hardware'
    : selectedPlant.stressLevel === 'calibrating'
    ? 'Calibrating'
    : 'Valid';

  let effectiveOutcome: ScreeningOutcomeCategory;
  if (isDataInconclusive) {
    effectiveOutcome = 'INCONCLUSIVE';
  } else if (
    selectedPlant.stressLevel === 'high_stress' ||
    selectedPlant.stressLevel === 'mild_stress'
  ) {
    effectiveOutcome = 'POSSIBLE WATER STRESS';
  } else {
    effectiveOutcome = 'NORMAL';
  }

  const outcomeDef = OUTCOME_DEFINITIONS[effectiveOutcome];
  const OutcomeIcon = outcomeDef.icon;

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs space-y-4">
      {/* Plant Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#D9F0EA]">
        {/* Plant Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EDF7F4] rounded-lg border border-[#D4E7E1]">
          {plants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => onSelectPlant(plant.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedPlant.id === plant.id
                  ? 'bg-white text-[#123B36] shadow-xs'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              <span>{plant.commonName}</span>
              <span className="font-mono text-[10px] text-[#78847C]">[{plant.code}]</span>
            </button>
          ))}
        </div>

        {/* Live Hardware Telemetry Badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#78847C]">Hardware Channel:</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
              selectedPlant.hasReceivedData
                ? 'bg-[#EDF7F4] text-[#087E75] border-[#55B6A3]/40'
                : 'bg-[#FFF8EB] text-[#C58A35] border-[#C58A35]/40'
            }`}
          >
            {selectedPlant.hardwareStatus || 'WAITING FOR FIRST DATA'}
          </span>
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
            <h3 className="text-base font-bold text-[#123B36]">
              {isDataInconclusive
                ? 'INCONCLUSIVE — Insufficient valid sensor data'
                : outcomeDef.description}
            </h3>
            <p className="text-xs text-[#26342D] mt-0.5 max-w-2xl leading-relaxed">
              {isDataInconclusive
                ? 'Telemetry packets are missing, stale (>40m), or physical ESP32 node is disconnected. RootWhisper requires genuine sensor telemetry to perform biophysical screening.'
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
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
          <div className="flex items-center justify-between text-[#78847C] text-[11px] mb-1">
            <span className="font-medium">Expected Leaf Temp</span>
            <span className="font-mono text-[10px] text-[#087E75]">Model Output</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#123B36] tabular-nums">
              {isDataInconclusive ? '--' : selectedPlant.aiBaseline.expectedLeafTemp.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#78847C]">°C</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-1">
            Predicted from ambient temp, RH & light
          </p>
        </div>

        {/* 2. Observed Leaf Temperature */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
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
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
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
                  : 'text-[#087E75]'
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
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
          <div className="flex items-center justify-between text-[#78847C] text-[11px] mb-1">
            <span className="font-medium">Soil Moisture Evidence</span>
            <span className="font-mono text-[10px] text-[#123B36]">Separate Evidence</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#123B36] tabular-nums">
              {isDataInconclusive || selectedPlant.soilMoisture === null ? '--' : selectedPlant.soilMoisture.toFixed(1)}
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
