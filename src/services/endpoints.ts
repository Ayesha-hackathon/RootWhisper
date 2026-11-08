/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Google Antigravity Backend API Route Registry
 * ----------------------------------------------------------------------------
 * NOTE FOR GOOGLE ANTIGRAVITY BACKEND TEAM:
 * This registry declares the REST endpoints expected by the RootWhisper frontend.
 * Update these paths to match your Antigravity HTTP/gRPC-Web gateway mappings.
 * All paths are relative to `APP_CONFIG.apiUrl` (e.g. `/api/v1`).
 */

export const ANTIGRAVITY_ENDPOINTS = {
  // Plant Fleet Telemetry
  PLANTS: {
    LIST: '/plants',
    GET_BY_ID: (id: string) => `/plants/${id}`,
    GET_HISTORY: (id: string, timeframe: string) => `/plants/${id}/history?timeframe=${timeframe}`,
  },

  // Environmental Phytotron Chamber Microclimate
  ENVIRONMENT: {
    CURRENT: '/chamber/environment',
    HISTORY: (timeframe: string) => `/chamber/environment/history?timeframe=${timeframe}`,
  },

  // System & Fleet KPIs
  KPIS: {
    SUMMARY: '/kpis/summary',
  },

  // ESP32 Wi-Fi Mesh Edge Nodes
  NODES: {
    LIST: '/nodes',
    GET_DIAGNOSTICS: (nodeId: string) => `/nodes/${nodeId}/diagnostics`,
    PING: (nodeId: string) => `/nodes/${nodeId}/ping`,
    SCAN_I2C: (nodeId: string) => `/nodes/${nodeId}/i2c-scan`,
    PACKET_STATS: '/nodes/packet-stats',
  },

  // AI Screening & Biophysical Fingerprinting
  SCREENING: {
    EVALUATE: (plantId: string) => `/screening/evaluate/${plantId}`,
    BATCH_STATUS: '/screening/status',
    HISTORY: '/screening/history',
    ANOMALIES: '/screening/anomalies',
  },

  // Actuation & Solenoid Micro-Irrigation
  ACTUATORS: {
    PULSE_IRRIGATION: (plantId: string) => `/actuators/irrigation/${plantId}`,
  },

  // Research Reports & Datasets
  REPORTS: {
    EXPORT_CSV: (category: string) => `/reports/export?category=${category}`,
    AUDIT_LOGS: '/reports/audit-logs',
  },
} as const;
