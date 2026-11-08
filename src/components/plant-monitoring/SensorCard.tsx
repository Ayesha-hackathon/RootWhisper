/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Droplet,
  Thermometer,
  Flame,
  Sun,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';
import { SensorMetricDetail, DataValidityState } from '../../types';

interface SensorCardProps {
  sensor: SensorMetricDetail;
  icon: LucideIcon;
  simulatedState: 'normal' | 'stale' | 'invalid' | 'offline';
  optimalNote?: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  sensor,
  icon: Icon,
  simulatedState,
  optimalNote,
}) => {
  // Determine effective validity and display value based on simulatedState
  let effectiveValidity: DataValidityState = sensor.validity;
  let displayValue: string = sensor.value !== null ? `${sensor.value}` : '--';
  let validityLabel = 'Valid';
  let validityBadgeClass = 'bg-[#EEF3ED] text-[#245640] border-[#A8BDA8]/40';
  let lastUpdateText = sensor.lastUpdated;
  let statusNoteText = sensor.statusNote || optimalNote || sensor.nominalRangeText;

  if (simulatedState === 'offline') {
    effectiveValidity = 'unavailable';
    displayValue = '--';
    validityLabel = 'Unavailable';
    validityBadgeClass = 'bg-[#F4F4F4] text-[#6B7280] border-[#D1D5DB]';
    lastUpdateText = 'Offline (2h ago)';
    statusNoteText = 'Node heartbeat lost. Awaiting telemetry reconnect.';
  } else if (simulatedState === 'invalid') {
    effectiveValidity = 'invalid';
    displayValue = sensor.name === 'Soil Moisture' ? '0xFF (NaN)' : 'Err: 0xFD';
    validityLabel = 'Invalid Data';
    validityBadgeClass = 'bg-[#FFF2F0] text-[#C95D58] border-[#C95D58]/40';
    lastUpdateText = '12s ago (CRC Fail)';
    statusNoteText = 'ADC voltage out of calibrated range. Check probe contacts.';
  } else if (simulatedState === 'stale') {
    effectiveValidity = 'stale';
    validityLabel = 'Stale Reading';
    validityBadgeClass = 'bg-[#FFF8EB] text-[#C58A35] border-[#C58A35]/40';
    lastUpdateText = '42m ago';
    statusNoteText = 'No fresh packet received for >40 minutes.';
  }

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-4 shadow-xs flex flex-col justify-between h-full min-h-[170px] transition-all hover:border-[#A8BDA8]">
      {/* Top row: Sensor Name & Hardware Model */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3] flex items-center justify-center text-[#173F32]">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#173F32] tracking-tight">
                {sensor.name}
              </h3>
              <p className="text-[10px] font-mono text-[#78847C]">
                {sensor.sensorModel}
              </p>
            </div>
          </div>

          {/* Validity Badge */}
          <span
            className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded border ${validityBadgeClass}`}
          >
            {validityLabel}
          </span>
        </div>

        {/* Big Metric Display */}
        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${
                effectiveValidity === 'invalid'
                  ? 'text-[#C95D58]'
                  : effectiveValidity === 'unavailable'
                  ? 'text-[#9CA3AF]'
                  : effectiveValidity === 'stale'
                  ? 'text-[#C58A35]'
                  : 'text-[#173F32]'
              }`}
            >
              {displayValue}
            </span>
            {effectiveValidity !== 'unavailable' && effectiveValidity !== 'invalid' && (
              <span className="text-sm font-semibold text-[#78847C] font-mono">
                {sensor.unit}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#78847C] mt-0.5 line-clamp-1">
            Nominal: {sensor.nominalRangeText}
          </p>
        </div>
      </div>

      {/* Footer: Diagnostic Note & Last Update */}
      <div className="pt-2.5 border-t border-[#EEF3ED] text-[11px] space-y-1">
        <p className="text-[#26342D] text-[10px] leading-tight line-clamp-1">
          {statusNoteText}
        </p>
        <div className="flex items-center justify-between text-[#78847C] text-[10px] font-mono">
          <span>Target: {sensor.id}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {lastUpdateText}
          </span>
        </div>
      </div>
    </div>
  );
};
