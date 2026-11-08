/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlantTelemetry, EnvironmentalConditions } from '../../types';
import { PlantSelector } from './PlantSelector';
import { PlantProfileHeader } from './PlantProfileHeader';
import { SensorCardsGrid } from './SensorCardsGrid';
import { AiBaselinePanel } from './AiBaselinePanel';
import { HistoricalCharts } from './HistoricalCharts';
import { EnvironmentalContextPanel } from './EnvironmentalContextPanel';
import { ArrowLeft, RefreshCw, Activity, Droplets } from 'lucide-react';

interface PlantMonitoringViewProps {
  plants: PlantTelemetry[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
  environment: EnvironmentalConditions;
  onBackToDashboard: () => void;
  onTriggerScreening: (plantId: string) => Promise<void>;
  onTriggerIrrigation: (plantId: string) => Promise<void>;
}

export const PlantMonitoringView: React.FC<PlantMonitoringViewProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
  environment,
  onBackToDashboard,
  onTriggerScreening,
  onTriggerIrrigation,
}) => {
  const [dataState, setDataState] = useState<'normal' | 'stale' | 'invalid' | 'offline'>('normal');
  const [isScreening, setIsScreening] = useState(false);
  const [isIrrigating, setIsIrrigating] = useState(false);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  const handleScreening = async () => {
    setIsScreening(true);
    try {
      await onTriggerScreening(selectedPlant.id);
    } finally {
      setIsScreening(false);
    }
  };

  const handleIrrigation = async () => {
    setIsIrrigating(true);
    try {
      await onTriggerIrrigation(selectedPlant.id);
    } finally {
      setIsIrrigating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EEF3ED]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5EBE3] bg-white text-xs font-medium text-[#26342D] hover:text-[#173F32] hover:bg-[#F8F8F4] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </button>
          <span className="text-xs text-[#78847C] font-mono">
            Species Telemetry Deep-Dive
          </span>
        </div>

        {/* Quick Action Simulation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleScreening}
            disabled={isScreening}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#173F32] bg-white border border-[#E5EBE3] hover:border-[#A8BDA8] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Activity className="w-3.5 h-3.5 text-[#245640]" />
            <span>{isScreening ? 'Screening...' : 'Scan Physiological State'}</span>
          </button>

          <button
            onClick={handleIrrigation}
            disabled={isIrrigating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-[#173F32] hover:bg-[#245640] transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{isIrrigating ? 'Pulsing...' : 'Simulate Micro-Irrigation'}</span>
          </button>
        </div>
      </div>

      {/* 1. Plant Selector */}
      <PlantSelector
        plants={plants}
        selectedPlantId={selectedPlant.id}
        onSelectPlant={onSelectPlant}
      />

      {/* 2. Plant Profile Header with botanical plate & baseline status */}
      <PlantProfileHeader
        plant={selectedPlant}
        dataState={dataState}
        onDataStateChange={setDataState}
      />

      {/* 3. Sensor Monitoring: 5 Elegant Sensor Cards */}
      <SensorCardsGrid
        plant={selectedPlant}
        dataState={dataState}
      />

      {/* 4. AI Baseline Information */}
      <AiBaselinePanel
        plant={selectedPlant}
      />

      {/* 5. Historical Trends: 1h, 24h, 7d, 30d */}
      <HistoricalCharts
        plantId={selectedPlant.id}
      />

      {/* 6. Environmental Chamber Context Panel */}
      <EnvironmentalContextPanel
        plant={selectedPlant}
        environment={environment}
      />
    </div>
  );
};
