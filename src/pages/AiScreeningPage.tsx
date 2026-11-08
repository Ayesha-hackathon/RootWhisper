/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AiScreeningView } from '../components/screening/AiScreeningView';
import { PlantTelemetry } from '../types';

interface AiScreeningPageProps {
  plants: PlantTelemetry[];
  selectedPlantId: string;
  onSelectPlant: (id: string) => void;
  onBackToDashboard: () => void;
  onTriggerScreening: (plantId: string) => Promise<void>;
}

export const AiScreeningPage: React.FC<AiScreeningPageProps> = (props) => {
  return <AiScreeningView {...props} />;
};
