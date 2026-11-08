/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * RootWhisper Frontend Configuration
 * ----------------------------------------------------------------------------
 * Centralized application configuration driven by Vite environment variables.
 * Designed for deployment to static hosting or Google Cloud Run alongside the
 * Google Antigravity backend and ESP32 mesh ingest services.
 */

export interface AppConfig {
  /**
   * Base URL of the Google Antigravity backend REST & WebSocket API.
   * Configured via VITE_ANTIGRAVITY_API_URL.
   */
  apiUrl: string;

  /**
   * Toggle between live Antigravity backend and local sample telemetry data.
   * Defaults to true in development or when backend is unreachable.
   */
  useSampleData: boolean;

  /**
   * ESP32 Wi-Fi / MQTT Mesh Gateway Identifier.
   */
  esp32MeshId: string;

  /**
   * Model version tag corresponding to Antigravity foliar regression baseline.
   */
  aiModelVersion: string;

  /**
   * Standard hardware sampling interval in milliseconds (default: 5 minutes / 300,000ms).
   */
  samplingIntervalMs: number;

  /**
   * Live UI pulse refresh interval in milliseconds (default: 8,000ms).
   */
  uiRefreshIntervalMs: number;

  /**
   * Default species-aware water-stress anomaly threshold delta (in °C).
   */
  defaultStressThresholdDelta: number;

  /**
   * Target phytotron chamber identifier.
   */
  chamberId: string;
}

export const APP_CONFIG: AppConfig = {
  apiUrl: (import.meta as any).env?.VITE_ANTIGRAVITY_API_URL || 'https://antigravity.rootwhisper.internal:8443/api/v1',
  useSampleData: (import.meta as any).env?.VITE_USE_SAMPLE_DATA !== 'false',
  esp32MeshId: (import.meta as any).env?.VITE_ESP32_MESH_ID || 'ESP32_MESH_CHAMBER_A4',
  aiModelVersion: (import.meta as any).env?.VITE_AI_MODEL_VERSION || 'Antigravity-PhysioFingerprint-v2.4',
  samplingIntervalMs: Number((import.meta as any).env?.VITE_SAMPLING_INTERVAL_MS) || 300000, // 5 min
  uiRefreshIntervalMs: Number((import.meta as any).env?.VITE_UI_REFRESH_MS) || 8000, // 8 sec
  defaultStressThresholdDelta: 1.8, // +1.8°C over expected hydrated baseline
  chamberId: 'CHAMBER_ALPHA_04',
};
