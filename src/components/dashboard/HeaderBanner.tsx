/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface HeaderBannerProps {
  activeScreenings: number;
  stressAlertCount: number;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  activeScreenings,
  stressAlertCount,
}) => {
  return (
    <div className="bg-gradient-to-r from-[#123B36] via-[#0E352F] to-[#087E75] rounded-xl border border-[#1A4D45] p-6 shadow-sm relative overflow-hidden text-white">
      {/* Decorative subtle botanical line motif in corner */}
      <div className="absolute right-0 top-0 bottom-0 w-80 pointer-events-none opacity-15 flex items-center justify-end pr-6">
        <svg viewBox="0 0 200 200" className="w-64 h-64 text-[#55B6A3]" fill="currentColor">
          <path d="M100 0 C120 40 180 80 200 100 C160 120 120 180 100 200 C80 160 40 120 0 100 C40 80 80 40 100 0 Z" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-[#55B6A3] tracking-wider uppercase">
              Adaptive Physiological Fingerprinting
            </span>
            <span className="text-[#55B6A3]/60">·</span>
            <span className="text-[11px] text-[#D9F0EA]/80 font-mono">
              Chamber Alpha
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Your plants are whispering.
          </h1>

          <p className="text-sm text-[#D9F0EA]/90 mt-1 max-w-2xl leading-relaxed">
            Intelligent plant monitoring, environmental insights and early water-stress screening.
          </p>
        </div>

        {/* Quick Screening Status Pill strip */}
        <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A2622]/80 backdrop-blur-xs border border-[#55B6A3]/30">
            <Activity className="w-4 h-4 text-[#55B6A3]" />
            <div className="text-left">
              <p className="text-[10px] text-[#D9F0EA]/70 font-medium leading-none">
                Active Screenings
              </p>
              <p className="text-xs font-semibold text-white font-mono mt-0.5">
                {activeScreenings} Species Online
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              stressAlertCount > 0
                ? 'bg-[#C95D58]/20 border-[#C95D58]/50 text-white'
                : 'bg-[#0A2622]/80 backdrop-blur-xs border-[#55B6A3]/30 text-white'
            }`}
          >
            {stressAlertCount > 0 ? (
              <AlertTriangle className="w-4 h-4 text-[#C95D58]" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#55B6A3]" />
            )}
            <div className="text-left">
              <p className="text-[10px] text-[#D9F0EA]/70 font-medium leading-none">
                Screening Status
              </p>
              <p
                className={`text-xs font-semibold font-mono mt-0.5 ${
                  stressAlertCount > 0 ? 'text-[#C95D58]' : 'text-white'
                }`}
              >
                {stressAlertCount > 0 ? `${stressAlertCount} Stress Alert` : 'All Nominal'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
