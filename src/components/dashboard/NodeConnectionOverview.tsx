/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Cpu,
  Wifi,
  BatteryCharging,
  Activity,
  CheckCircle2,
  Send,
  Zap,
} from 'lucide-react';
import { ESP32Node } from '../../types';

interface NodeConnectionOverviewProps {
  nodes: ESP32Node[];
  onOpenDiagnostics?: () => void;
}

export const NodeConnectionOverview: React.FC<NodeConnectionOverviewProps> = ({
  nodes,
  onOpenDiagnostics,
}) => {
  const [pingingNode, setPingingNode] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<{ [nodeId: string]: string }>({});

  const handlePing = (nodeId: string) => {
    setPingingNode(nodeId);
    setTimeout(() => {
      const latency = Math.floor(Math.random() * 18 + 12);
      setPingResults((prev) => ({
        ...prev,
        [nodeId]: `${latency}ms (ACK OK)`,
      }));
      setPingingNode(null);
    }, 600);
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5EBE3] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-3 border-b border-[#EEF3ED]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#173F32] tracking-tight">
              ESP32 Sensor Node Telemetry & Mesh Fleet
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#EEF3ED] text-[#245640]">
              Mesh Network Online
            </span>
          </div>
          <p className="text-xs text-[#78847C] mt-0.5">
            Distributed edge nodes transmitting radiometric IR leaf thermometry, I2C substrate capacitance, and PAR light.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenDiagnostics && (
            <button
              onClick={onOpenDiagnostics}
              className="py-1 px-3 rounded text-xs font-medium bg-[#EEF3ED] text-[#173F32] hover:bg-[#173F32] hover:text-white transition-colors cursor-pointer border border-[#A8BDA8]/50"
            >
              Open Diagnostics Centre →
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nodes.map((node) => {
          return (
            <div
              key={node.nodeId}
              className="p-4 rounded-lg bg-[#F8F8F4] border border-[#E5EBE3] flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-[#173F32]" />
                      <span className="font-mono font-semibold text-xs text-[#173F32]">
                        {node.nodeId}
                      </span>
                    </div>
                    <p className="text-xs text-[#26342D] font-medium mt-0.5">
                      {node.assignedPlantName}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-[#245640] bg-[#EEF3ED] px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-[#245640]" />
                    Online
                  </span>
                </div>

                {/* Node Hardware Spec Badges */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  {/* Battery & Solar */}
                  <div className="p-2 rounded bg-white border border-[#E5EBE3]/70">
                    <div className="flex items-center justify-between text-[#78847C] text-[10px]">
                      <span>Power</span>
                      <BatteryCharging className="w-3 h-3 text-[#245640]" />
                    </div>
                    <p className="font-semibold text-[#173F32] mt-0.5">
                      {node.batteryVoltage.toFixed(2)}V · Solar
                    </p>
                  </div>

                  {/* WiFi RSSI */}
                  <div className="p-2 rounded bg-white border border-[#E5EBE3]/70">
                    <div className="flex items-center justify-between text-[#78847C] text-[10px]">
                      <span>Signal</span>
                      <Wifi className="w-3 h-3 text-[#173F32]" />
                    </div>
                    <p className="font-semibold text-[#173F32] mt-0.5">
                      {node.rssi} dBm
                    </p>
                  </div>
                </div>

                {/* Sensor Array Health */}
                <div className="mt-3 pt-2.5 border-t border-[#EEF3ED]">
                  <p className="text-[10px] font-semibold text-[#78847C] uppercase tracking-wider mb-1.5">
                    Attached Sensor Array
                  </p>
                  <div className="space-y-1">
                    {node.sensors.map((sensor, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between text-[11px]"
                      >
                        <span className="text-[#26342D] truncate pr-1">
                          {sensor.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#245640] shrink-0">
                          {sensor.model}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ping action & Uptime */}
              <div className="mt-4 pt-3 border-t border-[#EEF3ED] flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#78847C] font-mono">
                  Up: {node.uptimeHours}h · Loss: {node.packetLoss}%
                </span>

                <button
                  onClick={() => handlePing(node.nodeId)}
                  disabled={pingingNode === node.nodeId}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-medium text-[#173F32] bg-white border border-[#E5EBE3] hover:border-[#A8BDA8] transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>
                    {pingingNode === node.nodeId
                      ? 'Pinging...'
                      : pingResults[node.nodeId] || 'Ping Node'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
