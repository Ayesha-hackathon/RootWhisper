/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Gauge,
  Flame,
  CloudSun,
  Timer,
} from 'lucide-react';
import { EnvironmentalConditions } from '../../types';

interface EnvironmentalOverviewProps {
  environment: EnvironmentalConditions;
}

export const EnvironmentalOverview: React.FC<EnvironmentalOverviewProps> = ({
  environment,
}) => {
  const metrics = [
    {
      label: 'Vapor Pressure Deficit',
      value: `${environment.vpd.toFixed(2)} kPa`,
      description: 'Optimal transpiration range (0.8–1.4 kPa)',
      icon: Gauge,
      badge: 'Balanced',
      badgeColor: 'text-[#087E75] bg-[#D9F0EA]',
    },
    {
      label: 'Ambient Temperature',
      value: `${environment.ambientTemp.toFixed(1)}°C`,
      description: 'Chamber diurnal setpoint: 24.0°C',
      icon: Flame,
      badge: 'Stable',
      badgeColor: 'text-[#087E75] bg-[#D9F0EA]',
    },
    {
      label: 'Chamber Humidity',
      value: `${environment.ambientRh.toFixed(1)}%`,
      description: 'RH hygrometer sensor baseline',
      icon: Droplets,
      badge: 'Optimal',
      badgeColor: 'text-[#087E75] bg-[#D9F0EA]',
    },
    {
      label: 'Average PAR Irradiance',
      value: `${environment.parLightAvg} µmol`,
      description: `Daily Light Integral: ${environment.dli} mol/m²/d`,
      icon: Sun,
      badge: 'Full Spectrum',
      badgeColor: 'text-[#C58A35] bg-[#FFF8EB]',
    },
    {
      label: 'Chamber CO2 Concentration',
      value: `${environment.co2Level} ppm`,
      description: 'Atmospheric equilibrium maintained',
      icon: CloudSun,
      badge: 'Normal',
      badgeColor: 'text-[#78847C] bg-[#EDF7F4]',
    },
    {
      label: 'Laminar Airflow Speed',
      value: `${environment.airflowSpeed} m/s`,
      description: `Photoperiod: ${environment.photoperiodHours}h Light Cycle`,
      icon: Wind,
      badge: 'Gentle',
      badgeColor: 'text-[#78847C] bg-[#EDF7F4]',
    },
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#CCE2DB] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D9F0EA]">
        <div>
          <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
            Chamber Microclimate Environment
          </h2>
          <p className="text-xs text-[#78847C] mt-0.5">
            {environment.facilityName} · {environment.location}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#087E75] bg-[#D9F0EA] px-2.5 py-1 rounded-md border border-[#55B6A3]/30 font-medium">
          <Timer className="w-3.5 h-3.5" />
          <span>Photoperiod: 14h / 10h</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-[#EAF4F0] border border-[#CCE2DB] flex flex-col justify-between transition-all hover:border-[#087E75]"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-md bg-[#D9F0EA] flex items-center justify-center text-[#087E75]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border border-[#55B6A3]/20 ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#78847C] line-clamp-1 font-medium">
                  {item.label}
                </p>
                <p className="text-base font-bold font-mono text-[#123B36] mt-0.5 tabular-nums">
                  {item.value}
                </p>
              </div>
              <p className="text-[10px] text-[#78847C] mt-2 pt-1 border-t border-[#D9F0EA] line-clamp-1">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
