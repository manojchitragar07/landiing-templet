# Manoj Chitragar - High-Tech Interactive Portfolio Landing Page

An ultra-modern, cyberpunk/developer-tool inspired portfolio landing page featuring an autonomous collaborative cursor swarm, dynamic speed ramping, technical typing with digital cipher decryption, and a fully interactive system terminal.

---

## ⚡ Core Technical Features

1. **Autonomous Cursor Swarm with Speed Ramping**:
   - 14 distinct autonomous collaborative cursor agents (`Manoj::Core`, `Synapse.ai`, `HyperThread_01`, `V8_JIT`, `AST_Parser`, `Linter_Agent`, etc.).
   - Physics-driven speed ramping: cursors accelerate along exponential velocity curves up to 2,800+ px/s with real-time dynamic banking and vector angles.
   - Canvas2D glowing comet trails and particle sparks.
   - Live telemetry in HUD: real-time swarm velocity, agent state, and coordinates.

2. **Confluence & Collaborative Typing Animation**:
   - Hyperspeed cursors smoothly brake and converge onto the central target coordinate.
   - The lead cursor locks onto the caret position while peer cursors orbit and highlight characters.
   - **"Manoj Chitragar"** prints out letter-by-letter with a technical decryption cipher effect, keystroke audio clicks, and micro-spark bursts.
   - Followed by the technical subtitle: `Creative Technologist // Full-Stack & Systems Architect`.

3. **Interactive Post-Intro Experience**:
   - **Ambient Cursor Intelligence**: Cursors gently roam, react to the user's cursor, or orbit interactive cards.
   - **Interactive Cyber Terminal**: Real executable commands (`help`, `about`, `skills`, `projects`, `contact`, `matrix`, `clear`, `sudo`, `replay`).
   - **Matrix Rain Canvas**: Toggleable digital rain backdrop (`btn-matrix-toggle` or `matrix` command).
   - **Web Audio API Synthesizer**: Zero external MP3/WAV files needed; pure synthesized mechanical keystrokes, high-speed whooshes, target lock chimes, and UI sounds (toggleable in HUD).
   - **Filterable Projects Grid**: Spotlight cards with mouse-following radial lighting shaders.
   - **Skills Matrix**: Live competency meters for Frontend, Backend, AI Infrastructure, and DevOps.
   - **Encrypted Contact Channel**: Contact form with simulated payload transmission feedback.

---

## 🚀 How to Run Locally

### Option 1: Direct in Browser
Simply open `index.html` in your favorite web browser (Chrome, Safari, Firefox, Edge, Brave, etc.). No build step or server required!

### Option 2: Using Python HTTP Server
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

### Option 3: Using Node / Vite
```bash
npm install
npm run dev
```

---

## 📂 File Architecture

```
├── index.html          # Semantic HTML5 layout, HUD telemetry, projects, terminal, contact
├── css/
│   └── style.css       # Cyberpunk theme, JetBrains Mono typography, glowing borders, animations
├── js/
│   ├── audio.js        # Web Audio API sound synthesizer (zero external dependencies)
│   ├── cursors.js      # Autonomous cursor swarm engine (speed ramping, trails, flocking)
│   ├── typing.js       # Cipher decryption typing engine & coordinate synchronization
│   ├── terminal.js     # Interactive cyber terminal console with custom commands
│   └── main.js         # Master application orchestrator, HUD telemetry & card spotlight
└── package.json        # Node script definitions (Vite dev & build)
```

---

## 🛠️ Controls in the Top HUD Bar

- **SYS_ONLINE**: System status indicator.
- **LOCAL**: Real-time clock with UTC offset.
- **FPS**: Live framerate meter (60-120 FPS).
- **X / Y**: Real-time user cursor coordinates.
- **SWARM VELOCITY**: Live speed-ramp readout.
- **AUDIO: [ON/OFF]**: Toggle synthesized typing and whoosh sound effects.
- **SWARM: [ROAM / TURBO / CALM]**: Adjust background cursor speed and flocking.
- **MATRIX**: Toggle the digital rain overlay.
- **REPLAY**: Relaunch the speed-ramping intro and collaborative typing sequence anytime.

