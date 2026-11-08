/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Play, Pause, Download, Menu } from 'lucide-react';

interface TopNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  timeframe: '6h' | '12h' | '24h' | '7d';
  onTimeframeChange: (t: '6h' | '12h' | '24h' | '7d') => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExportData: () => void;
  onOpenMobileMenu?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  timeframe,
  onTimeframeChange,
  isStreaming,
  onToggleStreaming,
  onRefresh,
  isRefreshing,
  onExportData,
  onOpenMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-20 h-16 bg-[#123B36] border-b border-[#0C2925] px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6 select-none shadow-xs text-white">
      {/* Zone 1: Mobile Hamburger, Context Breadcrumb & View Mode Switcher */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 rounded-lg text-[#D9F0EA] hover:bg-[#1A4D45] lg:hidden cursor-pointer shrink-0"
            title="Open workspace navigation"
            aria-label="Open workspace navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <span className="text-sm font-semibold text-white tracking-tight shrink-0 hidden sm:inline">
          RootWhisper
        </span>
        <span className="text-[#55B6A3] text-sm shrink-0 hidden sm:inline">/</span>
        
        {/* View Switcher: Horizontally scrollable on narrower viewports */}
        <div className="flex items-center gap-1 p-0.5 bg-[#0C2925] rounded-lg border border-[#1A4D45] overflow-x-auto max-w-[calc(100vw-180px)] sm:max-w-md md:max-w-xl lg:max-w-none scrollbar-none">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-[#087E75] text-white shadow-xs font-semibold'
                : 'text-[#D9F0EA]/85 hover:text-white hover:bg-[#1A4D45]/60'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('plant-monitoring')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'plant-monitoring'
                ? 'bg-[#087E75] text-white shadow-xs font-semibold'
                : 'text-[#D9F0EA]/85 hover:text-white hover:bg-[#1A4D45]/60'
            }`}
          >
            Plant Monitoring
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'analytics'
                ? 'bg-[#087E75] text-white shadow-xs font-semibold'
                : 'text-[#D9F0EA]/85 hover:text-white hover:bg-[#1A4D45]/60'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => onSelectTab('ai-screening')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'ai-screening'
                ? 'bg-[#087E75] text-white shadow-xs font-semibold'
                : 'text-[#D9F0EA]/85 hover:text-white hover:bg-[#1A4D45]/60'
            }`}
          >
            AI Screening
          </button>
          <button
            onClick={() => onSelectTab('sensor-diagnostics')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'sensor-diagnostics' || currentTab === 'esp32-nodes'
                ? 'bg-[#087E75] text-white shadow-xs font-semibold'
                : 'text-[#D9F0EA]/85 hover:text-white hover:bg-[#1A4D45]/60'
            }`}
          >
            Sensor Diagnostics
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'reports'
                ? 'bg-[#087E75] text-white shadow-xs font-semibold'
                : 'text-[#D9F0EA]/85 hover:text-white hover:bg-[#1A4D45]/60'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => onSelectTab('settings')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'settings'
                ? 'bg-[#087E75] text-white shadow-xs font-semibold'
                : 'text-[#D9F0EA]/85 hover:text-white hover:bg-[#1A4D45]/60'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Zone 2: Timeframe Filter Tabs */}
      <div className="hidden md:flex items-center gap-1 p-1 bg-[#0C2925] rounded-lg border border-[#1A4D45] shrink-0">
        {(['6h', '12h', '24h', '7d'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTimeframeChange(t)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              timeframe === t
                ? 'bg-[#087E75] text-white shadow-xs font-semibold'
                : 'text-[#D9F0EA]/85 hover:text-white'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Zone 3: Primary Action & Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Live Telemetry Streaming Simulator Toggle */}
        <button
          onClick={onToggleStreaming}
          title={isStreaming ? 'Pause live 5s telemetry pulse' : 'Resume live 5s telemetry pulse'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
            isStreaming
              ? 'bg-[#087E75]/30 border-[#55B6A3] text-white'
              : 'bg-[#0C2925] border-[#1A4D45] text-[#D9F0EA]/85 hover:text-white'
          }`}
        >
          {isStreaming ? (
            <>
              <Pause className="w-3.5 h-3.5 text-[#55B6A3]" />
              <span className="hidden sm:inline">Telemetry Live</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-[#D9F0EA]" />
              <span className="hidden sm:inline">Stream Paused</span>
            </>
          )}
        </button>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-md border border-[#1A4D45] bg-[#0C2925] text-[#D9F0EA] hover:bg-[#1A4D45] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          title="Force telemetry refresh"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#55B6A3]' : ''}`}
          />
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onExportData}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#087E75] hover:bg-[#55B6A3] text-white rounded-md text-xs font-medium shadow-xs transition-colors whitespace-nowrap cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Dataset</span>
        </button>
      </div>
    </header>
  );
};
