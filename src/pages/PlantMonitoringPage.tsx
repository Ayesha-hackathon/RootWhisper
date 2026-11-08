/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlantMonitoringView } from '../components/plant-monitoring/PlantMonitoringView';
import { PlantTelemetry, EnvironmentalConditions } from '../types';

interface PlantMonitoringPageProps {
  plants: PlantTelemetry[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
  environment: EnvironmentalConditions;
  onBackToDashboard: () => void;
  onTriggerScreening: (plantId: string) => Promise<void>;
  onTriggerIrrigation: (plantId: string) => Promise<void>;
}

export const PlantMonitoringPage: React.FC<PlantMonitoringPageProps> = (props) => {
  return <PlantMonitoringView {...props} />;
};
