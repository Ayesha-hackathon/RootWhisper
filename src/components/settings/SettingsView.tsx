/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Sliders,
  Sprout,
  Activity,
  Clock,
  Cpu,
  Database,
  Info,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldCheck,
  Server,
  Zap,
  Leaf,
  Thermometer,
  Droplets,
  Sun,
  AlertCircle,
} from 'lucide-react';

interface SettingsViewProps {
  onBackToDashboard: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBackToDashboard }) => {
  // Navigation active tab inside settings
  const [activeSection, setActiveSection] = useState<string>('plant-config');

  // Area 1: Plant Configuration State
  const [plantsConfig, setPlantsConfig] = useState([
    {
      id: 'tulsi-01',
      code: 'TULSI_01',
      commonName: 'Tulsi (Holy Basil)',
      scientificName: 'Ocimum tenuiflorum',
      nodeId: 'NODE_ESP32_01',
      monitoringStatus: 'active',
      soilThreshold: 30,
    },
    {
      id: 'hibiscus-01',
      code: 'HIBISCUS_01',
      commonName: 'Hibiscus',
      scientificName: 'Hibiscus rosa-sinensis',
      nodeId: 'NODE_ESP32_02',
      monitoringStatus: 'active',
      soilThreshold: 45,
    },
    {
      id: 'moneyplant-01',
      code: 'MONEYPLANT_01',
      commonName: 'Money Plant (Golden Pothos)',
      scientificName: 'Epipremnum aureum',
      nodeId: 'NODE_ESP32_03',
      monitoringStatus: 'active',
      soilThreshold: 35,
    },
  ]);

  // Area 2: Sensor Configuration State
  const [tempUnit, setTempUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [lightUnit, setLightUnit] = useState<'lux' | 'par'>('lux');
  const [emissivityCoefficient, setEmissivityCoefficient] = useState<number>(0.98);
  const [capacitiveCalibDry, setCapacitiveCalibDry] = useState<number>(3120);
  const [capacitiveCalibWet, setCapacitiveCalibWet] = useState<number>(1450);

  // Area 3: Monitoring Configuration State
  const [samplingInterval, setSamplingInterval] = useState<string>('5 minutes');
  const [dashboardRefreshRate, setDashboardRefreshRate] = useState<string>('8 seconds');
  const [dataRetentionDays, setDataRetentionDays] = useState<string>('90 days');
  const [autoDliCalculation, setAutoDliCalculation] = useState<boolean>(true);

  // Area 4: AI Configuration State
  const [modelName, setModelName] = useState<string>('Random Forest Foliar Regression v2.4');
  const [adaptiveThreshold, setAdaptiveThreshold] = useState<number>(1.8);
  const [persistenceWindowMins, setPersistenceWindowMins] = useState<number>(60);
  const [screeningSensitivity, setScreeningSensitivity] = useState<'standard' | 'high' | 'conservative'>('standard');
  const [decoupleSoilFeature, setDecoupleSoilFeature] = useState<boolean>(true);

  // Area 5: System Configuration State
  const [backendAddress, setBackendAddress] = useState<string>('https://antigravity.rootwhisper.internal:8443/api/v1');
  const [mqttBrokerUrl, setMqttBrokerUrl] = useState<string>('mqtts://mesh-broker.phytotron.internal:8883');
  const [apiConnectionStatus, setApiConnectionStatus] = useState<string>('Ready for Antigravity');
  const [appVersion] = useState<string>('v2.4.1 (ESP32-S3 Mesh)');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Honest Save Handler
  const handleSave = (sectionName: string) => {
    showToast(`Saved ${sectionName} to local prototype state. Ready for Google Antigravity backend synchronization.`);
  };

  // Reset defaults handler
  const handleResetDefaults = () => {
    setSamplingInterval('5 minutes');
    setDashboardRefreshRate('8 seconds');
    setDataRetentionDays('90 days');
    setAdaptiveThreshold(1.8);
    setPersistenceWindowMins(60);
    setScreeningSensitivity('standard');
    showToast('Reset configuration to default research benchmarks.');
  };

  const navSections = [
    { id: 'plant-config', label: '1. Plant Configuration', icon: Sprout },
    { id: 'sensor-config', label: '2. Sensor Configuration', icon: Activity },
    { id: 'monitoring-config', label: '3. Monitoring & Telemetry', icon: Clock },
    { id: 'ai-config', label: '4. AI Screening Model', icon: Sliders },
    { id: 'system-config', label: '5. System & Backend', icon: Server },
    { id: 'about-rootwhisper', label: '6. About RootWhisper', icon: Info },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#173F32] text-[#F8F8F4] text-xs font-medium shadow-lg border border-[#A8BDA8]/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A8BDA8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#E5EBE3] hover:border-[#173F32] bg-white text-xs font-medium text-[#173F32] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#78847C]">
            <span>System</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#173F32] font-semibold">Settings & Configuration</span>
          </div>
        </div>

        <button
          onClick={handleResetDefaults}
          className="self-start sm:self-auto flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#E5EBE3] hover:border-[#173F32] bg-white text-xs font-medium text-[#78847C] hover:text-[#173F32] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#173F32] via-[#245640] to-[#173F32] text-[#F8F8F4] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#A8BDA8] font-mono">
              <Sliders className="w-4 h-4 text-[#A8BDA8]" />
              <span>Phytotron Chamber A-4 Control Plane</span>
              <span aria-hidden="true">·</span>
              <span>Antigravity Integration Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              System Settings & Calibration
            </h1>
            <p className="text-xs sm:text-sm text-[#EEF3ED]/90 leading-relaxed">
              Configure species thresholds, sensor measurement ranges, 5-minute sampling rates, adaptive AI sensitivity, and edge backend communication endpoints.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0 font-mono text-xs">
            <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A8BDA8]" />
              <span>Antigravity Engine Decoupled</span>
            </div>
            <div className="text-[11px] text-[#A8BDA8] text-right">
              ESP-IDF v5.1 Protocol
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Settings Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-1">
          <div className="p-3 bg-white rounded-xl border border-[#E5EBE3] shadow-xs space-y-1">
            <span className="text-[10px] font-semibold text-[#78847C] uppercase tracking-wider block px-3 py-1.5">
              Configuration Areas
            </span>
            {navSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EEF3ED] text-[#173F32] font-semibold shadow-xs'
                      : 'text-[#26342D] hover:bg-[#F8F8F4] hover:text-[#173F32]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#173F32]' : 'text-[#78847C]'
                    }`}
                  />
                  <span className="truncate">{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Antigravity Sync Status Notice Box */}
          <div className="p-4 rounded-xl bg-[#EEF3ED]/60 border border-[#E5EBE3] text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-[#173F32] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#245640]" />
              <span>State Isolation</span>
            </div>
            <p className="text-[11px] text-[#78847C] leading-snug">
              Settings altered in this prototype are isolated in local memory. Upon launching with your Google Antigravity backend, this form binds to your live parameters API.
            </p>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* ================================================================= */}
          {/* AREA 1: PLANT CONFIGURATION */}
          {/* ================================================================= */}
          {activeSection === 'plant-config' && (
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E5EBE3] shadow-xs space-y-5">
              <div className="flex items-start justify-between border-b border-[#F0F4EF] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#173F32]">
                    1. Monitored Plant Species Configuration
                  </h3>
                  <p className="text-xs text-[#78847C] mt-0.5">
                    Assign telemetry nodes, configure scientific botanical identifiers, and set species-specific wilting thresholds.
                  </p>
                </div>
                <button
                  onClick={() => handleSave('Plant Configuration')}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 bg-[#173F32] hover:bg-[#245640] text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Plants</span>
                </button>
              </div>

              <div className="space-y-4">
                {plantsConfig.map((plant, idx) => (
                  <div
                    key={plant.id}
                    className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#EEF3ED] text-[#173F32] font-mono text-xs font-bold flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        <span className="font-semibold text-sm text-[#173F32]">
                          {plant.commonName}
                        </span>
                      </div>
                      <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-[#E5EBE3] text-[#245640]">
                        {plant.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {/* Common Name */}
                      <div>
                        <label className="text-[11px] font-medium text-[#78847C] block mb-1">
                          Common Name
                        </label>
                        <input
                          type="text"
                          value={plant.commonName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPlantsConfig((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, commonName: val } : p))
                            );
                          }}
                          className="w-full py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg text-[#26342D] focus:outline-none focus:border-[#173F32]"
                        />
                      </div>

                      {/* Scientific Name */}
                      <div>
                        <label className="text-[11px] font-medium text-[#78847C] block mb-1">
                          Scientific Name
                        </label>
                        <input
                          type="text"
                          value={plant.scientificName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPlantsConfig((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, scientificName: val } : p))
                            );
                          }}
                          className="w-full py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg text-[#26342D] italic focus:outline-none focus:border-[#173F32]"
                        />
                      </div>

                      {/* Node ID */}
                      <div>
                        <label className="text-[11px] font-medium text-[#78847C] block mb-1">
                          Assigned Node ID
                        </label>
                        <input
                          type="text"
                          value={plant.nodeId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPlantsConfig((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, nodeId: val } : p))
                            );
                          }}
                          className="w-full py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg font-mono text-[#26342D] focus:outline-none focus:border-[#173F32]"
                        />
                      </div>
                    </div>

                    {/* Monitoring Status & Threshold */}
                    <div className="pt-2 border-t border-[#E5EBE3]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#78847C]">Monitoring Status:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setPlantsConfig((prev) =>
                                prev.map((p, i) =>
                                  i === idx
                                    ? { ...p, monitoringStatus: p.monitoringStatus === 'active' ? 'paused' : 'active' }
                                    : p
                                )
                              );
                            }}
                            className={`py-0.5 px-2.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              plant.monitoringStatus === 'active'
                                ? 'bg-[#EEF3ED] text-[#245640]'
                                : 'bg-[#FBF4E8] text-[#C58A35]'
                            }`}
                          >
                            {plant.monitoringStatus === 'active' ? '● ACTIVE MONITORING' : '○ PAUSED'}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#78847C]">
                          Lower Moisture Threshold (%):
                        </span>
                        <input
                          type="number"
                          value={plant.soilThreshold}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPlantsConfig((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, soilThreshold: val } : p))
                            );
                          }}
                          className="w-16 py-1 px-2 bg-white border border-[#E5EBE3] rounded text-right font-mono text-xs focus:outline-none focus:border-[#173F32]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* AREA 2: SENSOR CONFIGURATION */}
          {/* ================================================================= */}
          {activeSection === 'sensor-config' && (
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E5EBE3] shadow-xs space-y-5">
              <div className="flex items-start justify-between border-b border-[#F0F4EF] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#173F32]">
                    2. Sensor Measurement & Calibration Configuration
                  </h3>
                  <p className="text-xs text-[#78847C] mt-0.5">
                    Configure physical units, target measurement ranges, MLX90614 emissivity, and 2-point capacitive calibrations.
                  </p>
                </div>
                <button
                  onClick={() => handleSave('Sensor Configuration')}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 bg-[#173F32] hover:bg-[#245640] text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Sensors</span>
                </button>
              </div>

              {/* Units Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-2">
                  <span className="text-[11px] font-semibold text-[#78847C] uppercase tracking-wider block">
                    Temperature Measurement Unit
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTempUnit('celsius')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        tempUnit === 'celsius'
                          ? 'bg-white border-[#245640] text-[#173F32] shadow-xs font-semibold'
                          : 'bg-[#F4F7F3] border-[#E5EBE3] text-[#78847C]'
                      }`}
                    >
                      Celsius (°C) — Scientific Default
                    </button>
                    <button
                      onClick={() => setTempUnit('fahrenheit')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        tempUnit === 'fahrenheit'
                          ? 'bg-white border-[#245640] text-[#173F32] shadow-xs font-semibold'
                          : 'bg-[#F4F7F3] border-[#E5EBE3] text-[#78847C]'
                      }`}
                    >
                      Fahrenheit (°F)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-2">
                  <span className="text-[11px] font-semibold text-[#78847C] uppercase tracking-wider block">
                    Light Intensity Unit
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLightUnit('lux')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        lightUnit === 'lux'
                          ? 'bg-white border-[#245640] text-[#173F32] shadow-xs font-semibold'
                          : 'bg-[#F4F7F3] border-[#E5EBE3] text-[#78847C]'
                      }`}
                    >
                      Photopic Illuminance (Lux)
                    </button>
                    <button
                      onClick={() => setLightUnit('par')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        lightUnit === 'par'
                          ? 'bg-white border-[#245640] text-[#173F32] shadow-xs font-semibold'
                          : 'bg-[#F4F7F3] border-[#E5EBE3] text-[#78847C]'
                      }`}
                    >
                      PAR Irradiance (µmol/m²/s)
                    </button>
                  </div>
                </div>
              </div>

              {/* Sensor Channels Table */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-[#78847C] uppercase tracking-wider block">
                  Sensor Channel Specifications & Ranges
                </span>
                <div className="border border-[#E5EBE3] rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAFAF8] border-b border-[#E5EBE3] text-[11px] font-semibold text-[#78847C] uppercase">
                        <th className="py-2.5 px-3">Sensor Model</th>
                        <th className="py-2.5 px-3">Parameter</th>
                        <th className="py-2.5 px-3">Unit</th>
                        <th className="py-2.5 px-3">Operational Range</th>
                        <th className="py-2.5 px-3">Calibration Status</th>
                        <th className="py-2.5 px-3">Calibration Parameter</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F4EF]">
                      <tr className="hover:bg-[#F8F8F4]">
                        <td className="py-2.5 px-3 font-semibold text-[#173F32]">Capacitive Probe v1.2</td>
                        <td className="py-2.5 px-3">Soil Moisture</td>
                        <td className="py-2.5 px-3 font-mono">% VWC</td>
                        <td className="py-2.5 px-3 font-mono">0.0% – 100.0%</td>
                        <td className="py-2.5 px-3 text-[#245640] font-semibold">Calibrated</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">Dry: {capacitiveCalibDry} / Sat: {capacitiveCalibWet}</td>
                      </tr>
                      <tr className="hover:bg-[#F8F8F4]">
                        <td className="py-2.5 px-3 font-semibold text-[#173F32]">MLX90614 Contactless IR</td>
                        <td className="py-2.5 px-3">Leaf Surface Temp</td>
                        <td className="py-2.5 px-3 font-mono">°C</td>
                        <td className="py-2.5 px-3 font-mono">-20.0°C – +85.0°C</td>
                        <td className="py-2.5 px-3 text-[#245640] font-semibold">Calibrated</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">Emissivity ε = {emissivityCoefficient.toFixed(2)}</td>
                      </tr>
                      <tr className="hover:bg-[#F8F8F4]">
                        <td className="py-2.5 px-3 font-semibold text-[#173F32]">AHT25 Precision Digital</td>
                        <td className="py-2.5 px-3">Ambient Temp & RH</td>
                        <td className="py-2.5 px-3 font-mono">°C / %</td>
                        <td className="py-2.5 px-3 font-mono">-40°C – +80°C / 0–100%</td>
                        <td className="py-2.5 px-3 text-[#245640] font-semibold">Factory Certified</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">NIST Traceable ASIC</td>
                      </tr>
                      <tr className="hover:bg-[#F8F8F4]">
                        <td className="py-2.5 px-3 font-semibold text-[#173F32]">BH1750 Ambient Lux</td>
                        <td className="py-2.5 px-3">Light Intensity</td>
                        <td className="py-2.5 px-3 font-mono">lux</td>
                        <td className="py-2.5 px-3 font-mono">1 – 65,535 lux</td>
                        <td className="py-2.5 px-3 text-[#245640] font-semibold">Calibrated</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">Cosine Factor k = 1.021</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Advanced Calibration Controls */}
              <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-3 text-xs">
                <span className="text-[11px] font-semibold text-[#78847C] uppercase tracking-wider block">
                  Fine Emissivity & ADC Reference Tuning
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-[#78847C] block mb-1">
                      Foliage Emissivity (ε)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.80"
                      max="1.00"
                      value={emissivityCoefficient}
                      onChange={(e) => setEmissivityCoefficient(Number(e.target.value))}
                      className="w-full py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg font-mono text-xs focus:outline-none focus:border-[#173F32]"
                    />
                    <span className="text-[10px] text-[#78847C] mt-0.5 block">0.98 for vegetative cuticle</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#78847C] block mb-1">
                      Dry Substrate ADC Counts
                    </label>
                    <input
                      type="number"
                      value={capacitiveCalibDry}
                      onChange={(e) => setCapacitiveCalibDry(Number(e.target.value))}
                      className="w-full py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg font-mono text-xs focus:outline-none focus:border-[#173F32]"
                    />
                    <span className="text-[10px] text-[#78847C] mt-0.5 block">Air baseline: ~3,120 counts</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#78847C] block mb-1">
                      Saturated Water ADC Counts
                    </label>
                    <input
                      type="number"
                      value={capacitiveCalibWet}
                      onChange={(e) => setCapacitiveCalibWet(Number(e.target.value))}
                      className="w-full py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg font-mono text-xs focus:outline-none focus:border-[#173F32]"
                    />
                    <span className="text-[10px] text-[#78847C] mt-0.5 block">Saturation: ~1,450 counts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* AREA 3: MONITORING CONFIGURATION */}
          {/* ================================================================= */}
          {activeSection === 'monitoring-config' && (
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E5EBE3] shadow-xs space-y-5">
              <div className="flex items-start justify-between border-b border-[#F0F4EF] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#173F32]">
                    3. Monitoring Cadence & Data Retention Configuration
                  </h3>
                  <p className="text-xs text-[#78847C] mt-0.5">
                    Set ESP32 sensor acquisition intervals, live dashboard stream frequencies, and historical database retention periods.
                  </p>
                </div>
                <button
                  onClick={() => handleSave('Monitoring Configuration')}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 bg-[#173F32] hover:bg-[#245640] text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Monitoring</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* 1. Sampling Interval: 5 minutes */}
                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-sm text-[#173F32] block">
                      ESP32 Sensor Sampling Interval
                    </span>
                    <p className="text-[#78847C] mt-0.5 text-xs">
                      Default scientific screening cadence for multi-sensor measurement acquisition.
                    </p>
                  </div>
                  <select
                    value={samplingInterval}
                    onChange={(e) => setSamplingInterval(e.target.value)}
                    className="py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg font-mono text-xs text-[#26342D] focus:outline-none focus:border-[#173F32] cursor-pointer"
                  >
                    <option value="1 minute">1 minute (High Frequency Lab Run)</option>
                    <option value="5 minutes">5 minutes (Recommended Default)</option>
                    <option value="10 minutes">10 minutes (Energy Conservative)</option>
                    <option value="15 minutes">15 minutes (Hourly Aggregation)</option>
                  </select>
                </div>

                {/* 2. Dashboard Refresh Interval */}
                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-sm text-[#173F32] block">
                      Dashboard Live Refresh Interval
                    </span>
                    <p className="text-[#78847C] mt-0.5 text-xs">
                      Frequency at which the frontend updates live micro-telemetry meters.
                    </p>
                  </div>
                  <select
                    value={dashboardRefreshRate}
                    onChange={(e) => setDashboardRefreshRate(e.target.value)}
                    className="py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg font-mono text-xs text-[#26342D] focus:outline-none focus:border-[#173F32] cursor-pointer"
                  >
                    <option value="5 seconds">5 seconds (Continuous pulse)</option>
                    <option value="8 seconds">8 seconds (Living Transpiration Default)</option>
                    <option value="30 seconds">30 seconds (Low CPU)</option>
                    <option value="Manual only">Manual refresh only</option>
                  </select>
                </div>

                {/* 3. Data Retention Settings */}
                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-sm text-[#173F32] block">
                      Historical Data Retention Period
                    </span>
                    <p className="text-[#78847C] mt-0.5 text-xs">
                      Storage duration for raw 5-minute telemetry before compaction to hourly medians.
                    </p>
                  </div>
                  <select
                    value={dataRetentionDays}
                    onChange={(e) => setDataRetentionDays(e.target.value)}
                    className="py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg font-mono text-xs text-[#26342D] focus:outline-none focus:border-[#173F32] cursor-pointer"
                  >
                    <option value="30 days">30 days (Ephemeral buffer)</option>
                    <option value="90 days">90 days (Quarterly trial - Default)</option>
                    <option value="180 days">180 days (Multi-season)</option>
                    <option value="1 year">1 year (Full annual cycle)</option>
                  </select>
                </div>

                {/* DLI compilation toggle */}
                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-[#173F32] block">
                      Automated Daily Light Integral (DLI) Compilation
                    </span>
                    <p className="text-[#78847C] mt-0.5 text-xs">
                      Integrates BH1750 lux measurements over 14-hour photoperiod into mol/m²/day.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoDliCalculation}
                    onChange={(e) => setAutoDliCalculation(e.target.checked)}
                    className="w-4 h-4 text-[#173F32] rounded border-[#E5EBE3] focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* AREA 4: AI CONFIGURATION */}
          {/* ================================================================= */}
          {activeSection === 'ai-config' && (
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E5EBE3] shadow-xs space-y-5">
              <div className="flex items-start justify-between border-b border-[#F0F4EF] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#173F32]">
                    4. AI Screening Model & Baseline Architecture
                  </h3>
                  <p className="text-xs text-[#78847C] mt-0.5">
                    Tune Random Forest expected leaf temperature parameters, residual triggers, and persistence windows.
                  </p>
                </div>
                <button
                  onClick={() => handleSave('AI Configuration')}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 bg-[#173F32] hover:bg-[#245640] text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save AI Config</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Model Info Banner */}
                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#173F32]">
                        {modelName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EEF3ED] text-[#245640]">
                        CONVERGED
                      </span>
                    </div>
                    <p className="text-[#78847C] mt-0.5 text-xs">
                      Predicts expected leaf temperature (T_expected) using ambient temp, RH, and PAR light.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#78847C]">
                    Baseline: Day 14–18 Calibrated
                  </span>
                </div>

                {/* Adaptive Threshold Slider */}
                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm text-[#173F32] block">
                        Adaptive Temperature Residual Threshold (ΔT_thresh)
                      </span>
                      <p className="text-[#78847C] text-xs">
                        Residual trigger point (T_observed - T_expected) marking stomatal restriction.
                      </p>
                    </div>
                    <span className="font-mono text-base font-bold text-[#173F32] bg-white px-3 py-1 rounded border border-[#E5EBE3]">
                      +{adaptiveThreshold.toFixed(1)}°C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="3.5"
                    step="0.1"
                    value={adaptiveThreshold}
                    onChange={(e) => setAdaptiveThreshold(Number(e.target.value))}
                    className="w-full accent-[#173F32] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#78847C]">
                    <span>+0.8°C (High sensitivity)</span>
                    <span>+1.8°C (Standard Baseline)</span>
                    <span>+3.5°C (Severe stress only)</span>
                  </div>
                </div>

                {/* Persistence Window & Sensitivity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-2">
                    <span className="font-semibold text-sm text-[#173F32] block">
                      Temporal Persistence Window
                    </span>
                    <p className="text-[#78847C] text-xs">
                      Duration thermal divergence must persist before triggering POSSIBLE WATER STRESS.
                    </p>
                    <select
                      value={persistenceWindowMins}
                      onChange={(e) => setPersistenceWindowMins(Number(e.target.value))}
                      className="w-full py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg font-mono text-xs text-[#26342D] focus:outline-none focus:border-[#173F32] cursor-pointer"
                    >
                      <option value={30}>30 minutes (6 consecutive intervals)</option>
                      <option value={60}>60 minutes (12 intervals - Standard)</option>
                      <option value={90}>90 minutes (18 intervals - Resilient)</option>
                      <option value={120}>120 minutes (2 hours)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-2">
                    <span className="font-semibold text-sm text-[#173F32] block">
                      Screening Sensitivity Mode
                    </span>
                    <p className="text-[#78847C] text-xs">
                      Governs false-positive rejection vs. early-warning lead time.
                    </p>
                    <select
                      value={screeningSensitivity}
                      onChange={(e) => setScreeningSensitivity(e.target.value as any)}
                      className="w-full py-1.5 px-3 bg-white border border-[#E5EBE3] rounded-lg font-mono text-xs text-[#26342D] focus:outline-none focus:border-[#173F32] cursor-pointer"
                    >
                      <option value="standard">Standard (Balanced 4.5h lead time)</option>
                      <option value="high">High Sensitivity (Early Research Trial)</option>
                      <option value="conservative">Conservative (Severe Stress Only)</option>
                    </select>
                  </div>
                </div>

                {/* Decoupling Scientific Rule Notice */}
                <div className="p-4 rounded-xl bg-[#EEF3ED] border border-[#A8BDA8]/40 space-y-2">
                  <div className="flex items-center gap-2 text-[#173F32] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#245640]" />
                    <span>Scientific Constraint: Strict Input Decoupling</span>
                  </div>
                  <p className="text-[11px] text-[#26342D] leading-relaxed">
                    Soil moisture is strictly isolated as separate corroborating evidence. It is never fed into the leaf temperature prediction model to prevent circular confirmation bias.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* AREA 5: SYSTEM CONFIGURATION */}
          {/* ================================================================= */}
          {activeSection === 'system-config' && (
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E5EBE3] shadow-xs space-y-5">
              <div className="flex items-start justify-between border-b border-[#F0F4EF] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#173F32]">
                    5. System & Google Antigravity Integration
                  </h3>
                  <p className="text-xs text-[#78847C] mt-0.5">
                    Central backend address, MQTT broker endpoints, database health status, and firmware specs.
                  </p>
                </div>
                <button
                  onClick={() => handleSave('System Configuration')}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 bg-[#173F32] hover:bg-[#245640] text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save System</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Status Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3]">
                    <span className="text-[10px] text-[#78847C] uppercase tracking-wider block">
                      API Connection Status
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 font-semibold text-[#245640]">
                      <span className="w-2 h-2 rounded-full bg-[#245640]" />
                      <span>{apiConnectionStatus}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3]">
                    <span className="text-[10px] text-[#78847C] uppercase tracking-wider block">
                      Time-Series Database
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 font-semibold text-[#173F32]">
                      <Database className="w-3.5 h-3.5 text-[#173F32]" />
                      <span>Antigravity Store (Ready)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3]">
                    <span className="text-[10px] text-[#78847C] uppercase tracking-wider block">
                      Frontend App Version
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 font-mono font-semibold text-[#26342D]">
                      <span>{appVersion}</span>
                    </div>
                  </div>
                </div>

                {/* Backend URL Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#78847C] uppercase tracking-wider block">
                    Central Backend Endpoint Address
                  </label>
                  <input
                    type="text"
                    value={backendAddress}
                    onChange={(e) => setBackendAddress(e.target.value)}
                    className="w-full py-2 px-3 bg-[#F8F8F4] border border-[#E5EBE3] rounded-lg font-mono text-xs text-[#26342D] focus:outline-none focus:border-[#173F32]"
                  />
                  <span className="text-[10px] text-[#78847C] block">
                    Target URL for telemetry synchronization and model inference calls.
                  </span>
                </div>

                {/* MQTT Broker URL */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#78847C] uppercase tracking-wider block">
                    ESP32 Wi-Fi Mesh Broker Address
                  </label>
                  <input
                    type="text"
                    value={mqttBrokerUrl}
                    onChange={(e) => setMqttBrokerUrl(e.target.value)}
                    className="w-full py-2 px-3 bg-[#F8F8F4] border border-[#E5EBE3] rounded-lg font-mono text-xs text-[#26342D] focus:outline-none focus:border-[#173F32]"
                  />
                  <span className="text-[10px] text-[#78847C] block">
                    Secure MQTT broker listening on port 8883 for encrypted edge node packets.
                  </span>
                </div>

                {/* Mesh Topology Summary */}
                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#173F32]">Network Architecture</span>
                    <span className="font-mono text-[11px] text-[#78847C]">802.11 b/g/n · 2.4GHz Direct</span>
                  </div>
                  <p className="text-[11px] text-[#78847C] leading-relaxed">
                    Edge nodes (TULSI_01, HIBISCUS_01, MONEYPLANT_01) operate autonomously using ESP-IDF v5.1 firmware. Each node polls its sensor bus every 5 minutes and pushes a verified CRC32 payload directly to the central ingest broker.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* AREA 6: ABOUT ROOTWHISPER */}
          {/* ================================================================= */}
          {activeSection === 'about-rootwhisper' && (
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#E5EBE3] shadow-xs space-y-6">
              <div className="border-b border-[#F0F4EF] pb-4">
                <span className="text-xs font-mono text-[#245640] uppercase tracking-wider font-semibold">
                  Botanical Intelligence Project
                </span>
                <h3 className="text-xl font-bold text-[#173F32] mt-0.5">
                  About RootWhisper & Physiological Screening
                </h3>
                <p className="text-xs text-[#78847C] mt-1">
                  Species-Aware AI Framework for Early Plant Water-Stress Screening Through Adaptive Physiological Fingerprinting.
                </p>
              </div>

              {/* Mission Prose */}
              <div className="space-y-3 text-xs sm:text-sm text-[#26342D] leading-relaxed">
                <p>
                  <strong className="text-[#173F32]">"Your plants are whispering."</strong> Long before
                  foliage wilts, loses structural turgor, or shows visible signs of water deficit, plants
                  regulate their microscopic stomatal pores to conserve internal moisture. When stomata
                  restrict or close, evaporative cooling (latent heat dissipation) drops sharply, causing
                  the leaf surface temperature to rise above ambient equilibrium.
                </p>
                <p>
                  RootWhisper captures this thermal whisper using high-precision contactless infrared
                  thermometers (MLX90614) alongside ambient atmospheric sensors (AHT25 and BH1750).
                  Rather than relying on static, generic thresholds, our species-aware framework learns
                  an individual-plant baseline over 14–18 days of calibrated environmental exposure.
                </p>
              </div>

              {/* 3 Core Scientific Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF3ED] flex items-center justify-center text-[#173F32]">
                    <Thermometer className="w-4 h-4 text-[#245640]" />
                  </div>
                  <h4 className="text-xs font-semibold text-[#173F32]">
                    1. Thermal Decoupling
                  </h4>
                  <p className="text-[11px] text-[#78847C] leading-snug">
                    Expected leaf temperatures are modeled strictly from ambient energy balances. Soil moisture is kept as separate supporting evidence.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF3ED] flex items-center justify-center text-[#173F32]">
                    <Sliders className="w-4 h-4 text-[#245640]" />
                  </div>
                  <h4 className="text-xs font-semibold text-[#173F32]">
                    2. Adaptive Fingerprints
                  </h4>
                  <p className="text-[11px] text-[#78847C] leading-snug">
                    Each plant species—Tulsi, Hibiscus, Money Plant—possesses a unique hydraulic architecture and species-specific threshold delta.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF3ED] flex items-center justify-center text-[#173F32]">
                    <ShieldCheck className="w-4 h-4 text-[#245640]" />
                  </div>
                  <h4 className="text-xs font-semibold text-[#173F32]">
                    3. Temporal Persistence
                  </h4>
                  <p className="text-[11px] text-[#78847C] leading-snug">
                    Transient cloud shadows or drafts do not trigger false alerts. Anomalies must persist over multiple consecutive sampling windows.
                  </p>
                </div>
              </div>

              {/* Project Credits & Scientific Team */}
              <div className="pt-4 border-t border-[#F0F4EF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#78847C]">
                <div>
                  <strong className="text-[#173F32]">RootWhisper Research Initiative</strong> · Phytotron Chamber A-4
                  <div className="text-[11px] mt-0.5">Designed for Google Antigravity & ESP32-S3 Distributed Meshes</div>
                </div>
                <div className="font-mono text-[11px] self-start sm:self-auto">
                  v2.4.1 · Clean Botanical Architecture
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
