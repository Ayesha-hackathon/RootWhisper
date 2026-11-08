/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Wifi,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { NodeDiagnostic } from '../../types';

interface PacketMonitoringSectionProps {
  nodes: NodeDiagnostic[];
}

export const PacketMonitoringSection: React.FC<PacketMonitoringSectionProps> = ({ nodes }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('TULSI_01');

  // Compute aggregate fleet metrics
  const totalTransmitted = nodes.reduce((acc, n) => acc + n.packetsTransmitted, 0);
  const totalReceived = nodes.reduce((acc, n) => acc + n.packetsReceived, 0);
  const totalDropped = nodes.reduce((acc, n) => acc + n.packetsDropped, 0);
  const aggregateLossRate = (totalDropped / Math.max(1, totalTransmitted)) * 100;
  const totalCrcErrors = nodes.reduce((acc, n) => acc + n.crcErrors, 0);

  const selectedNode = nodes.find((n) => n.nodeId === selectedNodeId) || nodes[0];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-[#123B36]">
          Data Packet & Freshness Monitoring
        </h3>
        <p className="text-xs text-[#78847C] mt-0.5">
          Real-time packet throughput, missing sequence frame detection, and telemetry freshness tracking.
        </p>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-[#D4E7E1] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#78847C] mb-1">
            <span>Total Transmissions</span>
            <Activity className="w-3.5 h-3.5 text-[#123B36]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#123B36] tabular-nums">
            {totalTransmitted.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#78847C] mt-1 font-mono">
            Rate: 1 pkt / 10s per node
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-[#D4E7E1] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#78847C] mb-1">
            <span>Fleet Delivery Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#087E75]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#087E75] tabular-nums">
            {(100 - aggregateLossRate).toFixed(2)}%
          </div>
          <div className="text-[11px] text-[#087E75] mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#087E75]" />
            <span>High reliability channel</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-[#D4E7E1] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#78847C] mb-1">
            <span>Missing Packets</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#C58A35]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#26342D] tabular-nums">
            {totalDropped}
          </div>
          <div className="text-[11px] text-[#78847C] mt-1 font-mono">
            Loss: {aggregateLossRate.toFixed(3)}% (Mesh hops)
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-[#D4E7E1] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#78847C] mb-1">
            <span>CRC32 Validation</span>
            <Radio className="w-3.5 h-3.5 text-[#123B36]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#123B36] tabular-nums">
            99.99%
          </div>
          <div className="text-[11px] text-[#78847C] mt-1 font-mono">
            Discards: {totalCrcErrors} checksum faults
          </div>
        </div>
      </div>

      {/* Two-Column Split: Telemetry Freshness Spectrum & Sequence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Freshness Monitoring Panel */}
        <div className="bg-white p-5 rounded-xl border border-[#D4E7E1] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E1EFEA] pb-3">
            <div>
              <h4 className="text-sm font-semibold text-[#123B36]">
                Data Freshness Spectrum
              </h4>
              <p className="text-xs text-[#78847C]">
                Telemetry age monitoring per node against latency thresholds.
              </p>
            </div>
            <Clock className="w-4 h-4 text-[#78847C]" />
          </div>

          {/* Node Freshness Sliders */}
          <div className="space-y-3.5">
            {nodes.map((n) => {
              const isOffline = n.status === 'offline';
              const isStale = n.status === 'stale';
              let freshnessLabel = 'Real-Time (<15s)';
              let barColor = 'bg-[#087E75]';
              let percent = 95;

              if (isOffline) {
                freshnessLabel = 'Carrier Lost (>60m)';
                barColor = 'bg-[#C95D58]';
                percent = 5;
              } else if (isStale || n.lastSeenSecondsAgo > 900) {
                freshnessLabel = 'Stale Telemetry (>15m)';
                barColor = 'bg-[#C58A35]';
                percent = 35;
              } else if (n.lastSeenSecondsAgo > 30) {
                freshnessLabel = 'Delayed (30s–60s)';
                barColor = 'bg-[#55B6A3]';
                percent = 70;
              }

              return (
                <div key={n.nodeId} className="p-3 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#123B36]">
                        {n.nodeId}
                      </span>
                      <span className="text-[#78847C]">{n.assignedPlantName}</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] font-semibold ${
                        isOffline
                          ? 'text-[#C95D58]'
                          : isStale
                          ? 'text-[#C58A35]'
                          : 'text-[#087E75]'
                      }`}
                    >
                      {isOffline ? 'OFFLINE' : `${n.lastSeenSecondsAgo}s ago`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-[#D4E7E1] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#78847C] mt-1.5">
                    <span>Status: {freshnessLabel}</span>
                    <span className="font-mono">IP: {n.ipAddress}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Freshness Legend */}
          <div className="pt-2 border-t border-[#E1EFEA] flex items-center justify-between text-[11px] text-[#78847C]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#087E75]" />
              <span>&lt;15s Fresh</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#55B6A3]" />
              <span>15s–60s Nominal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C58A35]" />
              <span>&gt;15m Stale</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C95D58]" />
              <span>&gt;60m Offline</span>
            </div>
          </div>
        </div>

        {/* Right: Missing Packet Sequence & Payload Structure */}
        <div className="bg-white p-5 rounded-xl border border-[#D4E7E1] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E1EFEA] pb-3">
              <div>
                <h4 className="text-sm font-semibold text-[#123B36]">
                  Sequence Frame Tracker & Payload Schema
                </h4>
                <p className="text-xs text-[#78847C]">
                  Frame sequence continuity validation for {selectedNode.nodeId}.
                </p>
              </div>

              {/* Node selector buttons */}
              <div className="flex items-center gap-1 p-0.5 bg-[#EDF7F4] rounded border border-[#D4E7E1] text-xs">
                {nodes.map((n) => (
                  <button
                    key={n.nodeId}
                    onClick={() => setSelectedNodeId(n.nodeId)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                      selectedNodeId === n.nodeId
                        ? 'bg-white text-[#123B36] font-bold shadow-xs'
                        : 'text-[#78847C] hover:text-[#26342D]'
                    }`}
                  >
                    {n.nodeId}
                  </button>
                ))}
              </div>
            </div>

            {/* Sequence Stream Visualizer */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-semibold text-[#78847C] uppercase tracking-wider block">
                Recent Packet Stream (Last 6 Frames)
              </span>
              <div className="grid grid-cols-6 gap-2 text-center font-mono text-xs">
                <div className="p-2 rounded bg-[#D9F0EA] border border-[#55B6A3]/50 text-[#087E75]">
                  <div className="text-[10px] text-[#78847C]">Seq</div>
                  <div className="font-bold">#54215</div>
                  <div className="text-[9px] text-[#087E75]">200 OK</div>
                </div>
                <div className="p-2 rounded bg-[#D9F0EA] border border-[#55B6A3]/50 text-[#087E75]">
                  <div className="text-[10px] text-[#78847C]">Seq</div>
                  <div className="font-bold">#54216</div>
                  <div className="text-[9px] text-[#087E75]">200 OK</div>
                </div>
                <div className="p-2 rounded bg-[#D9F0EA] border border-[#55B6A3]/50 text-[#087E75]">
                  <div className="text-[10px] text-[#78847C]">Seq</div>
                  <div className="font-bold">#54217</div>
                  <div className="text-[9px] text-[#087E75]">200 OK</div>
                </div>
                <div className="p-2 rounded bg-[#FDF2F2] border border-[#C95D58]/40 text-[#C95D58]">
                  <div className="text-[10px] text-[#C95D58]">Seq</div>
                  <div className="font-bold">#54218</div>
                  <div className="text-[9px] font-semibold">DROPPED</div>
                </div>
                <div className="p-2 rounded bg-[#D9F0EA] border border-[#55B6A3]/50 text-[#087E75]">
                  <div className="text-[10px] text-[#78847C]">Seq</div>
                  <div className="font-bold">#54219</div>
                  <div className="text-[9px] text-[#087E75]">200 OK</div>
                </div>
                <div className="p-2 rounded bg-[#D9F0EA] border border-[#087E75] text-[#123B36] ring-1 ring-[#087E75]/30">
                  <div className="text-[10px] text-[#087E75]">Seq</div>
                  <div className="font-bold">#54220</div>
                  <div className="text-[9px] text-[#087E75] font-semibold">LATEST</div>
                </div>
              </div>
            </div>

            {/* Packet Payload Anatomy Box */}
            <div className="mt-4 p-3 rounded-lg bg-[#F5FAF8] border border-[#D4E7E1] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-[#78847C]">
                <span>Telemetry Payload Format</span>
                <span>JSON / 148 Bytes</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-[#D4E7E1] text-[11px] text-[#26342D] overflow-x-auto leading-relaxed">
                <span className="text-[#123B36] font-semibold">&#123;</span>
                <br />
                &nbsp;&nbsp;<span className="text-[#78847C]">"node_id":</span> "{selectedNode.nodeId}",
                &nbsp;&nbsp;<span className="text-[#78847C]">"seq":</span> 54220,
                &nbsp;&nbsp;<span className="text-[#78847C]">"v_batt":</span> {selectedNode.batteryVoltage.toFixed(2)},
                <br />
                &nbsp;&nbsp;<span className="text-[#78847C]">"sensors":</span> &#123;
                &nbsp;<span className="text-[#087E75]">"sm_pct":</span> 34.2,
                &nbsp;<span className="text-[#087E75]">"mlx_leaf_c":</span> 26.8,
                &nbsp;<span className="text-[#087E75]">"aht_temp_c":</span> 24.2,
                &nbsp;<span className="text-[#087E75]">"aht_rh_pct":</span> 58.4,
                &nbsp;<span className="text-[#087E75]">"bh_lux":</span> 18450
                &#125;,
                <br />
                &nbsp;&nbsp;<span className="text-[#78847C]">"crc32":</span> "0x89A4BF12"
                <br />
                <span className="text-[#123B36] font-semibold">&#125;</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E1EFEA] flex items-center justify-between text-[11px] text-[#78847C]">
            <span>ESP32 Wi-Fi Transmission: HTTP POST /api/telemetry/v1</span>
            <span className="font-mono text-[#087E75] font-medium">Ready for Antigravity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
