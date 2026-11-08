/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StressLevel = 'nominal' | 'mild_stress' | 'high_stress' | 'calibrating';
export type DataValidityState = 'valid' | 'stale' | 'invalid' | 'unavailable';

export interface SensorMetricDetail {
  id: string;
  name: string;
  sensorModel: string;
  value: number | null;
  unit: string;
  validity: DataValidityState;
  lastUpdated: string;
  minOptimal?: number;
  maxOptimal?: number;
  nominalRangeText: string;
  statusNote?: string;
}

export interface AiBaselineStats {
  expectedLeafTemp: number; // °C calculated from baseline model
  observedLeafTemp: number; // °C from MLX90614
  temperatureResidual: number; // T_observed - T_expected (°C)
  adaptiveThreshold: number; // °C trigger threshold
  baselineLearningStatus: 'converged' | 'adapting' | 'calibrating';
  learningProgressPercent: number; // e.g. 96%
  convergenceDays: number;
  totalTrainingPoints: number;
  confidenceInterval: string;
  stomataResponseState: 'open' | 'restricting' | 'closed';
  summaryInsight: string;
}

export type HardwareNodeState = 'ONLINE' | 'OFFLINE' | 'WAITING FOR FIRST DATA' | 'STALE' | 'CONNECTION ERROR';

export interface PlantTelemetry {
  id: string;
  code: string;
  commonName: string;
  scientificName: string;
  family: string;
  nodeId: string;
  nodeStatus: 'online' | 'offline' | 'degraded';
  hardwareStatus?: HardwareNodeState;
  hasReceivedData?: boolean;
  illustrationUrl: string;
  stressLevel: StressLevel;
  stressIndex: number; // 0.00 to 1.00 (Crop Water Stress Index - CWSI)
  soilMoisture: number | null; // percentage % (null when awaiting data)
  soilMoistureThreshold: number; // %
  leafTemperature: number | null; // °C (radiometric IR, null when awaiting data)
  ambientTemperature: number | null; // °C (null when awaiting data)
  temperatureDelta: number | null; // T_leaf - T_ambient (°C)
  relativeHumidity: number | null; // % (null when awaiting data)
  lightIntensity: number | null; // lux (BH1750, null when awaiting data)
  parIntensity?: number; // µmol/m²/s
  vpd: number | null; // Vapor Pressure Deficit (kPa)
  transpirationRate: 'nominal' | 'restricted' | 'depressed';
  stomatalConductanceProxy: number; // mmol/m²s
  lastUpdated: string;
  lastUpdatedSecondsAgo: number;
  batteryVoltage: number; // V
  wifiRssi: number; // dBm
  baselineStatusText: string;
  aiBaseline: AiBaselineStats;
  sensors: {
    soilMoisture: SensorMetricDetail;
    leafTemperature: SensorMetricDetail;
    ambientTemperature: SensorMetricDetail;
    relativeHumidity: SensorMetricDetail;
    lightIntensity: SensorMetricDetail;
  };
  physiologicalFingerprint: {
    baselineLeafDelta: number; // Expected delta under full hydration
    stressThresholdDelta: number; // Delta threshold marking stomatal closure
    transpirationEfficiency: number; // %
    hoursBeforeVisualWilting: number; // Early detection lead time
    diagnosis: string;
  };
}

export interface EnvironmentalConditions {
  facilityName: string;
  location: string;
  ambientTemp: number | null; // °C
  ambientRh: number | null; // %
  vpd: number | null; // kPa
  parLightAvg: number | null; // µmol/m²/s
  dli: number | null; // Daily Light Integral (mol/m²/day)
  co2Level: number | null; // ppm
  airflowSpeed: number | null; // m/s
  photoperiodHours: number | null;
}

export interface TimeSeriesReading {
  timestamp: string;
  timeLabel: string;
  // Tulsi
  tulsiMoisture: number;
  tulsiLeafTemp: number;
  tulsiDelta: number;
  tulsiCwsi: number;
  // Hibiscus
  hibiscusMoisture: number;
  hibiscusLeafTemp: number;
  hibiscusDelta: number;
  hibiscusCwsi: number;
  // Money Plant
  moneyPlantMoisture: number;
  moneyPlantLeafTemp: number;
  moneyPlantDelta: number;
  moneyPlantCwsi: number;
  // Ambient
  ambientTemp: number;
  ambientRh: number;
  lightLux: number;
}

export interface ESP32Node {
  nodeId: string;
  assignedPlantId: string;
  assignedPlantName: string;
  status: 'online' | 'offline' | 'low_power';
  ipAddress: string;
  macAddress: string;
  firmwareVersion: string;
  uptimeHours: number;
  rssi: number | null; // dBm
  batteryVoltage: number | null; // V
  solarCharging: boolean;
  packetRate: string; // e.g. "1 pkt / 10s"
  packetLoss: number; // %
  sensors: {
    name: string;
    model: string;
    status: 'healthy' | 'warning' | 'error' | 'offline';
  }[];
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  plantId?: string;
  plantName?: string;
  category: 'screening' | 'node' | 'irrigation' | 'calibration';
  severity: 'nominal' | 'warning' | 'alert';
  message: string;
  metric?: string;
}

export interface KpiSummary {
  plantsMonitored: number;
  nodesOnline: number;
  totalNodes: number;
  activeScreenings: number;
  dataCollectionHealth: number; // %
  totalPacketsProcessedToday: number;
}

export interface NodeDiagnostic {
  nodeId: 'TULSI_01' | 'HIBISCUS_01' | 'MONEYPLANT_01';
  assignedPlantId: string;
  assignedPlantName: string;
  scientificName: string;
  boardModel: string;
  mcuArchitecture: string;
  status: 'online' | 'offline' | 'degraded' | 'stale';
  ipAddress: string;
  macAddress: string;
  firmwareVersion: string;
  uptimeFormatted: string;
  uptimeSeconds: number;
  rssi: number;
  batteryVoltage: number;
  busSupplyVoltage: number;
  solarCharging: boolean;
  lastSeenTimestamp: string;
  lastSeenSecondsAgo: number;
  freshnessStatus: 'fresh' | 'nominal' | 'stale' | 'critical';
  packetsTransmitted: number;
  packetsReceived: number;
  packetsDropped: number;
  packetLossPercent: number;
  crcErrors: number;
  heapFreeKb: number;
  sensorModules: {
    name: string;
    model: string;
    busInterface: string;
    status: 'healthy' | 'warning' | 'error' | 'offline';
  }[];
}

export interface SensorChannelDiagnostic {
  id: string;
  nodeId: 'TULSI_01' | 'HIBISCUS_01' | 'MONEYPLANT_01';
  sensorName: string;
  sensorModel: string;
  measurementType: 'Soil Moisture' | 'Leaf Temperature' | 'Ambient Temperature' | 'Relative Humidity' | 'Light Intensity';
  busInterface: string;
  reading: number | null;
  unit: string;
  rawReading: string;
  validity: DataValidityState;
  diagnosticStatus: string;
  lastUpdate: string;
  lastUpdateSecondsAgo: number;
  nominalRange: string;
  calibration: {
    status: 'calibrated' | 'verification_due' | 'uncalibrated' | 'error';
    method: string;
    date: string;
    offset: string;
  };
}

export interface CommunicationErrorRecord {
  id: string;
  timestamp: string;
  nodeId: 'TULSI_01' | 'HIBISCUS_01' | 'MONEYPLANT_01';
  severity: 'nominal' | 'warning' | 'critical';
  errorType: string;
  description: string;
  sequenceNumber?: number;
  rawHex?: string;
  resolved: boolean;
}

