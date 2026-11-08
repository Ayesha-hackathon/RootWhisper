/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SensorDiagnosticsView } from '../components/diagnostics/SensorDiagnosticsView';

interface SensorDiagnosticsPageProps {
  onBackToDashboard: () => void;
  onExportDiagnostics: () => void;
}

export const SensorDiagnosticsPage: React.FC<SensorDiagnosticsPageProps> = (props) => {
  return <SensorDiagnosticsView {...props} />;
};
