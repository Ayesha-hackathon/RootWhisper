"""Device ORM model representing each individual plant monitoring node."""

from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime
from backend.app.database import Base


class Device(Base):
    __tablename__ = "devices"

    device_id = Column(String(50), primary_key=True, index=True)
    plant_name = Column(String(100), nullable=False)
    species = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)

    # Calibration parameters per probe
    soil_dry_adc = Column(Integer, default=3200)
    soil_wet_adc = Column(Integer, default=1400)

    # Provisional screening thresholds
    provisional_soil_dry_threshold_pct = Column(Float, default=35.0)
    provisional_temp_residual_threshold_c = Column(Float, default=1.5)
    persistence_window_size = Column(Integer, default=5)

    # Operational status
    is_online = Column(Boolean, default=False)
    last_seen = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "device_id": self.device_id,
            "plant_name": self.plant_name,
            "species": self.species,
            "description": self.description,
            "soil_dry_adc": self.soil_dry_adc,
            "soil_wet_adc": self.soil_wet_adc,
            "provisional_soil_dry_threshold_pct": self.provisional_soil_dry_threshold_pct,
            "provisional_temp_residual_threshold_c": self.provisional_temp_residual_threshold_c,
            "persistence_window_size": self.persistence_window_size,
            "is_online": self.is_online,
            "last_seen": self.last_seen.isoformat() if self.last_seen else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

