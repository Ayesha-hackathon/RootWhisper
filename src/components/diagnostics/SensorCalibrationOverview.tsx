/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Thermometer,
  Droplets,
  Sun,
  Activity,
  AlertCircle,
} from 'lucide-react';

export const SensorCalibrationOverview: React.FC = () => {
  const calibrationProfiles = [
    {
      sensorType: 'Capacitive Soil-Moisture Sensor',
      model: 'Chirp v1.2 / Capacitive Probe v1.2',
      bus: 'ADC1_CH0 (GPIO 36)',
      icon: Droplets,
      calibrationMethod: '2-Point Physical Hydro-Matrix Calibration',
      parameters: [
        { label: 'Dry Air Reference', value: '3,120 ADC counts (0.0% VWC)' },
        { label: 'Saturated Water Reference', value: '1,450 ADC counts (100.0% VWC)' },
        { label: 'Excitation Frequency', value: '1.5 MHz (Prevents ionic polarization)' },
        { label: 'Certified Drift Offset', value: '±0.8% volumetric water content' },
      ],
      lastCalibrated: '2026-10-24',
      nextScheduled: '2026-12-24',
      status: 'CALIBRATED',
      notes:
        'Capacitive measurement measures dielectric permittivity of substrate without direct electrode-to-soil metallic contact, preventing electrolytic degradation.',
    },
    {
      sensorType: 'Infrared Foliage Thermometer',
      model: 'Melexis MLX90614 Contactless IR',
      bus: 'I2C 0x5A (SMBus Compatible)',
      icon: Thermometer,
      calibrationMethod: 'Blackbody Radiometric + Foliage Cuticle Emissivity',
      parameters: [
        { label: 'Emissivity Coefficient (ε)', value: '0.980 (Calibrated for leaf cuticle)' },
        { label: 'Field of View (FOV)', value: '35° focused conical canopy zone' },
        { label: 'Internal Die Compensation', value: 'Active on-chip ambient thermistor' },
        { label: 'Temperature Drift Offset', value: '+0.10°C over 1,000h soak' },
      ],
      lastCalibrated: '2026-10-28',
      nextScheduled: '2026-12-28',
      status: 'CALIBRATED',
      notes:
        'Uses Stefan-Boltzmann radiation balance. Ingestion engine intercepts any -99.0°C register timeout sentinel to prevent invalid readings.',
    },
    {
      sensorType: 'Ambient Temperature & Humidity Sensor',
      model: 'Aosong AHT25 Precision Digital',
      bus: 'I2C 0x38 (Standard 400kHz)',
      icon: Activity,
      calibrationMethod: 'Factory NIST-Traceable Dual Semiconductor Calibration',
      parameters: [
        { label: 'Temperature Accuracy', value: '±0.3°C nominal (20°C–40°C)' },
        { label: 'Relative Humidity Accuracy', value: '±2.0% RH (10%–90% RH)' },
        { label: 'CRC Checksum Engine', value: 'Active on 6-byte telemetry frame' },
        { label: 'Drift Offset', value: '±0.15°C / ±1.0% RH annual' },
      ],
      lastCalibrated: '2026-09-15',
      nextScheduled: '2027-03-15',
      status: 'FACTORY CALIBRATED',
      notes:
        'Provides environmental boundary conditions (T_ambient, RH, VPD) essential for computing leaf-to-air thermal gradient without contaminating stomatal conductance proxies.',
    },
    {
      sensorType: 'Digital Ambient Light Sensor',
      model: 'ROHM BH1750FVI Lux Meter',
      bus: 'I2C 0x23 (ADDR to GND)',
      icon: Sun,
      calibrationMethod: 'CIE Photopic Spectral Response + Cosine Optical Mask',
      parameters: [
        { label: 'Measurement Mode', value: 'Continuously H-Resolution Mode 1 (1 lx)' },
        { label: 'Peak Sensitivity', value: '555 nm (Matches human & photosynthetic eye)' },
        { label: 'Optical Transmittance (k)', value: '1.021 glass dome multiplier' },
        { label: 'Drift Offset', value: '< 1.5% under LED horticultural fixtures' },
      ],
      lastCalibrated: '2026-10-15',
      nextScheduled: '2027-01-15',
      status: 'CALIBRATED',
      notes:
        'Used to verify active photoperiod irradiance thresholds (>10,000 lux) before evaluating stomatal conductance and water-stress transpiration deficits.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#123B36]">
            Sensor Array Calibration & Metrological Status
          </h3>
          <p className="text-xs text-[#78847C] mt-0.5">
            Hardware calibration curves, emissivity parameters, and drift offsets across the 4 attached sensor modules.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#087E75] font-medium bg-[#D9F0EA] px-3 py-1 rounded-lg border border-[#55B6A3]/40">
          <ShieldCheck className="w-4 h-4 text-[#087E75]" />
          <span>All 4 Sensor Modules Calibrated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {calibrationProfiles.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-[#D4E7E1] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-[#E1EFEA] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#D9F0EA] flex items-center justify-center text-[#123B36]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#123B36]">
                        {p.sensorType}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#78847C]">
                        <span>{p.model}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[10px] text-[#087E75] bg-[#D9F0EA] px-1.5 py-0.2 rounded">
                          {p.bus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D9F0EA] text-[#087E75] shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-[#087E75]" />
                    {p.status}
                  </span>
                </div>

                {/* Calibration Details */}
                <div className="mt-3 space-y-2">
                  <div className="text-[11px] text-[#78847C]">
                    <span className="font-semibold text-[#26342D]">Method:</span> {p.calibrationMethod}
                  </div>

                  <div className="p-3 bg-[#F5FAF8] rounded-lg border border-[#D4E7E1] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {p.parameters.map((param, pIdx) => (
                      <div key={pIdx}>
                        <span className="text-[10px] text-[#78847C] block font-sans">
                          {param.label}
                        </span>
                        <span className="text-xs font-semibold text-[#26342D]">
                          {param.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-[#78847C] leading-relaxed pt-1">
                    {p.notes}
                  </p>
                </div>
              </div>

              {/* Card Footer: Dates */}
              <div className="pt-2 border-t border-[#E1EFEA] flex items-center justify-between text-[11px] text-[#78847C]">
                <span>Last Verified: <strong className="font-mono font-medium text-[#26342D]">{p.lastCalibrated}</strong></span>
                <span>Next Re-Zeroing: <strong className="font-mono font-medium text-[#087E75]">{p.nextScheduled}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
