/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sprout, Radio, Activity, CheckCircle2 } from 'lucide-react';
import { KpiSummary } from '../../types';

interface KpiOverviewProps {
  kpis: KpiSummary;
  onFilterNodes?: () => void;
  onViewScreenings?: () => void;
}

export const KpiOverview: React.FC<KpiOverviewProps> = ({
  kpis,
  onFilterNodes,
  onViewScreenings,
}) => {
  const cards = [
    {
      id: 'plants',
      title: 'Plants Monitored',
      value: `0${kpis.plantsMonitored}`,
      subtext: 'Species calibrated: Tulsi, Hibiscus, Pothos',
      icon: Sprout,
      badge: 'Active Fleet',
      badgeColor: 'text-[#245640] bg-[#EEF3ED]',
      action: undefined,
    },
    {
      id: 'nodes',
      title: 'Nodes Online',
      value: `${kpis.nodesOnline}/${kpis.totalNodes}`,
      subtext: 'ESP32 Wi-Fi Mesh · 100% Signal Integrity',
      icon: Radio,
      badge: kpis.nodesOnline === kpis.totalNodes ? 'Mesh Stable' : 'Degraded',
      badgeColor: 'text-[#245640] bg-[#EEF3ED]',
      action: onFilterNodes,
    },
    {
      id: 'screenings',
      title: 'Active Screenings',
      value: `0${kpis.activeScreenings}`,
      subtext: 'Continuous CWSI & Leaf Thermal Profiling',
      icon: Activity,
      badge: 'Real-Time AI',
      badgeColor: 'text-[#173F32] bg-[#EEF3ED]',
      action: onViewScreenings,
    },
    {
      id: 'collection',
      title: 'Data Collection Status',
      value: `${kpis.dataCollectionHealth}%`,
      subtext: `${kpis.totalPacketsProcessedToday.toLocaleString()} telemetry packets today`,
      icon: CheckCircle2,
      badge: 'Nominal Cadence',
      badgeColor: 'text-[#245640] bg-[#EEF3ED]',
      action: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.action}
            className={`bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-4 shadow-xs flex flex-col justify-between transition-all hover:border-[#A8BDA8] ${
              card.action ? 'cursor-pointer hover:shadow-sm' : ''
            }`}
          >
            {/* Header: Title and Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#78847C] tracking-tight">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3] flex items-center justify-center text-[#173F32] shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Metric Value */}
            <div className="my-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[#173F32] tracking-tight tabular-nums">
                  {card.value}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
            </div>

            {/* Subtext */}
            <div className="pt-2 border-t border-[#F4F7F3] flex items-center justify-between text-[11px] text-[#78847C]">
              <span className="truncate">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
