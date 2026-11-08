"""RootWhisper System Configuration.

Central settings for plant identification, provisional thresholds, sampling rates,
soil probe calibrations, and database paths.
"""

from pathlib import Path
from typing import Dict, Any, List, Tuple
import os

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent.parent
BACKEND_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.environ.get("DATA_DIR", str(BASE_DIR / "data")))
DATA_DIR.mkdir(parents=True, exist_ok=True)
DATABASE_PATH = Path(os.environ.get("DATABASE_PATH", str(DATA_DIR / "rootwhisper.db")))
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DATABASE_PATH.as_posix()}")

# Load environment variables from backend/.env or root .env
def load_dotenv_file(filepath: Path) -> None:
    if not filepath.exists():
        return
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip("'\"")
                # Populate if not already explicitly set in environment
                if k and k not in os.environ:
                    os.environ[k] = v
    except Exception as e:
        print(f"[Config] Warning: Failed to parse {filepath}: {e}")

load_dotenv_file(BACKEND_DIR / ".env")
load_dotenv_file(BASE_DIR / ".env")

# SMTP & Frontend Configuration
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.environ.get("SMTP_FROM_EMAIL", os.environ.get("SMTP_FROM", SMTP_USER))
FRONTEND_BASE_URL = os.environ.get("FRONTEND_BASE_URL", os.environ.get("ROOTWHISPER_APP_URL", "http://localhost:3000")).rstrip("/")

def validate_smtp_config() -> Tuple[bool, List[str]]:
    """Checks whether all required SMTP variables are present. Never logs passwords."""
    missing = []
    if not os.environ.get("SMTP_HOST"):
        missing.append("SMTP_HOST")
    if not os.environ.get("SMTP_PORT"):
        missing.append("SMTP_PORT")
    if not os.environ.get("SMTP_USER"):
        missing.append("SMTP_USER")
    if not os.environ.get("SMTP_PASSWORD"):
        missing.append("SMTP_PASSWORD")
    return len(missing) == 0, missing

# Monitored Plants Registry (Exactly 3 Independent Hardware Nodes)
ACTIVE_DEVICES: Dict[str, Dict[str, Any]] = {
    "TULSI_01": {
        "plant_name": "Tulsi (Holy Basil)",
        "species": "Ocimum tenuiflorum",
        "node_id": "TULSI_01",
        "description": "Individual specimen baseline. Note: N=1 does not establish species-level behavior.",
        "default_soil_dry_adc": 3200,   # Sensor reading in air (completely dry)
        "default_soil_wet_adc": 1400,   # Sensor reading in water (100% saturated)
        "provisional_soil_dry_threshold_pct": 35.0,  # Provisional water-stress soil cutoff
        "provisional_temp_residual_threshold_c": 1.5, # Provisional canopy elevation cutoff
    },
    "HIBISCUS_01": {
        "plant_name": "Hibiscus",
        "species": "Hibiscus rosa-sinensis",
        "node_id": "HIBISCUS_01",
        "description": "Individual specimen baseline. Note: N=1 does not establish species-level behavior.",
        "default_soil_dry_adc": 3150,
        "default_soil_wet_adc": 1380,
        "provisional_soil_dry_threshold_pct": 40.0,
        "provisional_temp_residual_threshold_c": 1.5,
    },
    "MONEYPLANT_01": {
        "plant_name": "Money Plant (Devil's Ivy)",
        "species": "Epipremnum aureum",
        "node_id": "MONEYPLANT_01",
        "description": "Individual specimen baseline. Note: N=1 does not establish species-level behavior.",
        "default_soil_dry_adc": 3250,
        "default_soil_wet_adc": 1420,
        "provisional_soil_dry_threshold_pct": 30.0,
        "provisional_temp_residual_threshold_c": 1.5,
    }
}

# Sampling and Temporal Persistence Parameters
DEFAULT_SAMPLING_INTERVAL_SECONDS = 300  # 5 minutes
DEFAULT_PERSISTENCE_WINDOW_SIZE = 5      # 5 readings (~25 minutes at 5-min interval)
PERSISTENCE_MIN_RATIO = 0.8              # 80% of window must violate threshold to trigger alert

# Heartbeat & Quality Sanity Thresholds
DEVICE_OFFLINE_TIMEOUT_SECONDS = 900     # 15 minutes without ping = offline
MIN_LIGHT_LUX_DAYTIME = 50.0             # Lux below this considered nighttime / low-light dormancy
TEMP_VALID_RANGE_C = (-10.0, 65.0)       # Physical sanity range for temperature
HUMIDITY_VALID_RANGE_PCT = (0.0, 100.0)  # Relative humidity range
SOIL_ADC_VALID_RANGE = (500, 4095)       # ESP32 12-bit ADC physical bounds

