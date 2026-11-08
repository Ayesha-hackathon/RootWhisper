/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  ArrowUpDown,
  FileCode,
  Info,
} from 'lucide-react';
import { SensorChannelDiagnostic, DataValidityState } from '../../types';
import { formatDiagnosticReading } from '../../data/diagnosticsData';

interface DetailedDiagnosticTableProps {
  channels: SensorChannelDiagnostic[];
  selectedNodeFilter: string;
  onSelectNodeFilter: (nodeId: string) => void;
  onInspectChannel?: (channel: SensorChannelDiagnostic) => void;
}

export const DetailedDiagnosticTable: React.FC<DetailedDiagnosticTableProps> = ({
  channels,
  selectedNodeFilter,
  onSelectNodeFilter,
  onInspectChannel,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [validityFilter, setValidityFilter] = useState<string>('all');
  const [inspectModalChannel, setInspectModalChannel] = useState<SensorChannelDiagnostic | null>(null);

  // Filter channels
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      // Node filter
      if (selectedNodeFilter !== 'all' && ch.nodeId !== selectedNodeFilter) {
        return false;
      }
      // Validity filter
      if (validityFilter === 'valid' && ch.validity !== 'valid') {
        return false;
      }
      if (validityFilter === 'issues') {
        if (ch.validity === 'valid') return false;
      }
      if (validityFilter === 'stale' && ch.validity !== 'stale') {
        return false;
      }
      if (validityFilter === 'error' && ch.validity !== 'invalid' && ch.validity !== 'unavailable') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ch.sensorName.toLowerCase().includes(q);
        const matchesModel = ch.sensorModel.toLowerCase().includes(q);
        const matchesNode = ch.nodeId.toLowerCase().includes(q);
        const matchesBus = ch.busInterface.toLowerCase().includes(q);
        const matchesDiag = ch.diagnosticStatus.toLowerCase().includes(q);
        return matchesName || matchesModel || matchesNode || matchesBus || matchesDiag;
      }

      return true;
    });
  }, [channels, selectedNodeFilter, validityFilter, searchQuery]);

  return (
    <div className="bg-white rounded-xl border border-[#D4E7E1] shadow-xs overflow-hidden">
      {/* Table Header & Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E1EFEA] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#123B36]">
                Detailed Sensor Diagnostic Matrix
              </h3>
              <span className="text-xs font-mono text-[#78847C]">
                ({filteredChannels.length} of {channels.length} channels)
              </span>
            </div>
            <p className="text-xs text-[#78847C] mt-0.5">
              Live hardware telemetry, bus interfaces, measurement validity, and diagnostic status across all ESP32 nodes.
            </p>
          </div>

          {/* Node Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#EDF7F4] rounded-lg border border-[#D4E7E1] self-start sm:self-auto shrink-0">
            <button
              onClick={() => onSelectNodeFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedNodeFilter === 'all'
                  ? 'bg-white text-[#123B36] shadow-xs font-semibold'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              All Nodes ({channels.length})
            </button>
            <button
              onClick={() => onSelectNodeFilter('TULSI_01')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedNodeFilter === 'TULSI_01'
                  ? 'bg-white text-[#123B36] shadow-xs font-semibold'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              TULSI_01
            </button>
            <button
              onClick={() => onSelectNodeFilter('HIBISCUS_01')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedNodeFilter === 'HIBISCUS_01'
                  ? 'bg-white text-[#123B36] shadow-xs font-semibold'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              HIBISCUS_01
            </button>
            <button
              onClick={() => onSelectNodeFilter('MONEYPLANT_01')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedNodeFilter === 'MONEYPLANT_01'
                  ? 'bg-white text-[#123B36] shadow-xs font-semibold'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              MONEYPLANT_01
            </button>
          </div>
        </div>

        {/* Search & Validity Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#78847C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sensor, bus (e.g. 0x5A), status, or node..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5FAF8] border border-[#D4E7E1] rounded-lg text-[#26342D] placeholder-[#78847C] focus:outline-none focus:border-[#123B36]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#78847C] hover:text-[#123B36]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Validity Filter Segment */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#78847C] font-medium hidden md:inline">Validity:</span>
            <div className="flex items-center gap-1 p-0.5 bg-[#EDF7F4] rounded-lg border border-[#D4E7E1]">
              <button
                onClick={() => setValidityFilter('all')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  validityFilter === 'all'
                    ? 'bg-white text-[#123B36] font-semibold shadow-xs'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setValidityFilter('valid')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  validityFilter === 'valid'
                    ? 'bg-white text-[#087E75] font-semibold shadow-xs'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                Valid
              </button>
              <button
                onClick={() => setValidityFilter('issues')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  validityFilter === 'issues'
                    ? 'bg-white text-[#C95D58] font-semibold shadow-xs'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                Alerts & Errors
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F0F7F4] border-b border-[#D4E7E1] text-[11px] font-semibold text-[#78847C] uppercase tracking-wider">
              <th className="py-3 px-4">Sensor & Hardware Interface</th>
              <th className="py-3 px-3">Node ID</th>
              <th className="py-3 px-3">Current Reading</th>
              <th className="py-3 px-3">Data Validity</th>
              <th className="py-3 px-4">Diagnostic Status / Self-Test</th>
              <th className="py-3 px-3">Calibration Status</th>
              <th className="py-3 px-3">Last Update</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1EFEA] text-xs">
            {filteredChannels.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#78847C]">
                  <Layers className="w-8 h-8 text-[#55B6A3] mx-auto mb-2 opacity-50" />
                  <p className="font-medium text-xs">No sensor channels match the selected filters.</p>
                  <p className="text-[11px] text-[#78847C] mt-0.5">
                    Try adjusting your search query or reset the node/validity filters.
                  </p>
                </td>
              </tr>
            ) : (
              filteredChannels.map((channel) => {
                // Apply strict scientific rule: Intercept -99.0°C or corrupted values!
                const formatted = formatDiagnosticReading(
                  channel.reading,
                  channel.unit,
                  channel.validity
                );

                const isValid = channel.validity === 'valid';
                const isStale = channel.validity === 'stale';
                const isInvalid = channel.validity === 'invalid';
                const isUnavailable = channel.validity === 'unavailable';

                return (
                  <tr
                    key={channel.id}
                    className={`hover:bg-[#F5FAF8] transition-colors ${
                      formatted.isError
                        ? 'bg-[#FDF2F2]/40'
                        : isStale
                        ? 'bg-[#FFF8EB]/30'
                        : ''
                    }`}
                  >
                    {/* 1. Sensor Name & Hardware Interface */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#123B36]">
                        {channel.sensorName}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#78847C] mt-0.5">
                        <span>{channel.sensorModel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono bg-[#D9F0EA] text-[#087E75] px-1.5 py-0.2 rounded text-[10px]">
                          {channel.busInterface}
                        </span>
                      </div>
                    </td>

                    {/* 2. Node ID */}
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-semibold text-[#123B36] text-xs">
                        {channel.nodeId}
                      </span>
                      <span className="text-[10px] text-[#78847C] block">
                        {channel.nodeId === 'TULSI_01'
                          ? 'Tulsi'
                          : channel.nodeId === 'HIBISCUS_01'
                          ? 'Hibiscus'
                          : 'Money Plant'}
                      </span>
                    </td>

                    {/* 3. Current Reading (CRITICAL INVALID DATA RULE APPLIED) */}
                    <td className="py-3.5 px-3">
                      {formatted.isError ? (
                        <div className="flex items-center gap-1.5">
                          <AlertOctagon className="w-3.5 h-3.5 text-[#C95D58] shrink-0" />
                          <span className="font-mono text-xs font-bold text-[#C95D58] tracking-tight">
                            {formatted.display}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1 font-mono font-semibold text-sm text-[#26342D] tabular-nums">
                          <span>{formatted.display}</span>
                          <span className="text-[11px] font-normal text-[#78847C]">
                            {formatted.unitDisplay}
                          </span>
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-[#78847C] block truncate max-w-[130px]">
                        {channel.rawReading}
                      </span>
                    </td>

                    {/* 4. Data Validity */}
                    <td className="py-3.5 px-3">
                      {isValid && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D9F0EA] text-[#087E75]">
                          <CheckCircle2 className="w-3 h-3 text-[#087E75]" />
                          VALID
                        </span>
                      )}
                      {isStale && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFF8EB] text-[#C58A35]">
                          <AlertTriangle className="w-3 h-3 text-[#C58A35]" />
                          STALE
                        </span>
                      )}
                      {(isInvalid || formatted.isError) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FDF2F2] text-[#C95D58]">
                          <AlertOctagon className="w-3 h-3 text-[#C95D58]" />
                          ERROR
                        </span>
                      )}
                      {isUnavailable && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF7F4] text-[#78847C]">
                          OFFLINE
                        </span>
                      )}
                    </td>

                    {/* 5. Diagnostic Status / Self-Test */}
                    <td className="py-3.5 px-4">
                      <p
                        className={`text-xs font-medium leading-snug ${
                          formatted.isError
                            ? 'text-[#C95D58] font-semibold'
                            : isStale
                            ? 'text-[#C58A35]'
                            : 'text-[#26342D]'
                        }`}
                      >
                        {formatted.isError && formatted.alertNote
                          ? formatted.alertNote
                          : channel.diagnosticStatus}
                      </p>
                      <span className="text-[10px] text-[#78847C] block mt-0.5">
                        Nominal: {channel.nominalRange}
                      </span>
                    </td>

                    {/* 6. Calibration Status */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-[#087E75]">
                        <CheckCircle2 className="w-3 h-3 text-[#087E75]" />
                        <span>Calibrated</span>
                      </div>
                      <span className="text-[10px] text-[#78847C] block truncate max-w-[130px]">
                        {channel.calibration.offset} · {channel.calibration.date}
                      </span>
                    </td>

                    {/* 7. Last Update */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`font-mono text-xs ${
                          isStale
                            ? 'text-[#C58A35] font-semibold'
                            : isUnavailable
                            ? 'text-[#78847C]'
                            : 'text-[#26342D]'
                        }`}
                      >
                        {channel.lastUpdate}
                      </span>
                      <span className="text-[10px] text-[#78847C] block">
                        {channel.lastUpdateSecondsAgo < 30 ? 'Telemetry fresh' : 'Delay detected'}
                      </span>
                    </td>

                    {/* 8. Action (Channel Inspector) */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setInspectModalChannel(channel);
                          if (onInspectChannel) onInspectChannel(channel);
                        }}
                        className="py-1 px-2 rounded text-[11px] font-medium border border-[#D4E7E1] hover:border-[#123B36] hover:bg-[#D9F0EA] text-[#123B36] transition-colors cursor-pointer"
                        title="Inspect raw registers and calibration matrix"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary Notice */}
      <div className="p-3 bg-[#F0F7F4] border-t border-[#E1EFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#78847C]">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#123B36]" />
          <span>
            Hardware Sanitizer Rule: Out-of-bounds readings (&lt; -50°C, e.g. -99.0°C) are trapped at ingestion and displayed as SENSOR ERROR.
          </span>
        </div>
        <div className="font-mono text-[11px] self-end sm:self-auto">
          I2C Bus Clock: 400 kHz Fast-Mode
        </div>
      </div>

      {/* Channel Inspection Modal */}
      {inspectModalChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full border border-[#D4E7E1] shadow-xl p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#E1EFEA]">
              <div>
                <span className="font-mono text-xs font-bold text-[#123B36] uppercase">
                  {inspectModalChannel.nodeId} · {inspectModalChannel.busInterface}
                </span>
                <h4 className="text-base font-semibold text-[#123B36]">
                  {inspectModalChannel.sensorName} Diagnostic Trace
                </h4>
                <p className="text-xs text-[#78847C]">
                  {inspectModalChannel.sensorModel}
                </p>
              </div>
              <button
                onClick={() => setInspectModalChannel(null)}
                className="text-[#78847C] hover:text-[#123B36] text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1] space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#78847C]">Raw Register Word:</span>
                  <span className="font-semibold text-[#123B36]">{inspectModalChannel.rawReading}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78847C]">Calculated Metric:</span>
                  <span className="font-semibold text-[#087E75]">
                    {inspectModalChannel.reading !== null ? `${inspectModalChannel.reading} ${inspectModalChannel.unit}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78847C]">Validity State:</span>
                  <span className="font-semibold uppercase">{inspectModalChannel.validity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78847C]">Bus Interface:</span>
                  <span>{inspectModalChannel.busInterface}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#78847C] uppercase tracking-wider block">
                  Calibration Specification
                </span>
                <p className="text-xs text-[#26342D] bg-[#F0F7F4] p-2.5 rounded border border-[#D4E7E1]">
                  Method: <span className="font-medium">{inspectModalChannel.calibration.method}</span>
                  <br />
                  Calibration Offset: <span className="font-mono font-medium">{inspectModalChannel.calibration.offset}</span>
                  <br />
                  Certified Date: <span className="font-mono">{inspectModalChannel.calibration.date}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#78847C] uppercase tracking-wider block">
                  Self-Test Diagnostic Evaluation
                </span>
                <p className="text-xs text-[#26342D] bg-[#F0F7F4] p-2.5 rounded border border-[#D4E7E1]">
                  {inspectModalChannel.diagnosticStatus}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E1EFEA] flex justify-end">
              <button
                onClick={() => setInspectModalChannel(null)}
                className="py-1.5 px-4 rounded text-xs font-medium bg-[#123B36] text-white hover:bg-[#087E75] transition-colors cursor-pointer"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
