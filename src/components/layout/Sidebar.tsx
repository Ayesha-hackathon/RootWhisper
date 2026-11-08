/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { APP_CONFIG } from '../../config/appConfig';
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
  LogOut,
  User,
} from 'lucide-react';
import { AuthUser } from '../../services/authApi';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
  currentUser,
  onLogout,
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
        className={`w-64 bg-gradient-to-b from-[#123B36] via-[#0F3530] to-[#0A2622] text-[#F5FAF8] border-r border-[#0C2925] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile
            ? 'fixed inset-y-0 left-0 z-50 translate-x-0 shadow-2xl flex'
            : 'hidden lg:flex'
        }`}
      >
        {/* Top Branding Section */}
        <div className="flex flex-col">
          {/* Brand Lockup */}
          <div className="px-5 py-5 border-b border-[#1A4D45] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#087E75] flex items-center justify-center text-white shadow-sm">
                {/* Botanical Leaf / Root Icon */}
                <svg
                  className="w-5 h-5 text-white"
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
                  <span className="font-semibold text-base tracking-tight text-white">
                    RootWhisper
                  </span>
                </div>
                <p className="text-[11px] text-[#55B6A3] tracking-wide">
                  Species-Aware Plant AI
                </p>
              </div>
            </div>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-[#D9F0EA] hover:text-white hover:bg-[#1A4D45] lg:hidden cursor-pointer"
                title="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Live Hardware Integration Badge */}
          <div className="px-4 py-3 bg-[#0A2622]/80 border-b border-[#1A4D45]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#48D597] animate-pulse" />
              <span className="text-[11px] font-semibold text-white tracking-wide">
                HARDWARE INTEGRATION ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-[#55B6A3]/80 mt-1 leading-tight">
              FastAPI & SQLite Engine Active · ESP32 Fleet
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-[#55B6A3] uppercase tracking-wider">
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
                      ? 'bg-[#087E75] text-white font-semibold shadow-xs'
                      : 'text-[#D9F0EA]/85 hover:bg-[#1A4D45]/70 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-[#55B6A3]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Integration Status & Scientist Profile */}
        <div className="p-3 border-t border-[#1A4D45] space-y-3 bg-[#0A2622]/90">
          {/* Antigravity Backend Readiness Indicator */}
          <div className="p-2.5 rounded-lg border border-[#1A4D45] bg-[#123B36]/90 text-white">
            <div className="flex items-center justify-between text-[11px] font-medium text-white">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#55B6A3]" />
                Antigravity Engine
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[#55B6A3] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-[#55B6A3]" />
                Ready
              </span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-[#1A4D45] flex items-center justify-between text-[10px] text-[#D9F0EA]/70 font-mono">
              <span>ESP32-Mesh: 3 Nodes</span>
              <span>v2.4-IDF</span>
            </div>
          </div>

          {/* Authenticated Human User Profile */}
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-[#123B36]/60 border border-[#1A4D45]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#245640] border border-[#55B6A3]/60 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {currentUser?.full_name
                  ? currentUser.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'RW'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.full_name || 'Station Operator'}
                </p>
                <p className="text-[10px] text-[#55B6A3] truncate">
                  {currentUser?.email || 'Authenticated Session'}
                </p>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 rounded-md text-[#55B6A3] hover:text-[#C95D58] hover:bg-[#1A4D45] transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
  </>
  );
};
