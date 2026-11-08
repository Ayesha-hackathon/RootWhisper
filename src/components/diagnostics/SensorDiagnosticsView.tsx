/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Cpu,
  RefreshCw,
  Download,
  ShieldCheck,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import {
  NodeDiagnostic,
  SensorChannelDiagnostic,
  CommunicationErrorRecord,
} from '../../types';
import {
  INITIAL_NODE_DIAGNOSTICS,
  INITIAL_SENSOR_CHANNELS,
  INITIAL_COMMUNICATION_ERRORS,
} from '../../data/diagnosticsData';
import { NodeStatusCardGrid } from './NodeStatusCardGrid';
import { DetailedDiagnosticTable } from './DetailedDiagnosticTable';
import { PacketMonitoringSection } from './PacketMonitoringSection';
import { SensorCalibrationOverview } from './SensorCalibrationOverview';
import { CommunicationErrorHistory } from './CommunicationErrorHistory';
import {
  DiagnosticStateSimulator,
  DiagnosticStatePreset,
} from './DiagnosticStateSimulator';

interface SensorDiagnosticsViewProps {
  onBackToDashboard: () => void;
  onExportDiagnostics?: () => void;
}

export const SensorDiagnosticsView: React.FC<SensorDiagnosticsViewProps> = ({
  onBackToDashboard,
  onExportDiagnostics,
}) => {
  const [nodes, setNodes] = useState<NodeDiagnostic[]>(INITIAL_NODE_DIAGNOSTICS);
  const [channels, setChannels] = useState<SensorChannelDiagnostic[]>(INITIAL_SENSOR_CHANNELS);
  const [errors, setErrors] = useState<CommunicationErrorRecord[]>(INITIAL_COMMUNICATION_ERRORS);
  const [currentPreset, setCurrentPreset] = useState<DiagnosticStatePreset>('nominal');
  const [selectedNodeFilter, setSelectedNodeFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State Preset Switcher
  const handleSelectPreset = (preset: DiagnosticStatePreset) => {
    setCurrentPreset(preset);

    if (preset === 'nominal') {
      setNodes(INITIAL_NODE_DIAGNOSTICS);
      setChannels(INITIAL_SENSOR_CHANNELS);
      showToast('All 3 ESP32 nodes restored to nominal telemetry.');
    } else if (preset === 'sensor-error-99') {
      // Simulate MLX90614 fault on HIBISCUS_01 with -99.0°C sentinel
      setChannels((prev) =>
        prev.map((ch) => {
          if (ch.id === 'HIBISCUS_LT') {
            return {
              ...ch,
              reading: -99.0, // The sentinel error value
              rawReading: 'Reg 0x07: 0xFF9D (-99.0C Fault)',
              validity: 'invalid',
              diagnosticStatus:
                'CRITICAL: MLX90614 register timeout sentinel (-99.0°C intercepted by sanitizer)',
            };
          }
          return ch;
        })
      );

      setNodes((prev) =>
        prev.map((n) => {
          if (n.nodeId === 'HIBISCUS_01') {
            return {
              ...n,
              status: 'degraded',
              sensorModules: n.sensorModules.map((sm) =>
                sm.model.includes('MLX90614') ? { ...sm, status: 'error' } : sm
              ),
            };
          }
          return n;
        })
      );

      // Add audit log
      const newErr: CommunicationErrorRecord = {
        id: `ERR_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        nodeId: 'HIBISCUS_01',
        severity: 'critical',
        errorType: 'Out-of-Bounds Sentinel Intercepted',
        description:
          'MLX90614 register read returned invalid -99.0°C sentinel. Frontend sanitizer intercepted corrupted value; displayed SENSOR ERROR / N/A.',
        rawHex: '0x07 0xFF 0x9D (-99.0C)',
        resolved: false,
      };
      setErrors((prev) => [newErr, ...prev]);
      showToast('Injected -99.0°C sensor fault on HIBISCUS_01 (Intercepted as SENSOR ERROR).');
    } else if (preset === 'stale-telemetry') {
      // Simulate TULSI_01 delay >45m
      setNodes((prev) =>
        prev.map((n) => {
          if (n.nodeId === 'TULSI_01') {
            return {
              ...n,
              status: 'stale',
              lastSeenSecondsAgo: 2740,
              uptimeFormatted: '13d 5h 32m',
            };
          }
          return n;
        })
      );

      setChannels((prev) =>
        prev.map((ch) => {
          if (ch.nodeId === 'TULSI_01') {
            return {
              ...ch,
              validity: 'stale',
              lastUpdate: '45m ago',
              lastUpdateSecondsAgo: 2740,
              diagnosticStatus: 'Telemetry packet delayed >40 min (Stale state flagged)',
            };
          }
          return ch;
        })
      );
      showToast('Simulated stale telemetry on TULSI_01 (>45 minutes delay).');
    } else if (preset === 'node-offline') {
      // Simulate MONEYPLANT_01 Carrier Loss
      setNodes((prev) =>
        prev.map((n) => {
          if (n.nodeId === 'MONEYPLANT_01') {
            return {
              ...n,
              status: 'offline',
              rssi: -95,
              lastSeenSecondsAgo: 3920,
              packetLossPercent: 100,
            };
          }
          return n;
        })
      );

      setChannels((prev) =>
        prev.map((ch) => {
          if (ch.nodeId === 'MONEYPLANT_01') {
            return {
              ...ch,
              reading: null,
              rawReading: '-- (No carrier)',
              validity: 'unavailable',
              lastUpdate: '65m ago',
              lastUpdateSecondsAgo: 3920,
              diagnosticStatus: 'Node unreachable; 802.11 beacon lost (Carrier down)',
            };
          }
          return ch;
        })
      );
      showToast('Simulated MONEYPLANT_01 node offline (Carrier lost).');
    }
  };

  // Node Actions
  const handlePingNode = (nodeId: string) => {
    showToast(`ICMP / MQTT Ping response received from ${nodeId} (RTT: 18ms).`);
  };

  const handleScanI2c = (nodeId: string) => {
    showToast(`I2C bus scan completed for ${nodeId}: 0x5A (MLX90614), 0x38 (AHT25), 0x23 (BH1750) ACK OK.`);
  };

  // Export Diagnostics Dataset
  const handleExportJson = () => {
    if (onExportDiagnostics) {
      onExportDiagnostics();
      return;
    }
    const payload = {
      exportTime: new Date().toISOString(),
      nodes,
      sensorChannels: channels,
      communicationErrors: errors,
      systemMetadata: {
        meshProtocol: '802.11 b/g/n Wi-Fi Direct / MQTT',
        i2cFastMode: '400 kHz',
        targetBackend: 'Google Antigravity Plant Telemetry Engine',
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rootwhisper-diagnostics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported complete diagnostics JSON archive.');
  };

  // Manual Diagnostics Refresh
  const handleForceRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Diagnostics telemetry refreshed from Antigravity buffer.');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#173F32] text-[#F8F8F4] text-xs font-medium shadow-lg border border-[#A8BDA8]/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A8BDA8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Return to Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#E5EBE3] hover:border-[#173F32] bg-white text-xs font-medium text-[#173F32] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#78847C]">
            <span>System Telemetry</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#173F32] font-semibold">Sensor Diagnostics</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleForceRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#E5EBE3] hover:border-[#173F32] bg-white text-xs font-medium text-[#26342D] transition-colors cursor-pointer disabled:opacity-50"
            title="Poll fresh diagnostic packets"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#173F32]' : ''}`}
            />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-[#173F32] hover:bg-[#245640] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#173F32] via-[#245640] to-[#173F32] text-[#F8F8F4] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#A8BDA8] font-mono">
              <Cpu className="w-4 h-4 text-[#A8BDA8]" />
              <span>ESP32-S3 / DevKit V1 Hardware Fleet</span>
              <span aria-hidden="true">·</span>
              <span>Wi-Fi Telemetry Stream</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Sensor Diagnostics Centre
            </h1>
            <p className="text-xs sm:text-sm text-[#EEF3ED]/90 leading-relaxed">
              Comprehensive hardware telemetry, I2C bus health, packet transmission integrity, and sensor calibration curves across all three independent nodes.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0 self-start md:self-auto font-mono text-xs">
            <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#A8BDA8]" />
              <span>3 Nodes Online</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A8BDA8]" />
              <span>15 Channels Monitored</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Diagnostic State Simulator (Ingestion & Fault Test Bench) */}
      <section>
        <DiagnosticStateSimulator
          currentPreset={currentPreset}
          onSelectPreset={handleSelectPreset}
          onReset={() => handleSelectPreset('nominal')}
        />
      </section>

      {/* 2. Three Individual Node Status Cards */}
      <section id="node-cards">
        <NodeStatusCardGrid
          nodes={nodes}
          onPingNode={handlePingNode}
          onScanI2c={handleScanI2c}
          onSelectNodeFilter={(nodeId) => {
            setSelectedNodeFilter(nodeId);
            const el = document.getElementById('diagnostic-table');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </section>

      {/* 3. Detailed Diagnostic Table for All 15 Sensor Channels */}
      <section id="diagnostic-table">
        <DetailedDiagnosticTable
          channels={channels}
          selectedNodeFilter={selectedNodeFilter}
          onSelectNodeFilter={(nodeId) => setSelectedNodeFilter(nodeId)}
        />
      </section>

      {/* 4. Data Packet & Freshness Monitoring */}
      <section>
        <PacketMonitoringSection nodes={nodes} />
      </section>

      {/* 5. Sensor Calibration Status */}
      <section>
        <SensorCalibrationOverview />
      </section>

      {/* 6. Communication Error History */}
      <section>
        <CommunicationErrorHistory
          errors={errors}
          onClearResolved={() => {
            setErrors((prev) => prev.filter((e) => !e.resolved));
            showToast('Resolved event history cleared.');
          }}
          onSimulateError={(type) => {
            handleSelectPreset('sensor-error-99');
          }}
        />
      </section>
    </div>
  );
};
