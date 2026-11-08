"""Model baseline training and inspection router."""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.database import get_db
from backend.app.config import ACTIVE_DEVICES
from backend.app.models.device import Device
from backend.app.models.telemetry import Telemetry
from backend.app.models.model_meta import PlantModelMetadata
from ml_engine.baseline_trainer import train_plant_baseline, load_plant_baseline

router = APIRouter(prefix="/api/v1/models", tags=["models"])


@router.post("/{device_id}/train")
def train_model_endpoint(
    device_id: str,
    include_simulated: bool = Query(False, description="Allow using simulated baseline data for testing"),
    db: Session = Depends(get_db)
):
    """
    Trains an individual-plant Random Forest baseline model using chronological time-aware validation.
    Predicts expected leaf temperature from ambient temperature, humidity, and light intensity.
    Soil moisture is intentionally excluded from prediction features.
    """
    device_id = device_id.upper()
    if device_id not in ACTIVE_DEVICES:
        raise HTTPException(status_code=400, detail=f"Invalid device_id '{device_id}'.")

    # Fetch valid readings
    query = db.query(Telemetry).filter(
        Telemetry.device_id == device_id,
        Telemetry.quality_status == "VALID",
        Telemetry.light_lux >= 100.0  # Daytime active transpirational periods only
    )
    if not include_simulated:
        query = query.filter(Telemetry.is_simulated == False)

    records = query.order_by(Telemetry.timestamp.asc()).all()
    if len(records) < 15:
        data_type = "hardware" if not include_simulated else "valid"
        raise HTTPException(
            status_code=400,
            detail=(
                f"Insufficient {data_type} training data for {device_id}. Need at least 15 daytime records, "
                f"currently have {len(records)}. Fabricated readings are not accepted for physical hardware models."
            )
        )

    data = [
        {
            "ambient_temp_c": r.ambient_temp_c,
            "ambient_humidity_pct": r.ambient_humidity_pct,
            "light_lux": r.light_lux,
            "vpd_kpa": r.vpd_kpa if r.vpd_kpa is not None else 1.0,
            "leaf_temp_c": r.leaf_temp_c,
            "timestamp": r.timestamp.isoformat() if r.timestamp else None,
        }
        for r in records
    ]

    try:
        metrics = train_plant_baseline(device_id=device_id, records=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

    provenance = "SIMULATED_TEST_DATA" if include_simulated else "PHYSICAL_HARDWARE"

    # Update device's adaptive residual threshold in database
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if device and metrics.get("adaptive_threshold_c"):
        device.provisional_temp_residual_threshold_c = metrics["adaptive_threshold_c"]

    # Record in database
    meta = PlantModelMetadata(
        device_id=device_id,
        trained_at=datetime.now(timezone.utc),
        n_samples=metrics["n_samples"],
        n_train=metrics.get("n_train"),
        n_test=metrics.get("n_test"),
        r2_score=metrics["r2_score"],
        mae_score=metrics["mae_score"],
        adaptive_threshold_c=metrics.get("adaptive_threshold_c"),
        residual_std_c=metrics.get("residual_std_c"),
        residual_mean_c=metrics.get("residual_mean_c"),
        model_path=metrics["model_path"],
        features_list=",".join(metrics["features_used"]),
        validation_approach=metrics.get("validation_approach", "Chronological Forward Split"),
        data_provenance=provenance,
        is_active=True,
        notes=f"Individual baseline model ({provenance}). Chronologically validated.",
        scientific_limitations=metrics.get("scientific_limitations")
    )
    db.add(meta)
    db.commit()
    db.refresh(meta)

    return {
        "status": "SUCCESS",
        "device_id": device_id,
        "metrics": metrics,
        "data_provenance": provenance,
        "db_record": meta.to_dict()
    }


@router.get("/{device_id}/status")
def get_model_status(device_id: str, db: Session = Depends(get_db)):
    """Returns active baseline model status, training history, adaptive thresholds, and scientific limitations."""
    device_id = device_id.upper()
    if device_id not in ACTIVE_DEVICES:
        raise HTTPException(status_code=400, detail=f"Invalid device_id '{device_id}'.")

    latest_meta = db.query(PlantModelMetadata).filter(
        PlantModelMetadata.device_id == device_id
    ).order_by(desc(PlantModelMetadata.id)).first()

    device = db.query(Device).filter(Device.device_id == device_id).first()
    model_loaded = (load_plant_baseline(device_id) is not None)

    return {
        "device_id": device_id,
        "plant_name": ACTIVE_DEVICES[device_id]["plant_name"],
        "is_calibrated": model_loaded,
        "current_adaptive_threshold_c": device.provisional_temp_residual_threshold_c if device else 1.5,
        "metadata": latest_meta.to_dict() if latest_meta else None,
        "scientific_limitation_notice": (
            "Individual Specimen Baseline (N=1): This Random Forest model captures the idiosyncratic "
            "transpirational cooling response of this single physical specimen under well-watered conditions. "
            "A single plant per species demonstrates the AI screening methodology but does not establish general "
            "species-level physiological behavior without external multi-specimen physical trials."
        )
    }
