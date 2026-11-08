/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, Code } from 'lucide-react';
import { SAMPLE_DATA_METADATA } from '../../data/sampleData';
import { ANTIGRAVITY_CONFIG } from '../../services/antigravityApi';

interface SampleDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawSampleJson: any;
}

export const SampleDataModal: React.FC<SampleDataModalProps> = ({
  isOpen,
  onClose,
  rawSampleJson,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(rawSampleJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#123B36]/40 backdrop-blur-xs select-none">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl border border-[#D4E7E1] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9F0EA] flex items-center justify-between bg-[#F5FAF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#123B36] flex items-center justify-center text-[#F5FAF8]">
              <Database className="w-4 h-4 text-[#55B6A3]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#123B36]">
                Prototype Sample Data Architecture
              </h2>
              <p className="text-[11px] text-[#78847C]">
                Ready for Google Antigravity & ESP32 mesh integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78847C] hover:text-[#26342D] hover:bg-[#D9F0EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#26342D]">
          <div className="p-4 rounded-xl bg-[#D9F0EA]/70 border border-[#55B6A3]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#123B36]">
                Backend Data Architecture
              </span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded text-white ${ANTIGRAVITY_CONFIG.useSampleData ? 'bg-[#C58A35]' : 'bg-[#087E75]'}`}>
                {ANTIGRAVITY_CONFIG.useSampleData ? 'SAMPLE DATA ACTIVE' : 'LIVE FASTAPI BACKEND ACTIVE'}
              </span>
            </div>
            <p className="text-[#78847C] leading-relaxed text-[11px]">
              {ANTIGRAVITY_CONFIG.useSampleData
                ? 'This frontend prototype is running in standalone sample mode.'
                : 'Directly communicating with the live Python FastAPI backend at ' + ANTIGRAVITY_CONFIG.apiUrl + ' and SQLite database data/rootwhisper.db. Telemetry is queried from the 3 ESP32 nodes.'}
            </p>
          </div>

          {/* Config Parameters Table */}
          <div className="border border-[#D4E7E1] rounded-lg overflow-hidden">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-[#F5FAF8] border-b border-[#D4E7E1] text-[#78847C]">
                <tr>
                  <th className="p-2.5">Parameter</th>
                  <th className="p-2.5">Current Setting</th>
                  <th className="p-2.5">Production Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9F0EA]">
                <tr>
                  <td className="p-2.5 text-[#123B36] font-semibold">Data Source</td>
                  <td className="p-2.5 text-[#C58A35]">Synthetic Lab Sample</td>
                  <td className="p-2.5 text-[#087E75]">Antigravity REST / SSE</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-[#123B36] font-semibold">API Base URL</td>
                  <td className="p-2.5 text-[#78847C]">{ANTIGRAVITY_CONFIG.apiUrl}</td>
                  <td className="p-2.5 text-[#087E75]">VITE_ANTIGRAVITY_API_URL</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-[#123B36] font-semibold">AI Model Core</td>
                  <td className="p-2.5 text-[#78847C]">{ANTIGRAVITY_CONFIG.aiModelVersion}</td>
                  <td className="p-2.5 text-[#087E75]">Google Antigravity Engine</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-[#123B36] font-semibold">Hardware Mesh</td>
                  <td className="p-2.5 text-[#78847C]">{ANTIGRAVITY_CONFIG.esp32MeshId}</td>
                  <td className="p-2.5 text-[#087E75]">ESP32 Wi-Fi / MQTT Gateway</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Raw JSON Inspector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-[#123B36] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#78847C]" />
                Sample Telemetry Payload (JSON)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-mono text-[#123B36] hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#087E75]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#26342D] text-[#D9F0EA] rounded-lg text-[10px] font-mono overflow-x-auto max-h-48 scrollbar-thin">
              {JSON.stringify(rawSampleJson, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#D9F0EA] bg-[#F5FAF8] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#123B36] text-white rounded-md text-xs font-medium hover:bg-[#087E75] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
