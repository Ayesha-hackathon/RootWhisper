/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlantTelemetry } from '../../types';
import { OutcomeCategoryBadges } from './OutcomeCategoryBadges';
import { ProcessingPipeline } from './ProcessingPipeline';
import { ModelArchitectureCard } from './ModelArchitectureCard';
import { CurrentPlantScreeningCard } from './CurrentPlantScreeningCard';
import { ScreeningHistoryTable } from './ScreeningHistoryTable';
import { BiophysicalExplanationPanel } from './BiophysicalExplanationPanel';
import { ArrowLeft, Activity, Database, ShieldAlert } from 'lucide-react';

interface AiScreeningViewProps {
  plants: PlantTelemetry[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onBackToDashboard: () => void;
  onTriggerScreening: (plantId: string) => Promise<void>;
}

export const AiScreeningView: React.FC<AiScreeningViewProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
  onBackToDashboard,
  onTriggerScreening,
}) => {
  const [isScreening, setIsScreening] = useState(false);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  const handleScreeningClick = async () => {
    setIsScreening(true);
    try {
      await onTriggerScreening(selectedPlant.id);
    } finally {
      setIsScreening(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9F0EA]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4E7E1] bg-white text-xs font-medium text-[#26342D] hover:text-[#123B36] hover:bg-[#F5FAF8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </button>
          <span className="text-xs text-[#78847C] font-mono">
            AI Screening Centre · Adaptive Physiological Fingerprinting
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleScreeningClick}
            disabled={isScreening}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#123B36] hover:bg-[#087E75] text-[#FFFFFF] rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Activity className="w-3.5 h-3.5 text-[#55B6A3]" />
            <span>{isScreening ? 'Screening Pipeline Running...' : 'Execute Immediate Screening Scan'}</span>
          </button>
        </div>
      </div>

      {/* 1. Four Screening Outcome Categories */}
      <OutcomeCategoryBadges />

      {/* 2. Current Plant Screening Card (Expected, Observed, Residual, Soil Moisture Evidence, Data Quality) */}
      <CurrentPlantScreeningCard
        plants={plants}
        selectedPlantId={selectedPlant.id}
        onSelectPlant={onSelectPlant}
      />

      {/* 3. Visual 9-Step Processing Pipeline */}
      <ProcessingPipeline />

      {/* 4. Model Architecture & Core Pillars */}
      <ModelArchitectureCard />

      {/* 5. Searchable Screening History Table */}
      <ScreeningHistoryTable />

      {/* 6. Scientific Explanation Panel */}
      <BiophysicalExplanationPanel />
    </div>
  );
};
