"""Data validator and sensor quality monitor."""

from typing import Tuple, List
from backend.app.config import (
    ACTIVE_DEVICES,
    TEMP_VALID_RANGE_C,
    HUMIDITY_VALID_RANGE_PCT,
    SOIL_ADC_VALID_RANGE,
    MIN_LIGHT_LUX_DAYTIME,
)
from backend.app.schemas.telemetry import TelemetryIngestRequest
from backend.app.models.device import Device


def calibrate_soil_moisture(raw_adc: int, dry_adc: int, wet_adc: int) -> float:
    """
    Converts raw 12-bit ADC value to soil moisture percentage using probe-specific calibration.
    Capacitive sensors report higher ADC when dry, lower ADC when submerged in water.
    """
    if dry_adc == wet_adc:
        return 0.0
    
    # Calculate percentage: (dry - raw) / (dry - wet) * 100
    # Example: dry = 3200, wet = 1400. raw = 2300.
    # (3200 - 2300) / (3200 - 1400) = 900 / 1800 = 50.0%
    pct = ((dry_adc - raw_adc) / (dry_adc - wet_adc)) * 100.0
    return max(0.0, min(100.0, round(pct, 2)))


def validate_telemetry_payload(payload: TelemetryIngestRequest, device_record: Device) -> Tuple[str, List[str], float]:
    """
    Validates sensor readings and hardware connection diagnostics.
    
    Returns:
        quality_status: 'VALID', 'DEGRADED', or 'INVALID'
        issues: List of explanatory warning/error messages
        computed_soil_pct: Corrected soil moisture percentage from calibrated probe curve
    """
    issues: List[str] = []
    status = "VALID"

    readings = payload.readings
    diag = payload.diagnostics

    # 1. Hardware Connection Flags
    if not diag.mlx_connected:
        issues.append("MLX90614 infrared leaf sensor disconnected or I2C bus error")
        status = "INVALID"

    if not diag.aht_connected:
        issues.append("AHT25 ambient temperature/humidity sensor disconnected or I2C bus error")
        status = "INVALID"

    if not diag.bh1750_connected:
        issues.append("BH1750 ambient light sensor disconnected or I2C bus error")
        status = "INVALID"

    if not diag.soil_sensor_valid:
        issues.append("Soil moisture sensor reports invalid voltage level")
        status = "INVALID"

    # 2. Physical Sanity Bounds Checking
    t_min, t_max = TEMP_VALID_RANGE_C
    if not (t_min <= readings.leaf_temp_c <= t_max):
        issues.append(f"Leaf temperature ({readings.leaf_temp_c}°C) is outside physical range [{t_min}, {t_max}]")
        status = "INVALID"

    if not (t_min <= readings.ambient_temp_c <= t_max):
        issues.append(f"Ambient temperature ({readings.ambient_temp_c}°C) is outside physical range [{t_min}, {t_max}]")
        status = "INVALID"

    h_min, h_max = HUMIDITY_VALID_RANGE_PCT
    if not (h_min <= readings.ambient_humidity_pct <= h_max):
        issues.append(f"Ambient humidity ({readings.ambient_humidity_pct}%) is outside range [{h_min}, {h_max}]")
        status = "INVALID"

    if readings.light_lux < 0.0:
        issues.append(f"Light intensity ({readings.light_lux} Lux) cannot be negative")
        status = "INVALID"

    adc_min, adc_max = SOIL_ADC_VALID_RANGE
    if not (adc_min <= readings.soil_moisture_raw <= adc_max):
        issues.append(f"Raw soil ADC ({readings.soil_moisture_raw}) is outside valid ESP32 ADC range [{adc_min}, {adc_max}]")
        status = "INVALID"

    # 3. Nighttime / Low-Light Warning (Transpiration physics changes without light)
    if readings.light_lux < MIN_LIGHT_LUX_DAYTIME and status != "INVALID":
        issues.append(f"Light intensity ({readings.light_lux} Lux) indicates low-light/night conditions; stomata naturally closed")
        status = "DEGRADED"

    # 4. Calibrate Soil Moisture using Device's individual probe values
    computed_soil_pct = calibrate_soil_moisture(
        raw_adc=readings.soil_moisture_raw,
        dry_adc=device_record.soil_dry_adc,
        wet_adc=device_record.soil_wet_adc
    )

    return status, issues, computed_soil_pct

