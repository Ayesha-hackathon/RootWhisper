/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PlantTelemetry } from '../types';
import { APP_CONFIG } from '../config/appConfig';

export function useTelemetryStream(
  initialPlants: PlantTelemetry[],
  isStreaming: boolean
) {
  const [plants, setPlants] = useState<PlantTelemetry[]>(initialPlants);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setPlants((prev) =>
        prev.map((plant) => {
          // Living plant micro-variations
          const jitterTemp = (Math.random() - 0.5) * 0.15;
          const jitterMoist = (Math.random() - 0.5) * 0.1;
          const newLeafTemp = Number((plant.leafTemperature + jitterTemp).toFixed(1));
          const newMoisture = Math.max(10, Number((plant.soilMoisture + jitterMoist).toFixed(1)));
          const newDelta = Number((newLeafTemp - plant.ambientTemperature).toFixed(1));

          return {
            ...plant,
            leafTemperature: newLeafTemp,
            soilMoisture: newMoisture,
            temperatureDelta: newDelta,
            lastUpdated: 'A few seconds ago',
            lastUpdatedSecondsAgo: Math.floor(Math.random() * 5 + 1),
          };
        })
      );
    }, APP_CONFIG.uiRefreshIntervalMs);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return { plants, setPlants };
}
