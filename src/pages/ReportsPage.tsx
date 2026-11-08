/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ReportsView } from '../components/reports/ReportsView';

interface ReportsPageProps {
  onBackToDashboard: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = (props) => {
  return <ReportsView {...props} />;
};
