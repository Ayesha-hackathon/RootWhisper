/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlantTelemetry } from '../../types';
import { SensorCard } from './SensorCard';
import { Droplet, Thermometer, Flame, CloudRain, Sun } from 'lucide-react';

interface SensorCardsGridProps {
  plant: PlantTelemetry;
  dataState: 'normal' | 'stale' | 'invalid' | 'offline';
}

export const SensorCardsGrid: React.FC<SensorCardsGridProps> = ({
  plant,
  dataState,
}) => {
  const { sensors } = plant;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#173F32] tracking-tight">
            Live Edge Sensor Telemetry
          </h2>
          <p className="text-xs text-[#78847C]">
            Direct telemetry streams from node {plant.nodeId} via I2C & contactless MLX90614
          </p>
        </div>
        <span className="font-mono text-xs text-[#245640] bg-[#EEF3ED] px-2.5 py-0.5 rounded-md">
          5 Sensors Polling @ 10s
        </span>
      </div>

      {/* 5 Compact Equal Sized Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Soil Moisture */}
        <SensorCard
          sensor={sensors.soilMoisture}
          icon={Droplet}
          simulatedState={dataState}
        />

        {/* 2. Leaf Temperature */}
        <SensorCard
          sensor={sensors.leafTemperature}
          icon={Thermometer}
          simulatedState={dataState}
        />

        {/* 3. Ambient Temperature */}
        <SensorCard
          sensor={sensors.ambientTemperature}
          icon={Flame}
          simulatedState={dataState}
        />

        {/* 4. Relative Humidity */}
        <SensorCard
          sensor={sensors.relativeHumidity}
          icon={CloudRain}
          simulatedState={dataState}
        />

        {/* 5. Light Intensity */}
        <SensorCard
          sensor={sensors.lightIntensity}
          icon={Sun}
          simulatedState={dataState}
        />
      </div>
    </div>
  );
};
