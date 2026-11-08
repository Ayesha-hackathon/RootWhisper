"""RootWhisper FastAPI Backend Application."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database import engine, Base, SessionLocal
from backend.app.config import ACTIVE_DEVICES
from backend.app.models.device import Device
from backend.app.models.user import User, PasswordResetToken
from backend.app.routers import telemetry_router, devices_router, models_router, auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite tables on startup (creates users and password_reset_tokens safely)
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed the 3 monitored plant nodes if not already present
    db = SessionLocal()
    try:
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
    finally:
        db.close()
        
    yield


app = FastAPI(
    title="RootWhisper Plant Water-Stress Screening API",
    description="IoT and AI platform for plant canopy thermal screening and water-stress detection.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware configured for React frontend with credentials support
cors_origins_env = os.environ.get("CORS_ORIGINS", "")
custom_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]

default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://10.114.140.231:3000",
    "http://10.114.140.231:8000",
    "http://10.114.140.231",
    "https://ayesha-hackathon.github.io",
    "https://rootwhisper.onrender.com",
    "https://rootwhisper-web.onrender.com",
    "https://rootwhisper-api.onrender.com",
]

all_origins = [o for o in set(default_origins + custom_origins) if o and o != "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=all_origins,
    allow_origin_regex=r"https://.*\.github\.io|https://.*\.onrender\.com|http://localhost:.*|http://127\.0\.0\.1:.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(telemetry_router)
app.include_router(devices_router)
app.include_router(models_router)


@app.get("/")
def root_info():
    return {
        "system": "RootWhisper Plant Water-Stress Screening Platform",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "active_nodes": list(ACTIVE_DEVICES.keys()),
        "docs_url": "/docs",
        "auth_enabled": True,
        "notice": "All 3 plant baselines operate as individual specimen models (N=1). Provisional thresholds require empirical calibration."
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
