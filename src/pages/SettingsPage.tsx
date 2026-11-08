/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SettingsView } from '../components/settings/SettingsView';

interface SettingsPageProps {
  onBackToDashboard: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  return <SettingsView {...props} />;
};
