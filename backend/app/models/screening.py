"""Screening result ORM model storing AI and persistence evaluation outcomes."""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Index
from backend.app.database import Base


class ScreeningResult(Base):
    __tablename__ = "screening_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    telemetry_id = Column(Integer, ForeignKey("telemetry_readings.id"), nullable=False)
    device_id = Column(String(50), ForeignKey("devices.device_id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Model inference details
    expected_leaf_temp_c = Column(Float, nullable=True)
    residual_c = Column(Float, nullable=True)  # Actual - Expected
    residual_threshold_c = Column(Float, nullable=False)

    # Persistence metrics across consecutive readings
    consecutive_elevated_count = Column(Integer, default=0)
    elevated_count_in_window = Column(Integer, default=0)
    window_size = Column(Integer, default=5)

    # Separate component evaluation
    thermal_status = Column(String(30), default="NORMAL")  # NORMAL, ELEVATED, INCONCLUSIVE
    soil_status = Column(String(30), default="ADEQUATE")   # ADEQUATE, DRY, INVALID
    soil_moisture_trend = Column(String(30), default="STABLE")  # DEPLETING, STABLE, REHYDRATED, INSUFFICIENT_DATA
    soil_moisture_slope = Column(Float, nullable=True)     # % change per cycle
    evidence_sufficiency = Column(String(30), default="SUFFICIENT")  # SUFFICIENT, INSUFFICIENT

    # Final verdict: NORMAL, POSSIBLE WATER-STRESS INDICATION, INCONCLUSIVE
    screening_output = Column(String(50), nullable=False)
    confidence_score = Column(Float, default=1.0)
    scientific_reason = Column(String(500), nullable=False)

    # Data provenance
    is_simulated = Column(Boolean, default=False, nullable=False, index=True)

    __table_args__ = (
        Index("idx_screening_device_time", "device_id", "timestamp"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "telemetry_id": self.telemetry_id,
            "device_id": self.device_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "expected_leaf_temp_c": self.expected_leaf_temp_c,
            "residual_c": self.residual_c,
            "residual_threshold_c": self.residual_threshold_c,
            "consecutive_elevated_count": self.consecutive_elevated_count,
            "elevated_count_in_window": self.elevated_count_in_window,
            "window_size": self.window_size,
            "thermal_status": self.thermal_status,
            "soil_status": self.soil_status,
            "soil_moisture_trend": self.soil_moisture_trend,
            "soil_moisture_slope": self.soil_moisture_slope,
            "evidence_sufficiency": self.evidence_sufficiency,
            "screening_output": self.screening_output,
            "confidence_score": self.confidence_score,
            "scientific_reason": self.scientific_reason,
            "is_simulated": self.is_simulated,
        }
