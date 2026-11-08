/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlantTelemetry, EnvironmentalConditions } from '../../types';
import { Gauge, Wind, Sun, Clock, CloudSun, ShieldCheck } from 'lucide-react';

interface EnvironmentalContextPanelProps {
  plant: PlantTelemetry;
  environment: EnvironmentalConditions;
}

export const EnvironmentalContextPanel: React.FC<EnvironmentalContextPanelProps> = ({
  plant,
  environment,
}) => {
  const vpdVal = plant.vpd;
  const vpdState =
    vpdVal === null
      ? 'Awaiting Sensor Telemetry'
      : vpdVal < 0.8
      ? 'Low (High humidity/reduced transpiration)'
      : vpdVal > 1.4
      ? 'High (High transpiration demand)'
      : 'Optimal (0.8–1.4 kPa)';

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#D4E7E1] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D9F0EA]">
        <div>
          <h2 className="text-base font-semibold text-[#123B36] tracking-tight">
            Environmental Chamber Context
          </h2>
          <p className="text-xs text-[#78847C] mt-0.5">
            Boundary conditions governing foliar vapor exchange and latent heat dissipation.
          </p>
        </div>
        <span className="font-mono text-xs text-[#123B36] bg-[#D9F0EA] px-2.5 py-0.5 rounded-md font-medium">
          Chamber A-4
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 1. VPD Context */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-[#78847C] flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#123B36]" />
              Vapor Pressure Deficit
            </span>
            <span className="font-mono font-semibold text-xs text-[#123B36]">
              {vpdVal !== null ? `${vpdVal.toFixed(2)} kPa` : 'N/A'}
            </span>
          </div>
          <p className="text-xs font-semibold text-[#26342D] mt-2">
            {vpdState}
          </p>
          <p className="text-[10px] text-[#78847C] mt-0.5">
            Drives evaporative transpirational pull from leaf stomata.
          </p>
        </div>

        {/* 2. Air Circulation */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-[#78847C] flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-[#087E75]" />
              Boundary Layer Airflow
            </span>
            <span className="font-mono font-semibold text-xs text-[#087E75]">
              {environment.airflowSpeed} m/s
            </span>
          </div>
          <p className="text-xs font-semibold text-[#26342D] mt-2">
            Laminar Convection
          </p>
          <p className="text-[10px] text-[#78847C] mt-0.5">
            Prevents stagnant thermal microclimates across leaf surface.
          </p>
        </div>

        {/* 3. Daily Light Integral */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-[#78847C] flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#C58A35]" />
              DLI & Photoperiod
            </span>
            <span className="font-mono font-semibold text-xs text-[#C58A35]">
              {environment.dli} mol/m²/d
            </span>
          </div>
          <p className="text-xs font-semibold text-[#26342D] mt-2">
            14h Light / 10h Dark
          </p>
          <p className="text-[10px] text-[#78847C] mt-0.5">
            Photoperiod synchronizes circadian stomatal aperture rhythm.
          </p>
        </div>

        {/* 4. Ambient Stability Index */}
        <div className="p-3.5 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-[#78847C] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#087E75]" />
              Chamber Stability
            </span>
            <span className="font-mono font-semibold text-xs text-[#087E75]">
              99.4%
            </span>
          </div>
          <p className="text-xs font-semibold text-[#26342D] mt-2">
            Steady Phytotron State
          </p>
          <p className="text-[10px] text-[#78847C] mt-0.5">
            CO2 concentration stable at {environment.co2Level} ppm.
          </p>
        </div>
      </div>
    </div>
  );
};
