"""Pydantic schemas for data validation and API request/response contracts."""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class SensorReadingsPayload(BaseModel):
    """Raw readings payload sent from ESP32."""
    soil_moisture_raw: int = Field(..., description="Raw 12-bit ADC reading (0-4095) from capacitive sensor")
    soil_moisture_pct: Optional[float] = Field(None, description="Calculated soil moisture percentage, or recomputed on server")
    leaf_temp_c: float = Field(..., description="Leaf surface temperature from MLX90614 in Celsius")
    ambient_temp_c: float = Field(..., description="Ambient air temperature from AHT25 in Celsius")
    ambient_humidity_pct: float = Field(..., description="Ambient relative humidity from AHT25 in percentage")
    light_lux: float = Field(..., description="Ambient light intensity from BH1750 in Lux")


class SensorDiagnosticsPayload(BaseModel):
    """Diagnostic flags and hardware telemetry from ESP32."""
    wifi_rssi: Optional[int] = Field(None, description="Wi-Fi Received Signal Strength Indication in dBm")
    mlx_connected: bool = Field(True, description="True if MLX90614 I2C handshake succeeded")
    aht_connected: bool = Field(True, description="True if AHT25 I2C handshake succeeded")
    bh1750_connected: bool = Field(True, description="True if BH1750 I2C handshake succeeded")
    soil_sensor_valid: bool = Field(True, description="True if analog voltage is within safe ESP32 range")
    uptime_seconds: Optional[int] = Field(0, description="Node uptime in seconds")


class TelemetryIngestRequest(BaseModel):
    """Common telemetry payload structure used by all ESP32 nodes."""
    device_id: str = Field(..., description="Plant node identifier: TULSI_01, HIBISCUS_01, or MONEYPLANT_01")
    firmware_version: Optional[str] = Field("1.0.0", description="Firmware version running on ESP32")
    readings: SensorReadingsPayload
    diagnostics: SensorDiagnosticsPayload = Field(default_factory=SensorDiagnosticsPayload)
    is_simulated: Optional[bool] = Field(False, description="Flag explicitly marking simulated test data vs physical hardware")


class ScreeningResponse(BaseModel):
    """Response returned upon telemetry ingestion and screening."""
    telemetry_id: int
    device_id: str
    timestamp: str
    screening_output: str
    confidence_score: float
    expected_leaf_temp_c: Optional[float]
    actual_leaf_temp_c: float
    residual_c: Optional[float]
    adaptive_threshold_c: Optional[float] = None
    consecutive_elevated_count: Optional[int] = None
    soil_moisture_pct: float
    soil_status: str
    soil_moisture_trend: Optional[str] = None
    thermal_status: str
    evidence_sufficiency: Optional[str] = None
    scientific_reason: str
    is_simulated: bool


class DeviceConfigUpdate(BaseModel):
    """Payload to update calibration or provisional thresholds for a plant."""
    soil_dry_adc: Optional[int] = None
    soil_wet_adc: Optional[int] = None
    provisional_soil_dry_threshold_pct: Optional[float] = None
    provisional_temp_residual_threshold_c: Optional[float] = None
    persistence_window_size: Optional[int] = None
