/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNav } from '../components/layout/TopNav';
import { PlantTelemetry, EnvironmentalConditions, ESP32Node } from '../types';
import { AuthUser } from '../services/authApi';

interface AppLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  timeframe: '6h' | '12h' | '24h' | '7d';
  onTimeframeChange: (t: '6h' | '12h' | '24h' | '7d') => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExportData: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toastMessage: string | null;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentTab,
  onSelectTab,
  timeframe,
  onTimeframeChange,
  isStreaming,
  onToggleStreaming,
  onRefresh,
  isRefreshing,
  onExportData,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  toastMessage,
  currentUser,
  onLogout,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#EAF2ED] flex flex-row">
      {/* Fixed Left Sidebar & Mobile Drawer */}
      <Sidebar
        currentTab={currentTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={onLogout}
        onSelectTab={(tab) => {
          onSelectTab(tab);
          if (tab !== 'settings' && tab !== 'reports' && tab !== 'sensor-diagnostics' && tab !== 'esp32-nodes' && tab !== 'ai-screening' && tab !== 'analytics' && tab !== 'plant-monitoring' && tab !== 'dashboard') {
            setTimeout(() => {
              const el = document.getElementById(tab);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }
        }}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          timeframe={timeframe}
          onTimeframeChange={onTimeframeChange}
          isStreaming={isStreaming}
          onToggleStreaming={onToggleStreaming}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          onExportData={onExportData}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Global Floating Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#123B36] text-[#F5FAF8] text-xs font-medium shadow-lg border border-[#55B6A3]/30 flex items-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#55B6A3]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Institutional Footer */}
        <footer className="border-t border-[#0C2925] py-5 px-8 text-center text-xs text-[#D9F0EA]/80 bg-[#123B36] print:hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              RootWhisper · Species-Aware AI Framework for Early Plant Water-Stress Screening
            </span>
            <span className="font-mono text-[11px] text-[#55B6A3]">
              Google Antigravity & ESP32-S3 Mesh Ready
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
