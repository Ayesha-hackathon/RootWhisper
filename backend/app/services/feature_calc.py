"""Agronomic feature calculation: Vapor Pressure Deficit (VPD) and Delta-T."""

import math


def calculate_vpd_kpa(ambient_temp_c: float, ambient_humidity_pct: float) -> float:
    """
    Computes atmospheric Vapor Pressure Deficit (VPD) in kilopascals (kPa).
    
    Uses Tetens equation for saturation vapor pressure:
    e_s(T) = 0.61078 * exp((17.27 * T) / (T + 237.3))
    e_a = e_s * (RH / 100)
    VPD = e_s - e_a
    """
    if ambient_temp_c < -50 or ambient_temp_c > 100:
        return 0.0
    
    # Saturation vapor pressure in kPa
    e_s = 0.61078 * math.exp((17.27 * ambient_temp_c) / (ambient_temp_c + 237.3))
    
    # Clamp RH to 0-100
    rh_clamped = max(0.0, min(100.0, ambient_humidity_pct))
    e_a = e_s * (rh_clamped / 100.0)
    
    vpd = max(0.0, e_s - e_a)
    return round(vpd, 3)


def calculate_delta_t_c(leaf_temp_c: float, ambient_temp_c: float) -> float:
    """
    Calculates Canopy-Air Temperature Difference (Delta-T = T_leaf - T_ambient).
    Negative values indicate transpirational cooling (leaf cooler than air).
    Positive values indicate elevated leaf temperature.
    """
    return round(leaf_temp_c - ambient_temp_c, 2)

