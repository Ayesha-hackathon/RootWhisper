"""Telemetry ORM model for storing raw and validated sensor readings per plant."""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Index
from backend.app.database import Base


class Telemetry(Base):
    __tablename__ = "telemetry_readings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_id = Column(String(50), ForeignKey("devices.device_id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Sensor measurements
    soil_moisture_raw = Column(Integer, nullable=False)
    soil_moisture_pct = Column(Float, nullable=False)
    leaf_temp_c = Column(Float, nullable=False)
    ambient_temp_c = Column(Float, nullable=False)
    ambient_humidity_pct = Column(Float, nullable=False)
    light_lux = Column(Float, nullable=False)

    # Derived agronomic metrics
    vpd_kpa = Column(Float, nullable=True)  # Vapor Pressure Deficit
    delta_t_c = Column(Float, nullable=True)  # Leaf Temp - Ambient Temp

    # Hardware diagnostics
    wifi_rssi = Column(Integer, nullable=True)
    mlx_connected = Column(Boolean, default=True)
    aht_connected = Column(Boolean, default=True)
    bh1750_connected = Column(Boolean, default=True)
    soil_sensor_valid = Column(Boolean, default=True)
    uptime_seconds = Column(Integer, default=0)

    # Quality control
    quality_status = Column(String(20), default="VALID")  # VALID, DEGRADED, INVALID
    quality_issues = Column(String(255), nullable=True)

    # Explicit isolation for simulated/test data vs real hardware
    is_simulated = Column(Boolean, default=False, nullable=False, index=True)

    __table_args__ = (
        Index("idx_device_time", "device_id", "timestamp"),
        Index("idx_device_simulated", "device_id", "is_simulated"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "device_id": self.device_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "soil_moisture_raw": self.soil_moisture_raw,
            "soil_moisture_pct": self.soil_moisture_pct,
            "leaf_temp_c": self.leaf_temp_c,
            "ambient_temp_c": self.ambient_temp_c,
            "ambient_humidity_pct": self.ambient_humidity_pct,
            "light_lux": self.light_lux,
            "vpd_kpa": self.vpd_kpa,
            "delta_t_c": self.delta_t_c,
            "wifi_rssi": self.wifi_rssi,
            "mlx_connected": self.mlx_connected,
            "aht_connected": self.aht_connected,
            "bh1750_connected": self.bh1750_connected,
            "soil_sensor_valid": self.soil_sensor_valid,
            "uptime_seconds": self.uptime_seconds,
            "quality_status": self.quality_status,
            "quality_issues": self.quality_issues,
            "is_simulated": self.is_simulated,
        }

