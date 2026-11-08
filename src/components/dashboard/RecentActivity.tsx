/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActivityEvent,
} from '../../types';
import {
  Activity,
  Cpu,
  Droplets,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface RecentActivityProps {
  events: ActivityEvent[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ events }) => {
  const [filter, setFilter] = useState<'all' | 'screening' | 'node' | 'irrigation'>('all');

  const filteredEvents =
    filter === 'all' ? events : events.filter((e) => e.category === filter);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'screening':
        return <Activity className="w-3.5 h-3.5 text-[#123B36]" />;
      case 'node':
        return <Cpu className="w-3.5 h-3.5 text-[#087E75]" />;
      case 'irrigation':
        return <Droplets className="w-3.5 h-3.5 text-[#123B36]" />;
      case 'calibration':
      default:
        return <Sliders className="w-3.5 h-3.5 text-[#78847C]" />;
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D9F0EA]">
        <div>
          <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
            Recent System Activity & AI Screenings
          </h2>
          <p className="text-xs text-[#78847C] mt-0.5">
            Audit log of physiological detections, node mesh heartbeats, and irrigation events.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#EDF7F4] rounded-lg border border-[#D4E7E1] shrink-0">
          {(['all', 'screening', 'node', 'irrigation'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors cursor-pointer ${
                filter === cat
                  ? 'bg-white text-[#123B36] shadow-xs font-semibold'
                  : 'text-[#78847C] hover:text-[#26342D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#78847C]">
            No activity events recorded under this filter.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isAlert = evt.severity === 'alert';
            const isWarning = evt.severity === 'warning';
            return (
              <div
                key={evt.id}
                className="p-3 rounded-lg bg-[#F5FAF8] border border-[#D9F0EA] flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-6 h-6 rounded-md bg-white border border-[#D4E7E1] flex items-center justify-center shrink-0">
                    {getCategoryIcon(evt.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] text-[#78847C]">
                        {evt.timestamp}
                      </span>
                      {evt.plantName && (
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#D9F0EA] text-[#123B36] font-semibold">
                          {evt.plantName}
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-semibold text-[#78847C] tracking-wide">
                        {evt.category}
                      </span>
                    </div>
                    <p className="text-[#26342D] leading-relaxed">
                      {evt.message}
                    </p>
                  </div>
                </div>

                {evt.metric && (
                  <span
                    className={`font-mono font-semibold text-[11px] px-2 py-0.5 rounded shrink-0 whitespace-nowrap ${
                      isAlert
                        ? 'bg-[#FFF2F0] text-[#C95D58]'
                        : isWarning
                        ? 'bg-[#FFF8EB] text-[#C58A35]'
                        : 'bg-[#D9F0EA] text-[#087E75]'
                    }`}
                  >
                    {evt.metric}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
