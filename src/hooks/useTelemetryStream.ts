/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { PlantTelemetry } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { antigravityApi } from '../services/antigravityApi';

export function useTelemetryStream(
  initialPlants: PlantTelemetry[],
  isStreaming: boolean
) {
  const [plants, setPlants] = useState<PlantTelemetry[]>(initialPlants);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Initial fetch on mount
    const pollBackend = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        const livePlants = await antigravityApi.fetchPlants();
        if (livePlants && livePlants.length > 0) {
          setPlants(livePlants);
        }
      } catch (err) {
        console.warn('[RootWhisper Stream] Polling failed:', err);
      } finally {
        isFetchingRef.current = false;
      }
    };

    pollBackend();

    if (!isStreaming) return;

    const interval = setInterval(pollBackend, APP_CONFIG.uiRefreshIntervalMs);
    return () => clearInterval(interval);
  }, [isStreaming]);

  return { plants, setPlants };
}
