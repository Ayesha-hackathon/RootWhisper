/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * RootWhisper Frontend Configuration
 * ----------------------------------------------------------------------------
 * Centralized application configuration driven by Vite environment variables.
 * Directly routes to the local Python FastAPI backend at http://localhost:8000/api/v1.
 */

export interface AppConfig {
  /**
   * Base URL of the FastAPI backend REST API.
   * Defaults to http://localhost:8000/api/v1.
   */
  apiUrl: string;

  /**
   * Toggle between live backend and local sample telemetry fallback.
   * Defaults to false so live backend is queried.
   */
  useSampleData: boolean;

  /**
   * ESP32 Wi-Fi Node Cluster Identifier.
   */
  esp32MeshId: string;

  /**
   * Model version tag corresponding to individual-plant Random Forest foliar baseline.
   */
  aiModelVersion: string;

  /**
   * Standard hardware sampling interval in milliseconds (default: 5 minutes / 300,000ms).
   */
  samplingIntervalMs: number;

  /**
   * Live UI telemetry polling interval in milliseconds (default: 5,000ms).
   */
  uiRefreshIntervalMs: number;

  /**
   * Default provisional canopy water-stress residual threshold delta (in °C).
   */
  defaultStressThresholdDelta: number;

  /**
   * Target node cluster identifier.
   */
  chamberId: string;
}

export const APP_CONFIG: AppConfig = {
  apiUrl: (import.meta as any).env?.VITE_ANTIGRAVITY_API_URL || 
    (typeof window !== 'undefined' && window.location.hostname && window.location.hostname.endsWith('github.io')
      ? 'https://rootwhisper-api.onrender.com/api/v1'
      : (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
          ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1`
          : 'http://localhost:8000/api/v1')),
  useSampleData: false,
  esp32MeshId: (import.meta as any).env?.VITE_ESP32_MESH_ID || 'ESP32_DEVKIT_V1_CLUSTER',
  aiModelVersion: (import.meta as any).env?.VITE_AI_MODEL_VERSION || 'RootWhisper-RandomForest-v2.4',
  samplingIntervalMs: Number((import.meta as any).env?.VITE_SAMPLING_INTERVAL_MS) || 300000,
  uiRefreshIntervalMs: Number((import.meta as any).env?.VITE_UI_REFRESH_MS) || 5000,
  defaultStressThresholdDelta: 1.5,
  chamberId: 'ROOTWHISPER_DEVKIT_V1',
};
