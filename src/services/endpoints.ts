/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * RootWhisper FastAPI Backend API Route Registry
 * ----------------------------------------------------------------------------
 * 1:1 mapping to the actual FastAPI backend routers in backend/app/routers:
 * - auth: /api/v1/auth
 * - devices: /api/v1/devices
 * - telemetry: /api/v1/telemetry
 * - models: /api/v1/models
 */

export const ANTIGRAVITY_ENDPOINTS = {
  // Authentication & Session Security
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Monitored Plant Devices & Threshold Configurations
  DEVICES: {
    LIST: '/devices',
    UPDATE_CONFIG: (deviceId: string) => `/devices/${deviceId}/config`,
  },

  // Telemetry Ingestion & Real-Time Sensor Telemetry
  TELEMETRY: {
    INGEST: '/telemetry',
    LATEST: (deviceId: string) => `/telemetry/${deviceId}/latest`,
    HISTORY: (deviceId: string, limit: number = 100) =>
      `/telemetry/${deviceId}/history?limit=${limit}&include_simulated=true`,
  },

  // AI Baseline Models & Biophysical Regression Status
  MODELS: {
    STATUS: (deviceId: string) => `/models/${deviceId}/status`,
    TRAIN: (deviceId: string) =>
      `/models/${deviceId}/train?include_simulated=true`,
  },

  // System Health & Diagnostics
  SYSTEM: {
    HEALTH: '/health',
    INFO: '/',
  },
} as const;
