/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * REPORTS SAMPLE DATA REGISTRY
 * ----------------------------------------------------------------------------
 * Sample datasets and statistical aggregations for the five RootWhisper report categories:
 *   1. Plant Monitoring Report
 *   2. Sensor Data History Report
 *   3. AI Screening Report
 *   4. Environmental Trend Report
 *   5. Node Diagnostics Report
 * 
 * Explicitly labeled as SAMPLE DATA decoupled from backend.
 */

export type ReportCategory =
  | 'plant-monitoring'
  | 'sensor-history'
  | 'ai-screening'
  | 'environmental-trend'
  | 'node-diagnostics';

export interface ReportConfig {
  id: ReportCategory;
  title: string;
  subtitle: string;
  description: string;
  sampleNotice: string;
}

export const REPORT_CATEGORIES: ReportConfig[] = [
  {
    id: 'plant-monitoring',
    title: 'Plant Monitoring & Physiological Report',
    subtitle: 'Species-aware transpiration dynamics and Crop Water Stress Index (CWSI)',
    description: 'Detailed analysis of leaf-to-air thermal gradient, soil moisture depletion rates, and stomatal conductance proxies across monitored plants.',
    sampleNotice: 'SAMPLE REPORT · DATA DERIVED FROM SYNTHETIC BENCHMARK BUFFER',
  },
  {
    id: 'sensor-history',
    title: 'Sensor Data History & Telemetry Audit',
    subtitle: 'High-density multi-channel time-series readings and statistical distributions',
    description: 'Historical records for capacitive soil moisture, MLX90614 IR leaf temperature, AHT25 ambient temperature/humidity, and BH1750 lux.',
    sampleNotice: 'SAMPLE REPORT · DATA DERIVED FROM SYNTHETIC BENCHMARK BUFFER',
  },
  {
    id: 'ai-screening',
    title: 'AI Early Water-Stress Screening Report',
    subtitle: 'Adaptive physiological baseline residuals and evidence fusion audit',
    description: 'Comprehensive review of Random Forest expected leaf temperature predictions, temperature residual thresholds, and temporal persistence.',
    sampleNotice: 'SAMPLE REPORT · MODEL OUTPUT DERIVED FROM ANTIGRAVITY SPEC',
  },
  {
    id: 'environmental-trend',
    title: 'Chamber Environmental Microclimate Report',
    subtitle: 'Phytotron vapor pressure deficit (VPD), photoperiod DLI, and stability analysis',
    description: 'Audit of ambient atmospheric boundary conditions, diurnal thermal cycles, relative humidity equilibrium, and airflow distribution.',
    sampleNotice: 'SAMPLE REPORT · FACILITY DATA DERIVED FROM CHAMBER A-4 SIMULATION',
  },
  {
    id: 'node-diagnostics',
    title: 'ESP32 Hardware Fleet Diagnostics Report',
    subtitle: 'Edge device packet reliability, Wi-Fi mesh signal, and sensor calibration status',
    description: 'Hardware health audit across TULSI_01, HIBISCUS_01, and MONEYPLANT_01 DevKit V1 nodes including I2C bus error rates and battery rails.',
    sampleNotice: 'SAMPLE REPORT · HARDWARE METRICS DERIVED FROM ESP-IDF TELEMETRY LOG',
  },
];

// Sample aggregated statistical summary metrics for each report category
export const REPORT_SUMMARIES = {
  'plant-monitoring': [
    { label: 'Monitored Species', value: '3 Plants', subtext: 'Tulsi, Hibiscus, Money Plant', change: '100% active' },
    { label: 'Mean Soil Moisture', value: '48.5%', subtext: 'Min: 34.2% · Max: 62.8%', change: 'Nominal reserve' },
    { label: 'Avg Foliage Delta (ΔT)', value: '+0.56°C', subtext: 'T_leaf - T_ambient', change: '1 in mild restriction' },
    { label: 'Mean CWSI Score', value: '0.347', subtext: 'Scale: 0.00 – 1.00', change: 'Tulsi elevated (0.64)' },
  ],
  'sensor-history': [
    { label: 'Total Telemetry Points', value: '162,660', subtext: '5 channels × 3 nodes × 10,844', change: '99.88% valid' },
    { label: 'Data Validity Rate', value: '99.85%', subtext: '0.12% dropped or stale', change: 'Meets ISO 17025' },
    { label: 'Soil Moisture Range', value: '32.1% – 64.5%', subtext: 'Capacitive analog probe v1.2', change: '±0.8% accuracy' },
    { label: 'Leaf Temp Range', value: '22.8°C – 27.4°C', subtext: 'MLX90614 Contactless IR', change: 'Zero unhandled faults' },
  ],
  'ai-screening': [
    { label: 'Total Screenings Evaluated', value: '864 runs', subtext: '15-minute evaluation cadence', change: '100% coverage' },
    { label: 'Normal Classifications', value: '712 (82.4%)', subtext: 'Baseline homeostasis intact', change: 'Stable' },
    { label: 'Watch State Period', value: '104 (12.0%)', subtext: 'Transient thermal divergence', change: 'Monitored' },
    { label: 'Possible Water Stress', value: '48 (5.6%)', subtext: 'Persistent residual on Tulsi', change: 'Hydration flagged' },
  ],
  'environmental-trend': [
    { label: 'Mean Chamber VPD', value: '1.24 kPa', subtext: 'Target: 0.90 – 1.40 kPa', change: 'Optimal transpiration' },
    { label: 'Daily Light Integral (DLI)', value: '16.2 mol/m²', subtext: '14-hour photoperiod', change: '373 µmol/m²/s PAR' },
    { label: 'Ambient Temperature', value: '24.2°C', subtext: 'Std Dev: ±0.34°C', change: 'Chamber PID locked' },
    { label: 'Relative Humidity', value: '59.2%', subtext: 'Std Dev: ±1.8%', change: 'Steady boundary' },
  ],
  'node-diagnostics': [
    { label: 'Fleet Online Nodes', value: '3 / 3 Nodes', subtext: 'ESP32 DevKit V1 Xtensa LX6', change: '100% online' },
    { label: 'Aggregate Packet Delivery', value: '99.88%', subtext: '186 dropped of 162.6k', change: 'High reliability' },
    { label: 'Average Wi-Fi RSSI', value: '-58.0 dBm', subtext: 'Phytotron-Mesh 802.11 b/g/n', change: 'Excellent carrier' },
    { label: 'Sensors Calibrated', value: '12 / 12 units', subtext: '4 sensors × 3 DevKit nodes', change: 'Certified valid' },
  ],
};

// Detailed Table Rows for each report category
export const REPORT_TABLE_ROWS = {
  'plant-monitoring': [
    {
      plant: 'Tulsi (Ocimum tenuiflorum)',
      nodeId: 'TULSI_01',
      moisture: '34.2%',
      leafTemp: '26.8°C',
      ambientTemp: '24.2°C',
      delta: '+2.6°C',
      cwsi: '0.64',
      status: 'Mild Water Stress',
      actionNeeded: 'Targeted root-zone micro-irrigation advised (15-20 min pulse)',
    },
    {
      plant: 'Hibiscus (Hibiscus rosa-sinensis)',
      nodeId: 'HIBISCUS_01',
      moisture: '62.8%',
      leafTemp: '23.4°C',
      ambientTemp: '24.2°C',
      delta: '-0.8°C',
      cwsi: '0.18',
      status: 'Optimal Hydration',
      actionNeeded: 'None. Steady latent heat dissipation and transpiration rate',
    },
    {
      plant: 'Money Plant (Epipremnum aureum)',
      nodeId: 'MONEYPLANT_01',
      moisture: '48.6%',
      leafTemp: '24.1°C',
      ambientTemp: '24.2°C',
      delta: '-0.1°C',
      cwsi: '0.22',
      status: 'Optimal Hydration',
      actionNeeded: 'None. Balanced foliage turgor and xylem hydraulic conductivity',
    },
  ],
  'sensor-history': [
    {
      channel: 'Soil Moisture (%)',
      model: 'Capacitive Probe v1.2',
      mean: '48.5%',
      min: '34.2%',
      max: '62.8%',
      stdDev: '±11.4%',
      dataValidity: '99.92% Valid',
      status: 'Calibrated',
    },
    {
      channel: 'Leaf Temperature (°C)',
      model: 'MLX90614 Contactless IR',
      mean: '24.8°C',
      min: '23.1°C',
      max: '27.1°C',
      stdDev: '±1.42°C',
      dataValidity: '99.88% Valid',
      status: 'Calibrated (ε=0.98)',
    },
    {
      channel: 'Ambient Temperature (°C)',
      model: 'AHT25 Precision Digital',
      mean: '24.2°C',
      min: '23.8°C',
      max: '24.6°C',
      stdDev: '±0.28°C',
      dataValidity: '99.98% Valid',
      status: 'Factory Calibrated',
    },
    {
      channel: 'Relative Humidity (%)',
      model: 'AHT25 Precision Digital',
      mean: '58.8%',
      min: '56.2%',
      max: '61.4%',
      stdDev: '±1.65%',
      dataValidity: '99.98% Valid',
      status: 'Factory Calibrated',
    },
    {
      channel: 'Light Intensity (lux)',
      model: 'BH1750 Digital Ambient',
      mean: '18,480 lx',
      min: '0 lx (Dark)',
      max: '26,800 lx',
      stdDev: '±8,420 lx',
      dataValidity: '99.95% Valid',
      status: 'Cosine Calibrated',
    },
  ],
  'ai-screening': [
    {
      timestamp: '2026-11-06 23:15:00',
      plant: 'Tulsi (TULSI_01)',
      tExpected: '23.2°C',
      tObserved: '26.8°C',
      residual: '+3.6°C',
      threshold: '+1.8°C',
      persistence: '90 mins (6 consecutive checks)',
      soilMoistureEvidence: '34.2% (Approaching wilting point)',
      outcome: 'POSSIBLE WATER STRESS',
    },
    {
      timestamp: '2026-11-06 23:15:00',
      plant: 'Hibiscus (HIBISCUS_01)',
      tExpected: '23.6°C',
      tObserved: '23.4°C',
      residual: '-0.2°C',
      threshold: '+1.5°C',
      persistence: 'None',
      soilMoistureEvidence: '62.8% (Substantial reserve)',
      outcome: 'NORMAL',
    },
    {
      timestamp: '2026-11-06 23:15:00',
      plant: 'Money Plant (MONEYPLANT_01)',
      tExpected: '24.0°C',
      tObserved: '24.1°C',
      residual: '+0.1°C',
      threshold: '+1.6°C',
      persistence: 'None',
      soilMoistureEvidence: '48.6% (Optimal substrate)',
      outcome: 'NORMAL',
    },
    {
      timestamp: '2026-11-06 21:00:00',
      plant: 'Tulsi (TULSI_01)',
      tExpected: '23.4°C',
      tObserved: '25.3°C',
      residual: '+1.9°C',
      threshold: '+1.8°C',
      persistence: '30 mins (2 consecutive checks)',
      soilMoistureEvidence: '36.8% (Adequate)',
      outcome: 'WATCH',
    },
  ],
  'environmental-trend': [
    {
      period: 'Photoperiod Day (06:00 – 20:00)',
      ambientTemp: '24.2°C – 24.6°C',
      humidity: '57.5% – 59.8%',
      vpd: '1.20 – 1.28 kPa',
      parLight: '380 µmol/m²/s',
      co2: '445 ppm',
      airflow: '0.24 m/s',
      evaluation: 'Optimal for active transpiration and photosynthesis',
    },
    {
      period: 'Dark Period Night (20:00 – 06:00)',
      ambientTemp: '21.4°C – 21.8°C',
      humidity: '66.0% – 68.5%',
      vpd: '0.82 – 0.90 kPa',
      parLight: '0 µmol/m²/s',
      co2: '510 ppm',
      airflow: '0.15 m/s',
      evaluation: 'Nominal dark respiration; low hydraulic tension on xylem',
    },
  ],
  'node-diagnostics': [
    {
      nodeId: 'TULSI_01',
      mac: 'C8:F0:9E:81:4A:12',
      board: 'ESP32 DevKit V1',
      uptime: '13d 6h 18m',
      txPackets: '54,220',
      rxPackets: '54,162',
      dropped: '58 (0.107%)',
      rssi: '-58 dBm',
      voltage: '4.14V / 3.32V LDO',
      busHealth: 'I2C ACK OK (0x5A, 0x38, 0x23)',
    },
    {
      nodeId: 'HIBISCUS_01',
      mac: 'C8:F0:9E:81:5B:34',
      board: 'ESP32 DevKit V1',
      uptime: '17d 4h 12m',
      txPackets: '54,220',
      rxPackets: '54,124',
      dropped: '96 (0.177%)',
      rssi: '-62 dBm',
      voltage: '4.08V / 3.31V LDO',
      busHealth: 'I2C ACK OK (0x5A, 0x38, 0x23)',
    },
    {
      nodeId: 'MONEYPLANT_01',
      mac: 'C8:F0:9E:81:6C:58',
      board: 'ESP32 DevKit V1',
      uptime: '9d 19h 45m',
      txPackets: '54,220',
      rxPackets: '54,188',
      dropped: '32 (0.059%)',
      rssi: '-54 dBm',
      voltage: '4.18V / 3.33V LDO',
      busHealth: 'I2C ACK OK (0x5A, 0x38, 0x23)',
    },
  ],
};

// Historical chart data for Report Preview
export const REPORT_CHART_SERIES = [
  { time: '00:00', tulsiDelta: -0.4, hibiscusDelta: -0.8, moneyDelta: -0.2, vpd: 0.85, par: 0 },
  { time: '04:00', tulsiDelta: -0.2, hibiscusDelta: -0.9, moneyDelta: -0.3, vpd: 0.88, par: 0 },
  { time: '08:00', tulsiDelta: 0.6, hibiscusDelta: -0.7, moneyDelta: -0.1, vpd: 1.12, par: 180 },
  { time: '12:00', tulsiDelta: 2.1, hibiscusDelta: -0.6, moneyDelta: 0.1, vpd: 1.34, par: 395 },
  { time: '14:00', tulsiDelta: 2.8, hibiscusDelta: -0.7, moneyDelta: 0.0, vpd: 1.41, par: 420 },
  { time: '16:00', tulsiDelta: 2.6, hibiscusDelta: -0.8, moneyDelta: -0.1, vpd: 1.35, par: 360 },
  { time: '18:00', tulsiDelta: 1.8, hibiscusDelta: -0.8, moneyDelta: -0.2, vpd: 1.20, par: 210 },
  { time: '20:00', tulsiDelta: 0.5, hibiscusDelta: -0.9, moneyDelta: -0.3, vpd: 0.95, par: 0 },
  { time: '22:00', tulsiDelta: 0.1, hibiscusDelta: -0.9, moneyDelta: -0.3, vpd: 0.88, par: 0 },
];

/**
 * Generate CSV text payload from active report category and table data
 */
export function generateReportCsv(
  category: ReportCategory,
  plantFilter: string,
  dateRange: string
): string {
  const metaHeader = [
    `# ROOTWHISPER RESEARCH REPORT`,
    `# Category: ${category.toUpperCase()}`,
    `# Plant Filter: ${plantFilter.toUpperCase()}`,
    `# Date Range: ${dateRange}`,
    `# Facility: RootWhisper Botanical Phytotron Lab (Chamber A-4)`,
    `# Generated At: ${new Date().toISOString()}`,
    `# Status: SAMPLE DATA - FOR DEMONSTRATION & ANTIGRAVITY SPEC VERIFICATION ONLY`,
    ``,
  ].join('\n');

  if (category === 'plant-monitoring') {
    const headers = 'Plant,NodeID,SoilMoisture,LeafTemp,AmbientTemp,DeltaT,CWSI,Status,ActionRequired';
    const rows = REPORT_TABLE_ROWS['plant-monitoring'].map((r) =>
      `"${r.plant}","${r.nodeId}","${r.moisture}","${r.leafTemp}","${r.ambientTemp}","${r.delta}","${r.cwsi}","${r.status}","${r.actionNeeded}"`
    );
    return metaHeader + headers + '\n' + rows.join('\n');
  }

  if (category === 'sensor-history') {
    const headers = 'Channel,SensorModel,MeanValue,MinValue,MaxValue,StdDev,DataValidity,CalibrationStatus';
    const rows = REPORT_TABLE_ROWS['sensor-history'].map((r) =>
      `"${r.channel}","${r.model}","${r.mean}","${r.min}","${r.max}","${r.stdDev}","${r.dataValidity}","${r.status}"`
    );
    return metaHeader + headers + '\n' + rows.join('\n');
  }

  if (category === 'ai-screening') {
    const headers = 'Timestamp,Plant,T_Expected,T_Observed,Residual,AdaptiveThreshold,PersistenceDuration,SoilMoistureEvidence,ScreeningOutcome';
    const rows = REPORT_TABLE_ROWS['ai-screening'].map((r) =>
      `"${r.timestamp}","${r.plant}","${r.tExpected}","${r.tObserved}","${r.residual}","${r.threshold}","${r.persistence}","${r.soilMoistureEvidence}","${r.outcome}"`
    );
    return metaHeader + headers + '\n' + rows.join('\n');
  }

  if (category === 'environmental-trend') {
    const headers = 'Period,AmbientTempRange,HumidityRange,VpdRange,PAR_Light,CO2_ppm,Airflow_m_s,PhysiologicalEvaluation';
    const rows = REPORT_TABLE_ROWS['environmental-trend'].map((r) =>
      `"${r.period}","${r.ambientTemp}","${r.humidity}","${r.vpd}","${r.parLight}","${r.co2}","${r.airflow}","${r.evaluation}"`
    );
    return metaHeader + headers + '\n' + rows.join('\n');
  }

  // node-diagnostics
  const headers = 'NodeID,MacAddress,HardwareBoard,Uptime,TxPackets,RxPackets,DroppedPackets,WiFi_RSSI,PowerRail,I2CBusHealth';
  const rows = REPORT_TABLE_ROWS['node-diagnostics'].map((r) =>
    `"${r.nodeId}","${r.mac}","${r.board}","${r.uptime}","${r.txPackets}","${r.rxPackets}","${r.dropped}","${r.rssi}","${r.voltage}","${r.busHealth}"`
  );
  return metaHeader + headers + '\n' + rows.join('\n');
}
