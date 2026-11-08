/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlantTelemetry } from '../../types';
import { Wifi, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PlantSelectorProps {
  plants: PlantTelemetry[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
}

export const PlantSelector: React.FC<PlantSelectorProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
}) => {
  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-2 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {plants.map((plant) => {
          const isSelected = plant.id === selectedPlantId;
          const isStress = plant.stressLevel === 'mild_stress' || plant.stressLevel === 'high_stress';

          return (
            <button
              key={plant.id}
              onClick={() => onSelectPlant(plant.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#D9F0EA] border-[#123B36] shadow-xs'
                  : 'bg-[#F5FAF8] border-[#D4E7E1] hover:border-[#55B6A3] hover:bg-white'
              }`}
            >
              {/* Botanical Thumbnail */}
              <div className="w-12 h-12 rounded-md bg-white border border-[#D4E7E1] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={plant.illustrationUrl}
                  alt={plant.commonName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Plant Meta */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span
                    className={`text-xs font-semibold truncate ${
                      isSelected ? 'text-[#123B36]' : 'text-[#26342D]'
                    }`}
                  >
                    {plant.commonName}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white border border-[#D4E7E1] text-[#78847C] shrink-0 font-medium">
                    {plant.code}
                  </span>
                </div>

                <p className="text-[11px] text-[#78847C] italic truncate">
                  {plant.scientificName}
                </p>

                <div className="mt-1 flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 font-mono text-[#78847C]">
                    <Wifi className="w-2.5 h-2.5 text-[#087E75]" />
                    {plant.nodeId}
                  </span>
                  <span className="text-[#55B6A3]">·</span>
                  <span
                    className={`font-semibold ${
                      isStress ? 'text-[#C95D58]' : 'text-[#087E75]'
                    }`}
                  >
                    {isStress ? 'Stress Alert' : 'Nominal'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
