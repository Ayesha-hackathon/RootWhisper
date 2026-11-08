/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SAMPLE DATA REGISTRY
 * ----------------------------------------------------------------------------
 * This module isolates all prototype sample datasets for the RootWhisper
 * frontend. All mock values are explicitly flagged as sample data.
 * When integrating with the Antigravity backend, swap this data source
 * through the service layer in /src/services/antigravityApi.ts.
 */

import {
  PlantTelemetry,
  EnvironmentalConditions,
  TimeSeriesReading,
  ESP32Node,
  ActivityEvent,
  KpiSummary,
} from '../types';

export const SAMPLE_DATA_METADATA = {
  isSampleData: true,
  datasetVersion: 'v1.4.2-prototype',
  source: 'RootWhisper Synthetic Physiological Lab Benchmark',
  targetBackend: 'Google Antigravity Plant Telemetry Engine',
  lastCalibration: '2026-11-06 22:30 UTC',
};

export const INITIAL_PLANTS: PlantTelemetry[] = [
  {
    id: 'tulsi-01',
    code: 'TULSI_01',
    commonName: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum tenuiflorum',
    family: 'Lamiaceae',
    nodeId: 'NODE_ESP32_01',
    nodeStatus: 'online',
    illustrationUrl: '/src/assets/images/botanical_tulsi_1794035216143.jpg',
    stressLevel: 'mild_stress',
    stressIndex: 0.64, // CWSI (Crop Water Stress Index)
    soilMoisture: 34.2, // %
    soilMoistureThreshold: 30.0,
    leafTemperature: 26.8, // °C
    ambientTemperature: 24.2, // °C
    temperatureDelta: 2.6, // T_leaf > T_ambient indicates stomatal closure
    relativeHumidity: 58.4, // %
    lightIntensity: 18450, // lux (BH1750)
    parIntensity: 385,
    vpd: 1.28, // kPa
    transpirationRate: 'restricted',
    stomatalConductanceProxy: 142, // mmol/m²s
    lastUpdated: '12 seconds ago',
    lastUpdatedSecondsAgo: 12,
    batteryVoltage: 4.14,
    wifiRssi: -58,
    baselineStatusText: 'Adaptive Baseline Active · Day 14 Calibrated',
    aiBaseline: {
      expectedLeafTemp: 23.2,
      observedLeafTemp: 26.8,
      temperatureResidual: 3.6,
      adaptiveThreshold: 1.8,
      baselineLearningStatus: 'converged',
      learningProgressPercent: 98,
      convergenceDays: 14,
      totalTrainingPoints: 4032,
      confidenceInterval: '±0.28°C (95% CI)',
      stomataResponseState: 'restricting',
      summaryInsight:
        'Observed leaf temperature is +3.6°C higher than model expected value (23.2°C). Residual exceeds the +1.8°C adaptive water-stress threshold, indicating active stomatal restriction and transpiration drop.',
    },
    sensors: {
      soilMoisture: {
        id: 'sens-sm-01',
        name: 'Soil Moisture',
        sensorModel: 'Capacitive Soil Probe v1.2',
        value: 34.2,
        unit: '%',
        validity: 'valid',
        lastUpdated: '12s ago',
        minOptimal: 30.0,
        maxOptimal: 70.0,
        nominalRangeText: '30% – 70%',
        statusNote: 'Approaching lower wilting threshold (30%)',
      },
      leafTemperature: {
        id: 'sens-lt-01',
        name: 'Leaf Temperature',
        sensorModel: 'MLX90614 Contactless IR',
        value: 26.8,
        unit: '°C',
        validity: 'valid',
        lastUpdated: '12s ago',
        minOptimal: 21.0,
        maxOptimal: 25.5,
        nominalRangeText: '21.0°C – 25.5°C',
        statusNote: 'Elevated by +3.6°C vs baseline expectation',
      },
      ambientTemperature: {
        id: 'sens-at-01',
        name: 'Ambient Temperature',
        sensorModel: 'AHT25 Precision Digital',
        value: 24.2,
        unit: '°C',
        validity: 'valid',
        lastUpdated: '12s ago',
        minOptimal: 20.0,
        maxOptimal: 28.0,
        nominalRangeText: '20.0°C – 28.0°C',
        statusNote: 'Within nominal phytotron diurnal range',
      },
      relativeHumidity: {
        id: 'sens-rh-01',
        name: 'Relative Humidity',
        sensorModel: 'AHT25 Precision Digital',
        value: 58.4,
        unit: '%',
        validity: 'valid',
        lastUpdated: '12s ago',
        minOptimal: 50.0,
        maxOptimal: 75.0,
        nominalRangeText: '50% – 75%',
        statusNote: 'Adequate atmospheric boundary condition',
      },
      lightIntensity: {
        id: 'sens-li-01',
        name: 'Light Intensity',
        sensorModel: 'BH1750 Digital Ambient',
        value: 18450,
        unit: 'lux',
        validity: 'valid',
        lastUpdated: '12s ago',
        minOptimal: 10000,
        maxOptimal: 25000,
        nominalRangeText: '10,000 – 25,000 lux',
        statusNote: 'Active photoperiod sun-canopy lighting',
      },
    },
    physiologicalFingerprint: {
      baselineLeafDelta: -1.2,
      stressThresholdDelta: 1.8,
      transpirationEfficiency: 45.8,
      hoursBeforeVisualWilting: 4.5,
      diagnosis:
        'Early stomatal restriction detected. Leaf thermal signature is +2.6°C above ambient due to reduced evaporative cooling. Root zone moisture at 34.2% is approaching critical wilting threshold.',
    },
  },
  {
    id: 'hibiscus-01',
    code: 'HIBISCUS_01',
    commonName: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    family: 'Malvaceae',
    nodeId: 'NODE_ESP32_02',
    nodeStatus: 'online',
    illustrationUrl: '/src/assets/images/botanical_hibiscus_1794035218495.jpg',
    stressLevel: 'nominal',
    stressIndex: 0.18, // CWSI - Optimal
    soilMoisture: 62.8, // %
    soilMoistureThreshold: 45.0,
    leafTemperature: 23.4, // °C
    ambientTemperature: 24.0, // °C
    temperatureDelta: -0.6,
    relativeHumidity: 61.2, // %
    lightIntensity: 24800, // lux (BH1750)
    parIntensity: 520,
    vpd: 1.15, // kPa
    transpirationRate: 'nominal',
    stomatalConductanceProxy: 285, // mmol/m²s
    lastUpdated: '24 seconds ago',
    lastUpdatedSecondsAgo: 24,
    batteryVoltage: 4.08,
    wifiRssi: -62,
    baselineStatusText: 'Adaptive Baseline Active · Day 21 Calibrated',
    aiBaseline: {
      expectedLeafTemp: 23.5,
      observedLeafTemp: 23.4,
      temperatureResidual: -0.1,
      adaptiveThreshold: 1.5,
      baselineLearningStatus: 'converged',
      learningProgressPercent: 100,
      convergenceDays: 21,
      totalTrainingPoints: 6048,
      confidenceInterval: '±0.22°C (95% CI)',
      stomataResponseState: 'open',
      summaryInsight:
        'Observed leaf temperature matches expected model trajectory within -0.1°C residual. Latent heat dissipation is nominal and stomata remain fully responsive under high illumination.',
    },
    sensors: {
      soilMoisture: {
        id: 'sens-sm-02',
        name: 'Soil Moisture',
        sensorModel: 'Capacitive Soil Probe v1.2',
        value: 62.8,
        unit: '%',
        validity: 'valid',
        lastUpdated: '24s ago',
        minOptimal: 45.0,
        maxOptimal: 80.0,
        nominalRangeText: '45% – 80%',
        statusNote: 'Optimal root zone reservoir capacity',
      },
      leafTemperature: {
        id: 'sens-lt-02',
        name: 'Leaf Temperature',
        sensorModel: 'MLX90614 Contactless IR',
        value: 23.4,
        unit: '°C',
        validity: 'valid',
        lastUpdated: '24s ago',
        minOptimal: 21.0,
        maxOptimal: 25.0,
        nominalRangeText: '21.0°C – 25.0°C',
        statusNote: 'Effective evaporative leaf cooling active',
      },
      ambientTemperature: {
        id: 'sens-at-02',
        name: 'Ambient Temperature',
        sensorModel: 'AHT25 Precision Digital',
        value: 24.0,
        unit: '°C',
        validity: 'valid',
        lastUpdated: '24s ago',
        minOptimal: 20.0,
        maxOptimal: 28.0,
        nominalRangeText: '20.0°C – 28.0°C',
        statusNote: 'Chamber diurnal temperature steady',
      },
      relativeHumidity: {
        id: 'sens-rh-02',
        name: 'Relative Humidity',
        sensorModel: 'AHT25 Precision Digital',
        value: 61.2,
        unit: '%',
        validity: 'valid',
        lastUpdated: '24s ago',
        minOptimal: 50.0,
        maxOptimal: 75.0,
        nominalRangeText: '50% – 75%',
        statusNote: 'Ideal transpiration pressure differential',
      },
      lightIntensity: {
        id: 'sens-li-02',
        name: 'Light Intensity',
        sensorModel: 'BH1750 Digital Ambient',
        value: 24800,
        unit: 'lux',
        validity: 'valid',
        lastUpdated: '24s ago',
        minOptimal: 15000,
        maxOptimal: 35000,
        nominalRangeText: '15,000 – 35,000 lux',
        statusNote: 'High intensity photosynthetic lighting',
      },
    },
    physiologicalFingerprint: {
      baselineLeafDelta: -0.8,
      stressThresholdDelta: 1.5,
      transpirationEfficiency: 92.4,
      hoursBeforeVisualWilting: 36.0,
      diagnosis:
        'Physiological homeostasis intact. Latent heat dissipation is active with active stomatal aperture. Hydraulic conductivity stable across xylem channels.',
    },
  },
  {
    id: 'moneyplant-01',
    code: 'MONEYPLANT_01',
    commonName: 'Money Plant (Golden Pothos)',
    scientificName: 'Epipremnum aureum',
    family: 'Araceae',
    nodeId: 'NODE_ESP32_03',
    nodeStatus: 'online',
    illustrationUrl: '/src/assets/images/botanical_moneyplant_1794035219075.jpg',
    stressLevel: 'nominal',
    stressIndex: 0.22,
    soilMoisture: 48.6,
    soilMoistureThreshold: 35.0,
    leafTemperature: 24.1,
    ambientTemperature: 24.2,
    temperatureDelta: -0.1,
    relativeHumidity: 59.0,
    lightIntensity: 10200, // lux (BH1750)
    parIntensity: 215,
    vpd: 1.22,
    transpirationRate: 'nominal',
    stomatalConductanceProxy: 240,
    lastUpdated: '8 seconds ago',
    lastUpdatedSecondsAgo: 8,
    batteryVoltage: 4.18,
    wifiRssi: -54,
    baselineStatusText: 'Adaptive Baseline Active · Day 18 Calibrated',
    aiBaseline: {
      expectedLeafTemp: 24.0,
      observedLeafTemp: 24.1,
      temperatureResidual: 0.1,
      adaptiveThreshold: 1.6,
      baselineLearningStatus: 'converged',
      learningProgressPercent: 95,
      convergenceDays: 18,
      totalTrainingPoints: 5184,
      confidenceInterval: '±0.25°C (95% CI)',
      stomataResponseState: 'open',
      summaryInsight:
        'Residual is +0.1°C, safely below the +1.6°C threshold. Foliar stomatal conductance maintains steady turgor balance across canopy.',
    },
    sensors: {
      soilMoisture: {
        id: 'sens-sm-03',
        name: 'Soil Moisture',
        sensorModel: 'Capacitive Soil Probe v1.2',
        value: 48.6,
        unit: '%',
        validity: 'valid',
        lastUpdated: '8s ago',
        minOptimal: 35.0,
        maxOptimal: 70.0,
        nominalRangeText: '35% – 70%',
        statusNote: 'Substrate moisture well above 35% threshold',
      },
      leafTemperature: {
        id: 'sens-lt-03',
        name: 'Leaf Temperature',
        sensorModel: 'MLX90614 Contactless IR',
        value: 24.1,
        unit: '°C',
        validity: 'valid',
        lastUpdated: '8s ago',
        minOptimal: 21.0,
        maxOptimal: 26.0,
        nominalRangeText: '21.0°C – 26.0°C',
        statusNote: 'Even thermal distribution across foliage',
      },
      ambientTemperature: {
        id: 'sens-at-03',
        name: 'Ambient Temperature',
        sensorModel: 'AHT25 Precision Digital',
        value: 24.2,
        unit: '°C',
        validity: 'valid',
        lastUpdated: '8s ago',
        minOptimal: 20.0,
        maxOptimal: 28.0,
        nominalRangeText: '20.0°C – 28.0°C',
        statusNote: 'Within optimal indoor growth parameters',
      },
      relativeHumidity: {
        id: 'sens-rh-03',
        name: 'Relative Humidity',
        sensorModel: 'AHT25 Precision Digital',
        value: 59.0,
        unit: '%',
        validity: 'valid',
        lastUpdated: '8s ago',
        minOptimal: 45.0,
        maxOptimal: 75.0,
        nominalRangeText: '45% – 75%',
        statusNote: 'Steady indoor phytotron humidity',
      },
      lightIntensity: {
        id: 'sens-li-03',
        name: 'Light Intensity',
        sensorModel: 'BH1750 Digital Ambient',
        value: 10200,
        unit: 'lux',
        validity: 'valid',
        lastUpdated: '8s ago',
        minOptimal: 5000,
        maxOptimal: 15000,
        nominalRangeText: '5,000 – 15,000 lux',
        statusNote: 'Filtered indirect light optimal for Epipremnum',
      },
    },
    physiologicalFingerprint: {
      baselineLeafDelta: -0.4,
      stressThresholdDelta: 1.6,
      transpirationEfficiency: 88.0,
      hoursBeforeVisualWilting: 28.0,
      diagnosis:
        'Moderate transpiration rate. Foliage turgor is optimal with steady moisture gradient in aerial and substrate roots.',
    },
  },
];

export const INITIAL_ENVIRONMENT: EnvironmentalConditions = {
  facilityName: 'Screening Chamber A-4',
  location: 'RootWhisper Botanical Phytotron Lab',
  ambientTemp: 24.2,
  ambientRh: 59.5,
  vpd: 1.22,
  parLightAvg: 373,
  dli: 16.1,
  co2Level: 440,
  airflowSpeed: 0.24,
  photoperiodHours: 14,
};

export const INITIAL_KPIS: KpiSummary = {
  plantsMonitored: 3,
  nodesOnline: 3,
  totalNodes: 3,
  activeScreenings: 3,
  dataCollectionHealth: 99.8,
  totalPacketsProcessedToday: 8640,
};

export const INITIAL_NODES: ESP32Node[] = [
  {
    nodeId: 'NODE_ESP32_01',
    assignedPlantId: 'tulsi-01',
    assignedPlantName: 'Tulsi (TULSI_01)',
    status: 'online',
    ipAddress: '192.168.10.141',
    macAddress: 'C8:F0:9E:81:4A:12',
    firmwareVersion: 'ESP-IDF v5.1-rw2.4',
    uptimeHours: 318,
    rssi: -58,
    batteryVoltage: 4.14,
    solarCharging: true,
    packetRate: '1 pkt / 10s',
    packetLoss: 0.12,
    sensors: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 I2C', status: 'healthy' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', status: 'healthy' },
      { name: 'Ambient Temp & RH', model: 'Sensirion SHT40', status: 'healthy' },
      { name: 'Ambient PAR Lux', model: 'ROHM BH1750', status: 'healthy' },
    ],
  },
  {
    nodeId: 'NODE_ESP32_02',
    assignedPlantId: 'hibiscus-01',
    assignedPlantName: 'Hibiscus (HIBISCUS_01)',
    status: 'online',
    ipAddress: '192.168.10.142',
    macAddress: 'C8:F0:9E:81:5B:34',
    firmwareVersion: 'ESP-IDF v5.1-rw2.4',
    uptimeHours: 412,
    rssi: -62,
    batteryVoltage: 4.08,
    solarCharging: true,
    packetRate: '1 pkt / 10s',
    packetLoss: 0.18,
    sensors: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 I2C', status: 'healthy' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', status: 'healthy' },
      { name: 'Ambient Temp & RH', model: 'Sensirion SHT40', status: 'healthy' },
      { name: 'Ambient PAR Lux', model: 'ROHM BH1750', status: 'healthy' },
    ],
  },
  {
    nodeId: 'NODE_ESP32_03',
    assignedPlantId: 'moneyplant-01',
    assignedPlantName: 'Money Plant (MONEYPLANT_01)',
    status: 'online',
    ipAddress: '192.168.10.143',
    macAddress: 'C8:F0:9E:81:6C:56',
    firmwareVersion: 'ESP-IDF v5.1-rw2.4',
    uptimeHours: 526,
    rssi: -54,
    batteryVoltage: 4.18,
    solarCharging: true,
    packetRate: '1 pkt / 10s',
    packetLoss: 0.08,
    sensors: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 I2C', status: 'healthy' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', status: 'healthy' },
      { name: 'Ambient Temp & RH', model: 'Sensirion SHT40', status: 'healthy' },
      { name: 'Ambient PAR Lux', model: 'ROHM BH1750', status: 'healthy' },
    ],
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: 'evt-01',
    timestamp: '11:04:12',
    plantId: 'tulsi-01',
    plantName: 'Tulsi_01',
    category: 'screening',
    severity: 'warning',
    message: 'Adaptive Fingerprint Alert: Leaf-to-air differential reached +2.6°C. CWSI index elevated to 0.64.',
    metric: 'CWSI: 0.64',
  },
  {
    id: 'evt-02',
    timestamp: '10:55:00',
    plantId: 'tulsi-01',
    plantName: 'Tulsi_01',
    category: 'screening',
    severity: 'nominal',
    message: 'Antigravity inference model confirmed early transpiration decay prior to physical leaf curling.',
    metric: 'ΔT: +2.6°C',
  },
  {
    id: 'evt-03',
    timestamp: '10:48:30',
    category: 'node',
    severity: 'nominal',
    message: 'Mesh synchronization routine executed for ESP32-01, ESP32-02, and ESP32-03. Zero packet loss.',
    metric: '3/3 Nodes Synced',
  },
  {
    id: 'evt-04',
    timestamp: '10:30:15',
    plantId: 'hibiscus-01',
    plantName: 'Hibiscus_01',
    category: 'screening',
    severity: 'nominal',
    message: 'Mid-morning peak transpiration scan logged. Latent heat flux optimal at -0.6°C cooling offset.',
    metric: 'CWSI: 0.18',
  },
  {
    id: 'evt-05',
    timestamp: '10:15:00',
    plantId: 'moneyplant-01',
    plantName: 'MoneyPlant_01',
    category: 'screening',
    severity: 'nominal',
    message: 'Substrate capacitive sensor calibrated to species root density profile.',
    metric: 'Moisture: 48.6%',
  },
  {
    id: 'evt-06',
    timestamp: '09:40:22',
    category: 'calibration',
    severity: 'nominal',
    message: 'Chamber SHT40 reference sensor recalibrated against hygrometric baseline.',
    metric: 'RH: 59.5%',
  },
];

export const SAMPLE_TIME_SERIES: TimeSeriesReading[] = [
  {
    timestamp: '2026-11-06T00:00:00Z',
    timeLabel: '00:00',
    tulsiMoisture: 42.0,
    tulsiLeafTemp: 21.0,
    tulsiDelta: -0.4,
    tulsiCwsi: 0.22,
    hibiscusMoisture: 68.0,
    hibiscusLeafTemp: 20.8,
    hibiscusDelta: -0.6,
    hibiscusCwsi: 0.12,
    moneyPlantMoisture: 52.0,
    moneyPlantLeafTemp: 21.2,
    moneyPlantDelta: -0.2,
    moneyPlantCwsi: 0.15,
    ambientTemp: 21.4,
    ambientRh: 68.0,
    lightLux: 0,
  },
  {
    timestamp: '2026-11-06T02:00:00Z',
    timeLabel: '02:00',
    tulsiMoisture: 41.2,
    tulsiLeafTemp: 20.5,
    tulsiDelta: -0.3,
    tulsiCwsi: 0.24,
    hibiscusMoisture: 67.4,
    hibiscusLeafTemp: 20.2,
    hibiscusDelta: -0.6,
    hibiscusCwsi: 0.12,
    moneyPlantMoisture: 51.5,
    moneyPlantLeafTemp: 20.6,
    moneyPlantDelta: -0.2,
    moneyPlantCwsi: 0.16,
    ambientTemp: 20.8,
    ambientRh: 70.0,
    lightLux: 0,
  },
  {
    timestamp: '2026-11-06T04:00:00Z',
    timeLabel: '04:00',
    tulsiMoisture: 40.5,
    tulsiLeafTemp: 20.1,
    tulsiDelta: -0.2,
    tulsiCwsi: 0.26,
    hibiscusMoisture: 66.8,
    hibiscusLeafTemp: 19.8,
    hibiscusDelta: -0.5,
    hibiscusCwsi: 0.14,
    moneyPlantMoisture: 51.0,
    moneyPlantLeafTemp: 20.1,
    moneyPlantDelta: -0.2,
    moneyPlantCwsi: 0.17,
    ambientTemp: 20.3,
    ambientRh: 72.0,
    lightLux: 0,
  },
  {
    timestamp: '2026-11-06T06:00:00Z',
    timeLabel: '06:00',
    tulsiMoisture: 39.8,
    tulsiLeafTemp: 21.5,
    tulsiDelta: 0.0,
    tulsiCwsi: 0.31,
    hibiscusMoisture: 66.1,
    hibiscusLeafTemp: 21.0,
    hibiscusDelta: -0.5,
    hibiscusCwsi: 0.15,
    moneyPlantMoisture: 50.4,
    moneyPlantLeafTemp: 21.3,
    moneyPlantDelta: -0.2,
    moneyPlantCwsi: 0.18,
    ambientTemp: 21.5,
    ambientRh: 66.0,
    lightLux: 120,
  },
  {
    timestamp: '2026-11-06T08:00:00Z',
    timeLabel: '08:00',
    tulsiMoisture: 38.5,
    tulsiLeafTemp: 23.8,
    tulsiDelta: +0.8,
    tulsiCwsi: 0.42,
    hibiscusMoisture: 65.2,
    hibiscusLeafTemp: 22.4,
    hibiscusDelta: -0.6,
    hibiscusCwsi: 0.16,
    moneyPlantMoisture: 49.8,
    moneyPlantLeafTemp: 22.9,
    moneyPlantDelta: -0.1,
    moneyPlantCwsi: 0.19,
    ambientTemp: 23.0,
    ambientRh: 63.0,
    lightLux: 280,
  },
  {
    timestamp: '2026-11-06T10:00:00Z',
    timeLabel: '10:00',
    tulsiMoisture: 36.4,
    tulsiLeafTemp: 25.9,
    tulsiDelta: +1.9,
    tulsiCwsi: 0.56,
    hibiscusMoisture: 64.0,
    hibiscusLeafTemp: 23.2,
    hibiscusDelta: -0.8,
    hibiscusCwsi: 0.17,
    moneyPlantMoisture: 49.1,
    moneyPlantLeafTemp: 23.9,
    moneyPlantDelta: -0.1,
    moneyPlantCwsi: 0.20,
    ambientTemp: 24.0,
    ambientRh: 60.5,
    lightLux: 460,
  },
  {
    timestamp: '2026-11-06T11:00:00Z',
    timeLabel: '11:00 (Current)',
    tulsiMoisture: 34.2,
    tulsiLeafTemp: 26.8,
    tulsiDelta: +2.6,
    tulsiCwsi: 0.64,
    hibiscusMoisture: 62.8,
    hibiscusLeafTemp: 23.4,
    hibiscusDelta: -0.6,
    hibiscusCwsi: 0.18,
    moneyPlantMoisture: 48.6,
    moneyPlantLeafTemp: 24.1,
    moneyPlantDelta: -0.1,
    moneyPlantCwsi: 0.22,
    ambientTemp: 24.2,
    ambientRh: 58.4,
    lightLux: 520,
  },
];

export interface PlantSensorHistoryPoint {
  timeLabel: string;
  soilMoisture: number; // %
  leafTemperature: number; // °C
  ambientTemperature: number; // °C
  relativeHumidity: number; // %
  lightIntensity: number; // lux
  expectedLeafTemp: number; // °C
  temperatureResidual: number; // °C
  adaptiveThreshold: number; // °C
}

export function getPlantSensorHistory(
  plantId: string,
  timeframe: '1h' | '24h' | '7d' | '30d'
): PlantSensorHistoryPoint[] {
  const isTulsi = plantId === 'tulsi-01';
  const isHibiscus = plantId === 'hibiscus-01';

  if (timeframe === '1h') {
    return [
      { timeLabel: '10:00', soilMoisture: isTulsi ? 34.5 : isHibiscus ? 63.2 : 48.9, leafTemperature: isTulsi ? 26.4 : isHibiscus ? 23.3 : 24.0, ambientTemperature: 24.1, relativeHumidity: 59.2, lightIntensity: isTulsi ? 18000 : isHibiscus ? 24000 : 10000, expectedLeafTemp: isTulsi ? 23.1 : isHibiscus ? 23.4 : 24.0, temperatureResidual: isTulsi ? 3.3 : isHibiscus ? -0.1 : 0.0, adaptiveThreshold: 1.8 },
      { timeLabel: '10:10', soilMoisture: isTulsi ? 34.4 : isHibiscus ? 63.1 : 48.8, leafTemperature: isTulsi ? 26.5 : isHibiscus ? 23.3 : 24.0, ambientTemperature: 24.1, relativeHumidity: 59.0, lightIntensity: isTulsi ? 18200 : isHibiscus ? 24200 : 10100, expectedLeafTemp: isTulsi ? 23.1 : isHibiscus ? 23.4 : 24.0, temperatureResidual: isTulsi ? 3.4 : isHibiscus ? -0.1 : 0.0, adaptiveThreshold: 1.8 },
      { timeLabel: '10:20', soilMoisture: isTulsi ? 34.4 : isHibiscus ? 63.0 : 48.8, leafTemperature: isTulsi ? 26.6 : isHibiscus ? 23.4 : 24.1, ambientTemperature: 24.2, relativeHumidity: 58.8, lightIntensity: isTulsi ? 18350 : isHibiscus ? 24500 : 10150, expectedLeafTemp: isTulsi ? 23.2 : isHibiscus ? 23.5 : 24.0, temperatureResidual: isTulsi ? 3.4 : isHibiscus ? -0.1 : 0.1, adaptiveThreshold: 1.8 },
      { timeLabel: '10:30', soilMoisture: isTulsi ? 34.3 : isHibiscus ? 62.9 : 48.7, leafTemperature: isTulsi ? 26.7 : isHibiscus ? 23.4 : 24.1, ambientTemperature: 24.2, relativeHumidity: 58.6, lightIntensity: isTulsi ? 18400 : isHibiscus ? 24650 : 10180, expectedLeafTemp: isTulsi ? 23.2 : isHibiscus ? 23.5 : 24.0, temperatureResidual: isTulsi ? 3.5 : isHibiscus ? -0.1 : 0.1, adaptiveThreshold: 1.8 },
      { timeLabel: '10:40', soilMoisture: isTulsi ? 34.3 : isHibiscus ? 62.9 : 48.7, leafTemperature: isTulsi ? 26.7 : isHibiscus ? 23.4 : 24.1, ambientTemperature: 24.2, relativeHumidity: 58.5, lightIntensity: isTulsi ? 18420 : isHibiscus ? 24750 : 10200, expectedLeafTemp: isTulsi ? 23.2 : isHibiscus ? 23.5 : 24.0, temperatureResidual: isTulsi ? 3.5 : isHibiscus ? -0.1 : 0.1, adaptiveThreshold: 1.8 },
      { timeLabel: '10:50', soilMoisture: isTulsi ? 34.2 : isHibiscus ? 62.8 : 48.6, leafTemperature: isTulsi ? 26.8 : isHibiscus ? 23.4 : 24.1, ambientTemperature: 24.2, relativeHumidity: 58.4, lightIntensity: isTulsi ? 18450 : isHibiscus ? 24800 : 10200, expectedLeafTemp: isTulsi ? 23.2 : isHibiscus ? 23.5 : 24.0, temperatureResidual: isTulsi ? 3.6 : isHibiscus ? -0.1 : 0.1, adaptiveThreshold: 1.8 },
    ];
  }

  if (timeframe === '24h') {
    return [
      { timeLabel: '00:00', soilMoisture: isTulsi ? 42.0 : isHibiscus ? 68.0 : 52.0, leafTemperature: isTulsi ? 21.0 : isHibiscus ? 20.8 : 21.2, ambientTemperature: 21.4, relativeHumidity: 68.0, lightIntensity: 0, expectedLeafTemp: 21.3, temperatureResidual: isTulsi ? -0.3 : -0.5, adaptiveThreshold: 1.8 },
      { timeLabel: '03:00', soilMoisture: isTulsi ? 41.0 : isHibiscus ? 67.2 : 51.4, leafTemperature: isTulsi ? 20.3 : isHibiscus ? 20.0 : 20.4, ambientTemperature: 20.6, relativeHumidity: 71.0, lightIntensity: 0, expectedLeafTemp: 20.5, temperatureResidual: isTulsi ? -0.2 : -0.5, adaptiveThreshold: 1.8 },
      { timeLabel: '06:00', soilMoisture: isTulsi ? 39.8 : isHibiscus ? 66.1 : 50.4, leafTemperature: isTulsi ? 21.5 : isHibiscus ? 21.0 : 21.3, ambientTemperature: 21.5, relativeHumidity: 66.0, lightIntensity: 3500, expectedLeafTemp: 21.4, temperatureResidual: isTulsi ? 0.1 : -0.4, adaptiveThreshold: 1.8 },
      { timeLabel: '09:00', soilMoisture: isTulsi ? 37.5 : isHibiscus ? 64.6 : 49.5, leafTemperature: isTulsi ? 24.8 : isHibiscus ? 22.8 : 23.4, ambientTemperature: 23.5, relativeHumidity: 61.5, lightIntensity: 14500, expectedLeafTemp: 22.9, temperatureResidual: isTulsi ? 1.9 : -0.1, adaptiveThreshold: 1.8 },
      { timeLabel: '12:00', soilMoisture: isTulsi ? 34.2 : isHibiscus ? 62.8 : 48.6, leafTemperature: isTulsi ? 26.8 : isHibiscus ? 23.4 : 24.1, ambientTemperature: 24.2, relativeHumidity: 58.4, lightIntensity: isTulsi ? 18450 : isHibiscus ? 24800 : 10200, expectedLeafTemp: 23.2, temperatureResidual: isTulsi ? 3.6 : -0.1, adaptiveThreshold: 1.8 },
      { timeLabel: '15:00', soilMoisture: isTulsi ? 33.6 : isHibiscus ? 61.5 : 47.9, leafTemperature: isTulsi ? 27.2 : isHibiscus ? 23.8 : 24.4, ambientTemperature: 24.5, relativeHumidity: 57.0, lightIntensity: 17200, expectedLeafTemp: 23.6, temperatureResidual: isTulsi ? 3.6 : -0.2, adaptiveThreshold: 1.8 },
      { timeLabel: '18:00', soilMoisture: isTulsi ? 33.1 : isHibiscus ? 60.8 : 47.5, leafTemperature: isTulsi ? 25.1 : isHibiscus ? 22.9 : 23.6, ambientTemperature: 23.8, relativeHumidity: 62.0, lightIntensity: 6200, expectedLeafTemp: 23.2, temperatureResidual: isTulsi ? 1.9 : -0.3, adaptiveThreshold: 1.8 },
      { timeLabel: '21:00', soilMoisture: isTulsi ? 32.8 : isHibiscus ? 60.2 : 47.2, leafTemperature: isTulsi ? 22.4 : isHibiscus ? 21.8 : 22.1, ambientTemperature: 22.4, relativeHumidity: 65.0, lightIntensity: 0, expectedLeafTemp: 22.2, temperatureResidual: isTulsi ? 0.2 : -0.4, adaptiveThreshold: 1.8 },
    ];
  }

  if (timeframe === '7d') {
    return [
      { timeLabel: 'Nov 01', soilMoisture: isTulsi ? 58.0 : isHibiscus ? 72.0 : 56.0, leafTemperature: 22.6, ambientTemperature: 23.5, relativeHumidity: 64.0, lightIntensity: 16500, expectedLeafTemp: 22.8, temperatureResidual: -0.2, adaptiveThreshold: 1.8 },
      { timeLabel: 'Nov 02', soilMoisture: isTulsi ? 52.4 : isHibiscus ? 69.5 : 54.2, leafTemperature: 22.8, ambientTemperature: 23.6, relativeHumidity: 63.5, lightIntensity: 17100, expectedLeafTemp: 22.9, temperatureResidual: -0.1, adaptiveThreshold: 1.8 },
      { timeLabel: 'Nov 03', soilMoisture: isTulsi ? 47.0 : isHibiscus ? 67.2 : 52.8, leafTemperature: 23.2, ambientTemperature: 23.8, relativeHumidity: 62.0, lightIntensity: 17800, expectedLeafTemp: 23.1, temperatureResidual: 0.1, adaptiveThreshold: 1.8 },
      { timeLabel: 'Nov 04', soilMoisture: isTulsi ? 41.5 : isHibiscus ? 65.0 : 51.0, leafTemperature: 23.9, ambientTemperature: 23.9, relativeHumidity: 61.0, lightIntensity: 18000, expectedLeafTemp: 23.2, temperatureResidual: 0.7, adaptiveThreshold: 1.8 },
      { timeLabel: 'Nov 05', soilMoisture: isTulsi ? 37.2 : isHibiscus ? 63.8 : 49.5, leafTemperature: 25.1, ambientTemperature: 24.0, relativeHumidity: 59.8, lightIntensity: 18200, expectedLeafTemp: 23.2, temperatureResidual: 1.9, adaptiveThreshold: 1.8 },
      { timeLabel: 'Nov 06', soilMoisture: isTulsi ? 34.8 : isHibiscus ? 63.0 : 48.8, leafTemperature: 26.5, ambientTemperature: 24.2, relativeHumidity: 58.6, lightIntensity: 18400, expectedLeafTemp: 23.2, temperatureResidual: 3.3, adaptiveThreshold: 1.8 },
      { timeLabel: 'Nov 07', soilMoisture: isTulsi ? 34.2 : isHibiscus ? 62.8 : 48.6, leafTemperature: isTulsi ? 26.8 : 23.4, ambientTemperature: 24.2, relativeHumidity: 58.4, lightIntensity: 18450, expectedLeafTemp: 23.2, temperatureResidual: isTulsi ? 3.6 : -0.1, adaptiveThreshold: 1.8 },
    ];
  }

  // 30d
  return [
    { timeLabel: 'Oct 09', soilMoisture: 65.0, leafTemperature: 22.4, ambientTemperature: 23.2, relativeHumidity: 65.0, lightIntensity: 16000, expectedLeafTemp: 22.6, temperatureResidual: -0.2, adaptiveThreshold: 1.8 },
    { timeLabel: 'Oct 14', soilMoisture: 52.0, leafTemperature: 22.8, ambientTemperature: 23.4, relativeHumidity: 63.0, lightIntensity: 16500, expectedLeafTemp: 22.8, temperatureResidual: 0.0, adaptiveThreshold: 1.8 },
    { timeLabel: 'Oct 19 (Watered)', soilMoisture: 72.0, leafTemperature: 22.1, ambientTemperature: 23.1, relativeHumidity: 66.0, lightIntensity: 17000, expectedLeafTemp: 22.4, temperatureResidual: -0.3, adaptiveThreshold: 1.8 },
    { timeLabel: 'Oct 24', soilMoisture: 58.4, leafTemperature: 22.7, ambientTemperature: 23.5, relativeHumidity: 64.0, lightIntensity: 17200, expectedLeafTemp: 22.9, temperatureResidual: -0.2, adaptiveThreshold: 1.8 },
    { timeLabel: 'Oct 29', soilMoisture: 46.0, leafTemperature: 23.4, ambientTemperature: 23.7, relativeHumidity: 62.0, lightIntensity: 17500, expectedLeafTemp: 23.1, temperatureResidual: 0.3, adaptiveThreshold: 1.8 },
    { timeLabel: 'Nov 03', soilMoisture: 68.0, leafTemperature: 22.3, ambientTemperature: 23.3, relativeHumidity: 65.0, lightIntensity: 18000, expectedLeafTemp: 22.6, temperatureResidual: -0.3, adaptiveThreshold: 1.8 },
    { timeLabel: 'Nov 07 (Current)', soilMoisture: isTulsi ? 34.2 : isHibiscus ? 62.8 : 48.6, leafTemperature: isTulsi ? 26.8 : isHibiscus ? 23.4 : 24.1, ambientTemperature: 24.2, relativeHumidity: 58.4, lightIntensity: isTulsi ? 18450 : isHibiscus ? 24800 : 10200, expectedLeafTemp: 23.2, temperatureResidual: isTulsi ? 3.6 : -0.1, adaptiveThreshold: 1.8 },
  ];
}

// ----------------------------------------------------------------------------
// ANALYTICS DATA REGISTRY (SAMPLE DATA)
// ----------------------------------------------------------------------------

export interface PlantComparisonMetric {
  sensorName: string;
  unit: string;
  tulsiVal: number;
  hibiscusVal: number;
  moneyPlantVal: number;
  chamberRefVal?: number;
  sensorModel: string;
  varianceNote: string;
}

export const PLANT_COMPARISON_MATRIX: PlantComparisonMetric[] = [
  {
    sensorName: 'Soil Moisture',
    unit: '%',
    tulsiVal: 34.2,
    hibiscusVal: 62.8,
    moneyPlantVal: 48.6,
    sensorModel: 'Capacitive Soil Probe v1.2',
    varianceNote: 'Tulsi near threshold (30%); Hibiscus well hydrated',
  },
  {
    sensorName: 'Leaf Temperature',
    unit: '°C',
    tulsiVal: 26.8,
    hibiscusVal: 23.4,
    moneyPlantVal: 24.1,
    chamberRefVal: 24.2,
    sensorModel: 'MLX90614 Contactless IR',
    varianceNote: 'Tulsi +2.6°C elevated; Hibiscus cooling normally at -0.8°C',
  },
  {
    sensorName: 'Ambient Temperature',
    unit: '°C',
    tulsiVal: 24.2,
    hibiscusVal: 24.0,
    moneyPlantVal: 24.2,
    chamberRefVal: 24.2,
    sensorModel: 'AHT25 Precision Digital',
    varianceNote: 'Microclimate gradient variance < 0.2°C across chambers',
  },
  {
    sensorName: 'Relative Humidity',
    unit: '%',
    tulsiVal: 58.4,
    hibiscusVal: 61.2,
    moneyPlantVal: 59.0,
    chamberRefVal: 59.5,
    sensorModel: 'AHT25 Precision Digital',
    varianceNote: 'Boundary layer transpirational moisture highest near Hibiscus',
  },
  {
    sensorName: 'Light Intensity',
    unit: 'lux',
    tulsiVal: 18450,
    hibiscusVal: 24800,
    moneyPlantVal: 10200,
    chamberRefVal: 17800,
    sensorModel: 'BH1750 Digital Ambient',
    varianceNote: 'Differential canopy exposure tailored to species photoperiod',
  },
];

export interface EnvironmentalCorrelationPoint {
  index: number;
  label: string;
  ambientTemp: number; // °C
  leafTemp: number; // °C
  humidity: number; // %
  lightLux: number; // lux
  soilMoisture: number; // %
  cwsiScore: number; // 0.00 - 1.00
  plant: string;
}

export const SAMPLE_ENVIRONMENTAL_CORRELATIONS: EnvironmentalCorrelationPoint[] = [
  { index: 1, label: '06:00 Light Rise', ambientTemp: 21.0, leafTemp: 20.6, humidity: 70.0, lightLux: 3500, soilMoisture: 42.0, cwsiScore: 0.15, plant: 'Tulsi' },
  { index: 2, label: '07:30 Transpiration Ramp', ambientTemp: 22.2, leafTemp: 21.8, humidity: 67.5, lightLux: 8200, soilMoisture: 40.5, cwsiScore: 0.22, plant: 'Tulsi' },
  { index: 3, label: '09:00 Stomatal Tension', ambientTemp: 23.4, leafTemp: 24.2, humidity: 63.0, lightLux: 14500, soilMoisture: 38.0, cwsiScore: 0.38, plant: 'Tulsi' },
  { index: 4, label: '10:30 Evap Deficit', ambientTemp: 24.0, leafTemp: 25.8, humidity: 60.0, lightLux: 17800, soilMoisture: 35.8, cwsiScore: 0.54, plant: 'Tulsi' },
  { index: 5, label: '12:00 Thermal Onset', ambientTemp: 24.2, leafTemp: 26.8, humidity: 58.4, lightLux: 18450, soilMoisture: 34.2, cwsiScore: 0.64, plant: 'Tulsi' },
  { index: 6, label: '13:30 Peak Solar Load', ambientTemp: 24.5, leafTemp: 27.4, humidity: 56.5, lightLux: 19100, soilMoisture: 33.5, cwsiScore: 0.72, plant: 'Tulsi' },
  { index: 7, label: '15:00 Sustained Stress', ambientTemp: 24.6, leafTemp: 27.1, humidity: 57.2, lightLux: 16800, soilMoisture: 33.1, cwsiScore: 0.68, plant: 'Tulsi' },
  { index: 8, label: '16:30 Twilight Recovery', ambientTemp: 23.9, leafTemp: 25.0, humidity: 61.0, lightLux: 9500, soilMoisture: 32.9, cwsiScore: 0.45, plant: 'Tulsi' },
];

export interface PersistentAnomalyPeriod {
  id: string;
  plantId: string;
  plantName: string;
  startTime: string;
  duration: string;
  peakResidual: number; // °C
  adaptiveThreshold: number; // °C
  severity: 'mild' | 'moderate' | 'critical';
  status: 'active' | 'resolved' | 'investigating';
  interpretation: string;
}

export const SAMPLE_ANOMALY_PERIODS: PersistentAnomalyPeriod[] = [
  {
    id: 'ANOM-2026-084',
    plantId: 'tulsi-01',
    plantName: 'Tulsi (TULSI_01)',
    startTime: 'Today 08:45 UTC',
    duration: '2h 35m (ongoing)',
    peakResidual: 3.6,
    adaptiveThreshold: 1.8,
    severity: 'moderate',
    status: 'active',
    interpretation: 'Persistent stomatal constriction with leaf ΔT +3.6°C above expected baseline under 18,450 lux load.',
  },
  {
    id: 'ANOM-2026-079',
    plantId: 'tulsi-01',
    plantName: 'Tulsi (TULSI_01)',
    startTime: 'Yesterday 14:10 UTC',
    duration: '1h 15m',
    peakResidual: 2.2,
    adaptiveThreshold: 1.8,
    severity: 'mild',
    status: 'resolved',
    interpretation: 'Transient afternoon transpiration restriction resolved following photoperiod ramp-down.',
  },
  {
    id: 'ANOM-2026-071',
    plantId: 'hibiscus-01',
    plantName: 'Hibiscus (HIBISCUS_01)',
    startTime: 'Nov 04 11:20 UTC',
    duration: '22 min',
    peakResidual: 1.6,
    adaptiveThreshold: 1.5,
    severity: 'mild',
    status: 'resolved',
    interpretation: 'Localized canopy irradiance flux caused minor thermal transient; auto-regulated via latent cooling.',
  },
  {
    id: 'ANOM-2026-063',
    plantId: 'moneyplant-01',
    plantName: 'Money Plant (MONEYPLANT_01)',
    startTime: 'Nov 02 09:30 UTC',
    duration: '45 min',
    peakResidual: 1.7,
    adaptiveThreshold: 1.6,
    severity: 'mild',
    status: 'resolved',
    interpretation: 'Substrate capacitive settle time post top-watering; baseline recalibrated seamlessly.',
  },
];

export interface ScreeningDistributionItem {
  name: string;
  percentage: number;
  sampleCount: number;
  color: string;
}

export const SCREENING_OUTCOME_DISTRIBUTION: ScreeningDistributionItem[] = [
  { name: 'Optimal Turgor (CWSI < 0.3)', percentage: 68.4, sampleCount: 5912, color: '#245640' },
  { name: 'Mild Water-Stress (0.3 - 0.7)', percentage: 22.8, sampleCount: 1970, color: '#C58A35' },
  { name: 'Critical Water Deficit (> 0.7)', percentage: 4.8, sampleCount: 414, color: '#C95D58' },
  { name: 'Calibration / Diurnal Rest', percentage: 4.0, sampleCount: 344, color: '#A8BDA8' },
];

export type ScreeningOutcomeCategory = 'NORMAL' | 'WATCH' | 'POSSIBLE WATER STRESS' | 'INCONCLUSIVE';

export interface ScreeningHistoryRecord {
  id: string;
  timestamp: string;
  plantId: string;
  plantCode: string;
  plantName: string;
  outcome: ScreeningOutcomeCategory;
  expectedLeafTemp: number | null; // °C
  observedLeafTemp: number | null; // °C
  residual: number | null; // °C
  soilMoistureEvidence: number | null; // % (Separate supporting evidence, not an input)
  ambientTemp: number; // °C (prediction input)
  relativeHumidity: number; // % (prediction input)
  lightIntensity: number; // lux (prediction input)
  dataQuality: 'Valid' | 'Stale' | 'Unreliable (Sensor Fault)' | 'Missing (Node Offline)';
  notes: string;
}

export const SAMPLE_SCREENING_HISTORY: ScreeningHistoryRecord[] = [
  {
    id: 'SCR-2026-1107-001',
    timestamp: 'Today 11:00 UTC',
    plantId: 'tulsi-01',
    plantCode: 'TULSI_01',
    plantName: 'Tulsi',
    outcome: 'POSSIBLE WATER STRESS',
    expectedLeafTemp: 23.2,
    observedLeafTemp: 26.8,
    residual: 3.6,
    soilMoistureEvidence: 34.2,
    ambientTemp: 24.2,
    relativeHumidity: 58.4,
    lightIntensity: 18450,
    dataQuality: 'Valid',
    notes: 'Persistent positive leaf temperature residual (+3.6°C) for >2h coupled with substrate moisture at 34.2% approaching wilting threshold.',
  },
  {
    id: 'SCR-2026-1107-002',
    timestamp: 'Today 10:45 UTC',
    plantId: 'hibiscus-01',
    plantCode: 'HIBISCUS_01',
    plantName: 'Hibiscus',
    outcome: 'NORMAL',
    expectedLeafTemp: 23.5,
    observedLeafTemp: 23.4,
    residual: -0.1,
    soilMoistureEvidence: 62.8,
    ambientTemp: 24.0,
    relativeHumidity: 61.2,
    lightIntensity: 24800,
    dataQuality: 'Valid',
    notes: 'Observed leaf temperature aligns with energy-balance expectations (-0.1°C residual). Effective transpirational cooling confirmed.',
  },
  {
    id: 'SCR-2026-1107-003',
    timestamp: 'Today 10:30 UTC',
    plantId: 'moneyplant-01',
    plantCode: 'MONEYPLANT_01',
    plantName: 'Money Plant',
    outcome: 'NORMAL',
    expectedLeafTemp: 24.0,
    observedLeafTemp: 24.1,
    residual: 0.1,
    soilMoistureEvidence: 48.6,
    ambientTemp: 24.2,
    relativeHumidity: 59.0,
    lightIntensity: 10200,
    dataQuality: 'Valid',
    notes: 'Thermal residual within ±0.2°C nominal envelope. Moderate transpiration maintains foliar turgor.',
  },
  {
    id: 'SCR-2026-1107-004',
    timestamp: 'Today 09:15 UTC',
    plantId: 'tulsi-01',
    plantCode: 'TULSI_01',
    plantName: 'Tulsi',
    outcome: 'WATCH',
    expectedLeafTemp: 22.9,
    observedLeafTemp: 24.8,
    residual: 1.9,
    soilMoistureEvidence: 37.5,
    ambientTemp: 23.5,
    relativeHumidity: 61.5,
    lightIntensity: 14500,
    dataQuality: 'Valid',
    notes: 'Residual exceeded adaptive baseline threshold (+1.8°C) transiently for 25 mins. Flagged for temporal persistence screening.',
  },
  {
    id: 'SCR-2026-1106-005',
    timestamp: 'Yesterday 16:30 UTC',
    plantId: 'tulsi-01',
    plantCode: 'TULSI_01',
    plantName: 'Tulsi',
    outcome: 'INCONCLUSIVE',
    expectedLeafTemp: null,
    observedLeafTemp: null,
    residual: null,
    soilMoistureEvidence: null,
    ambientTemp: 24.0,
    relativeHumidity: 60.0,
    lightIntensity: 12000,
    dataQuality: 'Missing (Node Offline)',
    notes: 'ESP32 Wi-Fi mesh beacon dropped packets during scheduled chamber maintenance. Insufficient data to execute screening pipeline.',
  },
  {
    id: 'SCR-2026-1106-006',
    timestamp: 'Yesterday 14:00 UTC',
    plantId: 'hibiscus-01',
    plantCode: 'HIBISCUS_01',
    plantName: 'Hibiscus',
    outcome: 'WATCH',
    expectedLeafTemp: 23.8,
    observedLeafTemp: 25.4,
    residual: 1.6,
    soilMoistureEvidence: 64.0,
    ambientTemp: 24.5,
    relativeHumidity: 57.0,
    lightIntensity: 26000,
    dataQuality: 'Valid',
    notes: 'High PAR illumination spike caused minor foliar thermal rise; resolved within 20 mins without soil moisture depletion.',
  },
  {
    id: 'SCR-2026-1105-007',
    timestamp: 'Nov 05 08:00 UTC',
    plantId: 'moneyplant-01',
    plantCode: 'MONEYPLANT_01',
    plantName: 'Money Plant',
    outcome: 'INCONCLUSIVE',
    expectedLeafTemp: 23.4,
    observedLeafTemp: 32.5,
    residual: null,
    soilMoistureEvidence: 50.2,
    ambientTemp: 23.6,
    relativeHumidity: 62.0,
    lightIntensity: 9800,
    dataQuality: 'Unreliable (Sensor Fault)',
    notes: 'MLX90614 sensor returned impossible +32.5°C reading due to optical obstruction. Data validation pipeline rejected measurement.',
  },
];

