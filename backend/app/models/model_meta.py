"""Model metadata ORM for tracking individual-plant baseline training runs."""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from backend.app.database import Base


class PlantModelMetadata(Base):
    __tablename__ = "plant_models"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_id = Column(String(50), ForeignKey("devices.device_id"), nullable=False, index=True)
    trained_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    n_samples = Column(Integer, nullable=False)
    n_train = Column(Integer, nullable=True)
    n_test = Column(Integer, nullable=True)
    r2_score = Column(Float, nullable=True)
    mae_score = Column(Float, nullable=True)
    adaptive_threshold_c = Column(Float, nullable=True)
    residual_std_c = Column(Float, nullable=True)
    residual_mean_c = Column(Float, nullable=True)
    model_path = Column(String(255), nullable=False)
    features_list = Column(String(255), default="ambient_temp_c,ambient_humidity_pct,light_lux")
    validation_approach = Column(String(100), default="Chronological Forward Split (Time-Aware)")
    data_provenance = Column(String(50), default="SIMULATED_TEST_DATA")
    is_active = Column(Boolean, default=True)
    notes = Column(String(255), default="Individual baseline model. N=1 specimen only.")
    scientific_limitations = Column(
        String(500),
        default="Individual specimen demonstration (N=1). Demonstrates transpirational baseline; does not establish species-level behavior without physical multi-plant trials."
    )

    def to_dict(self):
        return {
            "id": self.id,
            "device_id": self.device_id,
            "trained_at": self.trained_at.isoformat() if self.trained_at else None,
            "n_samples": self.n_samples,
            "n_train": self.n_train,
            "n_test": self.n_test,
            "r2_score": self.r2_score,
            "mae_score": self.mae_score,
            "adaptive_threshold_c": self.adaptive_threshold_c,
            "residual_std_c": self.residual_std_c,
            "residual_mean_c": self.residual_mean_c,
            "model_path": self.model_path,
            "features_list": self.features_list,
            "validation_approach": self.validation_approach,
            "data_provenance": self.data_provenance,
            "is_active": self.is_active,
            "notes": self.notes,
            "scientific_limitations": self.scientific_limitations,
        }
