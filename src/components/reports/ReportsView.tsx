/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { authApi } from '../../services/authApi';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Sprout,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  Layers,
  Cpu,
  ShieldCheck,
  BarChart3,
  ArrowLeft,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ReportCategory,
  REPORT_CATEGORIES,
  REPORT_SUMMARIES,
  REPORT_TABLE_ROWS,
  REPORT_CHART_SERIES,
  generateReportCsv,
} from '../../data/reportsData';

interface ReportsViewProps {
  onBackToDashboard: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onBackToDashboard }) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('plant-monitoring');
  const [selectedPlant, setSelectedPlant] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('Last 24 Hours');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  const activeCategoryConfig =
    REPORT_CATEGORIES.find((c) => c.id === selectedCategory) || REPORT_CATEGORIES[0];
  const activeSummary = REPORT_SUMMARIES[selectedCategory];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // CSV Export
  const handleExportCsv = () => {
    setIsExporting(true);
    try {
      const csvContent = generateReportCsv(selectedCategory, selectedPlant, dateRange);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `rootwhisper-${selectedCategory}-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Exported ${activeCategoryConfig.title} to CSV.`);
    } finally {
      setIsExporting(false);
    }
  };

  // Print Document Trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 print:p-0 print:m-0 print:space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#123B36] text-[#F5FAF8] text-xs font-medium shadow-lg border border-[#55B6A3]/30 flex items-center gap-2 print:hidden">
          <span className="w-2 h-2 rounded-full bg-[#55B6A3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation & Controls Bar (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#D4E7E1] hover:border-[#123B36] bg-white text-xs font-medium text-[#123B36] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#78847C]">
            <span>Documentation</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#123B36] font-semibold">Research Reports</span>
          </div>
        </div>

        {/* Export & Print CTAs */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#D4E7E1] hover:border-[#123B36] bg-white text-xs font-medium text-[#26342D] transition-colors cursor-pointer disabled:opacity-50"
            title="Download formatted CSV dataset"
          >
            <Download className="w-3.5 h-3.5 text-[#123B36]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-[#123B36] hover:bg-[#087E75] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
            title="Open browser print dialog for high-res PDF export"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Category Switcher & Filter Ribbon (Hidden during print) */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#D4E7E1] shadow-xs space-y-4 print:hidden">
        <div>
          <span className="text-[10px] font-semibold text-[#78847C] uppercase tracking-wider block mb-2">
            Select Report Category
          </span>
          {/* 5 Category Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {REPORT_CATEGORIES.map((cat, idx) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#D9F0EA] border-[#087E75] text-[#123B36] shadow-xs'
                      : 'bg-[#F5FAF8] border-[#D4E7E1] text-[#26342D] hover:bg-[#D9F0EA]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{idx + 1}. {cat.title.split('&')[0]}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#087E75]" />}
                  </div>
                  <p className="text-[10px] text-[#78847C] mt-1 leading-snug line-clamp-2">
                    {cat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Bar: Plant Selector & Date Range Selector */}
        <div className="pt-3 border-t border-[#E1EFEA] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Plant Selector */}
            <div className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#123B36]" />
              <span className="text-[#78847C] font-medium">Plant Scope:</span>
              <select
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="py-1 px-2.5 text-xs bg-[#F5FAF8] border border-[#D4E7E1] rounded-lg text-[#26342D] focus:outline-none focus:border-[#123B36] cursor-pointer"
              >
                <option value="all">All Species (Tulsi, Hibiscus, Money Plant)</option>
                <option value="tulsi-01">Tulsi (TULSI_01)</option>
                <option value="hibiscus-01">Hibiscus (HIBISCUS_01)</option>
                <option value="moneyplant-01">Money Plant (MONEYPLANT_01)</option>
              </select>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#123B36]" />
              <span className="text-[#78847C] font-medium">Date Range:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="py-1 px-2.5 text-xs bg-[#F5FAF8] border border-[#D4E7E1] rounded-lg text-[#26342D] focus:outline-none focus:border-[#123B36] cursor-pointer"
              >
                <option value="Last 24 Hours">Last 24 Hours (Diurnal cycle)</option>
                <option value="Last 7 Days">Last 7 Days (Hydraulic trend)</option>
                <option value="Last 30 Days">Last 30 Days (Baseline epoch)</option>
                <option value="Season 2026-Q4">Season 2026-Q4 (Calibration trial)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[#78847C]">
            <Clock className="w-3 h-3 text-[#78847C]" />
            <span>Generated: 2026-11-06 23:45 UTC</span>
          </div>
        </div>
      </div>

      {/* 4 Executive Summary Metric Cards for the chosen category */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {activeSummary.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-[#D4E7E1] shadow-xs flex flex-col justify-between"
          >
            <div className="text-[11px] text-[#78847C] font-medium mb-1 truncate">
              {item.label}
            </div>
            <div className="font-mono text-2xl font-bold text-[#123B36] tabular-nums">
              {item.value}
            </div>
            <div className="mt-2 pt-2 border-t border-[#E1EFEA] flex items-center justify-between text-[10px] text-[#78847C]">
              <span className="truncate">{item.subtext}</span>
              <span className="text-[#087E75] font-semibold shrink-0 ml-1">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* PRINT-FRIENDLY FORMAL REPORT PREVIEW DOCUMENT */}
      {/* ==================================================================== */}
      <div
        ref={reportRef}
        className="bg-white rounded-2xl border border-[#D4E7E1] shadow-sm p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0 print:space-y-6"
      >
        {/* Formal Institutional Header */}
        <div className="border-b-2 border-[#123B36] pb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#087E75] tracking-wider uppercase font-semibold">
                <span>RootWhisper Botanical Phytotron Lab</span>
                <span aria-hidden="true">·</span>
                <span>Chamber A-4</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#123B36] mt-1">
                {activeCategoryConfig.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#78847C] mt-1 max-w-2xl">
                {activeCategoryConfig.description}
              </p>
            </div>

            {/* Document Reference Stamp */}
            <div className="p-3 bg-[#F5FAF8] border border-[#D4E7E1] rounded-lg text-right font-mono text-[11px] shrink-0 space-y-0.5">
              <div><strong className="text-[#123B36]">DOC REF:</strong> RW-REP-2026-11</div>
              <div><strong className="text-[#123B36]">SCOPE:</strong> {selectedPlant.toUpperCase()}</div>
              <div><strong className="text-[#123B36]">RANGE:</strong> {dateRange}</div>
              <div className="text-[10px] text-[#087E75] font-semibold">SECURITY: UNRESTRICTED RESEARCH</div>
            </div>
          </div>

          {/* Explicit Sample Data Notice Banner */}
          <div className="px-4 py-2.5 rounded-lg bg-[#D9F0EA] border border-[#55B6A3]/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#123B36] font-semibold">
              <Info className="w-4 h-4 text-[#087E75]" />
              <span>{activeCategoryConfig.sampleNotice}</span>
            </div>
            <span className="text-[11px] font-mono text-[#78847C] hidden sm:inline">
              Backend Integration: Google Antigravity Ready
            </span>
          </div>
        </div>

        {/* Report Section 1: Executive Findings Prose */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#123B36] uppercase tracking-wider">
            1. Executive Overview & Methodology
          </h3>
          <p className="text-xs sm:text-sm text-[#26342D] leading-relaxed">
            This report evaluates plant water-stress dynamics and environmental equilibrium within
            RootWhisper Screening Chamber A-4 over the specified period (<span className="font-semibold">{dateRange}</span>).
            Thermal screening incorporates non-contact radiometric infrared leaf temperatures (MLX90614)
            calibrated for foliage cuticle emissivity ($\varepsilon=0.98$), contrasted against AHT25 ambient temperatures.
            Soil moisture is measured via 1.5MHz capacitive analog impedance probes. Consistent with scientific screening
            principles, soil moisture serves exclusively as supporting physiological evidence and is decoupled from
            the primary thermodynamic leaf temperature expectation model.
          </p>
        </div>

        {/* Report Section 2: Recharts Trend Analysis Visual */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#123B36] uppercase tracking-wider">
              2. Temporal Trend Visualizations & Microclimate Response
            </h3>
            <span className="text-xs font-mono text-[#78847C]">24-Hour Diurnal Sample</span>
          </div>

          <div className="bg-[#F0F7F4] p-4 sm:p-5 rounded-xl border border-[#D4E7E1]">
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={REPORT_CHART_SERIES}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4E7E1" />
                  <XAxis
                    dataKey="time"
                    stroke="#78847C"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#78847C"
                    fontSize={11}
                    tickLine={false}
                    unit="°C"
                    domain={[-1.5, 3.5]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#78847C"
                    fontSize={11}
                    tickLine={false}
                    unit=" kPa"
                    domain={[0.5, 2.0]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#D4E7E1',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="tulsiDelta"
                    name="Tulsi ΔT (T_leaf - T_air)"
                    stroke="#C95D58"
                    strokeWidth={2.2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="hibiscusDelta"
                    name="Hibiscus ΔT (T_leaf - T_air)"
                    stroke="#087E75"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="moneyDelta"
                    name="Money Plant ΔT"
                    stroke="#123B36"
                    strokeWidth={1.8}
                    dot={{ r: 2 }}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="vpd"
                    name="Chamber VPD (kPa)"
                    fill="#55B6A3"
                    opacity={0.35}
                    barSize={16}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-[#78847C] mt-2 italic text-center">
              Figure 1.1: Diurnal leaf-to-air thermal gradient (ΔT) contrast. Tulsi experiences afternoon stomatal restriction (+2.8°C delta), while Hibiscus maintains evaporative cooling (-0.7°C delta).
            </p>
          </div>
        </div>

        {/* Report Section 3: Comprehensive Findings Data Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#123B36] uppercase tracking-wider">
            3. Quantitative Findings & Telemetry Ledger
          </h3>

          <div className="overflow-x-auto border border-[#D4E7E1] rounded-xl">
            {selectedCategory === 'plant-monitoring' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F0F7F4] border-b border-[#D4E7E1] text-[11px] font-semibold text-[#78847C] uppercase">
                    <th className="py-2.5 px-3">Species</th>
                    <th className="py-2.5 px-3">Node ID</th>
                    <th className="py-2.5 px-3">Soil Moisture</th>
                    <th className="py-2.5 px-3">Leaf Temp</th>
                    <th className="py-2.5 px-3">ΔT (Leaf - Air)</th>
                    <th className="py-2.5 px-3">CWSI Score</th>
                    <th className="py-2.5 px-3">Physiological State</th>
                    <th className="py-2.5 px-3">Protocol Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1EFEA]">
                  {REPORT_TABLE_ROWS['plant-monitoring'].map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#F5FAF8]">
                      <td className="py-2.5 px-3 font-semibold text-[#123B36]">{row.plant}</td>
                      <td className="py-2.5 px-3 font-mono">{row.nodeId}</td>
                      <td className="py-2.5 px-3 font-mono">{row.moisture}</td>
                      <td className="py-2.5 px-3 font-mono">{row.leafTemp}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#C95D58]">{row.delta}</td>
                      <td className="py-2.5 px-3 font-mono">{row.cwsi}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.status.includes('Mild')
                            ? 'bg-[#FFF8EB] text-[#C58A35]'
                            : 'bg-[#D9F0EA] text-[#087E75]'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#78847C] text-[11px]">{row.actionNeeded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedCategory === 'sensor-history' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F0F7F4] border-b border-[#D4E7E1] text-[11px] font-semibold text-[#78847C] uppercase">
                    <th className="py-2.5 px-3">Measurement Channel</th>
                    <th className="py-2.5 px-3">Sensor Model</th>
                    <th className="py-2.5 px-3">Mean Value</th>
                    <th className="py-2.5 px-3">Min / Max</th>
                    <th className="py-2.5 px-3">Std Deviation</th>
                    <th className="py-2.5 px-3">Validity %</th>
                    <th className="py-2.5 px-3">Calibration Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1EFEA]">
                  {REPORT_TABLE_ROWS['sensor-history'].map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#F5FAF8]">
                      <td className="py-2.5 px-3 font-semibold text-[#123B36]">{row.channel}</td>
                      <td className="py-2.5 px-3 text-[#78847C]">{row.model}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#26342D]">{row.mean}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">{row.min} – {row.max}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">{row.stdDev}</td>
                      <td className="py-2.5 px-3 text-[#087E75] font-mono font-semibold">{row.dataValidity}</td>
                      <td className="py-2.5 px-3 text-[#087E75]">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedCategory === 'ai-screening' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F0F7F4] border-b border-[#D4E7E1] text-[11px] font-semibold text-[#78847C] uppercase">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Specimen</th>
                    <th className="py-2.5 px-3">T_Expected</th>
                    <th className="py-2.5 px-3">T_Observed</th>
                    <th className="py-2.5 px-3">Residual</th>
                    <th className="py-2.5 px-3">Threshold</th>
                    <th className="py-2.5 px-3">Persistence</th>
                    <th className="py-2.5 px-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1EFEA]">
                  {REPORT_TABLE_ROWS['ai-screening'].map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#F5FAF8]">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#78847C]">{row.timestamp}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#123B36]">{row.plant}</td>
                      <td className="py-2.5 px-3 font-mono">{row.tExpected}</td>
                      <td className="py-2.5 px-3 font-mono">{row.tObserved}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#C95D58]">{row.residual}</td>
                      <td className="py-2.5 px-3 font-mono">{row.threshold}</td>
                      <td className="py-2.5 px-3 text-[11px] text-[#78847C]">{row.persistence}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.outcome.includes('STRESS')
                            ? 'bg-[#FDF2F2] text-[#C95D58]'
                            : row.outcome.includes('WATCH')
                            ? 'bg-[#FFF8EB] text-[#C58A35]'
                            : 'bg-[#D9F0EA] text-[#087E75]'
                        }`}>
                          {row.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedCategory === 'environmental-trend' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F0F7F4] border-b border-[#D4E7E1] text-[11px] font-semibold text-[#78847C] uppercase">
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3">Ambient Temp</th>
                    <th className="py-2.5 px-3">RH %</th>
                    <th className="py-2.5 px-3">VPD</th>
                    <th className="py-2.5 px-3">PAR Lux</th>
                    <th className="py-2.5 px-3">CO2</th>
                    <th className="py-2.5 px-3">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1EFEA]">
                  {REPORT_TABLE_ROWS['environmental-trend'].map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#F5FAF8]">
                      <td className="py-2.5 px-3 font-semibold text-[#123B36]">{row.period}</td>
                      <td className="py-2.5 px-3 font-mono">{row.ambientTemp}</td>
                      <td className="py-2.5 px-3 font-mono">{row.humidity}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#087E75]">{row.vpd}</td>
                      <td className="py-2.5 px-3 font-mono">{row.parLight}</td>
                      <td className="py-2.5 px-3 font-mono">{row.co2}</td>
                      <td className="py-2.5 px-3 text-[#78847C]">{row.evaluation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedCategory === 'node-diagnostics' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F0F7F4] border-b border-[#D4E7E1] text-[11px] font-semibold text-[#78847C] uppercase">
                    <th className="py-2.5 px-3">Node ID</th>
                    <th className="py-2.5 px-3">MAC Address</th>
                    <th className="py-2.5 px-3">Board Spec</th>
                    <th className="py-2.5 px-3">Uptime</th>
                    <th className="py-2.5 px-3">TX / RX</th>
                    <th className="py-2.5 px-3">Dropped</th>
                    <th className="py-2.5 px-3">Signal (RSSI)</th>
                    <th className="py-2.5 px-3">Power</th>
                    <th className="py-2.5 px-3">I2C Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1EFEA]">
                  {REPORT_TABLE_ROWS['node-diagnostics'].map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#F5FAF8]">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#123B36]">{row.nodeId}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#78847C]">{row.mac}</td>
                      <td className="py-2.5 px-3 text-[#78847C]">{row.board}</td>
                      <td className="py-2.5 px-3 font-mono">{row.uptime}</td>
                      <td className="py-2.5 px-3 font-mono">{row.txPackets} / {row.rxPackets}</td>
                      <td className="py-2.5 px-3 font-mono text-[#C58A35]">{row.dropped}</td>
                      <td className="py-2.5 px-3 font-mono">{row.rssi}</td>
                      <td className="py-2.5 px-3 font-mono">{row.voltage}</td>
                      <td className="py-2.5 px-3 text-[#087E75] text-[11px]">{row.busHealth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Report Section 4: Formal Attestation & Investigator Signature Block */}
        <div className="pt-6 border-t-2 border-[#D4E7E1] space-y-4 break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#78847C] uppercase tracking-wider block">
                Principal Research Attestation
              </span>
              <p className="text-xs text-[#78847C] max-w-md">
                Certified that data presented in this report is logged via calibrated ESP32 DevKit V1
                telemetry nodes under standard phytotron photoperiod parameters.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold text-xs text-[#123B36]">{authApi.getStoredUser()?.full_name || 'Station Principal Investigator'}</div>
                <div className="text-[11px] text-[#78847C]">{authApi.getStoredUser()?.email || 'Authorized Station Research Operator'}</div>
                <div className="text-[10px] font-mono text-[#087E75] mt-0.5">Verified Digital Timestamp · Live Backend Engine</div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#123B36] flex items-center justify-center p-1 bg-[#D9F0EA] text-[#123B36]">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E1EFEA] flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#78847C] font-mono">
            <span>RootWhisper Framework · Species-Aware AI Botanical Intelligence</span>
            <span>Document Checksum: 0x8FA42DE1 · Confidentiality: Research Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
