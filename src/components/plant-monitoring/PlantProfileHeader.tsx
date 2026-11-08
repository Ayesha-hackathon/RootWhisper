/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  PlantTelemetry,
  DataValidityState,
} from '../../types';
import {
  Wifi,
  WifiOff,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Cpu,
} from 'lucide-react';

interface PlantProfileHeaderProps {
  plant: PlantTelemetry;
  dataState: 'normal' | 'stale' | 'invalid' | 'offline';
  onDataStateChange: (state: 'normal' | 'stale' | 'invalid' | 'offline') => void;
}

export const PlantProfileHeader: React.FC<PlantProfileHeaderProps> = ({
  plant,
  dataState,
  onDataStateChange,
}) => {
  const isOffline = dataState === 'offline';
  const isStale = dataState === 'stale';
  const isInvalid = dataState === 'invalid';

  const connectionStatus = isOffline
    ? 'Disconnected'
    : isStale
    ? 'Degraded (Stale)'
    : isInvalid
    ? 'Warning (Bad Packets)'
    : 'Connected & Streaming';

  const lastReceived = isOffline
    ? 'Connection Lost (2h 14m ago)'
    : isStale
    ? '42 minutes ago (Stale heartbeat)'
    : isInvalid
    ? '8 seconds ago (CRC Mismatch)'
    : plant.lastUpdated;

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Botanical Plate & Plant Taxonomic Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Botanical Plate Image Frame */}
          <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-[#F8F8F4] border border-[#E5EBE3] p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative">
            <img
              src={plant.illustrationUrl}
              alt={plant.commonName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
            <span className="absolute bottom-1 right-1 text-[8px] font-mono text-[#78847C] bg-white/80 px-1 rounded">
              Plate 0{plant.code.slice(-1)}
            </span>
          </div>

          {/* Plant Identity and Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#EEF3ED] text-[#173F32]">
                {plant.code}
              </span>
              <span className="text-xs text-[#78847C]">·</span>
              <span className="text-xs text-[#78847C] font-mono">
                {plant.nodeId}
              </span>
              <span className="text-xs text-[#78847C]">·</span>
              <span className="text-xs text-[#78847C]">
                Family {plant.family}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-[#173F32] tracking-tight">
              {plant.commonName}
            </h1>

            <p className="text-sm text-[#78847C] italic font-serif mt-0.5">
              {plant.scientificName}
            </p>

            {/* Profile Status Strip */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              {/* Connection Status */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium ${
                  isOffline
                    ? 'bg-[#F4F4F4] border-[#D1D5DB] text-[#6B7280]'
                    : isStale
                    ? 'bg-[#FFF8EB] border-[#C58A35]/30 text-[#C58A35]'
                    : isInvalid
                    ? 'bg-[#FFF2F0] border-[#C95D58]/30 text-[#C95D58]'
                    : 'bg-[#EEF3ED] border-[#A8BDA8]/40 text-[#245640]'
                }`}
              >
                {isOffline ? (
                  <WifiOff className="w-3.5 h-3.5 text-[#6B7280]" />
                ) : isStale ? (
                  <Clock className="w-3.5 h-3.5 text-[#C58A35]" />
                ) : isInvalid ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C95D58]" />
                ) : (
                  <Wifi className="w-3.5 h-3.5 text-[#245640]" />
                )}
                <span>Node: {connectionStatus}</span>
              </div>

              {/* Last Received Timestamp */}
              <div className="flex items-center gap-1 text-[#78847C] font-mono text-[11px]">
                <Clock className="w-3 h-3 text-[#A8BDA8]" />
                <span>Last payload: {lastReceived}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Baseline Learning Status & Data State Simulator */}
        <div className="lg:max-w-md w-full flex flex-col justify-between space-y-3 pt-3 lg:pt-0 lg:border-l lg:border-[#EEF3ED] lg:pl-6">
          {/* Baseline Learning Status Pill & Metric */}
          <div className="p-3.5 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[#173F32] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#245640]" />
                Baseline Learning Status
              </span>
              <span className="font-mono font-semibold text-[11px] text-[#245640] bg-[#EEF3ED] px-2 py-0.5 rounded">
                {plant.aiBaseline.learningProgressPercent}% Converged
              </span>
            </div>

            <p className="text-[11px] text-[#78847C] leading-snug">
              {plant.baselineStatusText} ({plant.aiBaseline.totalTrainingPoints.toLocaleString()} telemetry points analyzed under calibrated diurnal photoperiod).
            </p>

            {/* Micro progress bar */}
            <div className="w-full bg-[#E5EBE3] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#245640] h-full rounded-full"
                style={{ width: `${plant.aiBaseline.learningProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive State Simulator (Testing Unavailable, Stale, Invalid, Offline) */}
          <div className="p-2.5 rounded-lg bg-white border border-[#E5EBE3]">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#78847C] mb-1.5">
              <span>Telemetry Diagnostic State:</span>
              <span className="font-mono text-[10px] text-[#173F32] font-semibold">
                Simulated Test Harness
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(
                [
                  { id: 'normal', label: 'Valid' },
                  { id: 'stale', label: 'Stale' },
                  { id: 'invalid', label: 'Invalid' },
                  { id: 'offline', label: 'Offline' },
                ] as const
              ).map((state) => (
                <button
                  key={state.id}
                  onClick={() => onDataStateChange(state.id)}
                  className={`py-1 text-[10px] font-medium rounded transition-colors text-center cursor-pointer ${
                    dataState === state.id
                      ? 'bg-[#173F32] text-white font-semibold'
                      : 'bg-[#F4F7F3] text-[#78847C] hover:text-[#26342D]'
                  }`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
