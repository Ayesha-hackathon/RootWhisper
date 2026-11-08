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
    <header className="sticky top-0 z-20 h-16 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5EBE3] px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6 select-none">
      {/* Zone 1: Mobile Hamburger, Context Breadcrumb & View Mode Switcher */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 rounded-lg text-[#173F32] hover:bg-[#EEF3ED] lg:hidden cursor-pointer shrink-0"
            title="Open workspace navigation"
            aria-label="Open workspace navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <span className="text-sm font-semibold text-[#173F32] tracking-tight shrink-0 hidden sm:inline">
          RootWhisper
        </span>
        <span className="text-[#A8BDA8] text-sm shrink-0 hidden sm:inline">/</span>
        
        {/* View Switcher: Horizontally scrollable on narrower viewports */}
        <div className="flex items-center gap-1 p-0.5 bg-[#F4F7F3] rounded-lg border border-[#E5EBE3] overflow-x-auto max-w-[calc(100vw-180px)] sm:max-w-md md:max-w-xl lg:max-w-none scrollbar-none">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('plant-monitoring')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'plant-monitoring'
                ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            Plant Monitoring
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'analytics'
                ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => onSelectTab('ai-screening')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'ai-screening'
                ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            AI Screening
          </button>
          <button
            onClick={() => onSelectTab('sensor-diagnostics')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'sensor-diagnostics' || currentTab === 'esp32-nodes'
                ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            Sensor Diagnostics
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'reports'
                ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => onSelectTab('settings')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'settings'
                ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Zone 2: Timeframe Filter Tabs */}
      <div className="hidden md:flex items-center gap-1 p-1 bg-[#F4F7F3] rounded-lg border border-[#E5EBE3] shrink-0">
        {(['6h', '12h', '24h', '7d'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTimeframeChange(t)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              timeframe === t
                ? 'bg-white text-[#173F32] shadow-xs font-semibold'
                : 'text-[#78847C] hover:text-[#26342D]'
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
              ? 'bg-[#EEF3ED] border-[#A8BDA8] text-[#173F32]'
              : 'bg-white border-[#E5EBE3] text-[#78847C] hover:text-[#26342D]'
          }`}
        >
          {isStreaming ? (
            <>
              <Pause className="w-3.5 h-3.5 text-[#245640]" />
              <span className="hidden sm:inline">Telemetry Live</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-[#78847C]" />
              <span className="hidden sm:inline">Stream Paused</span>
            </>
          )}
        </button>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-md border border-[#E5EBE3] text-[#26342D] hover:bg-[#F8F8F4] hover:text-[#173F32] transition-colors cursor-pointer disabled:opacity-50"
          title="Force telemetry refresh"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#173F32]' : ''}`}
          />
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onExportData}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#173F32] hover:bg-[#245640] text-[#FFFFFF] rounded-md text-xs font-medium shadow-xs transition-colors whitespace-nowrap cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Dataset</span>
        </button>
      </div>
    </header>
  );
};
