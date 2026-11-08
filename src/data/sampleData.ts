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
    nodeStatus: 'offline',
    hardwareStatus: 'WAITING FOR FIRST DATA',
    hasReceivedData: false,
    illustrationUrl: '/src/assets/images/botanical_tulsi_1794035216143.jpg',
    stressLevel: 'calibrating',
    stressIndex: 0.0,
    soilMoisture: null,
    soilMoistureThreshold: 35.0,
    leafTemperature: null,
    ambientTemperature: null,
    temperatureDelta: null,
    relativeHumidity: null,
    lightIntensity: null,
    parIntensity: 0,
    vpd: null,
    transpirationRate: 'nominal',
    stomatalConductanceProxy: 0,
    lastUpdated: 'Waiting for node data',
    lastUpdatedSecondsAgo: 999999,
    batteryVoltage: 0,
    wifiRssi: 0,
    baselineStatusText: 'Awaiting sensor stream from hardware',
    aiBaseline: {
      expectedLeafTemp: 0,
      observedLeafTemp: 0,
      temperatureResidual: 0,
      adaptiveThreshold: 2.0,
      baselineLearningStatus: 'calibrating',
      learningProgressPercent: 0,
      convergenceDays: 0,
      totalTrainingPoints: 0,
      confidenceInterval: 'Pending calibration',
      stomataResponseState: 'open',
      summaryInsight: 'Waiting for sensor data. Connect your ESP32 node to start live monitoring.',
    },
    sensors: {
      soilMoisture: {
        id: 'sens-sm-01',
        name: 'Soil Moisture',
        sensorModel: 'Capacitive Soil Probe v1.2',
        value: null,
        unit: '%',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 35.0,
        maxOptimal: 70.0,
        nominalRangeText: '35% – 70%',
        statusNote: 'Awaiting first telemetry packet',
      },
      leafTemperature: {
        id: 'sens-lt-01',
        name: 'Leaf Temperature',
        sensorModel: 'MLX90614 Contactless IR',
        value: null,
        unit: '°C',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 21.0,
        maxOptimal: 25.5,
        nominalRangeText: '21.0°C – 25.5°C',
        statusNote: 'Awaiting first telemetry packet',
      },
      ambientTemperature: {
        id: 'sens-at-01',
        name: 'Ambient Temperature',
        sensorModel: 'AHT25 Precision Digital',
        value: null,
        unit: '°C',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 20.0,
        maxOptimal: 28.0,
        nominalRangeText: '20.0°C – 28.0°C',
        statusNote: 'Awaiting first telemetry packet',
      },
      relativeHumidity: {
        id: 'sens-rh-01',
        name: 'Relative Humidity',
        sensorModel: 'AHT25 Precision Digital',
        value: null,
        unit: '%',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 50.0,
        maxOptimal: 75.0,
        nominalRangeText: '50% – 75%',
        statusNote: 'Awaiting first telemetry packet',
      },
      lightIntensity: {
        id: 'sens-li-01',
        name: 'Light Intensity',
        sensorModel: 'BH1750 Digital Ambient',
        value: null,
        unit: 'lux',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 10000,
        maxOptimal: 25000,
        nominalRangeText: '10,000 – 25,000 lux',
        statusNote: 'Awaiting first telemetry packet',
      },
    },
    physiologicalFingerprint: {
      baselineLeafDelta: 0,
      stressThresholdDelta: 2.0,
      transpirationEfficiency: 0,
      hoursBeforeVisualWilting: 0,
      diagnosis: 'Waiting for sensor data. Connect your ESP32 node to start live monitoring.',
    },
  },
  {
    id: 'hibiscus-01',
    code: 'HIBISCUS_01',
    commonName: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    family: 'Malvaceae',
    nodeId: 'NODE_ESP32_02',
    nodeStatus: 'offline',
    hardwareStatus: 'WAITING FOR FIRST DATA',
    hasReceivedData: false,
    illustrationUrl: '/src/assets/images/botanical_hibiscus_1794035218495.jpg',
    stressLevel: 'calibrating',
    stressIndex: 0.0,
    soilMoisture: null,
    soilMoistureThreshold: 40.0,
    leafTemperature: null,
    ambientTemperature: null,
    temperatureDelta: null,
    relativeHumidity: null,
    lightIntensity: null,
    parIntensity: 0,
    vpd: null,
    transpirationRate: 'nominal',
    stomatalConductanceProxy: 0,
    lastUpdated: 'Waiting for node data',
    lastUpdatedSecondsAgo: 999999,
    batteryVoltage: 0,
    wifiRssi: 0,
    baselineStatusText: 'Awaiting sensor stream from hardware',
    aiBaseline: {
      expectedLeafTemp: 0,
      observedLeafTemp: 0,
      temperatureResidual: 0,
      adaptiveThreshold: 1.0,
      baselineLearningStatus: 'calibrating',
      learningProgressPercent: 0,
      convergenceDays: 0,
      totalTrainingPoints: 0,
      confidenceInterval: 'Pending calibration',
      stomataResponseState: 'open',
      summaryInsight: 'Waiting for sensor data. Connect your ESP32 node to start live monitoring.',
    },
    sensors: {
      soilMoisture: {
        id: 'sens-sm-02',
        name: 'Soil Moisture',
        sensorModel: 'Capacitive Soil Probe v1.2',
        value: null,
        unit: '%',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 40.0,
        maxOptimal: 80.0,
        nominalRangeText: '40% – 80%',
        statusNote: 'Awaiting first telemetry packet',
      },
      leafTemperature: {
        id: 'sens-lt-02',
        name: 'Leaf Temperature',
        sensorModel: 'MLX90614 Contactless IR',
        value: null,
        unit: '°C',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 21.0,
        maxOptimal: 25.0,
        nominalRangeText: '21.0°C – 25.0°C',
        statusNote: 'Awaiting first telemetry packet',
      },
      ambientTemperature: {
        id: 'sens-at-02',
        name: 'Ambient Temperature',
        sensorModel: 'AHT25 Precision Digital',
        value: null,
        unit: '°C',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 20.0,
        maxOptimal: 28.0,
        nominalRangeText: '20.0°C – 28.0°C',
        statusNote: 'Awaiting first telemetry packet',
      },
      relativeHumidity: {
        id: 'sens-rh-02',
        name: 'Relative Humidity',
        sensorModel: 'AHT25 Precision Digital',
        value: null,
        unit: '%',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 50.0,
        maxOptimal: 75.0,
        nominalRangeText: '50% – 75%',
        statusNote: 'Awaiting first telemetry packet',
      },
      lightIntensity: {
        id: 'sens-li-02',
        name: 'Light Intensity',
        sensorModel: 'BH1750 Digital Ambient',
        value: null,
        unit: 'lux',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 15000,
        maxOptimal: 35000,
        nominalRangeText: '15,000 – 35,000 lux',
        statusNote: 'Awaiting first telemetry packet',
      },
    },
    physiologicalFingerprint: {
      baselineLeafDelta: 0,
      stressThresholdDelta: 1.0,
      transpirationEfficiency: 0,
      hoursBeforeVisualWilting: 0,
      diagnosis: 'Waiting for sensor data. Connect your ESP32 node to start live monitoring.',
    },
  },
  {
    id: 'moneyplant-01',
    code: 'MONEYPLANT_01',
    commonName: 'Money Plant (Golden Pothos)',
    scientificName: 'Epipremnum aureum',
    family: 'Araceae',
    nodeId: 'NODE_ESP32_03',
    nodeStatus: 'offline',
    hardwareStatus: 'WAITING FOR FIRST DATA',
    hasReceivedData: false,
    illustrationUrl: '/src/assets/images/botanical_moneyplant_1794035219075.jpg',
    stressLevel: 'calibrating',
    stressIndex: 0.0,
    soilMoisture: null,
    soilMoistureThreshold: 35.0,
    leafTemperature: null,
    ambientTemperature: null,
    temperatureDelta: null,
    relativeHumidity: null,
    lightIntensity: null,
    parIntensity: 0,
    vpd: null,
    transpirationRate: 'nominal',
    stomatalConductanceProxy: 0,
    lastUpdated: 'Waiting for node data',
    lastUpdatedSecondsAgo: 999999,
    batteryVoltage: 0,
    wifiRssi: 0,
    baselineStatusText: 'Awaiting sensor stream from hardware',
    aiBaseline: {
      expectedLeafTemp: 0,
      observedLeafTemp: 0,
      temperatureResidual: 0,
      adaptiveThreshold: 1.5,
      baselineLearningStatus: 'calibrating',
      learningProgressPercent: 0,
      convergenceDays: 0,
      totalTrainingPoints: 0,
      confidenceInterval: 'Pending calibration',
      stomataResponseState: 'open',
      summaryInsight: 'Waiting for sensor data. Connect your ESP32 node to start live monitoring.',
    },
    sensors: {
      soilMoisture: {
        id: 'sens-sm-03',
        name: 'Soil Moisture',
        sensorModel: 'Capacitive Soil Probe v1.2',
        value: null,
        unit: '%',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 35.0,
        maxOptimal: 70.0,
        nominalRangeText: '35% – 70%',
        statusNote: 'Awaiting first telemetry packet',
      },
      leafTemperature: {
        id: 'sens-lt-03',
        name: 'Leaf Temperature',
        sensorModel: 'MLX90614 Contactless IR',
        value: null,
        unit: '°C',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 21.0,
        maxOptimal: 26.0,
        nominalRangeText: '21.0°C – 26.0°C',
        statusNote: 'Awaiting first telemetry packet',
      },
      ambientTemperature: {
        id: 'sens-at-03',
        name: 'Ambient Temperature',
        sensorModel: 'AHT25 Precision Digital',
        value: null,
        unit: '°C',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 20.0,
        maxOptimal: 28.0,
        nominalRangeText: '20.0°C – 28.0°C',
        statusNote: 'Awaiting first telemetry packet',
      },
      relativeHumidity: {
        id: 'sens-rh-03',
        name: 'Relative Humidity',
        sensorModel: 'AHT25 Precision Digital',
        value: null,
        unit: '%',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 45.0,
        maxOptimal: 75.0,
        nominalRangeText: '45% – 75%',
        statusNote: 'Awaiting first telemetry packet',
      },
      lightIntensity: {
        id: 'sens-li-03',
        name: 'Light Intensity',
        sensorModel: 'BH1750 Digital Ambient',
        value: null,
        unit: 'lux',
        validity: 'unavailable',
        lastUpdated: 'Awaiting data',
        minOptimal: 5000,
        maxOptimal: 15000,
        nominalRangeText: '5,000 – 15,000 lux',
        statusNote: 'Awaiting first telemetry packet',
      },
    },
    physiologicalFingerprint: {
      baselineLeafDelta: 0,
      stressThresholdDelta: 1.5,
      transpirationEfficiency: 0,
      hoursBeforeVisualWilting: 0,
      diagnosis: 'Waiting for sensor data. Connect your ESP32 node to start live monitoring.',
    },
  },
];

export const INITIAL_ENVIRONMENT: EnvironmentalConditions = {
  facilityName: 'RootWhisper Growth Station',
  location: 'Specimen Array A-4',
  ambientTemp: null,
  ambientRh: null,
  vpd: null,
  parLightAvg: null,
  dli: null,
  co2Level: null,
  airflowSpeed: null,
  photoperiodHours: null,
};

export const INITIAL_KPIS: KpiSummary = {
  plantsMonitored: 3,
  nodesOnline: 0,
  totalNodes: 3,
  activeScreenings: 0,
  dataCollectionHealth: 0,
  totalPacketsProcessedToday: 0,
};

export const INITIAL_NODES: ESP32Node[] = [
  {
    nodeId: 'NODE_ESP32_01',
    assignedPlantId: 'tulsi-01',
    assignedPlantName: 'Tulsi (TULSI_01)',
    status: 'offline',
    ipAddress: 'N/A',
    macAddress: 'N/A',
    firmwareVersion: 'RootWhisper-ESP32 v2.4 (ESP-IDF v5.1)',
    uptimeHours: 0,
    rssi: null,
    batteryVoltage: null,
    solarCharging: false,
    packetRate: '0 pkt/s',
    packetLoss: 0,
    sensors: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 Analog', status: 'offline' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', status: 'offline' },
      { name: 'Ambient Temp & RH', model: 'AHT25 Precision Digital', status: 'offline' },
      { name: 'Ambient Light Sensor', model: 'BH1750 Digital Lux', status: 'offline' },
    ],
  },
  {
    nodeId: 'NODE_ESP32_02',
    assignedPlantId: 'hibiscus-01',
    assignedPlantName: 'Hibiscus (HIBISCUS_01)',
    status: 'offline',
    ipAddress: 'N/A',
    macAddress: 'N/A',
    firmwareVersion: 'RootWhisper-ESP32 v2.4 (ESP-IDF v5.1)',
    uptimeHours: 0,
    rssi: null,
    batteryVoltage: null,
    solarCharging: false,
    packetRate: '0 pkt/s',
    packetLoss: 0,
    sensors: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 Analog', status: 'offline' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', status: 'offline' },
      { name: 'Ambient Temp & RH', model: 'AHT25 Precision Digital', status: 'offline' },
      { name: 'Ambient Light Sensor', model: 'BH1750 Digital Lux', status: 'offline' },
    ],
  },
  {
    nodeId: 'NODE_ESP32_03',
    assignedPlantId: 'moneyplant-01',
    assignedPlantName: 'Money Plant (MONEYPLANT_01)',
    status: 'offline',
    ipAddress: 'N/A',
    macAddress: 'N/A',
    firmwareVersion: 'RootWhisper-ESP32 v2.4 (ESP-IDF v5.1)',
    uptimeHours: 0,
    rssi: null,
    batteryVoltage: null,
    solarCharging: false,
    packetRate: '0 pkt/s',
    packetLoss: 0,
    sensors: [
      { name: 'Soil Capacitive Probe', model: 'Chirp v1.2 Analog', status: 'offline' },
      { name: 'Infrared Leaf Thermometer', model: 'MLX90614 Contactless', status: 'offline' },
      { name: 'Ambient Temp & RH', model: 'AHT25 Precision Digital', status: 'offline' },
      { name: 'Ambient Light Sensor', model: 'BH1750 Digital Lux', status: 'offline' },
    ],
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [];

export const SAMPLE_TIME_SERIES: TimeSeriesReading[] = [];

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

export const PLANT_COMPARISON_MATRIX: PlantComparisonMetric[] = [];

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

export const SAMPLE_ENVIRONMENTAL_CORRELATIONS: EnvironmentalCorrelationPoint[] = [];

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

export const SAMPLE_ANOMALY_PERIODS: PersistentAnomalyPeriod[] = [];

export interface ScreeningDistributionItem {
  name: string;
  percentage: number;
  sampleCount: number;
  color: string;
}

export const SCREENING_OUTCOME_DISTRIBUTION: ScreeningDistributionItem[] = [];

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

export const SAMPLE_SCREENING_HISTORY: ScreeningHistoryRecord[] = [];

