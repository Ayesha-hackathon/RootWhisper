/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Droplet,
  Thermometer,
  Sun,
  Activity,
  Cpu,
  Wifi,
  Droplets,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PlantTelemetry } from '../../types';

interface PlantDetailModalProps {
  plant: PlantTelemetry | null;
  onClose: () => void;
  onTriggerScreening: (plantId: string) => Promise<void>;
  onTriggerIrrigation: (plantId: string) => Promise<void>;
  onOpenMonitoring?: (plantId: string) => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  onClose,
  onTriggerScreening,
  onTriggerIrrigation,
  onOpenMonitoring,
}) => {
  const [isScreening, setIsScreening] = useState(false);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!plant) return null;

  const isStress = plant.stressLevel === 'mild_stress' || plant.stressLevel === 'high_stress';

  const handleScreeningClick = async () => {
    setIsScreening(true);
    setActionFeedback(null);
    try {
      await onTriggerScreening(plant.id);
      setActionFeedback('Antigravity model confirmed real-time radiometric scan.');
    } finally {
      setIsScreening(false);
    }
  };

  const handleIrrigationClick = async () => {
    setIsIrrigating(true);
    setActionFeedback(null);
    try {
      await onTriggerIrrigation(plant.id);
      setActionFeedback('ESP32 pulsed 15s micro-irrigation valve. Substrate replenishing.');
    } finally {
      setIsIrrigating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#123B36]/40 backdrop-blur-xs select-none">
      <div className="bg-[#FFFFFF] w-full max-w-3xl rounded-2xl border border-[#D4E7E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9F0EA] flex items-center justify-between bg-[#F5FAF8]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#123B36] flex items-center justify-center text-[#F5FAF8]">
              <Activity className="w-4 h-4 text-[#55B6A3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#123B36]">
                  {plant.commonName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#D9F0EA] text-[#087E75] font-semibold">
                  {plant.code}
                </span>
              </div>
              <p className="text-xs text-[#78847C] italic">
                {plant.scientificName} · Family {plant.family}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78847C] hover:text-[#26342D] hover:bg-[#D9F0EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Action Feedback Banner */}
          {actionFeedback && (
            <div className="p-3 bg-[#D9F0EA] border border-[#55B6A3]/50 rounded-lg text-xs font-medium text-[#123B36] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#087E75]" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Top Split: Botanical Plate + Physiological Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* High-res Botanical Plate Image */}
            <div className="md:col-span-5 bg-[#F5FAF8] rounded-xl border border-[#D4E7E1] p-4 flex flex-col items-center justify-center relative">
              <img
                src={plant.illustrationUrl}
                alt={plant.commonName}
                referrerPolicy="no-referrer"
                className="max-h-60 w-auto object-contain drop-shadow-sm"
              />
              <div className="mt-2 text-center">
                <span className="text-[10px] text-[#78847C] font-mono uppercase tracking-wider">
                  Herbarium Archival Plate
                </span>
              </div>
            </div>

            {/* Physiological Fingerprint & Diagnosis */}
            <div className="md:col-span-7 space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  isStress
                    ? 'bg-[#FFF8F7] border-[#C95D58]/30'
                    : 'bg-[#EDF7F4] border-[#55B6A3]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isStress ? (
                      <AlertCircle className="w-4 h-4 text-[#C95D58]" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#087E75]" />
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        isStress ? 'text-[#C95D58]' : 'text-[#087E75]'
                      }`}
                    >
                      {isStress ? 'Early Water-Stress Detected' : 'Physiological Homeostasis'}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#123B36]">
                    CWSI: {plant.stressIndex.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[#26342D] leading-relaxed">
                  {plant.physiologicalFingerprint.diagnosis}
                </p>
                <div className="mt-3 pt-2 border-t border-[#D9F0EA] flex items-center justify-between text-[11px] font-mono text-[#78847C]">
                  <span>Lead Time: +{plant.physiologicalFingerprint.hoursBeforeVisualWilting}h before wilting</span>
                  <span>Transpiration: {plant.physiologicalFingerprint.transpirationEfficiency}%</span>
                </div>
              </div>

              {/* Fingerprint Benchmarks */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
                  <p className="text-[10px] text-[#78847C] uppercase font-semibold">
                    Hydrated Baseline ΔT
                  </p>
                  <p className="text-base font-bold font-mono text-[#123B36] mt-0.5">
                    {plant.physiologicalFingerprint.baselineLeafDelta}°C
                  </p>
                  <p className="text-[10px] text-[#78847C] mt-1">
                    Normal cooling differential
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
                  <p className="text-[10px] text-[#78847C] uppercase font-semibold">
                    Current Measured ΔT
                  </p>
                  <p
                    className={`text-base font-bold font-mono mt-0.5 ${
                      plant.temperatureDelta !== null && plant.temperatureDelta > 1.5 ? 'text-[#C95D58]' : 'text-[#087E75]'
                    }`}
                  >
                    {plant.temperatureDelta !== null
                      ? (plant.temperatureDelta > 0 ? `+${plant.temperatureDelta.toFixed(1)}°C` : `${plant.temperatureDelta.toFixed(1)}°C`)
                      : 'N/A'}
                  </p>
                  <p className="text-[10px] text-[#78847C] mt-1">
                    T_leaf ({plant.leafTemperature !== null ? `${plant.leafTemperature}°C` : 'N/A'}) - T_air ({plant.ambientTemperature !== null ? `${plant.ambientTemperature}°C` : 'N/A'})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Metrics Table */}
          <div>
            <h3 className="text-xs font-semibold text-[#123B36] uppercase tracking-wider mb-2.5">
              Live Edge Sensor Telemetry ({plant.nodeId})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
                <span className="text-[#78847C] text-[11px] flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-[#123B36]" />
                  Soil Moisture
                </span>
                <p className="text-lg font-bold font-mono text-[#123B36] mt-1">
                  {plant.soilMoisture !== null ? `${plant.soilMoisture.toFixed(1)}%` : 'N/A'}
                </p>
                <p className="text-[10px] text-[#78847C] mt-0.5">
                  Threshold: {plant.soilMoistureThreshold}%
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
                <span className="text-[#78847C] text-[11px] flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#123B36]" />
                  IR Leaf Temp
                </span>
                <p className="text-lg font-bold font-mono text-[#123B36] mt-1">
                  {plant.leafTemperature !== null ? `${plant.leafTemperature.toFixed(1)}°C` : 'N/A'}
                </p>
                <p className="text-[10px] text-[#78847C] mt-0.5">
                  Contactless MLX90614
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
                <span className="text-[#78847C] text-[11px] flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-[#C58A35]" />
                  Ambient Light
                </span>
                <p className="text-lg font-bold font-mono text-[#123B36] mt-1 tabular-nums">
                  {plant.lightIntensity !== null ? `${plant.lightIntensity.toLocaleString()} ` : 'N/A '}
                  <span className="text-[10px] font-normal font-sans text-[#78847C]">lux</span>
                </p>
                <p className="text-[10px] text-[#78847C] mt-0.5">
                  BH1750 Sensor
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
                <span className="text-[#78847C] text-[11px] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#087E75]" />
                  Stomatal Proxy
                </span>
                <p className="text-lg font-bold font-mono text-[#123B36] mt-1 tabular-nums">
                  {plant.stomatalConductanceProxy}
                </p>
                <p className="text-[10px] text-[#78847C] mt-0.5">
                  mmol/m²s conductance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#D9F0EA] bg-[#F5FAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#78847C]">
            RSSI: {plant.wifiRssi !== null ? `${plant.wifiRssi} dBm` : 'N/A'} · Battery: {plant.batteryVoltage ? `${plant.batteryVoltage.toFixed(2)}V` : 'N/A'}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenMonitoring && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMonitoring(plant.id);
                }}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#123B36] bg-[#D9F0EA] hover:bg-[#55B6A3]/40 transition-colors cursor-pointer"
              >
                Open Full Monitoring Page
              </button>
            )}

            <button
              onClick={handleScreeningClick}
              disabled={isScreening}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#123B36] bg-white border border-[#D4E7E1] hover:border-[#55B6A3] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Cpu className="w-3.5 h-3.5 text-[#087E75]" />
              <span>{isScreening ? 'Screening...' : 'Trigger AI Screen'}</span>
            </button>

            <button
              onClick={handleIrrigationClick}
              disabled={isIrrigating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-[#FFFFFF] bg-[#123B36] hover:bg-[#087E75] transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{isIrrigating ? 'Pulsing...' : 'Pulse Micro-Irrigation'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
