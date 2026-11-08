# RootWhisper — Botanical Intelligence & Water-Stress Screening Frontend

> **Species-Aware AI Framework for Early Plant Water-Stress Screening Through Adaptive Physiological Fingerprinting.**

RootWhisper is a production-grade, responsive React web application developed for phytotron microclimate monitoring, real-time radiometric thermometry, and non-destructive plant water-stress screening.

Designed specifically to interface with an existing **Google Antigravity** backend, physiological machine-learning engine, and an **ESP32 Wi-Fi / MQTT** edge sensor mesh.

---

## 🌿 Core Botanical Principles

1. **"Your plants are whispering" (Thermal Decoupling)**:
   - When plants experience root-zone moisture tension, stomata constrict to prevent dehydration. Evaporative cooling drops immediately, causing leaf temperature to climb **+1.5°C to +3.5°C** above ambient air **up to 4+ hours before visible wilting**.
   - Contactless radiometric infrared thermometry (MLX90614) captures this thermal signature non-destructively.

2. **Species-Aware Adaptive Fingerprinting**:
   - Rather than using static generic thresholds, RootWhisper models an individual-plant baseline over 14–18 days of calibrated environmental exposure.
   - Distinct physiological baselines are maintained for:
     - **Tulsi (*Ocimum tenuiflorum*)** — Node `TULSI_01`
     - **Hibiscus (*Hibiscus rosa-sinensis*)** — Node `HIBISCUS_01`
     - **Money Plant (*Epipremnum aureum*)** — Node `MONEYPLANT_01`

3. **Strict Scientific Input Decoupling**:
   - Expected leaf temperature ($T_{\text{expected}}$) is predicted using a Random Forest regression model driven strictly by environmental microclimate features: **ambient temperature**, **relative humidity**, and **PAR light intensity**.
   - **Soil moisture is intentionally excluded from the temperature prediction model** to prevent circular bias. Substrate moisture serves as **independent corroborating evidence** during multi-sensor evidence fusion.

4. **Responsible Screening Outcomes**:
   - `NORMAL`: Leaf temperature aligns with energy-balance expectations; evaporative cooling active.
   - `WATCH`: Transient thermal elevation observed, but persistence window (< 15 min) not yet met.
   - `POSSIBLE WATER STRESS`: Sustained residual ($> +1.8^\circ\text{C}$ for $> 15\text{ min}$) corroborated by declining soil moisture.
   - `INCONCLUSIVE`: Telemetry packets missing, stale ($> 40\text{ min}$), or hardware ADC out of bounds.

---

## 📁 Repository Directory Structure

```text
rootwhisper-frontend/
├── public/                     # Static public assets
├── src/
│   ├── assets/                 # High-resolution botanical plate plates & researcher avatars
│   │   └── images/             # Herbarium illustrations (Tulsi, Hibiscus, Money Plant)
│   ├── config/                 # Application configuration & environment bindings
│   │   └── appConfig.ts        # Base URL, refresh intervals, threshold benchmarks
│   ├── components/             # Domain UI components
│   │   ├── dashboard/          # KPI strips, plant cards, trend charts, activity logs
│   │   ├── plant-monitoring/   # 5-card sensor grid, historical charts, baseline panels
│   │   ├── analytics/          # Cross-species matrix, temporal charts, correlation curves
│   │   ├── screening/          # 9-stage pipeline, outcome badges, model architecture
│   │   ├── diagnostics/        # ESP32 node status, 15-channel matrix, error histories
│   │   ├── reports/            # Print-friendly research report templates & tables
│   │   ├── settings/           # 6 configuration areas & Antigravity connection panels
│   │   └── layout/             # Responsive Sidebar and TopNav
│   ├── data/                   # Separate, isolated sample telemetry datasets
│   │   ├── sampleData.ts       # Calibrated diurnal time-series & species profiles
│   │   ├── diagnosticsData.ts  # Node hardware specs & diagnostic registers
│   │   └── reportsData.ts      # Research report summaries & CSV generator
│   ├── hooks/                  # Reusable React hooks
│   │   ├── useToast.ts         # User feedback notification hook
│   │   └── useTelemetryStream.ts # Real-time telemetry pulse & streaming hook
│   ├── layouts/                # Reusable application layouts
│   │   └── AppLayout.tsx       # Unified layout wrapper (Sidebar, TopNav, Toasts, Footer)
│   ├── pages/                  # Top-level view modules (1-to-1 page routing)
│   │   ├── DashboardPage.tsx
│   │   ├── PlantMonitoringPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── AiScreeningPage.tsx
│   │   ├── SensorDiagnosticsPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/               # Antigravity backend API service layer
│   │   ├── apiClient.ts        # Typed fetch client with timeouts & error normalization
│   │   ├── endpoints.ts        # Antigravity REST / SSE route dictionary
│   │   └── antigravityApi.ts   # Integration contract with sample data fallback
│   ├── types/                  # TypeScript interface declarations
│   │   └── index.ts            # Biophysical telemetry models, ESP32 nodes, sensors
│   ├── App.tsx                 # Root component orchestrating page routing & state
│   ├── index.css               # Global Tailwind CSS styling & print optimizations
│   └── main.tsx                # React DOM root entry point
├── .env.example                # Environment variables template (NO SECRETS)
├── .gitignore                  # Git ignore rules for node_modules, dist, and local envs
├── index.html                  # HTML entry point with Plus Jakarta Sans & JetBrains Mono
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration with path aliases
└── vite.config.ts              # Vite 8 build & dev server configuration
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript (Strict Type Safety)
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Visual Palette**: Premium Botanical Intelligence (`#173F32` Forest Green, `#245640` Emerald, `#A8BDA8` Sage, `#F8F8F4` Warm Ivory, `#26342D` Charcoal)
- **Data Visualizations**: Recharts
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans (Display/Prose) & JetBrains Mono (Telemetry/Tabular figures)

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **Package Manager**: `npm` (v9+) or `pnpm` / `yarn`

### 2. Installation Instructions

Clone the repository and install dependencies:

```bash
# Clone repository
git clone https://github.com/your-username/rootwhisper-frontend.git
cd rootwhisper-frontend

# Install dependencies
npm install
```

### 3. Environment Configuration

Copy the sample environment file to `.env`:

```bash
cp .env.example .env
```

Review the `.env` settings:

```dotenv
# Antigravity Backend REST / WebSocket Base URL
VITE_ANTIGRAVITY_API_URL="https://antigravity.rootwhisper.internal:8443/api/v1"

# Telemetry Source Mode
# Set to 'false' to connect directly to the Antigravity backend API
# Set to 'true' to use the calibrated local sample telemetry repository
VITE_USE_SAMPLE_DATA="true"

# ESP32 Wi-Fi Mesh Gateway Identifier
VITE_ESP32_MESH_ID="ESP32_MESH_CHAMBER_A4"

# Antigravity Biophysical AI Model Version
VITE_AI_MODEL_VERSION="Antigravity-PhysioFingerprint-v2.4"

# Sensor Acquisition Interval (default: 5 minutes / 300,000 ms)
VITE_SAMPLING_INTERVAL_MS="300000"

# Live UI Pulse Simulator Cadence (default: 8,000 ms)
VITE_UI_REFRESH_MS="8000"
```

### 4. Development Run Instructions

Start the Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### 5. Production Build Instructions

Compile the production bundle and verify types:

```bash
# Typecheck & validate codebase
npm run lint

# Build production bundle to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🔗 Google Antigravity Backend Integration Guide

The frontend service layer has been pre-architected to seamlessly bind to your existing **Google Antigravity** backend, database, and ESP32 gateway.

### 1. API Service Layer Architecture

- **HTTP Client** (`src/services/apiClient.ts`):
  Provides a clean, typed fetch client with configurable request timeouts, parameter serialization, and error normalization.
- **Route Dictionary** (`src/services/endpoints.ts`):
  Lists all REST endpoints expected by the frontend. The Antigravity backend team can review and adjust this dictionary to match their route conventions.
- **Service Façade** (`src/services/antigravityApi.ts`):
  Coordinates API calls with automatic, graceful fallback to sample data if the backend is unreachable or when `VITE_USE_SAMPLE_DATA="true"`.

### 2. Expected REST Endpoints

| Resource | Method | Default Route | Description |
| :--- | :--- | :--- | :--- |
| **Plants Fleet** | `GET` | `/api/v1/plants` | Returns array of `PlantTelemetry` objects |
| **Plant History** | `GET` | `/api/v1/plants/:id/history` | Returns historical readings for 1h, 24h, 7d, 30d |
| **Chamber Environment** | `GET` | `/api/v1/chamber/environment` | Current VPD, ambient temperature, RH, PAR light |
| **KPI Summary** | `GET` | `/api/v1/kpis/summary` | Summary numbers for dashboard header cards |
| **Nodes Fleet** | `GET` | `/api/v1/nodes` | Status and hardware specs of 3 ESP32 nodes |
| **Node Diagnostics** | `GET` | `/api/v1/nodes/:id/diagnostics` | 15-channel register and calibration diagnostics |
| **On-Demand Screening** | `POST` | `/api/v1/screening/evaluate/:id` | Triggers immediate inference on Antigravity model |
| **Solenoid Irrigation** | `POST` | `/api/v1/actuators/irrigation/:id` | Triggers micro-irrigation valve pulse (e.g. 15s) |
| **Report Export** | `GET` | `/api/v1/reports/export` | Generates verified CSV/JSON export dataset |

### 3. ESP32 Node Hardware Configuration

The frontend interfaces with three physical nodes:
1. `TULSI_01` (Assigned plant: Tulsi, *Ocimum tenuiflorum*)
2. `HIBISCUS_01` (Assigned plant: Hibiscus, *Hibiscus rosa-sinensis*)
3. `MONEYPLANT_01` (Assigned plant: Money Plant, *Epipremnum aureum*)

Each node runs an **ESP32 DevKit V1** transmitting over Wi-Fi / MQTT with:
- **Capacitive Soil-Moisture Sensor v1.2** (Analog/ADC, dry: ~3120, sat: ~1450)
- **MLX90614 Contactless Infrared Thermometer** (I2C address `0x5A`, emissivity $\varepsilon = 0.98$)
- **AHT25 Precision Digital Temperature & Humidity Sensor** (I2C address `0x38`)
- **BH1750 Ambient Light Lux Sensor** (I2C address `0x23`)

### 4. Switching from Sample Data to Live Backend

1. In `.env`, set:
   ```dotenv
   VITE_ANTIGRAVITY_API_URL="https://your-antigravity-backend-host/api/v1"
   VITE_USE_SAMPLE_DATA="false"
   ```
2. Re-run or rebuild the frontend (`npm run build`). All queries will route to your live backend service.

---

## 📤 GitHub Upload Instructions

To publish this codebase to a new GitHub repository:

```bash
# 1. Initialize git repository (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: RootWhisper botanical intelligence and water-stress screening frontend v2.4.1"

# 4. Create new repository on GitHub (e.g. via GitHub UI or CLI)
# 5. Link local repository to your remote GitHub repository
git remote add origin https://github.com/your-username/rootwhisper-frontend.git

# 6. Push to main branch
git branch -M main
git push -u origin main
```

---

## 🔒 Security & Best Practices

- **Zero Secret Ingestion**: No passwords, database credentials, or secret API keys are stored in the codebase or git history.
- **Client-Side Safe**: All environment variables use the `VITE_` prefix and are strictly intended for public client consumption.
- **Fail-Safe Sanitization**: Hardware fault sentinels (e.g. `-99.0°C` or `0xFFFF`) are intercepted and formatted as `SENSOR ERROR / N/A` before presentation.

---

## 📄 License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
