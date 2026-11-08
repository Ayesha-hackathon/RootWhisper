/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertOctagon,
  Clock,
  WifiOff,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export type DiagnosticStatePreset =
  | 'nominal'
  | 'sensor-error-99'
  | 'stale-telemetry'
  | 'node-offline'
  | 'loading-scan';

interface DiagnosticStateSimulatorProps {
  currentPreset: DiagnosticStatePreset;
  onSelectPreset: (preset: DiagnosticStatePreset) => void;
  onReset: () => void;
}

export const DiagnosticStateSimulator: React.FC<DiagnosticStateSimulatorProps> = ({
  currentPreset,
  onSelectPreset,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#D4E7E1] shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#D9F0EA] flex items-center justify-center text-[#123B36]">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#123B36] uppercase tracking-wider">
              Diagnostic State Simulator & Ingestion Test Bench
            </h4>
            <p className="text-[11px] text-[#78847C]">
              Verify graceful UI handling of nominal, stale, offline, and corrupt (-99.0°C) telemetry states.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="self-start sm:self-auto flex items-center gap-1.5 py-1 px-2.5 rounded text-xs font-medium border border-[#D4E7E1] hover:border-[#123B36] bg-[#F5FAF8] text-[#123B36] hover:bg-[#D9F0EA] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset to Live Sample Data</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {/* Preset 1: Nominal */}
        <button
          onClick={() => onSelectPreset('nominal')}
          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
            currentPreset === 'nominal'
              ? 'bg-[#D9F0EA] border-[#087E75] text-[#123B36] shadow-xs'
              : 'bg-[#F5FAF8] border-[#D4E7E1] text-[#26342D] hover:bg-[#D9F0EA]/40'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#087E75]" />
            <span>All Nominal</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-0.5 leading-tight">
            All 3 nodes online, fresh packets, zero bus faults.
          </p>
        </button>

        {/* Preset 2: Corrupt -99.0°C */}
        <button
          onClick={() => onSelectPreset('sensor-error-99')}
          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
            currentPreset === 'sensor-error-99'
              ? 'bg-[#FDF2F2] border-[#C95D58] text-[#C95D58] shadow-xs'
              : 'bg-[#F5FAF8] border-[#D4E7E1] text-[#26342D] hover:bg-[#FDF2F2]/40'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C95D58]">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>-99.0°C Error State</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-0.5 leading-tight">
            MLX90614 fault on HIBISCUS_01 triggers SENSOR ERROR.
          </p>
        </button>

        {/* Preset 3: Stale Telemetry */}
        <button
          onClick={() => onSelectPreset('stale-telemetry')}
          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
            currentPreset === 'stale-telemetry'
              ? 'bg-[#FFF8EB] border-[#C58A35] text-[#C58A35] shadow-xs'
              : 'bg-[#F5FAF8] border-[#D4E7E1] text-[#26342D] hover:bg-[#FFF8EB]/40'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C58A35]">
            <Clock className="w-3.5 h-3.5" />
            <span>Stale Telemetry</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-0.5 leading-tight">
            TULSI_01 telemetry delayed &gt;45 min, flags STALE.
          </p>
        </button>

        {/* Preset 4: Node Offline */}
        <button
          onClick={() => onSelectPreset('node-offline')}
          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
            currentPreset === 'node-offline'
              ? 'bg-[#FDF2F2] border-[#C95D58] text-[#C95D58] shadow-xs'
              : 'bg-[#F5FAF8] border-[#D4E7E1] text-[#26342D] hover:bg-[#FDF2F2]/40'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C95D58]">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Node Offline</span>
          </div>
          <p className="text-[10px] text-[#78847C] mt-0.5 leading-tight">
            MONEYPLANT_01 Wi-Fi carrier drops; shows OFFLINE (N/A).
          </p>
        </button>
      </div>
    </div>
  );
};
