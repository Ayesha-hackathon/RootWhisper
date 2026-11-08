/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnalyticsView } from '../components/analytics/AnalyticsView';

interface AnalyticsPageProps {
  onBackToDashboard: () => void;
  onExportData: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = (props) => {
  return <AnalyticsView {...props} />;
};
