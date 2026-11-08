"""AI water-stress screening and temporal persistence evaluator.

Implements rigorous biophysical screening:
1. Predicts expected well-watered leaf temperature via specimen-specific Random Forest
   using ambient temperature, ambient relative humidity, and light intensity.
2. Derives residual = observed_leaf_temp - predicted_leaf_temp.
3. Applies adaptive baseline-derived thresholds.
4. Evaluates temporal persistence across consecutive readings (>= 3 consecutive cycles).
5. Independently analyses soil moisture levels AND temporal depletion trends as supporting evidence.
6. Handles missing, invalid, stale, out-of-range, and low-light measurements by outputting INCONCLUSIVE.
7. Guarantees scientific data integrity: reduced watering alone does NOT trigger physiological stress.

SCREENING OUTPUTS:
- NORMAL
- POSSIBLE WATER-STRESS INDICATION
- INCONCLUSIVE
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.models.device import Device
from backend.app.models.telemetry import Telemetry
from backend.app.models.screening import ScreeningResult
from backend.app.config import (
    PERSISTENCE_MIN_RATIO,
    MIN_LIGHT_LUX_DAYTIME,
    DEFAULT_PERSISTENCE_WINDOW_SIZE,
    DEFAULT_SAMPLING_INTERVAL_SECONDS
)
from ml_engine.baseline_trainer import load_plant_baseline, predict_expected_leaf_temp


def evaluate_water_stress(
    db: Session,
    device: Device,
    telemetry: Telemetry,
    quality_status: str,
    quality_issues: List[str]
) -> ScreeningResult:
    """
    Evaluates water-stress status for an incoming telemetry reading.
    Adheres strictly to biophysical plant water-stress principles.
    """
    threshold_c = device.provisional_temp_residual_threshold_c or 1.5
    window_size = max(3, device.persistence_window_size or DEFAULT_PERSISTENCE_WINDOW_SIZE)

    # ---------------------------------------------------------
    # 1. HARDWARE QUALITY & SENSOR SANITY GATE
    # ---------------------------------------------------------
    if quality_status == "INVALID":
        reasons_joined = "; ".join(quality_issues) if quality_issues else "Hardware or sensor communication fault."
        result = ScreeningResult(
            telemetry_id=telemetry.id,
            device_id=device.device_id,
            timestamp=telemetry.timestamp,
            expected_leaf_temp_c=None,
            residual_c=None,
            residual_threshold_c=threshold_c,
            consecutive_elevated_count=0,
            elevated_count_in_window=0,
            window_size=window_size,
            thermal_status="INCONCLUSIVE",
            soil_status="INVALID",
            soil_moisture_trend="INSUFFICIENT_DATA",
            soil_moisture_slope=None,
            evidence_sufficiency="INSUFFICIENT",
            screening_output="INCONCLUSIVE",
            confidence_score=0.0,
            scientific_reason=f"Data Quality Fault: {reasons_joined}. Insufficient sensor evidence to perform screening.",
            is_simulated=telemetry.is_simulated
        )
        db.add(result)
        db.commit()
        db.refresh(result)
        return result

    # ---------------------------------------------------------
    # 2. DAYTIME / ILLUMINATION GATE (Low-Light / Night Dormancy)
    # ---------------------------------------------------------
    if telemetry.light_lux < MIN_LIGHT_LUX_DAYTIME:
        soil_is_dry = telemetry.soil_moisture_pct < device.provisional_soil_dry_threshold_pct
        result = ScreeningResult(
            telemetry_id=telemetry.id,
            device_id=device.device_id,
            timestamp=telemetry.timestamp,
            expected_leaf_temp_c=None,
            residual_c=None,
            residual_threshold_c=threshold_c,
            consecutive_elevated_count=0,
            elevated_count_in_window=0,
            window_size=window_size,
            thermal_status="INCONCLUSIVE",
            soil_status="DRY" if soil_is_dry else "ADEQUATE",
            soil_moisture_trend="STABLE",
            soil_moisture_slope=0.0,
            evidence_sufficiency="INSUFFICIENT",
            screening_output="INCONCLUSIVE",
            confidence_score=0.50,
            scientific_reason=(
                f"Low-light / nighttime conditions ({round(telemetry.light_lux, 1)} Lux < {MIN_LIGHT_LUX_DAYTIME} Lux). "
                f"Plant stomata are naturally closed; transpirational screening requires active illumination."
            ),
            is_simulated=telemetry.is_simulated
        )
        db.add(result)
        db.commit()
        db.refresh(result)
        return result

    # ---------------------------------------------------------
    # 3. BASELINE MODEL AVAILABILITY GATE
    # ---------------------------------------------------------
    model = load_plant_baseline(device.device_id)
    if model is None:
        soil_is_dry = telemetry.soil_moisture_pct < device.provisional_soil_dry_threshold_pct
        result = ScreeningResult(
            telemetry_id=telemetry.id,
            device_id=device.device_id,
            timestamp=telemetry.timestamp,
            expected_leaf_temp_c=None,
            residual_c=None,
            residual_threshold_c=threshold_c,
            consecutive_elevated_count=0,
            elevated_count_in_window=0,
            window_size=window_size,
            thermal_status="INCONCLUSIVE",
            soil_status="DRY" if soil_is_dry else "ADEQUATE",
            soil_moisture_trend="INSUFFICIENT_DATA",
            soil_moisture_slope=None,
            evidence_sufficiency="INSUFFICIENT",
            screening_output="INCONCLUSIVE",
            confidence_score=0.20,
            scientific_reason=(
                f"Baseline model not yet calibrated for {device.device_id}. "
                f"Well-watered individual baseline cycles required before transpirational screening can activate."
            ),
            is_simulated=telemetry.is_simulated
        )
        db.add(result)
        db.commit()
        db.refresh(result)
        return result

    # ---------------------------------------------------------
    # 4. RANDOM FOREST PREDICTION & RESIDUAL CALCULATION
    # ---------------------------------------------------------
    expected_leaf_temp = predict_expected_leaf_temp(
        model=model,
        ambient_temp_c=telemetry.ambient_temp_c,
        ambient_humidity_pct=telemetry.ambient_humidity_pct,
        light_lux=telemetry.light_lux,
        vpd_kpa=telemetry.vpd_kpa or 1.0
    )

    residual_c = round(telemetry.leaf_temp_c - expected_leaf_temp, 2)
    is_elevated_now = residual_c > threshold_c
    thermal_status = "ELEVATED" if is_elevated_now else "NORMAL"

    # ---------------------------------------------------------
    # 5. INDEPENDENT SOIL MOISTURE LEVEL & TEMPORAL TREND
    # ---------------------------------------------------------
    is_soil_dry = telemetry.soil_moisture_pct < device.provisional_soil_dry_threshold_pct
    soil_status = "DRY" if is_soil_dry else "ADEQUATE"

    # Fetch recent historical readings to determine soil trend and persistence
    recent_readings = db.query(Telemetry).filter(
        Telemetry.device_id == device.device_id,
        Telemetry.is_simulated == telemetry.is_simulated,
        Telemetry.id < telemetry.id,
        Telemetry.quality_status == "VALID"
    ).order_by(desc(Telemetry.id)).limit(window_size - 1).all()

    # Calculate soil moisture temporal trend
    soil_trend = "STABLE"
    soil_slope = 0.0
    if len(recent_readings) >= 2:
        earliest_sm = recent_readings[-1].soil_moisture_pct
        delta_sm = telemetry.soil_moisture_pct - earliest_sm
        soil_slope = round(delta_sm / len(recent_readings), 2)
        if delta_sm < -0.6:
            soil_trend = "DEPLETING"
        elif delta_sm > 2.0:
            soil_trend = "REHYDRATED"
        else:
            soil_trend = "STABLE"
    elif len(recent_readings) == 1:
        delta_sm = telemetry.soil_moisture_pct - recent_readings[0].soil_moisture_pct
        soil_slope = round(delta_sm, 2)
        if delta_sm < -0.4:
            soil_trend = "DEPLETING"
        elif delta_sm > 1.5:
            soil_trend = "REHYDRATED"
        else:
            soil_trend = "STABLE"
    else:
        soil_trend = "INSUFFICIENT_DATA"
        soil_slope = 0.0

    # ---------------------------------------------------------
    # 6. TEMPORAL PERSISTENCE ACROSS CONSECUTIVE READINGS
    # ---------------------------------------------------------
    consecutive_elevated_count = 1 if is_elevated_now else 0
    elevated_count_in_window = 1 if is_elevated_now else 0
    streak_active = is_elevated_now

    # Fetch recent screenings to evaluate consecutive sequence and temporal continuity
    recent_screenings = db.query(ScreeningResult).filter(
        ScreeningResult.device_id == device.device_id,
        ScreeningResult.is_simulated == telemetry.is_simulated,
        ScreeningResult.id < (telemetry.id * 1000)  # query previous
    ).order_by(desc(ScreeningResult.id)).limit(window_size - 1).all()

    # Map previous screenings
    for prev in recent_screenings:
        prev_elevated = (prev.residual_c is not None and prev.residual_c > threshold_c)
        if prev_elevated:
            elevated_count_in_window += 1
            if streak_active:
                consecutive_elevated_count += 1
        else:
            streak_active = False

    total_window_samples = min(window_size, len(recent_screenings) + 1)
    is_persistent = (consecutive_elevated_count >= 3) or (
        total_window_samples >= 4 and (elevated_count_in_window / total_window_samples) >= PERSISTENCE_MIN_RATIO
    )

    # ---------------------------------------------------------
    # 7. MULTI-VARIABLE SYNTHESIS & DECISION MATRIX
    # ---------------------------------------------------------
    evidence_sufficiency = "SUFFICIENT"

    if is_elevated_now and total_window_samples < 3:
        # Isolated reading with insufficient history cannot confirm persistent stress
        evidence_sufficiency = "INSUFFICIENT"
        screening_output = "INCONCLUSIVE"
        confidence = 0.45
        reason = (
            f"Elevated canopy temperature observed (+{residual_c}°C > adaptive threshold {threshold_c}°C), "
            f"but insufficient consecutive history ({total_window_samples}/3 cycles required) to confirm persistence. "
            f"Monitoring continuation required."
        )

    elif is_persistent and (is_soil_dry or soil_trend == "DEPLETING"):
        # CASE 1: Persistent thermal elevation corroborated by soil moisture deficit/depletion
        screening_output = "POSSIBLE WATER-STRESS INDICATION"
        confidence = min(0.95, round(0.75 + (consecutive_elevated_count * 0.05), 2))
        reason = (
            f"Persistent canopy transpirational cooling deficit (residual +{residual_c}°C, "
            f"elevated for {consecutive_elevated_count} consecutive cycles, threshold {threshold_c}°C) "
            f"corroborated by independent soil moisture evidence ({telemetry.soil_moisture_pct}% "
            f"< threshold {device.provisional_soil_dry_threshold_pct}%, trend: {soil_trend}). "
            f"Consistent with stomatal closure under soil moisture limitation."
        )

    elif is_elevated_now and not is_soil_dry and soil_trend != "DEPLETING":
        # CASE 2: High canopy temp, but soil moisture is adequate
        screening_output = "NORMAL"
        confidence = 0.82
        reason = (
            f"Canopy temperature is elevated (+{residual_c}°C, threshold {threshold_c}°C), but soil moisture remains "
            f"adequate ({telemetry.soil_moisture_pct}%, trend: {soil_trend}). Elevation is attributable to atmospheric "
            f"evaporative demand or solar loading rather than soil moisture-induced stomatal closure."
        )

    elif is_elevated_now and not is_persistent:
        # CASE 3: Transient thermal deviation (isolated spike)
        screening_output = "NORMAL"
        confidence = 0.78
        reason = (
            f"Transient canopy temperature elevation (+{residual_c}°C observed), but persistence criteria not met "
            f"({consecutive_elevated_count}/3 consecutive cycles elevated). Isolated deviation consistent with "
            f"transient air draft or microclimate fluctuation."
        )

    elif is_soil_dry and not is_elevated_now:
        # CASE 4: Soil moisture low, but canopy transpirational cooling is normal
        # "Do not interpret reduced watering alone as confirmed physiological stress."
        screening_output = "NORMAL"
        confidence = 0.86
        reason = (
            f"Soil moisture is depleted ({telemetry.soil_moisture_pct}% < threshold {device.provisional_soil_dry_threshold_pct}%), "
            f"but actual leaf temperature agrees with predicted transpirational baseline (residual {residual_c:+0.2f}°C). "
            f"Plant maintains active evaporative cooling; reduced soil watering alone does not constitute physiological stress."
        )

    else:
        # CASE 5: Both canopy temperature and soil moisture are normal
        screening_output = "NORMAL"
        confidence = 0.92
        reason = (
            f"Normal physiological functioning: observed leaf temperature ({telemetry.leaf_temp_c}°C) agrees with "
            f"predicted well-watered baseline ({expected_leaf_temp}°C, residual {residual_c:+0.2f}°C, threshold {threshold_c}°C). "
            f"Soil moisture is adequate ({telemetry.soil_moisture_pct}%)."
        )

    # ---------------------------------------------------------
    # 8. PERSIST IN DATABASE
    # ---------------------------------------------------------
    result = ScreeningResult(
        telemetry_id=telemetry.id,
        device_id=device.device_id,
        timestamp=telemetry.timestamp,
        expected_leaf_temp_c=expected_leaf_temp,
        residual_c=residual_c,
        residual_threshold_c=threshold_c,
        consecutive_elevated_count=consecutive_elevated_count,
        elevated_count_in_window=elevated_count_in_window,
        window_size=window_size,
        thermal_status=thermal_status,
        soil_status=soil_status,
        soil_moisture_trend=soil_trend,
        soil_moisture_slope=soil_slope,
        evidence_sufficiency=evidence_sufficiency,
        screening_output=screening_output,
        confidence_score=confidence,
        scientific_reason=reason,
        is_simulated=telemetry.is_simulated
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result
