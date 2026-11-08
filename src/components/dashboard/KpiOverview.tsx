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
  const isAllOffline = kpis.nodesOnline === 0;

  const cards = [
    {
      id: 'plants',
      title: 'Plants Monitored',
      value: `0${kpis.plantsMonitored}`,
      subtext: 'Species calibrated: Tulsi, Hibiscus, Pothos',
      icon: Sprout,
      badge: 'Active Fleet',
      badgeColor: 'text-[#087E75] bg-[#D9F0EA]',
      action: undefined,
    },
    {
      id: 'nodes',
      title: 'Nodes Online',
      value: `${kpis.nodesOnline}/${kpis.totalNodes}`,
      subtext: isAllOffline ? 'Hardware disconnected · Connect ESP32 nodes' : 'ESP32 Wi-Fi Mesh Connected',
      icon: Radio,
      badge: isAllOffline ? 'Offline' : (kpis.nodesOnline === kpis.totalNodes ? 'Mesh Stable' : 'Degraded'),
      badgeColor: isAllOffline ? 'text-[#78847C] bg-[#FAF9F3]' : 'text-[#087E75] bg-[#D9F0EA]',
      action: onFilterNodes,
    },
    {
      id: 'screenings',
      title: 'Active Screenings',
      value: `0${kpis.activeScreenings}`,
      subtext: isAllOffline ? 'Awaiting telemetry to initiate screening' : 'Continuous CWSI & Leaf Thermal Profiling',
      icon: Activity,
      badge: isAllOffline ? 'Standby' : 'Real-Time AI',
      badgeColor: isAllOffline ? 'text-[#78847C] bg-[#FAF9F3]' : 'text-[#123B36] bg-[#D9F0EA]',
      action: onViewScreenings,
    },
    {
      id: 'collection',
      title: 'Data Collection Status',
      value: `${kpis.dataCollectionHealth}%`,
      subtext: isAllOffline ? '0 telemetry packets today (Awaiting node stream)' : `${kpis.totalPacketsProcessedToday.toLocaleString()} telemetry packets today`,
      icon: CheckCircle2,
      badge: isAllOffline ? 'Awaiting Stream' : 'Nominal Cadence',
      badgeColor: isAllOffline ? 'text-[#78847C] bg-[#FAF9F3]' : 'text-[#087E75] bg-[#D9F0EA]',
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
            className={`bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-4 shadow-xs flex flex-col justify-between transition-all hover:border-[#55B6A3] ${
              card.action ? 'cursor-pointer hover:shadow-sm' : ''
            }`}
          >
            {/* Header: Title and Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#78847C] tracking-tight">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1] flex items-center justify-center text-[#123B36] shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Metric Value */}
            <div className="my-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[#123B36] tracking-tight tabular-nums">
                  {card.value}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
            </div>

            {/* Subtext */}
            <div className="pt-2 border-t border-[#EDF7F4] flex items-center justify-between text-[11px] text-[#78847C]">
              <span className="truncate">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
