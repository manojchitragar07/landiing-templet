# Manoj Chitragar - Full-Stack Cyber Interactive Portfolio

A modern, high-tech portfolio architecture cleanly separated into independent **Frontend** and **Backend** micro-architectures. Features an autonomous collaborative cursor swarm with dynamic speed-ramping, physics-driven flocking, cyber decryption typing, and a live integrated Express API backend powering telemetry, terminal execution, and secure contact dispatches.

---

## 🏗️ Architecture Overview

The repository is modularly structured into two decoupled tiers:

```
├── frontend/                     # Modern UI client (HTML5, Vanilla JS, Modular Canvas & CSS)
│   ├── index.html                # Semantic interface (Hero, Terminal, Projects, Telemetry HUD)
│   ├── css/
│   │   └── style.css             # Cyberpunk styling, radar pings, glowing cursors, scanlines
│   ├── js/
│   │   ├── cursors.js            # Physics-driven speed-ramping autonomous cursor swarm & web lines
│   │   ├── typing.js             # Decryption cipher typing engine synchronized with cursor caret
│   │   ├── terminal.js           # Interactive terminal supporting local & backend API commands
│   │   ├── audio.js              # Synthesized Web Audio API sound effects (no external assets)
│   │   ├── main.js               # HUD telemetry, system status, API health check & form handler
│   │   └── bundle.js             # Universal all-in-one bundle for instant zero-config loading
│   └── package.json              # Frontend dev scripts (Vite / serve)
│
├── backend/                      # Production-ready Node.js & Express REST API
│   ├── src/
│   │   ├── server.js             # Express application with CORS, security headers & error handling
│   │   └── routes/
│   │       ├── telemetry.js      # Host telemetry (RAM, CPU cores, uptime, load)
│   │       ├── contact.js        # Contact message validator & transmission receipts
│   │       ├── projects.js       # Dynamic portfolio project metadata and tag filters
│   │       └── terminal.js       # Remote terminal command execution engine
│   ├── .env.example              # Sample environment configuration
│   ├── README.md                 # Backend-specific documentation
│   └── package.json              # Express, CORS, Dotenv dependencies
│
├── .gitignore                    # Environment & node_modules exclusions
├── package.json                  # Root orchestration scripts
└── README.md                     # Comprehensive project documentation
```

---

## ⚡ Core Technical Features

### 1. Autonomous Speed-Ramping Cursor Swarm
- **Autonomous Agents**: 14 distinct autonomous cursor agents (`Manoj::Core`, `Synapse.ai`, `HyperThread_01`, `AST_Parser`, `Linter_Agent`, `Optimizer_z`, etc.).
- **Dynamic Speed-Ramping**: Cursors dynamically accelerate along exponential velocity vectors up to 2,800+ px/s before gracefully decelerating.
- **Monochromic Glow & Web Topology**: Monochromatic glowing pointers connected by delicate, subtle constellation web lines (`rgba(130, 200, 255, 0.22)`).
- **Free-Flying Orbits**: Avoids rigid clumped docks or fixed ellipses; cursors maintain organic, fluid, speed-ramping motion across the hero section.

### 2. Technical Collaborative Typing Sequence
- Cursors smoothly converge onto the typing position while the primary cursor tracks the glowing active caret.
- **"Manoj Chitragar"** prints character-by-character with a technical cipher decryption animation, synthesized keystroke clicks, and subtle micro-spark bursts.
- Subtitle: `Creative Technologist // Full-Stack & Systems Architect`.

### 3. Full-Stack API Integration
- **Telemetry HUD**: Live ping indicators query the backend `/api/health` and `/api/telemetry` endpoints, with automatic offline fallback when running standalone.
- **Remote Terminal Execution**: Cyber terminal runs both client-side commands (`help`, `about`, `projects`, `clear`, `matrix`) and remote backend commands (`ping`, `uptime`, `status`).
- **Encrypted Contact Transmissions**: Contact form dispatches structured payloads to `POST /api/contact`, receiving a cryptographic receipt ID and timestamp.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (optional for pure frontend preview, required for backend API)
- npm or yarn

---

### Option A: Run Full-Stack (Frontend + Backend)

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start both Backend and Frontend**:
   ```bash
   npm run dev
   ```
   - **Backend**: `http://localhost:5000`
   - **Frontend**: `http://localhost:3000` (or open `frontend/index.html`)

---

### Option B: Run Services Individually

#### 1. Backend API Service
```bash
cd backend
npm install
npm run dev
# Server listens on http://localhost:5000
```

#### 2. Frontend Client
```bash
cd frontend
npm run dev
# Or simply open frontend/index.html directly in any web browser!
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check and server status |
| `GET` | `/api/telemetry` | Real-time system memory, CPU cores, node version, and uptime |
| `GET` | `/api/projects` | Dynamic project listings with tech stack tags and links |
| `POST` | `/api/contact` | Submits contact inquiries; returns transmission receipt |
| `POST` | `/api/terminal/execute` | Remote command executor for the interactive terminal |

---

## 🛠️ Controls in the Top HUD Bar

- **SYS_ONLINE**: Live system and API connection indicator.
- **FPS**: Real-time framerate meter (60-120 FPS).
- **X / Y**: Live user mouse cursor coordinates.
- **SWARM VELOCITY**: Live velocity readout of the speed-ramping cursors.
- **AUDIO [ON/OFF]**: Toggle synthesized typing and whoosh audio effects.
- **SWARM [ROAM / TURBO / CALM]**: Adjust background cursor swarm velocity.
- **MATRIX**: Toggle digital rain background canvas.
- **REPLAY**: Re-trigger the speed-ramping intro and collaborative typing sequence.

---

## 📜 License
MIT License © Manoj Chitragar
