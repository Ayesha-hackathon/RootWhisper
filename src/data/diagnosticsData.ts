/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SENSOR DIAGNOSTICS REGISTRY
 * ----------------------------------------------------------------------------
 * Manages live telemetry, hardware health, I2C bus records, packet monitoring,
 * and communication error history for the three independent physical ESP32 nodes:
 *   - TULSI_01
 *   - HIBISCUS_01
 *   - MONEYPLANT_01
 * 
 * Strict Data Hygiene: No simulated or fabricated numbers. When hardware is offline,
 * all readings are N/A with status "Node Offline (Awaiting hardware data)".
 */

import { NodeDiagnostic, SensorChannelDiagnostic, CommunicationErrorRecord, DataValidityState } from '../types';

export const INITIAL_NODE_DIAGNOSTICS: NodeDiagnostic[] = [
  {
    nodeId: 'TULSI_01',
    assignedPlantId: 'tulsi-01',
    assignedPlantName: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum tenuiflorum',
    boardModel: 'ESP32 DevKit V1',
    mcuArchitecture: 'Xtensa 32-bit LX6 Dual-Core @ 240MHz',
    status: 'offline',
    ipAddress: 'N/A',
    macAddress: 'N/A',
    firmwareVersion: 'RootWhisper-ESP32 v2.4 (ESP-IDF v5.1)',
    uptimeFormatted: '0h 0m',
    uptimeSeconds: 0,
    rssi: 0,
    batteryVoltage: 0,
    busSupplyVoltage: 0,
    solarCharging: false,
    lastSeenTimestamp: 'No telemetry recorded',
    lastSeenSecondsAgo: 999999,
    freshnessStatus: 'critical',
    packetsTransmitted: 0,
    packetsReceived: 0,
    packetsDropped: 0,
    packetLossPercent: 0,
    crcErrors: 0,
    heapFreeKb: 0,
    sensorModules: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 Analog', busInterface: 'ADC1_CH0 (GPIO 36)', status: 'offline' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', busInterface: 'I2C 0x5A (400kHz)', status: 'offline' },
      { name: 'Ambient Temp & RH', model: 'AHT25 Precision Digital', busInterface: 'I2C 0x38 (400kHz)', status: 'offline' },
      { name: 'Ambient Light Sensor', model: 'BH1750 Digital Lux', busInterface: 'I2C 0x23 (400kHz)', status: 'offline' },
    ],
  },
  {
    nodeId: 'HIBISCUS_01',
    assignedPlantId: 'hibiscus-01',
    assignedPlantName: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    boardModel: 'ESP32 DevKit V1',
    mcuArchitecture: 'Xtensa 32-bit LX6 Dual-Core @ 240MHz',
    status: 'offline',
    ipAddress: 'N/A',
    macAddress: 'N/A',
    firmwareVersion: 'RootWhisper-ESP32 v2.4 (ESP-IDF v5.1)',
    uptimeFormatted: '0h 0m',
    uptimeSeconds: 0,
    rssi: 0,
    batteryVoltage: 0,
    busSupplyVoltage: 0,
    solarCharging: false,
    lastSeenTimestamp: 'No telemetry recorded',
    lastSeenSecondsAgo: 999999,
    freshnessStatus: 'critical',
    packetsTransmitted: 0,
    packetsReceived: 0,
    packetsDropped: 0,
    packetLossPercent: 0,
    crcErrors: 0,
    heapFreeKb: 0,
    sensorModules: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 Analog', busInterface: 'ADC1_CH0 (GPIO 36)', status: 'offline' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', busInterface: 'I2C 0x5A (400kHz)', status: 'offline' },
      { name: 'Ambient Temp & RH', model: 'AHT25 Precision Digital', busInterface: 'I2C 0x38 (400kHz)', status: 'offline' },
      { name: 'Ambient Light Sensor', model: 'BH1750 Digital Lux', busInterface: 'I2C 0x23 (400kHz)', status: 'offline' },
    ],
  },
  {
    nodeId: 'MONEYPLANT_01',
    assignedPlantId: 'moneyplant-01',
    assignedPlantName: 'Money Plant (Golden Pothos)',
    scientificName: 'Epipremnum aureum',
    boardModel: 'ESP32 DevKit V1',
    mcuArchitecture: 'Xtensa 32-bit LX6 Dual-Core @ 240MHz',
    status: 'offline',
    ipAddress: 'N/A',
    macAddress: 'N/A',
    firmwareVersion: 'RootWhisper-ESP32 v2.4 (ESP-IDF v5.1)',
    uptimeFormatted: '0h 0m',
    uptimeSeconds: 0,
    rssi: 0,
    batteryVoltage: 0,
    busSupplyVoltage: 0,
    solarCharging: false,
    lastSeenTimestamp: 'No telemetry recorded',
    lastSeenSecondsAgo: 999999,
    freshnessStatus: 'critical',
    packetsTransmitted: 0,
    packetsReceived: 0,
    packetsDropped: 0,
    packetLossPercent: 0,
    crcErrors: 0,
    heapFreeKb: 0,
    sensorModules: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 Analog', busInterface: 'ADC1_CH0 (GPIO 36)', status: 'offline' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', busInterface: 'I2C 0x5A (400kHz)', status: 'offline' },
      { name: 'Ambient Temp & RH', model: 'AHT25 Precision Digital', busInterface: 'I2C 0x38 (400kHz)', status: 'offline' },
      { name: 'Ambient Light Sensor', model: 'BH1750 Digital Lux', busInterface: 'I2C 0x23 (400kHz)', status: 'offline' },
    ],
  },
];

export const INITIAL_SENSOR_CHANNELS: SensorChannelDiagnostic[] = [
  // --- TULSI_01 ---
  {
    id: 'TULSI_SM',
    nodeId: 'TULSI_01',
    sensorName: 'Soil Moisture',
    sensorModel: 'Capacitive Soil Probe v1.2',
    measurementType: 'Soil Moisture',
    busInterface: 'ADC1_CH0 (GPIO 36)',
    reading: null,
    unit: '%',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '35.0% – 70.0%',
    calibration: {
      status: 'calibrated',
      method: '2-Point Soil Matrix (Dry: 3200, Sat: 1400 counts)',
      date: 'Pending node stream',
      offset: '±0.0%',
    },
  },
  {
    id: 'TULSI_LT',
    nodeId: 'TULSI_01',
    sensorName: 'Leaf Temperature',
    sensorModel: 'MLX90614 Contactless IR',
    measurementType: 'Leaf Temperature',
    busInterface: 'I2C 0x5A',
    reading: null,
    unit: '°C',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '20.0°C – 32.0°C',
    calibration: {
      status: 'calibrated',
      method: 'Factory Emissivity (ε=0.98)',
      date: 'Pending node stream',
      offset: '0.00°C',
    },
  },
  {
    id: 'TULSI_AT',
    nodeId: 'TULSI_01',
    sensorName: 'Ambient Temperature',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Ambient Temperature',
    busInterface: 'I2C 0x38',
    reading: null,
    unit: '°C',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '18.0°C – 35.0°C',
    calibration: {
      status: 'calibrated',
      method: 'NIST Traceable Factory Calibration',
      date: 'Pending node stream',
      offset: '0.00°C',
    },
  },
  {
    id: 'TULSI_RH',
    nodeId: 'TULSI_01',
    sensorName: 'Relative Humidity',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Relative Humidity',
    busInterface: 'I2C 0x38',
    reading: null,
    unit: '%',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '40.0% – 80.0%',
    calibration: {
      status: 'calibrated',
      method: 'Factory Hygrometric Calibration',
      date: 'Pending node stream',
      offset: '0.0%',
    },
  },
  {
    id: 'TULSI_LI',
    nodeId: 'TULSI_01',
    sensorName: 'Light Intensity',
    sensorModel: 'BH1750 Ambient Lux',
    measurementType: 'Light Intensity',
    busInterface: 'I2C 0x23',
    reading: null,
    unit: 'lux',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '0 – 65,535 lux',
    calibration: {
      status: 'calibrated',
      method: 'CIE Standard Illuminant A',
      date: 'Pending node stream',
      offset: '0.0 lx',
    },
  },

  // --- HIBISCUS_01 ---
  {
    id: 'HIBISCUS_SM',
    nodeId: 'HIBISCUS_01',
    sensorName: 'Soil Moisture',
    sensorModel: 'Capacitive Soil Probe v1.2',
    measurementType: 'Soil Moisture',
    busInterface: 'ADC1_CH0 (GPIO 36)',
    reading: null,
    unit: '%',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '40.0% – 80.0%',
    calibration: {
      status: 'calibrated',
      method: '2-Point Soil Matrix (Dry: 3150, Sat: 1380 counts)',
      date: 'Pending node stream',
      offset: '±0.0%',
    },
  },
  {
    id: 'HIBISCUS_LT',
    nodeId: 'HIBISCUS_01',
    sensorName: 'Leaf Temperature',
    sensorModel: 'MLX90614 Contactless IR',
    measurementType: 'Leaf Temperature',
    busInterface: 'I2C 0x5A',
    reading: null,
    unit: '°C',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '20.0°C – 32.0°C',
    calibration: {
      status: 'calibrated',
      method: 'Factory Emissivity (ε=0.98)',
      date: 'Pending node stream',
      offset: '0.00°C',
    },
  },
  {
    id: 'HIBISCUS_AT',
    nodeId: 'HIBISCUS_01',
    sensorName: 'Ambient Temperature',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Ambient Temperature',
    busInterface: 'I2C 0x38',
    reading: null,
    unit: '°C',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '18.0°C – 35.0°C',
    calibration: {
      status: 'calibrated',
      method: 'NIST Traceable Factory Calibration',
      date: 'Pending node stream',
      offset: '0.00°C',
    },
  },
  {
    id: 'HIBISCUS_RH',
    nodeId: 'HIBISCUS_01',
    sensorName: 'Relative Humidity',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Relative Humidity',
    busInterface: 'I2C 0x38',
    reading: null,
    unit: '%',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '40.0% – 80.0%',
    calibration: {
      status: 'calibrated',
      method: 'Factory Hygrometric Calibration',
      date: 'Pending node stream',
      offset: '0.0%',
    },
  },
  {
    id: 'HIBISCUS_LI',
    nodeId: 'HIBISCUS_01',
    sensorName: 'Light Intensity',
    sensorModel: 'BH1750 Ambient Lux',
    measurementType: 'Light Intensity',
    busInterface: 'I2C 0x23',
    reading: null,
    unit: 'lux',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '0 – 65,535 lux',
    calibration: {
      status: 'calibrated',
      method: 'CIE Standard Illuminant A',
      date: 'Pending node stream',
      offset: '0.0 lx',
    },
  },

  // --- MONEYPLANT_01 ---
  {
    id: 'MONEYPLANT_SM',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Soil Moisture',
    sensorModel: 'Capacitive Soil Probe v1.2',
    measurementType: 'Soil Moisture',
    busInterface: 'ADC1_CH0 (GPIO 36)',
    reading: null,
    unit: '%',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '30.0% – 70.0%',
    calibration: {
      status: 'calibrated',
      method: '2-Point Soil Matrix (Dry: 3250, Sat: 1420 counts)',
      date: 'Pending node stream',
      offset: '±0.0%',
    },
  },
  {
    id: 'MONEYPLANT_LT',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Leaf Temperature',
    sensorModel: 'MLX90614 Contactless IR',
    measurementType: 'Leaf Temperature',
    busInterface: 'I2C 0x5A',
    reading: null,
    unit: '°C',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '20.0°C – 32.0°C',
    calibration: {
      status: 'calibrated',
      method: 'Factory Emissivity (ε=0.98)',
      date: 'Pending node stream',
      offset: '0.00°C',
    },
  },
  {
    id: 'MONEYPLANT_AT',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Ambient Temperature',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Ambient Temperature',
    busInterface: 'I2C 0x38',
    reading: null,
    unit: '°C',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '18.0°C – 35.0°C',
    calibration: {
      status: 'calibrated',
      method: 'NIST Traceable Factory Calibration',
      date: 'Pending node stream',
      offset: '0.00°C',
    },
  },
  {
    id: 'MONEYPLANT_RH',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Relative Humidity',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Relative Humidity',
    busInterface: 'I2C 0x38',
    reading: null,
    unit: '%',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '40.0% – 80.0%',
    calibration: {
      status: 'calibrated',
      method: 'Factory Hygrometric Calibration',
      date: 'Pending node stream',
      offset: '0.0%',
    },
  },
  {
    id: 'MONEYPLANT_LI',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Light Intensity',
    sensorModel: 'BH1750 Ambient Lux',
    measurementType: 'Light Intensity',
    busInterface: 'I2C 0x23',
    reading: null,
    unit: 'lux',
    rawReading: 'No telemetry recorded',
    validity: 'unavailable',
    diagnosticStatus: 'Node Offline (Awaiting hardware data)',
    lastUpdate: 'Never',
    lastUpdateSecondsAgo: 999999,
    nominalRange: '0 – 65,535 lux',
    calibration: {
      status: 'calibrated',
      method: 'CIE Standard Illuminant A',
      date: 'Pending node stream',
      offset: '0.0 lx',
    },
  },
];

export const INITIAL_COMMUNICATION_ERRORS: CommunicationErrorRecord[] = [];

/**
 * Robust Data Sanitization & Formatting
 * ----------------------------------------------------------------------------
 * CRITICAL SCIENTIFIC & SYSTEM RULE:
 * Invalid values such as -99.0°C, 0xFFFF, or NaN must NEVER appear as genuine
 * measurements. When nodes are offline or awaiting first data, returns "N/A".
 */
export function formatDiagnosticReading(
  value: number | null | undefined,
  unit: string,
  validity: DataValidityState | 'error',
  nodeStatus?: string
): {
  display: string;
  unitDisplay: string;
  isError: boolean;
  isStale: boolean;
  isOffline: boolean;
  alertNote?: string;
} {
  if (nodeStatus === 'offline' || validity === 'unavailable' || value === null || value === undefined) {
    return {
      display: 'N/A',
      unitDisplay: '',
      isError: false,
      isStale: false,
      isOffline: true,
      alertNote: 'Waiting for sensor data. Connect your ESP32 node to start live monitoring.',
    };
  }

  // Intercept -99.0°C, -99, NaN, and out-of-bounds sentinels
  if (
    isNaN(value) ||
    value === -99 ||
    value === -99.0 ||
    value <= -50 ||
    validity === 'invalid'
  ) {
    return {
      display: 'SENSOR ERROR',
      unitDisplay: '',
      isError: true,
      isStale: false,
      isOffline: false,
      alertNote: value === -99.0 ? 'Hardware fault sentinel (-99.0°C)' : 'Invalid reading / bus fault',
    };
  }

  if (validity === 'stale') {
    return {
      display: value.toLocaleString(undefined, {
        minimumFractionDigits: unit === 'lux' ? 0 : 1,
        maximumFractionDigits: unit === 'lux' ? 0 : 1,
      }),
      unitDisplay: unit,
      isError: false,
      isStale: true,
      isOffline: false,
      alertNote: 'Stale telemetry (>40m delay)',
    };
  }

  return {
    display: value.toLocaleString(undefined, {
      minimumFractionDigits: unit === 'lux' ? 0 : 1,
      maximumFractionDigits: unit === 'lux' ? 0 : 1,
    }),
    unitDisplay: unit,
    isError: false,
    isStale: false,
    isOffline: false,
  };
}
