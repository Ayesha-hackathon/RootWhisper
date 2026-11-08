"""Baseline Random Forest model trainer for individual plant specimens.

Trains an expected leaf temperature regression model for each plant:
Input features: ambient_temp_c, ambient_humidity_pct, light_lux
Target: leaf_temp_c (measured during well-watered baseline conditions)

NOTE: Soil moisture is intentionally EXCLUDED from prediction features so that
soil moisture decline is not learned away by the model. Soil moisture is evaluated
independently in the screening logic.

SCIENTIFIC INTEGRITY:
- Chronological time-aware validation to prevent data leakage from autocorrelated time-series.
- Never shuffle adjacent time-series readings.
- Derives adaptive residual thresholds from baseline empirical observation variance.
- Explicitly documents individual specimen N=1 demonstration limitation.
"""

from pathlib import Path
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

from backend.app.config import BASE_DIR

MODELS_DIR = BASE_DIR / "ml_engine" / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Core Feature set for predicting expected leaf temperature
CORE_FEATURES = ["ambient_temp_c", "ambient_humidity_pct", "light_lux"]
FEATURE_COLUMNS = CORE_FEATURES
TARGET_COLUMN = "leaf_temp_c"


def train_plant_baseline(
    device_id: str,
    records: List[Dict[str, Any]],
    n_estimators: int = 100,
    random_state: int = 42,
    use_vpd: bool = False
) -> Dict[str, Any]:
    """
    Trains a specimen-specific Random Forest baseline model using chronological validation.
    
    Args:
        device_id: Target plant ID ('TULSI_01', 'HIBISCUS_01', 'MONEYPLANT_01')
        records: List of sensor telemetry dictionaries collected under well-watered conditions
        n_estimators: Number of trees in the forest
        random_state: Seed for tree bootstrap reproducibility
        use_vpd: Whether to append vpd_kpa as 4th feature (defaults to False for 3 core features)
        
    Returns:
        Dictionary with training metrics, chronological validation results, and derived adaptive thresholds.
    """
    df = pd.DataFrame(records)
    
    # Check minimum required samples
    if len(df) < 10:
        raise ValueError(
            f"Insufficient training samples for {device_id}. Need at least 10 baseline samples, got {len(df)}."
        )

    # Determine feature list
    feature_cols = list(CORE_FEATURES)
    if use_vpd and "vpd_kpa" in df.columns:
        feature_cols.append("vpd_kpa")

    # Validate required columns
    missing_cols = [col for col in feature_cols + [TARGET_COLUMN] if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing columns in training records for {device_id}: {missing_cols}")

    # Ensure chronological order by timestamp if available
    if "timestamp" in df.columns:
        df["timestamp_dt"] = pd.to_datetime(df["timestamp"])
        df = df.sort_values("timestamp_dt").reset_index(drop=True)

    X = df[feature_cols].values
    y = df[TARGET_COLUMN].values
    n_total = len(df)

    # 1. Chronological / Time-Aware Validation (Strictly avoids temporal data leakage)
    test_ratio = 0.20 if n_total >= 25 else 0.15
    split_idx = int(np.floor(n_total * (1.0 - test_ratio)))
    split_idx = max(split_idx, 10)  # Ensure at least 10 training samples

    X_train, y_train = X[:split_idx], y[:split_idx]
    X_test, y_test = X[split_idx:], y[split_idx:]

    n_train = len(X_train)
    n_test = len(X_test)

    # 2. Train Random Forest Model on Chronological Training Window
    model = RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=8,
        min_samples_split=3,
        random_state=random_state
    )
    model.fit(X_train, y_train)

    # 3. Evaluate Out-of-Sample Performance on Chronological Test Window
    if n_test > 1:
        y_pred = model.predict(X_test)
        r2 = float(r2_score(y_test, y_pred))
        mae = float(mean_absolute_error(y_test, y_pred))
        test_residuals = y_test - y_pred
    else:
        # Fallback if holdout is too small
        y_pred = model.predict(X_train)
        r2 = float(r2_score(y_train, y_pred))
        mae = float(mean_absolute_error(y_train, y_pred))
        test_residuals = y_train - y_pred

    # 4. Derive Adaptive Thresholds from Actual Baseline Residual Distribution
    # Standard deviation of residuals under baseline conditions:
    res_mean = float(np.mean(test_residuals))
    res_std = float(np.std(test_residuals))
    
    # Adaptive threshold: mean + 2.0 * sigma (representing 95% upper one-sided prediction bound)
    # Enforce minimum threshold floor of 1.0°C to guard against sensor precision noise (MLX90614 ±0.5°C)
    adaptive_threshold_c = max(1.0, round(res_mean + (2.0 * max(0.2, res_std)), 2))

    # Retrain on full baseline dataset for production deployment
    final_model = RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=8,
        min_samples_split=3,
        random_state=random_state
    )
    final_model.fit(X, y)

    # 5. Save model artifact
    model_path = MODELS_DIR / f"{device_id}.joblib"
    joblib.dump(final_model, model_path)

    # Feature importances
    importances = dict(zip(feature_cols, [round(float(x), 4) for x in final_model.feature_importances_]))

    return {
        "device_id": device_id,
        "n_samples": n_total,
        "n_train": n_train,
        "n_test": n_test,
        "r2_score": round(r2, 4),
        "mae_score": round(mae, 4),
        "adaptive_threshold_c": adaptive_threshold_c,
        "residual_std_c": round(res_std, 4),
        "residual_mean_c": round(res_mean, 4),
        "model_path": str(model_path),
        "feature_importances": importances,
        "features_used": feature_cols,
        "validation_approach": "Chronological Sequential Holdout (Time-Aware Split, no data leakage)",
        "scientific_limitations": (
            "Individual specimen baseline (N=1). Captures idiosyncratic microclimate thermal response "
            "of this single physical specimen. Does not establish general species-level physiological behavior."
        )
    }


def load_plant_baseline(device_id: str) -> Optional[RandomForestRegressor]:
    """Loads the trained Random Forest model for the requested plant if available."""
    model_path = MODELS_DIR / f"{device_id}.joblib"
    if model_path.exists():
        try:
            return joblib.load(model_path)
        except Exception:
            return None
    return None


def predict_expected_leaf_temp(
    model: RandomForestRegressor,
    ambient_temp_c: float,
    ambient_humidity_pct: float,
    light_lux: float,
    vpd_kpa: Optional[float] = None
) -> float:
    """
    Predicts expected well-watered leaf temperature given ambient microclimate.
    Handles models trained with 3 core features or 4 features (with VPD).
    """
    n_features = getattr(model, "n_features_in_", 3)
    if n_features == 4:
        v = vpd_kpa if vpd_kpa is not None else 1.0
        X = np.array([[ambient_temp_c, ambient_humidity_pct, light_lux, v]])
    else:
        X = np.array([[ambient_temp_c, ambient_humidity_pct, light_lux]])
        
    pred = model.predict(X)[0]
    return round(float(pred), 2)
