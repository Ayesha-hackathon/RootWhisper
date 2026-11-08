"""Telemetry ingestion and query router."""

from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.database import get_db
from backend.app.config import ACTIVE_DEVICES
from backend.app.models.device import Device
from backend.app.models.telemetry import Telemetry
from backend.app.models.screening import ScreeningResult
from backend.app.schemas.telemetry import TelemetryIngestRequest, ScreeningResponse
from backend.app.services.data_validator import validate_telemetry_payload
from backend.app.services.feature_calc import calculate_vpd_kpa, calculate_delta_t_c
from backend.app.services.screener import evaluate_water_stress

router = APIRouter(prefix="/api/v1/telemetry", tags=["telemetry"])


@router.post("", response_model=ScreeningResponse)
def ingest_sensor_telemetry(payload: TelemetryIngestRequest, db: Session = Depends(get_db)):
    """
    Standard ingestion endpoint for all ESP32 nodes (Tulsi, Hibiscus, Money Plant).
    Receives JSON, validates quality, stores readings in SQLite, and evaluates screening.
    """
    device_id = payload.device_id.upper()
    if device_id not in ACTIVE_DEVICES:
        raise HTTPException(status_code=400, detail=f"Unknown device_id '{payload.device_id}'. Registered nodes: {list(ACTIVE_DEVICES.keys())}")

    # Fetch or auto-register device record
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        dev_meta = ACTIVE_DEVICES[device_id]
        device = Device(
            device_id=device_id,
            plant_name=dev_meta["plant_name"],
            species=dev_meta["species"],
            description=dev_meta["description"],
            soil_dry_adc=dev_meta["default_soil_dry_adc"],
            soil_wet_adc=dev_meta["default_soil_wet_adc"],
            provisional_soil_dry_threshold_pct=dev_meta["provisional_soil_dry_threshold_pct"],
            provisional_temp_residual_threshold_c=dev_meta["provisional_temp_residual_threshold_c"],
        )
        db.add(device)
        db.commit()
        db.refresh(device)

    # 1. Quality validation and calibrated soil percentage computation
    quality_status, quality_issues, calibrated_soil_pct = validate_telemetry_payload(payload, device)

    # 2. Agronomic feature calculations
    vpd_kpa = calculate_vpd_kpa(
        ambient_temp_c=payload.readings.ambient_temp_c,
        ambient_humidity_pct=payload.readings.ambient_humidity_pct
    )
    delta_t_c = calculate_delta_t_c(
        leaf_temp_c=payload.readings.leaf_temp_c,
        ambient_temp_c=payload.readings.ambient_temp_c
    )

    # 3. Store raw & calculated telemetry
    now = datetime.now(timezone.utc)
    telemetry_record = Telemetry(
        device_id=device_id,
        timestamp=now,
        soil_moisture_raw=payload.readings.soil_moisture_raw,
        soil_moisture_pct=calibrated_soil_pct,
        leaf_temp_c=payload.readings.leaf_temp_c,
        ambient_temp_c=payload.readings.ambient_temp_c,
        ambient_humidity_pct=payload.readings.ambient_humidity_pct,
        light_lux=payload.readings.light_lux,
        vpd_kpa=vpd_kpa,
        delta_t_c=delta_t_c,
        wifi_rssi=payload.diagnostics.wifi_rssi,
        mlx_connected=payload.diagnostics.mlx_connected,
        aht_connected=payload.diagnostics.aht_connected,
        bh1750_connected=payload.diagnostics.bh1750_connected,
        soil_sensor_valid=payload.diagnostics.soil_sensor_valid,
        uptime_seconds=payload.diagnostics.uptime_seconds or 0,
        quality_status=quality_status,
        quality_issues="; ".join(quality_issues) if quality_issues else None,
        is_simulated=bool(payload.is_simulated)
    )
    db.add(telemetry_record)

    # Update device heartbeat
    device.last_seen = now
    device.is_online = True
    db.commit()
    db.refresh(telemetry_record)

    # 4. Run AI water-stress screening logic
    screening_res = evaluate_water_stress(
        db=db,
        device=device,
        telemetry=telemetry_record,
        quality_status=quality_status,
        quality_issues=quality_issues
    )

    return ScreeningResponse(
        telemetry_id=telemetry_record.id,
        device_id=device_id,
        timestamp=telemetry_record.timestamp.isoformat(),
        screening_output=screening_res.screening_output,
        confidence_score=screening_res.confidence_score,
        expected_leaf_temp_c=screening_res.expected_leaf_temp_c,
        actual_leaf_temp_c=telemetry_record.leaf_temp_c,
        residual_c=screening_res.residual_c,
        adaptive_threshold_c=screening_res.residual_threshold_c,
        consecutive_elevated_count=screening_res.consecutive_elevated_count,
        soil_moisture_pct=telemetry_record.soil_moisture_pct,
        soil_status=screening_res.soil_status,
        soil_moisture_trend=screening_res.soil_moisture_trend,
        thermal_status=screening_res.thermal_status,
        evidence_sufficiency=screening_res.evidence_sufficiency,
        scientific_reason=screening_res.scientific_reason,
        is_simulated=telemetry_record.is_simulated
    )


@router.get("/{device_id}/latest")
def get_latest_telemetry(
    device_id: str,
    include_simulated: bool = Query(False),
    db: Session = Depends(get_db)
):
    """Fetches the most recent sensor reading and screening output for a specific plant."""
    device_id = device_id.upper()
    query = db.query(Telemetry).filter(Telemetry.device_id == device_id)
    if not include_simulated:
        query = query.filter(Telemetry.is_simulated == False)
    latest_telemetry = query.order_by(desc(Telemetry.id)).first()

    if not latest_telemetry:
        raise HTTPException(status_code=404, detail=f"No genuine telemetry readings recorded for {device_id}.")

    latest_screening = db.query(ScreeningResult).filter(
        ScreeningResult.device_id == device_id,
        ScreeningResult.telemetry_id == latest_telemetry.id
    ).first()

    return {
        "telemetry": latest_telemetry.to_dict(),
        "screening": latest_screening.to_dict() if latest_screening else None
    }


@router.get("/{device_id}/history")
def get_telemetry_history(
    device_id: str,
    limit: int = Query(100, ge=1, le=1000),
    include_simulated: bool = Query(False),
    db: Session = Depends(get_db)
):
    """Retrieves chronological history of readings and screening results for plotting."""
    device_id = device_id.upper()
    query = db.query(Telemetry).filter(Telemetry.device_id == device_id)
    if not include_simulated:
        query = query.filter(Telemetry.is_simulated == False)

    readings = query.order_by(desc(Telemetry.timestamp)).limit(limit).all()
    readings.reverse()  # Return in chronological order

    # Match with screening results
    results = []
    for r in readings:
        scr = db.query(ScreeningResult).filter(ScreeningResult.telemetry_id == r.id).first()
        results.append({
            "telemetry": r.to_dict(),
            "screening": scr.to_dict() if scr else None
        })

    return {"device_id": device_id, "count": len(results), "history": results}

