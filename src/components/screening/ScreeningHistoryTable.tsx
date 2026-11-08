/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  SAMPLE_SCREENING_HISTORY,
  ScreeningHistoryRecord,
  ScreeningOutcomeCategory,
} from '../../data/sampleData';
import { OUTCOME_DEFINITIONS } from './OutcomeCategoryBadges';
import { Search, History, Filter } from 'lucide-react';

export const ScreeningHistoryTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOutcome, setFilterOutcome] = useState<ScreeningOutcomeCategory | 'ALL'>('ALL');

  const filteredHistory = SAMPLE_SCREENING_HISTORY.filter((item) => {
    const matchesSearch =
      item.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.plantCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOutcome = filterOutcome === 'ALL' || item.outcome === filterOutcome;

    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9F0EA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
              Screening History & Audit Trail
            </h2>
            <span className="font-mono text-[10px] text-[#087E75] bg-[#D9F0EA] px-2 py-0.5 rounded font-semibold">
              Searchable Archive
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Historical evaluations recording expected vs. observed leaf temperatures, residuals, and corroborating soil moisture.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#78847C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search plant, ID, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5FAF8] border border-[#D4E7E1] rounded-lg text-[#26342D] placeholder-[#78847C] focus:outline-none focus:border-[#55B6A3]"
          />
        </div>
      </div>

      {/* Outcome Category Filters */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(['ALL', 'NORMAL', 'WATCH', 'POSSIBLE WATER STRESS', 'INCONCLUSIVE'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterOutcome(cat)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer ${
              filterOutcome === cat
                ? 'bg-[#123B36] text-white font-semibold shadow-xs'
                : 'bg-[#EDF7F4] text-[#78847C] hover:text-[#26342D] border border-[#D4E7E1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-[#D4E7E1] rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-[#F5FAF8] border-b border-[#D4E7E1] text-[#78847C] font-mono text-[11px]">
            <tr>
              <th className="p-3">Evaluation ID</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Target Plant</th>
              <th className="p-3">Outcome</th>
              <th className="p-3 text-right">Expected</th>
              <th className="p-3 text-right">Observed</th>
              <th className="p-3 text-right">Residual</th>
              <th className="p-3 text-right">Soil Moisture</th>
              <th className="p-3">Data Quality</th>
              <th className="p-3">Evidence Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9F0EA] text-[#26342D]">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-xs text-[#78847C]">
                  No screening evaluations match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredHistory.map((row) => {
                const outcomeDef = OUTCOME_DEFINITIONS[row.outcome];
                return (
                  <tr key={row.id} className="hover:bg-[#EEF7F4] transition-colors">
                    <td className="p-3 font-mono font-semibold text-[#123B36] whitespace-nowrap">
                      {row.id}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#78847C] whitespace-nowrap">
                      {row.timestamp}
                    </td>
                    <td className="p-3 font-medium whitespace-nowrap">
                      <span>{row.plantName}</span>{' '}
                      <span className="font-mono text-[10px] text-[#78847C]">[{row.plantCode}]</span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${outcomeDef.badgeStyle}`}
                      >
                        {row.outcome}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      {row.expectedLeafTemp !== null ? `${row.expectedLeafTemp.toFixed(1)}°C` : '--'}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      {row.observedLeafTemp !== null ? `${row.observedLeafTemp.toFixed(1)}°C` : '--'}
                    </td>
                    <td
                      className={`p-3 text-right font-mono font-bold tabular-nums ${
                        row.residual !== null && row.residual > 1.8
                          ? 'text-[#C95D58]'
                          : row.residual !== null && row.residual > 0.5
                          ? 'text-[#C58A35]'
                          : 'text-[#087E75]'
                      }`}
                    >
                      {row.residual !== null
                        ? `${row.residual > 0 ? `+${row.residual.toFixed(1)}` : row.residual.toFixed(1)}°C`
                        : '--'}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-[#123B36]">
                      {row.soilMoistureEvidence !== null ? `${row.soilMoistureEvidence.toFixed(1)}%` : '--'}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#78847C] whitespace-nowrap">
                      {row.dataQuality}
                    </td>
                    <td className="p-3 text-[11px] text-[#78847C] max-w-xs">
                      {row.notes}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-[#D9F0EA] flex items-center justify-between text-[11px] text-[#78847C]">
        <span>Showing {filteredHistory.length} verified screening evaluations.</span>
        <span className="font-mono text-[#087E75]">SAMPLE DATA ARCHIVE</span>
      </div>
    </div>
  );
};
