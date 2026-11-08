/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SENSOR DIAGNOSTICS SAMPLE REGISTRY
 * ----------------------------------------------------------------------------
 * Manages sample telemetry, hardware health, I2C bus records, packet monitoring,
 * and communication error history for the three independent ESP32 nodes:
 *   - TULSI_01
 *   - HIBISCUS_01
 *   - MONEYPLANT_01
 * 
 * Strict Data Hygiene: Values like -99.0°C or NaN are intercepted and converted
 * to SENSOR ERROR / N/A, ensuring invalid data never appears as genuine measurements.
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
    status: 'online',
    ipAddress: '192.168.10.141',
    macAddress: 'C8:F0:9E:81:4A:12',
    firmwareVersion: 'RootWhisper-ESP32 v2.4.1 (ESP-IDF v5.1)',
    uptimeFormatted: '13d 6h 18m',
    uptimeSeconds: 1145880,
    rssi: -58,
    batteryVoltage: 4.14,
    busSupplyVoltage: 3.32,
    solarCharging: true,
    lastSeenTimestamp: '2026-11-06T23:34:25Z',
    lastSeenSecondsAgo: 14,
    freshnessStatus: 'fresh',
    packetsTransmitted: 54220,
    packetsReceived: 54162,
    packetsDropped: 58,
    packetLossPercent: 0.107,
    crcErrors: 3,
    heapFreeKb: 184.5,
    sensorModules: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 Analog', busInterface: 'ADC1_CH0 (GPIO 36)', status: 'healthy' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', busInterface: 'I2C 0x5A (400kHz)', status: 'healthy' },
      { name: 'Ambient Temp & RH', model: 'AHT25 Precision Digital', busInterface: 'I2C 0x38 (400kHz)', status: 'healthy' },
      { name: 'Ambient Light Sensor', model: 'BH1750 Digital Lux', busInterface: 'I2C 0x23 (400kHz)', status: 'healthy' },
    ],
  },
  {
    nodeId: 'HIBISCUS_01',
    assignedPlantId: 'hibiscus-01',
    assignedPlantName: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    boardModel: 'ESP32 DevKit V1',
    mcuArchitecture: 'Xtensa 32-bit LX6 Dual-Core @ 240MHz',
    status: 'online',
    ipAddress: '192.168.10.142',
    macAddress: 'C8:F0:9E:81:5B:34',
    firmwareVersion: 'RootWhisper-ESP32 v2.4.1 (ESP-IDF v5.1)',
    uptimeFormatted: '17d 4h 12m',
    uptimeSeconds: 1483920,
    rssi: -62,
    batteryVoltage: 4.08,
    busSupplyVoltage: 3.31,
    solarCharging: true,
    lastSeenTimestamp: '2026-11-06T23:34:31Z',
    lastSeenSecondsAgo: 8,
    freshnessStatus: 'fresh',
    packetsTransmitted: 54220,
    packetsReceived: 54124,
    packetsDropped: 96,
    packetLossPercent: 0.177,
    crcErrors: 5,
    heapFreeKb: 178.2,
    sensorModules: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 Analog', busInterface: 'ADC1_CH0 (GPIO 36)', status: 'healthy' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', busInterface: 'I2C 0x5A (400kHz)', status: 'healthy' },
      { name: 'Ambient Temp & RH', model: 'AHT25 Precision Digital', busInterface: 'I2C 0x38 (400kHz)', status: 'healthy' },
      { name: 'Ambient Light Sensor', model: 'BH1750 Digital Lux', busInterface: 'I2C 0x23 (400kHz)', status: 'healthy' },
    ],
  },
  {
    nodeId: 'MONEYPLANT_01',
    assignedPlantId: 'moneyplant-01',
    assignedPlantName: 'Money Plant (Golden Pothos)',
    scientificName: 'Epipremnum aureum',
    boardModel: 'ESP32 DevKit V1',
    mcuArchitecture: 'Xtensa 32-bit LX6 Dual-Core @ 240MHz',
    status: 'online',
    ipAddress: '192.168.10.143',
    macAddress: 'C8:F0:9E:81:6C:58',
    firmwareVersion: 'RootWhisper-ESP32 v2.4.1 (ESP-IDF v5.1)',
    uptimeFormatted: '9d 19h 45m',
    uptimeSeconds: 848700,
    rssi: -54,
    batteryVoltage: 4.18,
    busSupplyVoltage: 3.33,
    solarCharging: true,
    lastSeenTimestamp: '2026-11-06T23:34:33Z',
    lastSeenSecondsAgo: 6,
    freshnessStatus: 'fresh',
    packetsTransmitted: 54220,
    packetsReceived: 54188,
    packetsDropped: 32,
    packetLossPercent: 0.059,
    crcErrors: 1,
    heapFreeKb: 192.0,
    sensorModules: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 Analog', busInterface: 'ADC1_CH0 (GPIO 36)', status: 'healthy' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', busInterface: 'I2C 0x5A (400kHz)', status: 'healthy' },
      { name: 'Ambient Temp & RH', model: 'AHT25 Precision Digital', busInterface: 'I2C 0x38 (400kHz)', status: 'healthy' },
      { name: 'Ambient Light Sensor', model: 'BH1750 Digital Lux', busInterface: 'I2C 0x23 (400kHz)', status: 'healthy' },
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
    reading: 34.2,
    unit: '%',
    rawReading: 'ADC: 1940 counts (1.56V)',
    validity: 'valid',
    diagnosticStatus: 'Nominal 12-bit ADC curve · Impedance steady',
    lastUpdate: '14s ago',
    lastUpdateSecondsAgo: 14,
    nominalRange: '30.0% – 70.0%',
    calibration: {
      status: 'calibrated',
      method: '2-Point Soil Matrix (Dry: 3120, Sat: 1450 counts)',
      date: '2026-10-24',
      offset: '±0.8%',
    },
  },
  {
    id: 'TULSI_LT',
    nodeId: 'TULSI_01',
    sensorName: 'Leaf Temperature',
    sensorModel: 'MLX90614 Contactless IR',
    measurementType: 'Leaf Temperature',
    busInterface: 'I2C 0x5A',
    reading: 26.8,
    unit: '°C',
    rawReading: 'Reg 0x07: 0x3AC4 (300.0K)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · Emissivity calibrated (ε=0.98)',
    lastUpdate: '14s ago',
    lastUpdateSecondsAgo: 14,
    nominalRange: '21.0°C – 28.0°C',
    calibration: {
      status: 'calibrated',
      method: 'Blackbody Reference + Foliage Cuticle Compensation',
      date: '2026-10-28',
      offset: '+0.12°C',
    },
  },
  {
    id: 'TULSI_AT',
    nodeId: 'TULSI_01',
    sensorName: 'Ambient Temperature',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Ambient Temperature',
    busInterface: 'I2C 0x38',
    reading: 24.2,
    unit: '°C',
    rawReading: 'Word: 0x69420 (297.35K)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · On-chip CRC valid',
    lastUpdate: '14s ago',
    lastUpdateSecondsAgo: 14,
    nominalRange: '20.0°C – 28.0°C',
    calibration: {
      status: 'calibrated',
      method: 'NIST Traceable Factory Calibration',
      date: '2026-09-15',
      offset: '±0.15°C',
    },
  },
  {
    id: 'TULSI_RH',
    nodeId: 'TULSI_01',
    sensorName: 'Relative Humidity',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Relative Humidity',
    busInterface: 'I2C 0x38',
    reading: 58.4,
    unit: '%',
    rawReading: 'Word: 0x959E2 (58.4%)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · RH sensor polymer response nominal',
    lastUpdate: '14s ago',
    lastUpdateSecondsAgo: 14,
    nominalRange: '45.0% – 75.0%',
    calibration: {
      status: 'calibrated',
      method: 'Saturated Salt Chamber Verification (75.3% RH)',
      date: '2026-10-10',
      offset: '±1.1%',
    },
  },
  {
    id: 'TULSI_LI',
    nodeId: 'TULSI_01',
    sensorName: 'Light Intensity',
    sensorModel: 'BH1750 Ambient Lux',
    measurementType: 'Light Intensity',
    busInterface: 'I2C 0x23',
    reading: 18450,
    unit: 'lux',
    rawReading: 'Raw: 0x4812 (18450 lx)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · High-res Mode 1 (1 lx step)',
    lastUpdate: '14s ago',
    lastUpdateSecondsAgo: 14,
    nominalRange: '10,000 – 30,000 lux',
    calibration: {
      status: 'calibrated',
      method: 'Cosine-Corrected Photodiode Standard',
      date: '2026-10-15',
      offset: 'k=1.021',
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
    reading: 62.8,
    unit: '%',
    rawReading: 'ADC: 1520 counts (1.22V)',
    validity: 'valid',
    diagnosticStatus: 'Nominal 12-bit ADC curve · Well hydrated root zone',
    lastUpdate: '8s ago',
    lastUpdateSecondsAgo: 8,
    nominalRange: '35.0% – 75.0%',
    calibration: {
      status: 'calibrated',
      method: '2-Point Soil Matrix (Dry: 3110, Sat: 1430 counts)',
      date: '2026-10-24',
      offset: '±0.7%',
    },
  },
  {
    id: 'HIBISCUS_LT',
    nodeId: 'HIBISCUS_01',
    sensorName: 'Leaf Temperature',
    sensorModel: 'MLX90614 Contactless IR',
    measurementType: 'Leaf Temperature',
    busInterface: 'I2C 0x5A',
    reading: 23.4,
    unit: '°C',
    rawReading: 'Reg 0x07: 0x39B2 (296.55K)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · Emissivity calibrated (ε=0.98)',
    lastUpdate: '8s ago',
    lastUpdateSecondsAgo: 8,
    nominalRange: '20.0°C – 26.5°C',
    calibration: {
      status: 'calibrated',
      method: 'Blackbody Reference + Foliage Cuticle Compensation',
      date: '2026-10-28',
      offset: '+0.08°C',
    },
  },
  {
    id: 'HIBISCUS_AT',
    nodeId: 'HIBISCUS_01',
    sensorName: 'Ambient Temperature',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Ambient Temperature',
    busInterface: 'I2C 0x38',
    reading: 24.2,
    unit: '°C',
    rawReading: 'Word: 0x69420 (297.35K)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · Precision digital output steady',
    lastUpdate: '8s ago',
    lastUpdateSecondsAgo: 8,
    nominalRange: '20.0°C – 28.0°C',
    calibration: {
      status: 'calibrated',
      method: 'NIST Traceable Factory Calibration',
      date: '2026-09-15',
      offset: '±0.15°C',
    },
  },
  {
    id: 'HIBISCUS_RH',
    nodeId: 'HIBISCUS_01',
    sensorName: 'Relative Humidity',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Relative Humidity',
    busInterface: 'I2C 0x38',
    reading: 59.8,
    unit: '%',
    rawReading: 'Word: 0x992B1 (59.8%)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · RH sensor polymer response nominal',
    lastUpdate: '8s ago',
    lastUpdateSecondsAgo: 8,
    nominalRange: '45.0% – 75.0%',
    calibration: {
      status: 'calibrated',
      method: 'Saturated Salt Chamber Verification (75.3% RH)',
      date: '2026-10-10',
      offset: '±1.0%',
    },
  },
  {
    id: 'HIBISCUS_LI',
    nodeId: 'HIBISCUS_01',
    sensorName: 'Light Intensity',
    sensorModel: 'BH1750 Ambient Lux',
    measurementType: 'Light Intensity',
    busInterface: 'I2C 0x23',
    reading: 26800,
    unit: 'lux',
    rawReading: 'Raw: 0x68B0 (26800 lx)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · High-res Mode 1 (1 lx step)',
    lastUpdate: '8s ago',
    lastUpdateSecondsAgo: 8,
    nominalRange: '15,000 – 35,000 lux',
    calibration: {
      status: 'calibrated',
      method: 'Cosine-Corrected Photodiode Standard',
      date: '2026-10-15',
      offset: 'k=1.018',
    },
  },

  // --- MONEYPLANT_01 ---
  {
    id: 'MONEY_SM',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Soil Moisture',
    sensorModel: 'Capacitive Soil Probe v1.2',
    measurementType: 'Soil Moisture',
    busInterface: 'ADC1_CH0 (GPIO 36)',
    reading: 48.6,
    unit: '%',
    rawReading: 'ADC: 1760 counts (1.41V)',
    validity: 'valid',
    diagnosticStatus: 'Nominal 12-bit ADC curve · Medium substrate hydration',
    lastUpdate: '6s ago',
    lastUpdateSecondsAgo: 6,
    nominalRange: '30.0% – 70.0%',
    calibration: {
      status: 'calibrated',
      method: '2-Point Soil Matrix (Dry: 3140, Sat: 1470 counts)',
      date: '2026-10-24',
      offset: '±0.9%',
    },
  },
  {
    id: 'MONEY_LT',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Leaf Temperature',
    sensorModel: 'MLX90614 Contactless IR',
    measurementType: 'Leaf Temperature',
    busInterface: 'I2C 0x5A',
    reading: 24.1,
    unit: '°C',
    rawReading: 'Reg 0x07: 0x3A08 (297.25K)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · Emissivity calibrated (ε=0.98)',
    lastUpdate: '6s ago',
    lastUpdateSecondsAgo: 6,
    nominalRange: '20.0°C – 26.5°C',
    calibration: {
      status: 'calibrated',
      method: 'Blackbody Reference + Foliage Cuticle Compensation',
      date: '2026-10-28',
      offset: '+0.10°C',
    },
  },
  {
    id: 'MONEY_AT',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Ambient Temperature',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Ambient Temperature',
    busInterface: 'I2C 0x38',
    reading: 24.2,
    unit: '°C',
    rawReading: 'Word: 0x69420 (297.35K)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · Precision digital output steady',
    lastUpdate: '6s ago',
    lastUpdateSecondsAgo: 6,
    nominalRange: '20.0°C – 28.0°C',
    calibration: {
      status: 'calibrated',
      method: 'NIST Traceable Factory Calibration',
      date: '2026-09-15',
      offset: '±0.15°C',
    },
  },
  {
    id: 'MONEY_RH',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Relative Humidity',
    sensorModel: 'AHT25 Precision Digital',
    measurementType: 'Relative Humidity',
    busInterface: 'I2C 0x38',
    reading: 59.0,
    unit: '%',
    rawReading: 'Word: 0x970A4 (59.0%)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · RH sensor polymer response nominal',
    lastUpdate: '6s ago',
    lastUpdateSecondsAgo: 6,
    nominalRange: '45.0% – 75.0%',
    calibration: {
      status: 'calibrated',
      method: 'Saturated Salt Chamber Verification (75.3% RH)',
      date: '2026-10-10',
      offset: '±1.1%',
    },
  },
  {
    id: 'MONEY_LI',
    nodeId: 'MONEYPLANT_01',
    sensorName: 'Light Intensity',
    sensorModel: 'BH1750 Ambient Lux',
    measurementType: 'Light Intensity',
    busInterface: 'I2C 0x23',
    reading: 10200,
    unit: 'lux',
    rawReading: 'Raw: 0x27D8 (10200 lx)',
    validity: 'valid',
    diagnosticStatus: 'I2C ACK OK · High-res Mode 1 (1 lx step)',
    lastUpdate: '6s ago',
    lastUpdateSecondsAgo: 6,
    nominalRange: '5,000 – 18,000 lux',
    calibration: {
      status: 'calibrated',
      method: 'Cosine-Corrected Photodiode Standard',
      date: '2026-10-15',
      offset: 'k=1.025',
    },
  },
];

export const INITIAL_COMMUNICATION_ERRORS: CommunicationErrorRecord[] = [
  {
    id: 'ERR_001',
    timestamp: '2026-11-06 23:28:10',
    nodeId: 'HIBISCUS_01',
    severity: 'warning',
    errorType: 'Sequence Gap Detected',
    description: 'Packet sequence jumped from #41028 to #41030 (1 frame lost over Wi-Fi mesh channel 6).',
    sequenceNumber: 41029,
    rawHex: '0xFA 0x29 0xA1 ... [DROPPED]',
    resolved: true,
  },
  {
    id: 'ERR_002',
    timestamp: '2026-11-06 23:14:45',
    nodeId: 'TULSI_01',
    severity: 'nominal',
    errorType: 'Wi-Fi AP Reassociation',
    description: 'Node performed seamless 802.11 b/g/n BSSID roaming to Phytotron-Mesh-East AP (RSSI: -58 dBm).',
    resolved: true,
  },
  {
    id: 'ERR_003',
    timestamp: '2026-11-06 22:42:19',
    nodeId: 'MONEYPLANT_01',
    severity: 'warning',
    errorType: 'CRC32 Checksum Mismatch',
    description: 'Incoming UDP telemetry packet payload failed CRC32 validation (Calculated: 0xE8A1B02, Received: 0xE8A1BF0). Packet discarded.',
    sequenceNumber: 40912,
    rawHex: '0xAA 0x55 0x03 0x0E ... 0xE8A1BF0',
    resolved: true,
  },
  {
    id: 'ERR_004',
    timestamp: '2026-11-06 21:05:33',
    nodeId: 'HIBISCUS_01',
    severity: 'critical',
    errorType: 'Out-of-Bounds Sentinel Intercepted',
    description: 'MLX90614 register read returned invalid -99.0°C sentinel. Frontend sanitizer intercepted corrupted value; displayed SENSOR ERROR / N/A.',
    sequenceNumber: 40510,
    rawHex: '0x07 0xFF 0x9D (-99.0C)',
    resolved: true,
  },
  {
    id: 'ERR_005',
    timestamp: '2026-11-06 19:40:02',
    nodeId: 'TULSI_01',
    severity: 'nominal',
    errorType: 'I2C Bus Recovery Event',
    description: 'SDA line held low by slave clock stretching; 9 clock pulses executed on SCL (GPIO 22). Bus successfully released.',
    resolved: true,
  },
];

/**
 * Robust Data Sanitization & Formatting
 * ----------------------------------------------------------------------------
 * CRITICAL SCIENTIFIC & SYSTEM RULE:
 * Invalid values such as -99.0°C, 0xFFFF, or NaN must NEVER appear as genuine
 * measurements. This helper guarantees that invalid data is formatted strictly
 * as "SENSOR ERROR" or "N/A" with appropriate warning tags.
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
  if (nodeStatus === 'offline') {
    return {
      display: 'N/A',
      unitDisplay: '',
      isError: true,
      isStale: false,
      isOffline: true,
      alertNote: 'Node unreachable (Offline)',
    };
  }

  // Intercept -99.0°C, -99, NaN, null, and out-of-bounds sentinels
  if (
    value === null ||
    value === undefined ||
    isNaN(value) ||
    value === -99 ||
    value === -99.0 ||
    value <= -50 ||
    validity === 'invalid' ||
    validity === 'unavailable'
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
