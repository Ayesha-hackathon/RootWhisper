"""Routers package init."""

from backend.app.routers.telemetry import router as telemetry_router
from backend.app.routers.devices import router as devices_router
from backend.app.routers.models import router as models_router
from backend.app.routers.auth import router as auth_router, get_current_user

__all__ = ["telemetry_router", "devices_router", "models_router", "auth_router", "get_current_user"]
