/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlantTelemetry, HardwareNodeState } from '../../types';
import {
  Droplet,
  Thermometer,
  Sun,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Wifi,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

interface PlantCardProps {
  plant: PlantTelemetry;
  onViewDetails: (plant: PlantTelemetry) => void;
}

const renderHardwareStateBadge = (state?: HardwareNodeState) => {
  switch (state) {
    case 'ONLINE':
      return (
        <span className="flex items-center gap-1 text-[#48D597] font-semibold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#48D597] animate-pulse" />
          ONLINE
        </span>
      );
    case 'WAITING FOR FIRST DATA':
      return (
        <span className="flex items-center gap-1 text-[#A8C3A0] font-semibold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A8C3A0]" />
          WAITING FOR DATA
        </span>
      );
    case 'STALE':
      return (
        <span className="flex items-center gap-1 text-[#C58A35] font-semibold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C58A35]" />
          STALE
        </span>
      );
    case 'CONNECTION ERROR':
      return (
        <span className="flex items-center gap-1 text-[#C95D58] font-semibold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C95D58]" />
          CONNECTION ERROR
        </span>
      );
    case 'OFFLINE':
    default:
      return (
        <span className="flex items-center gap-1 text-[#78847C] font-semibold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#78847C]" />
          OFFLINE
        </span>
      );
  }
};

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onViewDetails }) => {
  const isStress = plant.stressLevel === 'high_stress' || plant.stressLevel === 'mild_stress';
  const hasData = plant.hasReceivedData !== false && plant.soilMoisture !== null;
  const isWaiting = !hasData || plant.hardwareStatus === 'WAITING FOR FIRST DATA';

  const deltaColor =
    plant.temperatureDelta !== null && plant.temperatureDelta > 1.5
      ? 'text-[#C95D58]'
      : plant.temperatureDelta !== null && plant.temperatureDelta > 0.5
      ? 'text-[#C58A35]'
      : 'text-[#087E75]';

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D9F0EA] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top Banner with Botanical Plate & Badges */}
      <div className="relative h-44 bg-gradient-to-b from-[#D9F0EA] via-[#E4F2EC] to-[#EDF7F4] border-b border-[#CCE2DB] overflow-hidden flex items-center justify-center p-3">
        {/* Botanical Plate Illustration */}
        <img
          src={plant.illustrationUrl}
          alt={`${plant.commonName} scientific illustration`}
          referrerPolicy="no-referrer"
          className="h-full w-auto max-w-full object-contain filter drop-shadow-xs transition-transform duration-300 hover:scale-105"
        />

        {/* Backend-Derived Hardware Node Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#123B36] text-white border border-[#1A4D45] text-[11px] font-mono font-medium shadow-xs">
          <Wifi className="w-3 h-3 text-[#55B6A3]" />
          <span>{plant.nodeId}</span>
          <span className="text-[#55B6A3]">·</span>
          {renderHardwareStateBadge(plant.hardwareStatus)}
        </div>

        {/* Stress Status Pill */}
        <div className="absolute top-3 right-3">
          {isWaiting ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium shadow-xs bg-[#FAF9F3] border border-[#D4E7E1] text-[#78847C]">
              <HelpCircle className="w-3.5 h-3.5 text-[#78847C]" />
              <span>Awaiting Stream</span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium shadow-xs ${
                isStress
                  ? 'bg-[#FFF2F0] border border-[#C95D58]/30 text-[#C95D58]'
                  : 'bg-[#D9F0EA] border border-[#55B6A3]/40 text-[#123B36]'
              }`}
            >
              {isStress ? (
                <AlertCircle className="w-3.5 h-3.5 text-[#C95D58]" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087E75]" />
              )}
              <span>{isStress ? 'Early Stress Detected' : 'Optimal Turgor'}</span>
            </div>
          )}
        </div>

        {/* Crop Water Stress Index Overlay Badge */}
        {hasData && (
          <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-[#123B36]/85 text-[#FFFFFF] text-[10px] font-mono">
            CWSI: {plant.stressIndex.toFixed(2)}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Plant Titles */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-[#123B36] text-base leading-snug">
                {plant.commonName}
              </h3>
              <p className="text-xs text-[#78847C] italic">
                {plant.scientificName}
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#D9F0EA] text-[#087E75] font-semibold border border-[#55B6A3]/30">
              {plant.code}
            </span>
          </div>
        </div>

        {/* Empty State Banner if awaiting first hardware packet */}
        {isWaiting && (
          <div className="mt-4 p-3 rounded-lg bg-[#FAF9F3] border border-[#E9E2F5] text-xs text-[#26342D] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#173F32]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#C58A35]" />
              <span>Sensor Offline</span>
            </div>
            <p className="text-[11px] text-[#78847C] leading-relaxed">
              Waiting for sensor data. Connect your ESP32 node to start live monitoring.
            </p>
          </div>
        )}

        {/* Primary Metric: Soil Moisture with progress bar */}
        <div className="mt-4 pt-3 border-t border-[#D9F0EA]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium text-[#26342D]">
              <Droplet className="w-3.5 h-3.5 text-[#087E75]" />
              Soil Moisture
            </span>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-sm font-bold text-[#123B36] tabular-nums">
                {plant.soilMoisture !== null ? `${plant.soilMoisture.toFixed(1)}%` : 'N/A'}
              </span>
              <span className="text-[10px] text-[#78847C]">
                (min {plant.soilMoistureThreshold}%)
              </span>
            </div>
          </div>

          {/* Moisture Bar */}
          <div className="w-full h-2 bg-[#D9F0EA] rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                plant.soilMoisture !== null && plant.soilMoisture <= plant.soilMoistureThreshold + 5
                  ? 'bg-[#C58A35]'
                  : 'bg-[#087E75]'
              }`}
              style={{ width: `${plant.soilMoisture !== null ? Math.min(100, plant.soilMoisture) : 0}%` }}
            />
          </div>
        </div>

        {/* 2x2 Sensor Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {/* Leaf Temperature */}
          <div className="p-2.5 rounded-lg bg-[#EAF4F0] border border-[#CCE2DB]">
            <div className="flex items-center justify-between text-[#78847C] text-[11px] mb-1">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-[#087E75]" />
                Leaf Temp
              </span>
              {plant.temperatureDelta !== null && (
                <span className={`font-mono font-medium text-[10px] ${deltaColor}`}>
                  {plant.temperatureDelta > 0 ? `+${plant.temperatureDelta.toFixed(1)}` : plant.temperatureDelta.toFixed(1)}°C Δ
                </span>
              )}
            </div>
            <p className="text-sm font-semibold font-mono text-[#123B36] tabular-nums">
              {plant.leafTemperature !== null ? `${plant.leafTemperature.toFixed(1)}°C` : 'N/A'}
            </p>
          </div>

          {/* Ambient Temperature */}
          <div className="p-2.5 rounded-lg bg-[#EAF4F0] border border-[#CCE2DB]">
            <div className="text-[#78847C] text-[11px] mb-1">
              Ambient Temp
            </div>
            <p className="text-sm font-semibold font-mono text-[#26342D] tabular-nums">
              {plant.ambientTemperature !== null ? `${plant.ambientTemperature.toFixed(1)}°C` : 'N/A'}
            </p>
          </div>

          {/* Relative Humidity */}
          <div className="p-2.5 rounded-lg bg-[#EAF4F0] border border-[#CCE2DB]">
            <div className="text-[#78847C] text-[11px] mb-1">
              Rel. Humidity
            </div>
            <p className="text-sm font-semibold font-mono text-[#26342D] tabular-nums">
              {plant.relativeHumidity !== null ? `${plant.relativeHumidity.toFixed(1)}%` : 'N/A'}
            </p>
          </div>

          {/* Light Intensity */}
          <div className="p-2.5 rounded-lg bg-[#EAF4F0] border border-[#CCE2DB]">
            <div className="flex items-center gap-1 text-[#78847C] text-[11px] mb-1">
              <Sun className="w-3 h-3 text-[#C58A35]" />
              Ambient Light
            </div>
            <p className="text-sm font-semibold font-mono text-[#26342D] tabular-nums">
              {plant.lightIntensity !== null ? (
                <>
                  {plant.lightIntensity.toLocaleString()}{' '}
                  <span className="text-[10px] font-normal font-sans text-[#78847C]">lux</span>
                </>
              ) : (
                'N/A'
              )}
            </p>
          </div>
        </div>

        {/* Footer: Timestamp & View Details Action */}
        <div className="mt-4 pt-3 border-t border-[#D9F0EA] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-[#78847C]">
            <Clock className="w-3 h-3 text-[#55B6A3]" />
            <span className="truncate">
              {plant.lastUpdated ? `Updated ${plant.lastUpdated}` : 'Waiting for connection'}
            </span>
          </div>

          <button
            onClick={() => onViewDetails(plant)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#087E75] hover:bg-[#123B36] transition-colors cursor-pointer shadow-xs"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface PlantCardGridProps {
  plants: PlantTelemetry[];
  onViewDetails: (plant: PlantTelemetry) => void;
}

export const PlantCardGrid: React.FC<PlantCardGridProps> = ({
  plants,
  onViewDetails,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#123B36] tracking-tight">
            Monitored Species Fleet
          </h2>
          <p className="text-xs text-[#78847C]">
            Continuous non-destructive thermal and capacitive screening nodes
          </p>
        </div>
        <div className="text-xs text-[#78847C] font-mono">
          3 Calibrated Species
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};
