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
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-6 shadow-xs relative overflow-hidden">
      {/* Decorative subtle botanical line motif in corner */}
      <div className="absolute right-0 top-0 bottom-0 w-80 pointer-events-none opacity-[0.06] flex items-center justify-end pr-6">
        <svg viewBox="0 0 200 200" className="w-64 h-64 text-[#173F32]" fill="currentColor">
          <path d="M100 0 C120 40 180 80 200 100 C160 120 120 180 100 200 C80 160 40 120 0 100 C40 80 80 40 100 0 Z" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-[#245640] tracking-wider uppercase">
              Adaptive Physiological Fingerprinting
            </span>
            <span className="text-[#A8BDA8]">·</span>
            <span className="text-[11px] text-[#78847C] font-mono">
              Chamber Alpha
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#173F32] tracking-tight">
            Your plants are whispering.
          </h1>

          <p className="text-sm text-[#78847C] mt-1 max-w-2xl leading-relaxed">
            Intelligent plant monitoring, environmental insights and early water-stress screening.
          </p>
        </div>

        {/* Quick Screening Status Pill strip */}
        <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EEF3ED] border border-[#A8BDA8]/40">
            <Activity className="w-4 h-4 text-[#173F32]" />
            <div className="text-left">
              <p className="text-[10px] text-[#78847C] font-medium leading-none">
                Active Screenings
              </p>
              <p className="text-xs font-semibold text-[#173F32] font-mono mt-0.5">
                {activeScreenings} Species Online
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              stressAlertCount > 0
                ? 'bg-[#FFF8F7] border-[#C95D58]/30'
                : 'bg-[#F4F7F3] border-[#A8BDA8]/30'
            }`}
          >
            {stressAlertCount > 0 ? (
              <AlertTriangle className="w-4 h-4 text-[#C95D58]" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#245640]" />
            )}
            <div className="text-left">
              <p className="text-[10px] text-[#78847C] font-medium leading-none">
                Screening Status
              </p>
              <p
                className={`text-xs font-semibold font-mono mt-0.5 ${
                  stressAlertCount > 0 ? 'text-[#C95D58]' : 'text-[#245640]'
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
