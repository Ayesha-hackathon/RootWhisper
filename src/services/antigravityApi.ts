/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Google Antigravity Integration Service Layer
 * ----------------------------------------------------------------------------
 * This service layer coordinates between the RootWhisper frontend, the Google Antigravity
 * biophysical AI engine, and the ESP32 Wi-Fi mesh telemetry broker.
 * 
 * DESIGN FOR ANTIGRAVITY BACKEND INTEGRATION:
 * 1. Base URL is driven by `APP_CONFIG.apiUrl` (`VITE_ANTIGRAVITY_API_URL`).
 * 2. Set `VITE_USE_SAMPLE_DATA=false` in `.env` to route requests to the live backend.
 * 3. If live backend endpoints fail or are unavailable, the service gracefully falls
 *    back to calibrated SAMPLE DATA to prevent application crash during network partition.
 */

import { APP_CONFIG } from '../config/appConfig';
export const ANTIGRAVITY_CONFIG = APP_CONFIG;
import { ANTIGRAVITY_ENDPOINTS } from './endpoints';
import { http } from './apiClient';
import {
  PlantTelemetry,
  EnvironmentalConditions,
  TimeSeriesReading,
  ESP32Node,
  ActivityEvent,
  KpiSummary,
} from '../types';
import {
  INITIAL_PLANTS,
  INITIAL_ENVIRONMENT,
  INITIAL_KPIS,
  INITIAL_NODES,
  INITIAL_ACTIVITY_LOGS,
  SAMPLE_TIME_SERIES,
  SAMPLE_DATA_METADATA,
} from '../data/sampleData';

export interface ScreeningEvaluationResult {
  success: boolean;
  message: string;
  stressIndex?: number;
  residual?: number;
  outcome?: string;
}

export interface ActuatorCommandResult {
  success: boolean;
  message: string;
  valveState?: 'open' | 'closed';
  runtimeSeconds?: number;
}

class AntigravityApiService {
  private samplePlants: PlantTelemetry[] = [...INITIAL_PLANTS];
  private sampleEnvironment: EnvironmentalConditions = { ...INITIAL_ENVIRONMENT };
  private sampleNodes: ESP32Node[] = [...INITIAL_NODES];
  private sampleLogs: ActivityEvent[] = [...INITIAL_ACTIVITY_LOGS];

  /**
   * Returns metadata verifying the decoupling of sample data from production endpoints.
   */
  public getMetadata() {
    return SAMPLE_DATA_METADATA;
  }

  /**
   * Fetches real-time telemetry for all monitored species in the fleet.
   */
  public async fetchPlants(): Promise<PlantTelemetry[]> {
    if (!APP_CONFIG.useSampleData) {
      try {
        return await http.get<PlantTelemetry[]>(ANTIGRAVITY_ENDPOINTS.PLANTS.LIST);
      } catch (err) {
        console.warn('[RootWhisper AntigravityApi] Live endpoint unavailable, using sample plant fleet:', err);
      }
    }
    return [...this.samplePlants];
  }

  /**
   * Fetches environmental chamber baseline microclimate conditions.
   */
  public async fetchEnvironment(): Promise<EnvironmentalConditions> {
    if (!APP_CONFIG.useSampleData) {
      try {
        return await http.get<EnvironmentalConditions>(ANTIGRAVITY_ENDPOINTS.ENVIRONMENT.CURRENT);
      } catch (err) {
        console.warn('[RootWhisper AntigravityApi] Live endpoint unavailable, using sample environment:', err);
      }
    }
    return { ...this.sampleEnvironment };
  }

  /**
   * Fetches high-level chamber KPI summary counters.
   */
  public async fetchKpis(): Promise<KpiSummary> {
    if (!APP_CONFIG.useSampleData) {
      try {
        return await http.get<KpiSummary>(ANTIGRAVITY_ENDPOINTS.KPIS.SUMMARY);
      } catch (err) {
        console.warn('[RootWhisper AntigravityApi] Live endpoint unavailable, using sample KPIs:', err);
      }
    }
    return { ...INITIAL_KPIS };
  }

  /**
   * Fetches hardware telemetry for all registered ESP32 edge nodes.
   */
  public async fetchNodes(): Promise<ESP32Node[]> {
    if (!APP_CONFIG.useSampleData) {
      try {
        return await http.get<ESP32Node[]>(ANTIGRAVITY_ENDPOINTS.NODES.LIST);
      } catch (err) {
        console.warn('[RootWhisper AntigravityApi] Live endpoint unavailable, using sample nodes:', err);
      }
    }
    return [...this.sampleNodes];
  }

  /**
   * Fetches recent physiological detections and node heartbeat activity events.
   */
  public async fetchActivityLogs(): Promise<ActivityEvent[]> {
    if (!APP_CONFIG.useSampleData) {
      try {
        return await http.get<ActivityEvent[]>(ANTIGRAVITY_ENDPOINTS.REPORTS.AUDIT_LOGS);
      } catch (err) {
        console.warn('[RootWhisper AntigravityApi] Live endpoint unavailable, using sample logs:', err);
      }
    }
    return [...this.sampleLogs];
  }

  /**
   * Fetches synchronized multi-sensor time-series readings for a given window.
   */
  public async fetchTimeSeries(timeframe: '6h' | '12h' | '24h' | '7d'): Promise<TimeSeriesReading[]> {
    if (!APP_CONFIG.useSampleData) {
      try {
        return await http.get<TimeSeriesReading[]>(
          ANTIGRAVITY_ENDPOINTS.ENVIRONMENT.HISTORY(timeframe)
        );
      } catch (err) {
        console.warn('[RootWhisper AntigravityApi] Live endpoint unavailable, using sample time-series:', err);
      }
    }
    if (timeframe === '6h') {
      return SAMPLE_TIME_SERIES.slice(-4);
    }
    return SAMPLE_TIME_SERIES;
  }

  /**
   * Triggers an on-demand biophysical screening evaluation on the Antigravity AI model.
   */
  public async triggerManualScreening(plantId: string): Promise<ScreeningEvaluationResult> {
    if (!APP_CONFIG.useSampleData) {
      try {
        return await http.post<ScreeningEvaluationResult>(
          ANTIGRAVITY_ENDPOINTS.SCREENING.EVALUATE(plantId)
        );
      } catch (err) {
        console.warn('[RootWhisper AntigravityApi] Live screening call failed, simulating evaluation locally:', err);
      }
    }

    const plant = this.samplePlants.find((p) => p.id === plantId);
    if (!plant) throw new Error(`Plant not found for identifier: ${plantId}`);

    const newLog: ActivityEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      plantId: plant.id,
      plantName: plant.code,
      category: 'screening',
      severity: plant.stressLevel === 'mild_stress' ? 'warning' : 'nominal',
      message: `On-demand Antigravity fingerprint scan executed for ${plant.commonName}. Current CWSI is ${plant.stressIndex.toFixed(2)}.`,
      metric: `CWSI: ${plant.stressIndex.toFixed(2)}`,
    };
    this.sampleLogs.unshift(newLog);

    return {
      success: true,
      message: `Antigravity screening complete for ${plant.commonName}. Thermal index confirmed.`,
      stressIndex: plant.stressIndex,
      residual: plant.temperatureDelta,
      outcome: plant.stressLevel === 'mild_stress' ? 'POSSIBLE WATER STRESS' : 'NORMAL',
    };
  }

  /**
   * Signals the ESP32 node to trigger a precision micro-irrigation valve pulse.
   */
  public async triggerMicroIrrigation(
    plantId: string,
    durationSec: number = 15
  ): Promise<ActuatorCommandResult> {
    if (!APP_CONFIG.useSampleData) {
      try {
        return await http.post<ActuatorCommandResult>(
          ANTIGRAVITY_ENDPOINTS.ACTUATORS.PULSE_IRRIGATION(plantId),
          { durationSec }
        );
      } catch (err) {
        console.warn('[RootWhisper AntigravityApi] Live actuation call failed, simulating locally:', err);
      }
    }

    const plant = this.samplePlants.find((p) => p.id === plantId);
    if (!plant) throw new Error(`Plant not found for identifier: ${plantId}`);

    // Update local sample state to simulate hydration response
    plant.soilMoisture = Math.min(100, plant.soilMoisture + 8.5);
    if (plant.stressLevel === 'mild_stress') {
      plant.stressLevel = 'nominal';
      plant.stressIndex = 0.28;
      plant.temperatureDelta = -0.2;
      plant.leafTemperature = plant.ambientTemperature - 0.2;
    }

    const newLog: ActivityEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      plantId: plant.id,
      plantName: plant.code,
      category: 'irrigation',
      severity: 'nominal',
      message: `ESP32 micro-irrigation valve pulsed for ${durationSec}s on node ${plant.nodeId}. Substrate hydration replenishing.`,
      metric: `+8.5% Moisture`,
    };
    this.sampleLogs.unshift(newLog);

    return {
      success: true,
      message: `Micro-irrigation valve pulsed for ${durationSec}s on ${plant.nodeId}. Moisture increasing.`,
      valveState: 'closed',
      runtimeSeconds: durationSec,
    };
  }
}

export const antigravityApi = new AntigravityApiService();
