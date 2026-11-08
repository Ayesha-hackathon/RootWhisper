# ============================================================================
# RootWhisper Production Container
# Python 3.12 + FastAPI + Scikit-Learn + SQLite + Argon2id
# ============================================================================

FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

# Install essential system build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy application backend, ML models, and configuration
COPY backend /app/backend
COPY ml_engine /app/ml_engine
COPY data /app/data

# Ensure data directory exists for persistent SQLite database
RUN mkdir -p /app/data

# Expose standard application port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start Uvicorn production server
CMD ["sh", "-c", "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
