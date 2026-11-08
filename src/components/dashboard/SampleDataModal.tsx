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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173F32]/40 backdrop-blur-xs select-none">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl border border-[#E5EBE3] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EEF3ED] flex items-center justify-between bg-[#F8F8F4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#173F32] flex items-center justify-center text-[#F8F8F4]">
              <Database className="w-4 h-4 text-[#A8BDA8]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#173F32]">
                Prototype Sample Data Architecture
              </h2>
              <p className="text-[11px] text-[#78847C]">
                Ready for Google Antigravity & ESP32 mesh integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78847C] hover:text-[#26342D] hover:bg-[#EEF3ED] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#26342D]">
          <div className="p-4 rounded-xl bg-[#EEF3ED]/70 border border-[#A8BDA8]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#173F32]">
                Decoupled Architecture Notice
              </span>
              <span className="font-mono text-[10px] bg-[#173F32] text-white px-2 py-0.5 rounded">
                SAMPLE DATA ACTIVE
              </span>
            </div>
            <p className="text-[#78847C] leading-relaxed text-[11px]">
              This frontend prototype strictly isolates all sample mock records inside{' '}
              <code className="text-[#173F32] font-mono font-semibold">/src/data/sampleData.ts</code>.
              Your existing Antigravity backend, AI engine, and ESP32 broker are connected via the service contract in{' '}
              <code className="text-[#173F32] font-mono font-semibold">/src/services/antigravityApi.ts</code>.
            </p>
          </div>

          {/* Config Parameters Table */}
          <div className="border border-[#E5EBE3] rounded-lg overflow-hidden">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-[#F8F8F4] border-b border-[#E5EBE3] text-[#78847C]">
                <tr>
                  <th className="p-2.5">Parameter</th>
                  <th className="p-2.5">Current Setting</th>
                  <th className="p-2.5">Production Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3ED]">
                <tr>
                  <td className="p-2.5 text-[#173F32] font-semibold">Data Source</td>
                  <td className="p-2.5 text-[#C58A35]">Synthetic Lab Sample</td>
                  <td className="p-2.5 text-[#245640]">Antigravity REST / SSE</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-[#173F32] font-semibold">API Base URL</td>
                  <td className="p-2.5 text-[#78847C]">{ANTIGRAVITY_CONFIG.apiUrl}</td>
                  <td className="p-2.5 text-[#245640]">VITE_ANTIGRAVITY_API_URL</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-[#173F32] font-semibold">AI Model Core</td>
                  <td className="p-2.5 text-[#78847C]">{ANTIGRAVITY_CONFIG.aiModelVersion}</td>
                  <td className="p-2.5 text-[#245640]">Google Antigravity Engine</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-[#173F32] font-semibold">Hardware Mesh</td>
                  <td className="p-2.5 text-[#78847C]">{ANTIGRAVITY_CONFIG.esp32MeshId}</td>
                  <td className="p-2.5 text-[#245640]">ESP32 Wi-Fi / MQTT Gateway</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Raw JSON Inspector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-[#173F32] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#78847C]" />
                Sample Telemetry Payload (JSON)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-mono text-[#173F32] hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#245640]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#26342D] text-[#EEF3ED] rounded-lg text-[10px] font-mono overflow-x-auto max-h-48 scrollbar-thin">
              {JSON.stringify(rawSampleJson, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#EEF3ED] bg-[#F8F8F4] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#173F32] text-white rounded-md text-xs font-medium hover:bg-[#245640] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
