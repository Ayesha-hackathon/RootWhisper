"""Database connection and session factory supporting SQLite (local) and Neon PostgreSQL (cloud)."""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.config import DATABASE_URL

# Normalize postgres:// to postgresql+psycopg2:// for modern SQLAlchemy compatibility
normalized_db_url = DATABASE_URL
if normalized_db_url.startswith("postgres://"):
    normalized_db_url = normalized_db_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif normalized_db_url.startswith("postgresql://") and not normalized_db_url.startswith("postgresql+"):
    normalized_db_url = normalized_db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

# Configure engine arguments based on database backend
engine_kwargs = {}
if normalized_db_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # Production PostgreSQL / Neon connection resilience settings
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

engine = create_engine(normalized_db_url, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency for database session lifecycle."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


