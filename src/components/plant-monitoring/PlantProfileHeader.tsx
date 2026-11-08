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
}

export const PlantProfileHeader: React.FC<PlantProfileHeaderProps> = ({
  plant,
  dataState,
}) => {
  const isOffline = dataState === 'offline' || !plant.hasReceivedData;
  const isStale = dataState === 'stale';
  const isInvalid = dataState === 'invalid';

  const connectionStatus = isOffline
    ? 'Disconnected (Node Offline)'
    : isStale
    ? 'Degraded (Stale)'
    : isInvalid
    ? 'Warning (Bad Packets)'
    : 'Connected & Streaming';

  const lastReceived = isOffline
    ? 'Awaiting first telemetry packet'
    : isStale
    ? '42 minutes ago (Stale heartbeat)'
    : isInvalid
    ? 'CRC Mismatch'
    : plant.lastUpdated;

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Botanical Plate & Plant Taxonomic Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Botanical Plate Image Frame */}
          <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-[#F5FAF8] border border-[#D4E7E1] p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative">
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
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#D9F0EA] text-[#123B36]">
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

            <h1 className="text-2xl sm:text-3xl font-semibold text-[#123B36] tracking-tight">
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
                    : 'bg-[#D9F0EA] border-[#55B6A3]/40 text-[#087E75]'
                }`}
              >
                {isOffline ? (
                  <WifiOff className="w-3.5 h-3.5 text-[#6B7280]" />
                ) : isStale ? (
                  <Clock className="w-3.5 h-3.5 text-[#C58A35]" />
                ) : isInvalid ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C95D58]" />
                ) : (
                  <Wifi className="w-3.5 h-3.5 text-[#087E75]" />
                )}
                <span>Node: {connectionStatus}</span>
              </div>

              {/* Last Received Timestamp */}
              <div className="flex items-center gap-1 text-[#78847C] font-mono text-[11px]">
                <Clock className="w-3 h-3 text-[#55B6A3]" />
                <span>Last payload: {lastReceived}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Baseline Learning Status & Data State Simulator */}
        <div className="lg:max-w-md w-full flex flex-col justify-between space-y-3 pt-3 lg:pt-0 lg:border-l lg:border-[#D9F0EA] lg:pl-6">
          {/* Baseline Learning Status Pill & Metric */}
          <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[#123B36] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#087E75]" />
                Baseline Learning Status
              </span>
              <span className="font-mono font-semibold text-[11px] text-[#087E75] bg-[#D9F0EA] px-2 py-0.5 rounded">
                {plant.aiBaseline.learningProgressPercent}% Converged
              </span>
            </div>

            <p className="text-[11px] text-[#78847C] leading-snug">
              {plant.baselineStatusText} ({plant.aiBaseline.totalTrainingPoints.toLocaleString()} telemetry points analyzed under calibrated diurnal photoperiod).
            </p>

            {/* Micro progress bar */}
            <div className="w-full bg-[#D4E7E1] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#087E75] h-full rounded-full"
                style={{ width: `${plant.aiBaseline.learningProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Physical Edge Node Integration Status */}
          <div className="p-3 rounded-lg bg-white border border-[#D4E7E1] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#78847C]">
              <span>Hardware Fleet Channel:</span>
              <span className="font-mono text-[10px] text-[#087E75] font-semibold bg-[#EDF7F4] px-1.5 py-0.5 rounded border border-[#55B6A3]/30">
                802.11 b/g/n Mesh
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#26342D] font-semibold">Node {plant.nodeId}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  plant.hasReceivedData
                    ? 'bg-[#D9F0EA] text-[#087E75]'
                    : 'bg-[#FFF8EB] text-[#C58A35] border border-[#C58A35]/30'
                }`}
              >
                {plant.hardwareStatus || 'WAITING FOR FIRST DATA'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
