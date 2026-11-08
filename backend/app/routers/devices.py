"""Device management and configuration router."""

from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.config import ACTIVE_DEVICES, DEVICE_OFFLINE_TIMEOUT_SECONDS
from backend.app.models.device import Device
from backend.app.schemas.telemetry import DeviceConfigUpdate

router = APIRouter(prefix="/api/v1/devices", tags=["devices"])


@router.get("", response_model=List[Dict[str, Any]])
def list_devices(db: Session = Depends(get_db)):
    """
    Returns all registered plant devices with connection status,
    probe calibration parameters, and provisional thresholds.
    """
    now = datetime.now(timezone.utc)
    
    # Ensure active devices exist in DB
    for dev_id, meta in ACTIVE_DEVICES.items():
        existing = db.query(Device).filter(Device.device_id == dev_id).first()
        if not existing:
            dev = Device(
                device_id=dev_id,
                plant_name=meta["plant_name"],
                species=meta["species"],
                description=meta["description"],
                soil_dry_adc=meta["default_soil_dry_adc"],
                soil_wet_adc=meta["default_soil_wet_adc"],
                provisional_soil_dry_threshold_pct=meta["provisional_soil_dry_threshold_pct"],
                provisional_temp_residual_threshold_c=meta["provisional_temp_residual_threshold_c"],
            )
            db.add(dev)
    db.commit()

    devices = db.query(Device).all()
    out = []
    for d in devices:
        # Check connection status based on heartbeat
        if d.last_seen:
            # Handle timezone awareness safely
            last_seen_dt = d.last_seen
            if last_seen_dt.tzinfo is None:
                last_seen_dt = last_seen_dt.replace(tzinfo=timezone.utc)
            delta_sec = (now - last_seen_dt).total_seconds()
            d.is_online = (delta_sec <= DEVICE_OFFLINE_TIMEOUT_SECONDS)
        else:
            d.is_online = False
        
        info = d.to_dict()
        out.append(info)
    
    db.commit()
    return out


@router.put("/{device_id}/config")
def update_device_config(device_id: str, config: DeviceConfigUpdate, db: Session = Depends(get_db)):
    """Updates provisional thresholds or soil probe calibration values for a plant."""
    device_id = device_id.upper()
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail=f"Device {device_id} not found.")

    if config.soil_dry_adc is not None:
        device.soil_dry_adc = config.soil_dry_adc
    if config.soil_wet_adc is not None:
        device.soil_wet_adc = config.soil_wet_adc
    if config.provisional_soil_dry_threshold_pct is not None:
        device.provisional_soil_dry_threshold_pct = config.provisional_soil_dry_threshold_pct
    if config.provisional_temp_residual_threshold_c is not None:
        device.provisional_temp_residual_threshold_c = config.provisional_temp_residual_threshold_c
    if config.persistence_window_size is not None:
        device.persistence_window_size = config.persistence_window_size

    db.commit()
    db.refresh(device)
    return {"message": f"Configuration updated for {device_id}", "device": device.to_dict()}

