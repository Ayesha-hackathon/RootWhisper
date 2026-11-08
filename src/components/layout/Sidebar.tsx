/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  Activity,
  Cpu,
  Droplets,
  Sliders,
  Database,
  ExternalLink,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSampleDataModal: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSampleDataModal,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Screening Dashboard', icon: LayoutDashboard },
    { id: 'plant-monitoring', label: 'Plant Monitoring', icon: Sprout },
    { id: 'analytics', label: 'Biophysical Analytics', icon: Activity },
    { id: 'ai-screening', label: 'AI Fingerprinting', icon: Activity },
    { id: 'sensor-diagnostics', label: 'Sensor Diagnostics', icon: Cpu },
    { id: 'reports', label: 'Research Reports', icon: FileText },
    { id: 'irrigation', label: 'Watering & Actions', icon: Droplets },
    { id: 'settings', label: 'System Settings', icon: Sliders },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Drawer Dark Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container (Sticky on desktop, slide-over drawer on mobile) */}
      <aside
        className={`w-64 bg-[#FFFFFF] border-r border-[#E5EBE3] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile
            ? 'fixed inset-y-0 left-0 z-50 translate-x-0 shadow-2xl flex'
            : 'hidden lg:flex'
        }`}
      >
        {/* Top Branding Section */}
        <div className="flex flex-col">
          {/* Brand Lockup */}
          <div className="px-5 py-5 border-b border-[#EEF3ED] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#173F32] flex items-center justify-center text-[#F8F8F4] shadow-sm">
              {/* Botanical Leaf / Root Icon */}
              <svg
                className="w-5 h-5 text-[#A8BDA8]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
                <path d="M12 6v12" />
                <path d="M8 10c2 1 4 0 4 0" />
                <path d="M16 13c-2 1-4 0-4 0" />
                <path d="M9 16c1.5.5 3 0 3 0" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base tracking-tight text-[#173F32]">
                  RootWhisper
                </span>
              </div>
              <p className="text-[11px] text-[#78847C] tracking-wide">
                Species-Aware Plant AI
              </p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#78847C] hover:text-[#173F32] hover:bg-[#EEF3ED] lg:hidden cursor-pointer"
              title="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Prototype Sample Data Notice Box */}
        <div className="px-4 py-3 bg-[#EEF3ED]/60 border-b border-[#E5EBE3]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C58A35]" />
              <span className="text-[11px] font-medium text-[#26342D] tracking-wide">
                SAMPLE DATA ACTIVE
              </span>
            </div>
            <button
              onClick={onOpenSampleDataModal}
              className="text-[11px] font-medium text-[#173F32] hover:text-[#245640] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Info
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </button>
          </div>
          <p className="text-[10px] text-[#78847C] mt-1 leading-tight">
            Frontend prototype decoupled from Antigravity engine.
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-[#78847C] uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentTab === item.id ||
              (item.id === 'sensor-diagnostics' && currentTab === 'esp32-nodes');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#EEF3ED] text-[#173F32] font-semibold shadow-xs'
                    : 'text-[#26342D] hover:bg-[#F8F8F4] hover:text-[#173F32]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#173F32]' : 'text-[#78847C]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Integration Status & Scientist Profile */}
      <div className="p-3 border-t border-[#EEF3ED] space-y-3 bg-[#FAFAF8]">
        {/* Antigravity Backend Readiness Indicator */}
        <div className="p-2.5 rounded-lg border border-[#E5EBE3] bg-white">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#26342D]">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#173F32]" />
              Antigravity Engine
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#245640] font-semibold">
              <CheckCircle2 className="w-3 h-3 text-[#245640]" />
              Ready
            </span>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-[#F0F4EF] flex items-center justify-between text-[10px] text-[#78847C] font-mono">
            <span>ESP32-Mesh: 3 Nodes</span>
            <span>v2.4-IDF</span>
          </div>
        </div>

        {/* Researcher Profile */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <img
            src="/src/assets/images/avatar_researcher_1794035218996.jpg"
            alt="Dr. Aris Thorne"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-[#A8BDA8]/50"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#173F32] truncate">
              Dr. Aris Thorne
            </p>
            <p className="text-[10px] text-[#78847C] truncate">
              Lead Phytophysiologist
            </p>
          </div>
        </div>
      </div>
    </aside>
  </>
  );
};
