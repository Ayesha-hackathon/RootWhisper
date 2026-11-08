/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { CommunicationErrorRecord } from '../../types';

interface CommunicationErrorHistoryProps {
  errors: CommunicationErrorRecord[];
  onClearResolved?: () => void;
}

export const CommunicationErrorHistory: React.FC<CommunicationErrorHistoryProps> = ({
  errors,
  onClearResolved,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [nodeFilter, setNodeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredErrors = useMemo(() => {
    return errors.filter((err) => {
      if (severityFilter !== 'all' && err.severity !== severityFilter) {
        return false;
      }
      if (nodeFilter !== 'all' && err.nodeId !== nodeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesType = err.errorType.toLowerCase().includes(q);
        const matchesDesc = err.description.toLowerCase().includes(q);
        const matchesNode = err.nodeId.toLowerCase().includes(q);
        return matchesType || matchesDesc || matchesNode;
      }
      return true;
    });
  }, [errors, severityFilter, nodeFilter, searchQuery]);

  return (
    <div className="bg-white rounded-xl border border-[#D4E7E1] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#E1EFEA] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#123B36]">
                Communication & Hardware Error History
              </h3>
              <span className="text-xs font-mono text-[#78847C]">
                ({filteredErrors.length} logged events)
              </span>
            </div>
            <p className="text-xs text-[#78847C] mt-0.5">
              Audit log of CRC32 checksum errors, frame sequence gaps, Wi-Fi reconnects, and out-of-bounds telemetry intercepts.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#78847C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search error type, frame, or description..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5FAF8] border border-[#D4E7E1] rounded-lg text-[#26342D] placeholder-[#78847C] focus:outline-none focus:border-[#123B36]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            {/* Severity Tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-[#EDF7F4] rounded-lg border border-[#D4E7E1]">
              <button
                onClick={() => setSeverityFilter('all')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  severityFilter === 'all'
                    ? 'bg-white text-[#123B36] font-semibold shadow-xs'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                All Severities
              </button>
              <button
                onClick={() => setSeverityFilter('critical')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  severityFilter === 'critical'
                    ? 'bg-white text-[#C95D58] font-semibold shadow-xs'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setSeverityFilter('warning')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  severityFilter === 'warning'
                    ? 'bg-white text-[#C58A35] font-semibold shadow-xs'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                Warning
              </button>
              <button
                onClick={() => setSeverityFilter('nominal')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  severityFilter === 'nominal'
                    ? 'bg-white text-[#087E75] font-semibold shadow-xs'
                    : 'text-[#78847C] hover:text-[#26342D]'
                }`}
              >
                Nominal
              </button>
            </div>

            {/* Node Selector */}
            <select
              value={nodeFilter}
              onChange={(e) => setNodeFilter(e.target.value)}
              className="py-1 px-2.5 text-xs bg-[#F5FAF8] border border-[#D4E7E1] rounded-lg text-[#26342D] focus:outline-none focus:border-[#123B36] cursor-pointer"
            >
              <option value="all">All Nodes</option>
              <option value="TULSI_01">TULSI_01</option>
              <option value="HIBISCUS_01">HIBISCUS_01</option>
              <option value="MONEYPLANT_01">MONEYPLANT_01</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F0F7F4] border-b border-[#D4E7E1] text-[11px] font-semibold text-[#78847C] uppercase tracking-wider">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-3">Node ID</th>
              <th className="py-3 px-3">Severity</th>
              <th className="py-3 px-3">Error / Event Type</th>
              <th className="py-3 px-4">Detailed Description & Diagnostics</th>
              <th className="py-3 px-3">Frame Ref</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1EFEA] text-xs">
            {filteredErrors.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#78847C]">
                  <CheckCircle2 className="w-8 h-8 text-[#087E75] mx-auto mb-2 opacity-50" />
                  <p className="font-medium text-xs">No communication errors found.</p>
                  <p className="text-[11px] text-[#78847C] mt-0.5">
                    All ESP32 telemetry frames are transmitting within nominal CRC32 bounds.
                  </p>
                </td>
              </tr>
            ) : (
              filteredErrors.map((err) => {
                const isCrit = err.severity === 'critical';
                const isWarn = err.severity === 'warning';

                return (
                  <tr
                    key={err.id}
                    className={`hover:bg-[#F5FAF8] transition-colors ${
                      isCrit ? 'bg-[#FDF2F2]/30' : isWarn ? 'bg-[#FFF8EB]/20' : ''
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-4 font-mono text-[11px] text-[#78847C] whitespace-nowrap">
                      {err.timestamp}
                    </td>

                    {/* Node ID */}
                    <td className="py-3 px-3 font-mono font-semibold text-xs text-[#123B36]">
                      {err.nodeId}
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isCrit && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FDF2F2] text-[#C95D58]">
                          <AlertOctagon className="w-3 h-3 text-[#C95D58]" />
                          CRITICAL
                        </span>
                      )}
                      {isWarn && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFF8EB] text-[#C58A35]">
                          <AlertTriangle className="w-3 h-3 text-[#C58A35]" />
                          WARNING
                        </span>
                      )}
                      {!isCrit && !isWarn && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D9F0EA] text-[#087E75]">
                          <Info className="w-3 h-3 text-[#087E75]" />
                          NOMINAL
                        </span>
                      )}
                    </td>

                    {/* Error Type */}
                    <td className="py-3 px-3 font-medium text-[#123B36] whitespace-nowrap">
                      {err.errorType}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-[#26342D] max-w-md">
                      <p className="leading-snug">{err.description}</p>
                      {err.rawHex && (
                        <span className="font-mono text-[10px] text-[#78847C] block mt-0.5 truncate">
                          Hex Dump: {err.rawHex}
                        </span>
                      )}
                    </td>

                    {/* Sequence Ref */}
                    <td className="py-3 px-3 font-mono text-[11px] text-[#78847C] whitespace-nowrap">
                      {err.sequenceNumber ? `#${err.sequenceNumber}` : '--'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#087E75]">
                        <CheckCircle2 className="w-3 h-3 text-[#087E75]" />
                        Resolved
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#F0F7F4] border-t border-[#E1EFEA] flex items-center justify-between text-xs text-[#78847C]">
        <span>
          Auto-purging resolved non-critical logs after 72 hours.
        </span>
        {onClearResolved && (
          <button
            onClick={onClearResolved}
            className="text-[11px] text-[#123B36] hover:underline font-medium cursor-pointer"
          >
            Clear Resolved
          </button>
        )}
      </div>
    </div>
  );
};
