/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wifi,
  Radio,
  Cpu,
  Clock,
  Battery,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle,
  AlertOctagon,
} from 'lucide-react';
import { NodeDiagnostic } from '../../types';

interface NodeStatusCardGridProps {
  nodes: NodeDiagnostic[];
  onPingNode: (nodeId: string) => void;
  onScanI2c: (nodeId: string) => void;
  onSelectNodeFilter?: (nodeId: string) => void;
}

export const NodeStatusCardGrid: React.FC<NodeStatusCardGridProps> = ({
  nodes,
  onPingNode,
  onScanI2c,
  onSelectNodeFilter,
}) => {
  const [pingingNodeId, setPingingNodeId] = useState<string | null>(null);
  const [scanningNodeId, setScanningNodeId] = useState<string | null>(null);

  const handlePing = (nodeId: string) => {
    setPingingNodeId(nodeId);
    onPingNode(nodeId);
    setTimeout(() => setPingingNodeId(null), 1200);
  };

  const handleScan = (nodeId: string) => {
    setScanningNodeId(nodeId);
    onScanI2c(nodeId);
    setTimeout(() => setScanningNodeId(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-[#123B36]">
            ESP32 Sensor Nodes Fleet
          </h2>
          <p className="text-xs text-[#78847C] mt-0.5">
            Three independent Wi-Fi nodes transmitting telemetry directly to the central backend.
          </p>
        </div>
        <div className="text-xs text-[#78847C] font-mono flex items-center gap-3">
          <span>Active Nodes: {nodes.filter((n) => n.status === 'online').length}/3</span>
          <span aria-hidden="true">·</span>
          <span>Mesh Topology: 802.11 b/g/n</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {nodes.map((node) => {
          const isOnline = node.status === 'online';
          const isStale = node.status === 'stale';
          const isOffline = node.status === 'offline';
          const isDegraded = node.status === 'degraded';

          // Signal strength rating
          let rssiQuality = 'Excellent';
          let rssiBars = 4;
          if (node.rssi < -75) {
            rssiQuality = 'Weak';
            rssiBars = 1;
          } else if (node.rssi < -68) {
            rssiQuality = 'Fair';
            rssiBars = 2;
          } else if (node.rssi < -60) {
            rssiQuality = 'Good';
            rssiBars = 3;
          }

          return (
            <div
              key={node.nodeId}
              className={`bg-white rounded-xl border transition-all shadow-xs flex flex-col justify-between ${
                isOffline
                  ? 'border-[#C95D58]/40 bg-white/90'
                  : isStale
                  ? 'border-[#C58A35]/40 bg-white'
                  : isDegraded
                  ? 'border-[#C58A35]/50 bg-white'
                  : 'border-[#D4E7E1] hover:border-[#55B6A3]'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-[#E1EFEA]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#123B36] tracking-tight">
                        {node.nodeId}
                      </span>
                      <span className="text-[10px] text-[#78847C] font-mono">
                        {node.boardModel}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#26342D] truncate mt-0.5">
                      {node.assignedPlantName}
                    </p>
                    <p className="text-[11px] italic text-[#78847C] truncate">
                      {node.scientificName}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isOnline && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#D9F0EA] text-[#087E75] text-[11px] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#087E75]" />
                        <span>ONLINE</span>
                      </div>
                    )}
                    {isStale && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FFF8EB] text-[#C58A35] text-[11px] font-semibold">
                        <AlertTriangle className="w-3 h-3 text-[#C58A35]" />
                        <span>STALE</span>
                      </div>
                    )}
                    {isDegraded && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FFF8EB] text-[#C58A35] text-[11px] font-semibold">
                        <AlertTriangle className="w-3 h-3 text-[#C58A35]" />
                        <span>DEGRADED</span>
                      </div>
                    )}
                    {isOffline && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FDF2F2] text-[#C95D58] text-[11px] font-semibold">
                        <AlertOctagon className="w-3 h-3 text-[#C95D58]" />
                        <span>OFFLINE</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Freshness & Last Update */}
                <div className="mt-3 pt-2.5 border-t border-[#E1EFEA] flex items-center justify-between text-xs text-[#78847C]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#78847C]" />
                    <span>Last packet:</span>
                    <span
                      className={`font-mono font-medium ${
                        isOffline
                          ? 'text-[#C95D58]'
                          : isStale
                          ? 'text-[#C58A35]'
                          : 'text-[#26342D]'
                      }`}
                    >
                      {isOffline ? 'No Carrier (>60m)' : `${node.lastSeenSecondsAgo}s ago`}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#78847C]">
                    Uptime: {node.uptimeFormatted}
                  </span>
                </div>
              </div>

              {/* Card Body: Network, Telemetry & Sensor Health */}
              <div className="p-4 space-y-3.5 text-xs">
                {/* Network & Power Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#F5FAF8] rounded-lg border border-[#D4E7E1]/70">
                  <div>
                    <span className="text-[10px] text-[#78847C] uppercase tracking-wider block">
                      Wi-Fi RSSI
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Wifi className="w-3.5 h-3.5 text-[#123B36]" />
                      <span className="font-mono font-semibold text-[#26342D] tabular-nums">
                        {isOffline ? '--' : `${node.rssi} dBm`}
                      </span>
                      {!isOffline && (
                        <span className="text-[10px] text-[#78847C]">({rssiQuality})</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#78847C] uppercase tracking-wider block">
                      Power Rail / LiPo
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Battery className="w-3.5 h-3.5 text-[#087E75]" />
                      <span className="font-mono font-semibold text-[#26342D] tabular-nums">
                        {isOffline ? '--' : `${node.batteryVoltage.toFixed(2)}V`}
                      </span>
                      {!isOffline && (
                        <span className="text-[10px] text-[#087E75] font-mono">
                          ({node.busSupplyVoltage.toFixed(2)}V LDO)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 pt-1 border-t border-[#D4E7E1]/60 flex items-center justify-between text-[11px] font-mono text-[#78847C]">
                    <span>IP: {isOffline ? 'Disconnected' : node.ipAddress}</span>
                    <span>MAC: {node.macAddress}</span>
                  </div>
                </div>

                {/* Packet Monitoring Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#78847C] font-medium">Packet Reliability</span>
                    <span className="font-mono text-[#26342D] tabular-nums">
                      {isOffline
                        ? '0% (Carrier Lost)'
                        : `${(100 - node.packetLossPercent).toFixed(2)}% OK · ${node.packetsDropped} dropped`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#D4E7E1] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isOffline
                          ? 'w-0 bg-[#C95D58]'
                          : node.packetLossPercent > 0.5
                          ? 'bg-[#C58A35]'
                          : 'bg-[#087E75]'
                      }`}
                      style={{
                        width: isOffline ? '0%' : `${Math.max(5, 100 - node.packetLossPercent)}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#78847C] mt-1">
                    <span>TX: {node.packetsTransmitted.toLocaleString()}</span>
                    <span>RX: {isOffline ? '0' : node.packetsReceived.toLocaleString()}</span>
                    <span>CRC Errs: {node.crcErrors}</span>
                  </div>
                </div>

                {/* 4 Sensor Modules Health Status */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#78847C] uppercase tracking-wider block">
                    Sensors Attached to DevKit V1
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {node.sensorModules.map((sm, idx) => {
                      const isFaulty = isOffline || sm.status === 'error';
                      const isWarn = sm.status === 'warning' || isStale;
                      return (
                        <div
                          key={idx}
                          className={`p-1.5 rounded border text-[11px] flex items-center justify-between ${
                            isFaulty
                              ? 'bg-[#FDF2F2] border-[#C95D58]/30 text-[#C95D58]'
                              : isWarn
                              ? 'bg-[#FFF8EB] border-[#C58A35]/30 text-[#C58A35]'
                              : 'bg-[#EDF7F4] border-[#D4E7E1] text-[#26342D]'
                          }`}
                        >
                          <span className="truncate pr-1 font-medium">{sm.name}</span>
                          <span className="font-mono text-[9px] shrink-0 font-semibold">
                            {isFaulty ? 'ERR' : isWarn ? 'STALE' : 'OK'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer: Interactive Actions */}
              <div className="p-3 bg-[#F0F7F4] border-t border-[#E1EFEA] flex items-center justify-between gap-2">
                <button
                  onClick={() => handlePing(node.nodeId)}
                  disabled={pingingNodeId === node.nodeId || isOffline}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded text-xs font-medium border border-[#D4E7E1] hover:border-[#55B6A3] bg-white text-[#123B36] hover:bg-[#D9F0EA] transition-colors disabled:opacity-50 cursor-pointer"
                  title="Simulate ICMP / MQTT Ping response"
                >
                  <Radio
                    className={`w-3.5 h-3.5 ${
                      pingingNodeId === node.nodeId ? 'animate-pulse text-[#087E75]' : ''
                    }`}
                  />
                  <span>{pingingNodeId === node.nodeId ? 'Ping (18ms)...' : 'Ping Node'}</span>
                </button>

                <button
                  onClick={() => handleScan(node.nodeId)}
                  disabled={scanningNodeId === node.nodeId || isOffline}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded text-xs font-medium border border-[#D4E7E1] hover:border-[#55B6A3] bg-white text-[#123B36] hover:bg-[#D9F0EA] transition-colors disabled:opacity-50 cursor-pointer"
                  title="Scan I2C bus (0x5A, 0x38, 0x23)"
                >
                  <Search
                    className={`w-3.5 h-3.5 ${
                      scanningNodeId === node.nodeId ? 'animate-spin text-[#087E75]' : ''
                    }`}
                  />
                  <span>{scanningNodeId === node.nodeId ? 'Scanning...' : 'I2C Scan'}</span>
                </button>

                {onSelectNodeFilter && (
                  <button
                    onClick={() => onSelectNodeFilter(node.nodeId)}
                    className="p-1.5 rounded text-xs font-medium border border-[#D4E7E1] hover:border-[#55B6A3] bg-white text-[#78847C] hover:text-[#123B36] transition-colors cursor-pointer"
                    title="Filter table by this node"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
