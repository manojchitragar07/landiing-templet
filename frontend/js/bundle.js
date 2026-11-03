/**
 * Manoj Chitragar Portfolio - Standalone Universal Bundle
 * Runs seamlessly both via HTTP server and directly via file:/// protocol in Chrome/Safari/Firefox
 * Full-stack enabled with automatic API connectivity and graceful offline fallback
 */

// ==========================================
// 1. Audio Engine
// ==========================================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = false;
        this.masterGain = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.init();
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playKeystroke(pitchVariation = 1) {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            const baseFreq = 700 + (Math.random() * 300 - 150) * pitchVariation;
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1200, now);
            filter.Q.setValueAtTime(2.5, now);

            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {}
    }

    playSpeedWhoosh(intensity = 0.5) {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            const startFreq = 200 + Math.random() * 200;
            const endFreq = 900 + intensity * 600;

            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.12);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.09 * intensity, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 0.16);
        } catch (e) {}
    }

    playCipherChirp() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            const freq = 1200 + Math.random() * 1400;
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 0.03);
        } catch (e) {}
    }

    playConvergence() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [520, 1040].forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now + idx * 0.06);
                
                gain.gain.setValueAtTime(0.18, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.3);
            });
        } catch (e) {}
    }

    playCompletion() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const chord = [440, 554.37, 659.25, 880];
            chord.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.04);

                gain.gain.setValueAtTime(0.08, now + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.7);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start(now + idx * 0.04);
                osc.stop(now + idx * 0.04 + 0.75);
            });
        } catch (e) {}
    }

    playUiClick() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {}
    }
}

const sound = new SoundEngine();

// ==========================================
// 2. Cursor Swarm Engine
// ==========================================
class CursorSwarm {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.trailCanvas = options.canvas;
        this.ctx = this.trailCanvas ? this.trailCanvas.getContext('2d') : null;
        this.onRampComplete = options.onRampComplete || null;
        this.onTypingStart = options.onTypingStart || null;

        this.cursors = [];
        this.state = 'IDLE'; // IDLE, RAMPING, CONVERGING, TYPING, AMBIENT
        this.animFrameId = null;
        this.startTime = 0;
        this.rampDuration = 3000;
        this.convergenceDuration = 900;

        this.targetPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.caretPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.userMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

        this.particles = [];
        this.selectionBoxes = [];

        this.initAgents();
        this.bindEvents();
    }

    initAgents() {
        const agentConfigs = [
            { id: 'Manoj::Core', role: 'lead', label: 'lead_actor' },
            { id: 'Synapse.ai', role: 'support', label: 'nn_copilot' },
            { id: 'HyperThread_01', role: 'support', label: 'worker_01' },
            { id: 'V8_JIT', role: 'support', label: 'compiler' },
            { id: 'Vector_Engine', role: 'support', label: 'raster_gpu' },
            { id: 'Quantum_04', role: 'support', label: 'qubit_reg' },
            { id: 'AST_Parser', role: 'support', label: 'tree_sitter' },
            { id: 'Telemetry_Bot', role: 'support', label: 'probe_x' },
            { id: 'Linter_Agent', role: 'support', label: 'eval_linter' },
            { id: 'Optimizer_z', role: 'support', label: 'zero_alloc' },
            { id: 'SubProc_07', role: 'support', label: 'ipc_worker' },
            { id: 'Neon_Pulse', role: 'support', label: 'sync_daemon' },
            { id: 'Kube_Pod_09', role: 'support', label: 'orchestrator' },
            { id: 'Shader_Core', role: 'support', label: 'frag_shader' }
        ];

        document.querySelectorAll('.agent-cursor-elem').forEach(el => el.remove());
        this.cursors = [];

        agentConfigs.forEach((cfg, index) => {
            const el = document.createElement('div');
            el.className = 'agent-cursor-elem';
            if (cfg.role === 'lead') el.classList.add('is-lead');
            el.id = `cursor-agent-${index}`;
            el.innerHTML = `
                <div class="cursor-pointer-wrap">
                    <svg class="cursor-svg" viewBox="0 0 24 24" width="22" height="22" fill="none">
                        <path d="M4 2L20 10L12 13L9 21L4 2Z" fill="#ffffff" stroke="#07090e" stroke-width="1.3" stroke-linejoin="round"/>
                        <circle cx="4" cy="2" r="2.5" fill="#ffffff" />
                    </svg>
                    <div class="cursor-ping"></div>
                </div>
                <div class="cursor-tag">
                    <span class="cursor-id">${cfg.id}</span>
                    <span class="cursor-coords">0,0</span>
                </div>
            `;
            this.container.appendChild(el);

            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const angle = Math.random() * Math.PI * 2;
            const speed = 130 + Math.random() * 80;

            this.cursors.push({
                ...cfg,
                index,
                el,
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                targetX: x,
                targetY: y,
                baseSpeed: speed,
                angle: 0,
                orbitRadiusX: 180 + (index % 5) * 55,
                orbitRadiusY: 70 + (index % 4) * 35,
                orbitAngle: (index / agentConfigs.length) * Math.PI * 2,
                orbitSpeed: (index % 2 === 0 ? 1 : -1) * (1.1 + (index % 3) * 0.4)
            });
        });
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            this.userMouse.x = e.clientX;
            this.userMouse.y = e.clientY;
            this.userMouse.active = true;
        });

        document.addEventListener('mouseleave', () => {
            this.userMouse.active = false;
        });
    }

    resizeCanvas() {
        if (!this.trailCanvas) return;
        this.trailCanvas.width = window.innerWidth;
        this.trailCanvas.height = window.innerHeight;
    }

    setTargetPosition(x, y) {
        this.targetPoint.x = x;
        this.targetPoint.y = y;
    }

    setCaretPosition(x, y) {
        this.caretPoint.x = x;
        this.caretPoint.y = y;
    }

    emitKeystrokeBurst(x, y, char, color = '#ffffff') {
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 40 + Math.random() * 110;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 0.035 + Math.random() * 0.03,
                color,
                size: 1.8 + Math.random() * 2
            });
        }

        if (Math.random() > 0.55 && this.cursors.length > 2) {
            this.selectionBoxes.push({
                x: x - 10,
                y: y - 16,
                width: 22,
                height: 34,
                life: 1.0,
                label: `AST: '${char}'`
            });
        }
    }

    startSequence() {
        this.state = 'RAMPING';
        this.startTime = performance.now();
        this.initAgents();

        sound.playSpeedWhoosh(0.5);

        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        let lastTime = performance.now();

        const loop = (currentTime) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.08);
            lastTime = currentTime;

            this.update(currentTime, dt);
            this.render();

            this.animFrameId = requestAnimationFrame(loop);
        };

        this.animFrameId = requestAnimationFrame(loop);
    }

    update(currentTime, dt) {
        const elapsed = currentTime - this.startTime;
        const telemetrySpeed = document.getElementById('hud-swarm-speed');
        const telemetryStatus = document.getElementById('hud-swarm-status');

        if (this.state === 'RAMPING') {
            const progress = Math.min(elapsed / this.rampDuration, 1.0);
            const rampFactor = 1 + Math.pow(progress, 2.6) * 16;

            if (telemetrySpeed) {
                telemetrySpeed.textContent = `${Math.round(220 * rampFactor)} px/s`;
            }
            if (telemetryStatus) {
                telemetryStatus.textContent = `RAMPING [${Math.round(progress * 100)}%]`;
                telemetryStatus.className = 'hud-val text-neon-cyan animate-pulse';
            }

            if (Math.random() < 0.04 * rampFactor) {
                sound.playSpeedWhoosh(Math.min(rampFactor / 16, 1));
            }

            this.cursors.forEach((c) => {
                const angle = Math.atan2(c.vy, c.vx) + (Math.sin(currentTime * 0.004 + c.index * 1.2) * 0.16);
                const currentSpeed = c.baseSpeed * rampFactor;

                c.vx = Math.cos(angle) * currentSpeed;
                c.vy = Math.sin(angle) * currentSpeed;

                c.x += c.vx * dt;
                c.y += c.vy * dt;

                const margin = 20;
                if (c.x < margin) { c.x = margin; c.vx = Math.abs(c.vx); }
                if (c.x > window.innerWidth - margin) { c.x = window.innerWidth - margin; c.vx = -Math.abs(c.vx); }
                if (c.y < margin) { c.y = margin; c.vy = Math.abs(c.vy); }
                if (c.y > window.innerHeight - margin) { c.y = window.innerHeight - margin; c.vy = -Math.abs(c.vy); }
            });

            if (progress >= 1.0) {
                this.state = 'CONVERGING';
                this.convergenceStartTime = currentTime;
                sound.playConvergence();
                if (telemetryStatus) {
                    telemetryStatus.textContent = 'CONVERGING >> ASSEMBLE';
                    telemetryStatus.className = 'hud-val text-neon-magenta';
                }
            }
        } 
        else if (this.state === 'CONVERGING') {
            const convElapsed = currentTime - this.convergenceStartTime;
            const convProgress = Math.min(convElapsed / this.convergenceDuration, 1.0);
            const ease = 1 - Math.pow(1 - convProgress, 3);

            if (telemetrySpeed) {
                telemetrySpeed.textContent = `${Math.round(2200 * (1 - ease * 0.82))} px/s`;
            }

            this.cursors.forEach((c) => {
                let destX, destY;
                if (c.role === 'lead') {
                    destX = this.targetPoint.x - 24;
                    destY = this.targetPoint.y + 8;
                } else {
                    const angle = c.orbitAngle;
                    destX = this.targetPoint.x + Math.cos(angle) * c.orbitRadiusX;
                    destY = this.targetPoint.y + Math.sin(angle) * c.orbitRadiusY;
                }

                const dx = destX - c.x;
                const dy = destY - c.y;

                c.vx = dx * (4.5 + ease * 4.5);
                c.vy = dy * (4.5 + ease * 4.5);

                c.x += c.vx * dt;
                c.y += c.vy * dt;
            });

            if (convProgress >= 1.0) {
                this.state = 'TYPING';
                if (this.onTypingStart) {
                    this.onTypingStart();
                }
                if (telemetryStatus) {
                    telemetryStatus.textContent = 'COLLABORATIVE_TYPING';
                    telemetryStatus.className = 'hud-val text-neon-green';
                }
            }
        } 
        else if (this.state === 'TYPING') {
            if (telemetrySpeed) {
                telemetrySpeed.textContent = 'SYNCED';
            }

            this.cursors.forEach((c) => {
                if (c.role === 'lead') {
                    const destX = this.caretPoint.x + 4;
                    const destY = this.caretPoint.y + 12;
                    c.x += (destX - c.x) * 16 * dt;
                    c.y += (destY - c.y) * 16 * dt;
                } else {
                    c.orbitAngle += c.orbitSpeed * dt;
                    const destX = this.caretPoint.x + Math.cos(c.orbitAngle) * c.orbitRadiusX;
                    const destY = this.caretPoint.y + Math.sin(c.orbitAngle) * c.orbitRadiusY;

                    c.x += (destX - c.x) * 6 * dt;
                    c.y += (destY - c.y) * 6 * dt;
                }
            });
        } 
        else if (this.state === 'AMBIENT') {
            if (telemetrySpeed) {
                telemetrySpeed.textContent = 'AMBIENT';
            }
            if (telemetryStatus) {
                telemetryStatus.textContent = 'ONLINE [14 AGENTS]';
                telemetryStatus.className = 'hud-val text-neon-cyan';
            }

            this.cursors.forEach((c) => {
                c.orbitAngle += c.orbitSpeed * 0.4 * dt;

                let targetX = c.x + Math.cos(c.orbitAngle) * 35;
                let targetY = c.y + Math.sin(c.orbitAngle) * 35;

                if (this.userMouse.active) {
                    const distToMouse = Math.hypot(this.userMouse.x - c.x, this.userMouse.y - c.y);
                    if (distToMouse < 220) {
                        const mouseAngle = Math.atan2(c.y - this.userMouse.y, c.x - this.userMouse.x);
                        targetX = this.userMouse.x + Math.cos(mouseAngle + c.orbitSpeed * 0.7) * 160;
                        targetY = this.userMouse.y + Math.sin(mouseAngle + c.orbitSpeed * 0.7) * 160;
                    }
                }

                c.vx += (Math.random() - 0.5) * 100 * dt;
                c.vy += (Math.random() - 0.5) * 100 * dt;
                c.vx *= 0.94;
                c.vy *= 0.94;

                c.x += c.vx + (targetX - c.x) * 1.4 * dt;
                c.y += c.vy + (targetY - c.y) * 1.4 * dt;

                c.x = Math.max(20, Math.min(window.innerWidth - 30, c.x));
                c.y = Math.max(20, Math.min(window.innerHeight - 30, c.y));
            });
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= p.decay;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        for (let i = this.selectionBoxes.length - 1; i >= 0; i--) {
            const b = this.selectionBoxes[i];
            b.life -= dt * 1.8;
            if (b.life <= 0) {
                this.selectionBoxes.splice(i, 1);
            }
        }
    }

    render() {
        this.cursors.forEach((c) => {
            let rotation = 0;
            if (this.state === 'RAMPING') {
                const flightAngle = Math.atan2(c.vy, c.vx) * (180 / Math.PI);
                rotation = ((flightAngle + 135 + 180) % 360) - 180;
                rotation = Math.max(-45, Math.min(45, rotation * 0.4));
            }

            c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
            const svgEl = c.el.querySelector('.cursor-svg');
            if (svgEl) {
                svgEl.style.transform = `rotate(${rotation}deg)`;
            }

            const coordsEl = c.el.querySelector('.cursor-coords');
            if (coordsEl) {
                coordsEl.textContent = `${Math.round(c.x)},${Math.round(c.y)}`;
            }
        });

        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);

        const maxDist = 200;
        this.ctx.lineWidth = 0.85;

        for (let i = 0; i < this.cursors.length; i++) {
            const c1 = this.cursors[i];
            const p1x = c1.x + 4;
            const p1y = c1.y + 2;

            for (let j = i + 1; j < this.cursors.length; j++) {
                const c2 = this.cursors[j];
                const p2x = c2.x + 4;
                const p2y = c2.y + 2;

                const dx = p2x - p1x;
                const dy = p2y - p1y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    const alpha = Math.pow(1 - dist / maxDist, 1.2) * 0.22;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1x, p1y);
                    this.ctx.lineTo(p2x, p2y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
                    this.ctx.stroke();
                }
            }

            if (this.userMouse.active) {
                const dx = this.userMouse.x - p1x;
                const dy = this.userMouse.y - p1y;
                const dist = Math.hypot(dx, dy);
                if (dist < maxDist * 0.9) {
                    const alpha = Math.pow(1 - dist / (maxDist * 0.9), 1.2) * 0.25;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1x, p1y);
                    this.ctx.lineTo(this.userMouse.x, this.userMouse.y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
                    this.ctx.stroke();
                }
            }
        }

        this.particles.forEach((p) => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.globalAlpha = p.life;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#ffffff';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1.0;
        });

        this.selectionBoxes.forEach((b) => {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.globalAlpha = b.life * 0.85;
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = '#ffffff';
            this.ctx.setLineDash([4, 3]);
            this.ctx.strokeRect(b.x, b.y, b.width, b.height);
            this.ctx.setLineDash([]);

            this.ctx.font = '10px "JetBrains Mono", monospace';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(b.label, b.x, b.y - 4);
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1.0;
        });
    }

    setAmbient() {
        this.state = 'AMBIENT';
    }

    destroy() {
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        document.querySelectorAll('.agent-cursor-elem').forEach(el => el.remove());
    }
}

// ==========================================
// 3. Technical Typing Engine
// ==========================================
class TechnicalTypingEngine {
    constructor(options = {}) {
        this.titleElement = options.titleElement;
        this.subtitleElement = options.subtitleElement;
        this.cursorSwarm = options.cursorSwarm;
        this.onComplete = options.onComplete || null;

        this.cipherChars = '01#_<>[]{}/*+=~!?$%&';
        this.isTyping = false;
    }

    async runSequence() {
        if (this.isTyping) return;
        this.isTyping = true;

        if (this.titleElement) this.titleElement.innerHTML = '';
        if (this.subtitleElement) this.subtitleElement.innerHTML = '';

        const primaryText = 'Manoj Chitragar';
        const subtitleText = 'Creative Technologist  //  Full-Stack & Systems Architect';

        await this.typeWithCipher(this.titleElement, primaryText, {
            speed: 85,
            cipherPasses: 3,
            isPrimary: true
        });

        await new Promise(r => setTimeout(r, 380));

        await this.typeWithCipher(this.subtitleElement, subtitleText, {
            speed: 38,
            cipherPasses: 2,
            isPrimary: false
        });

        sound.playCompletion();

        this.isTyping = false;
        if (this.onComplete) {
            this.onComplete();
        }
    }

    async typeWithCipher(targetElement, fullText, options = {}) {
        const {
            speed = 70,
            cipherPasses = 3,
            isPrimary = true
        } = options;

        if (!targetElement) return;

        const caret = document.createElement('span');
        caret.className = 'technical-caret';
        targetElement.appendChild(caret);

        for (let i = 0; i < fullText.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.className = 'typed-char char-pending';
            charSpan.textContent = '';
            targetElement.insertBefore(charSpan, caret);

            const targetChar = fullText[i];

            if (targetChar === ' ') {
                charSpan.textContent = ' ';
                charSpan.classList.remove('char-pending');
                charSpan.classList.add('char-resolved');
                continue;
            }

            for (let pass = 0; pass < cipherPasses; pass++) {
                const randomCipher = this.cipherChars[Math.floor(Math.random() * this.cipherChars.length)];
                charSpan.textContent = randomCipher;
                charSpan.classList.add('char-glitch');
                sound.playCipherChirp();
                await new Promise(r => setTimeout(r, 22));
            }

            charSpan.textContent = targetChar;
            charSpan.classList.remove('char-pending', 'char-glitch');
            charSpan.classList.add('char-resolved');

            sound.playKeystroke(isPrimary ? 1.0 : 1.3);

            this.updateCaretCoordinates(caret, targetChar);

            const variance = (Math.random() - 0.5) * 20;
            await new Promise(r => setTimeout(r, Math.max(25, speed + variance)));
        }

        if (!isPrimary) {
            caret.classList.add('caret-idle');
        }
    }

    updateCaretCoordinates(caretEl, char) {
        if (!caretEl || !this.cursorSwarm) return;
        const rect = caretEl.getBoundingClientRect();
        const caretX = rect.left;
        const caretY = rect.top + rect.height / 2;

        this.cursorSwarm.setCaretPosition(caretX, caretY);
        this.cursorSwarm.emitKeystrokeBurst(caretX, caretY, char, '#ffffff');
    }
}

// ==========================================
// 4. Cyber Terminal Engine
// ==========================================
class CyberTerminal {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.outputArea = this.container.querySelector('.terminal-output');
        this.input = this.container.querySelector('.terminal-input');
        this.form = this.container.querySelector('.terminal-form');
        this.history = [];
        this.historyIndex = -1;

        this.commands = {
            help: () => `
Available system commands:
  <span class="text-neon-cyan">about</span>       - Print technical dossier & background
  <span class="text-neon-cyan">skills</span>      - List core engineering capabilities
  <span class="text-neon-cyan">projects</span>    - Display highlighted production projects
  <span class="text-neon-cyan">experience</span>  - View engineering background & milestones
  <span class="text-neon-cyan">contact</span>     - Display communication channels
  <span class="text-neon-cyan">status</span>      - Query remote API server telemetry
  <span class="text-neon-cyan">ping</span>        - Test roundtrip latency to backend daemon
  <span class="text-neon-cyan">uptime</span>      - Query server daemon uptime
  <span class="text-neon-cyan">replay</span>      - Re-run speed-ramping cursor swarm intro
  <span class="text-neon-cyan">matrix</span>      - Trigger digital rain visual effect
  <span class="text-neon-cyan">clear</span>       - Clear the terminal screen
  <span class="text-neon-cyan">sudo</span>        - Request privileged subsystem access
`,
            about: () => `
<span class="text-neon-green">MANOJ CHITRAGAR</span> // CREATIVE TECHNOLOGIST & FULL-STACK ARCHITECT
-----------------------------------------------------------------
Status:       Available for innovative contracts & high-impact roles
Focus:        High-performance Web, Distributed Systems, Interactive Graphics & AI Tools
Location:     Bengaluru, India / Open to Global Remote
Philosophy:   Merging deep systems engineering with bleeding-edge visual craft.
`,
            skills: () => `
<span class="text-neon-cyan">TECHNICAL CAPABILITIES MATRIX:</span>
-----------------------------------------------------------------
[Frontend]    TypeScript, React, Next.js, Vue, WebGL/Three.js, Canvas2D, Tailwind CSS, GSAP
[Backend]     Node.js, Go, Python, Rust (WASM), GraphQL, REST, gRPC
[Databases]   PostgreSQL, Redis, ClickHouse, MongoDB, Vector DBs (Pinecone, Chroma)
[DevOps/Ops]  Docker, Kubernetes, AWS, Cloudflare Workers, CI/CD, Terraform
[AI/ML]       LangChain, LlamaIndex, OpenAI/Gemini API, Local LLM Tooling, RAG pipelines
`,
            projects: () => `
<span class="text-neon-cyan">FEATURED REPOSITORIES & DEPLOYMENTS:</span>
-----------------------------------------------------------------
1. <span class="text-neon-green">SYNAPSE-UI</span>       - High-speed canvas-rendered collaborative node editor (React + WebGL)
2. <span class="text-neon-green">HYPERVECTOR-DB</span>   - Sub-millisecond approximate nearest neighbor search engine in Rust
3. <span class="text-neon-green">CHRONOS-STREAM</span>   - Real-time event streaming pipeline processing 100k events/sec
4. <span class="text-neon-green">NEXUS-STUDIO</span>     - WebGPU shader development environment with live hot-reloading
(Scroll down to examine interactive project cards!)
`,
            experience: () => `
<span class="text-neon-cyan">ENGINEERING TIMELINE:</span>
-----------------------------------------------------------------
2024 - Present:  Lead Creative Technologist & Systems Architect
2022 - 2024:     Senior Full-Stack Engineer // Scaled core microservices
2020 - 2022:     Frontend Specialist & Interactive Web Developer
`,
            contact: () => `
<span class="text-neon-cyan">COMMUNICATION CHANNELS:</span>
-----------------------------------------------------------------
Email:      <a href="mailto:manojchitragar@gmail.com" class="text-neon-cyan underline">manojchitragar@gmail.com</a>
GitHub:     <a href="https://github.com/manojchitragar07" target="_blank" class="text-neon-cyan underline">github.com/manojchitragar07</a>
LinkedIn:   <a href="https://linkedin.com" target="_blank" class="text-neon-cyan underline">linkedin.com/in/manojchitragar</a>
Status:     Encrypted direct channel ready. Send payload via Contact form below!
`,
            clear: () => {
                this.outputArea.innerHTML = '';
                return null;
            },
            replay: () => {
                window.dispatchEvent(new CustomEvent('replay-intro'));
                return '>> Relaunching boot sequence and cursor swarm...';
            },
            sudo: () => `<span class="text-neon-magenta">[SECURITY ALERT]</span> User is not in the sudoers file. This incident has been logged to /var/log/antigravity.`,
            matrix: () => {
                window.dispatchEvent(new CustomEvent('toggle-matrix'));
                return '<span class="text-neon-green">Matrix rain mode toggled.</span>';
            }
        };

        this.init();
    }

    init() {
        if (!this.form || !this.input) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCommand(this.input.value.trim());
            this.input.value = '';
        });

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.history[this.historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.history[this.historyIndex] || '';
                } else {
                    this.historyIndex = this.history.length;
                    this.input.value = '';
                }
            }
        });

        this.print(`System initialized. Type <span class="text-neon-cyan font-bold">'help'</span> to see available commands.`);
    }

    async handleCommand(cmdText) {
        if (!cmdText) return;
        sound.playUiClick();

        this.history.push(cmdText);
        this.historyIndex = this.history.length;

        // Print user prompt
        this.print(`<span class="text-slate-400">visitor@manoj-sys:~$</span> <span class="text-white">${this.escapeHtml(cmdText)}</span>`);

        const lower = cmdText.toLowerCase();
        if (this.commands[lower]) {
            const result = this.commands[lower]();
            if (result) {
                this.print(result);
            }
            this.outputArea.scrollTop = this.outputArea.scrollHeight;
            return;
        }

        // Try remote daemon execution
        try {
            const res = await fetch('http://localhost:5000/api/terminal/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: cmdText })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.output) {
                    this.print(data.output);
                    this.outputArea.scrollTop = this.outputArea.scrollHeight;
                    return;
                }
            }
        } catch (e) {}

        this.print(`<span class="text-neon-magenta">zsh: command not found: ${this.escapeHtml(cmdText)}</span>. Type <span class="text-neon-cyan font-bold">'help'</span> for reference.`);
        this.outputArea.scrollTop = this.outputArea.scrollHeight;
    }

    print(html) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = html;
        this.outputArea.appendChild(line);
        this.outputArea.scrollTop = this.outputArea.scrollHeight;
    }

    escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

// ==========================================
// 5. Master Orchestrator Application
// ==========================================
class App {
    constructor() {
        this.swarm = null;
        this.typingEngine = null;
        this.terminal = null;
        this.matrixActive = false;
        this.matrixCanvas = null;
        this.matrixAnimId = null;

        this.fps = 60;
        this.lastFpsTime = performance.now();
        this.frameCount = 0;
    }

    init() {
        const trailCanvas = document.getElementById('trails-canvas');
        this.swarm = new CursorSwarm({
            container: document.getElementById('cursors-container'),
            canvas: trailCanvas,
            onTypingStart: () => {
                this.startTyping();
            }
        });

        const titleEl = document.getElementById('hero-title');
        const subtitleEl = document.getElementById('hero-subtitle');
        this.typingEngine = new TechnicalTypingEngine({
            titleElement: titleEl,
            subtitleElement: subtitleEl,
            cursorSwarm: this.swarm,
            onComplete: () => {
                this.onIntroComplete();
            }
        });

        this.terminal = new CyberTerminal('cyber-terminal');

        this.setupHUD();
        this.setupEventListeners();
        this.setupInteractiveCards();
        this.setupMatrixCanvas();

        this.updateHeroTargetCoordinate();
        window.addEventListener('resize', () => this.updateHeroTargetCoordinate());

        this.runIntroSequence();
    }

    updateHeroTargetCoordinate() {
        const titleContainer = document.getElementById('hero-title-container');
        if (titleContainer && this.swarm) {
            const rect = titleContainer.getBoundingClientRect();
            this.swarm.setTargetPosition(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }

    runIntroSequence() {
        document.querySelectorAll('.post-intro-reveal').forEach(el => el.classList.remove('revealed'));

        const introTelemetry = document.getElementById('intro-telemetry');
        if (introTelemetry) introTelemetry.style.opacity = '1';

        this.updateHeroTargetCoordinate();
        this.swarm.startSequence();
    }

    startTyping() {
        this.typingEngine.runSequence();
    }

    onIntroComplete() {
        this.swarm.setAmbient();

        const revealElements = document.querySelectorAll('.post-intro-reveal');
        revealElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, i * 120);
        });

        const introTelemetry = document.getElementById('intro-telemetry');
        if (introTelemetry) {
            introTelemetry.style.opacity = '0.35';
        }
    }

    setupHUD() {
        // Ping backend telemetry if online
        fetch('http://localhost:5000/api/telemetry')
            .then(res => res.json())
            .then(data => {
                const sysOnline = document.querySelector('.hud-val.text-neon-green');
                if (sysOnline && data.status) {
                    sysOnline.textContent = 'SYS_ONLINE [API_LINKED]';
                }
            })
            .catch(() => {});

        // Sound toggle button
        const soundBtn = document.getElementById('btn-sound-toggle');
        const soundStatus = document.getElementById('sound-status');
        if (soundBtn && soundStatus) {
            soundBtn.addEventListener('click', () => {
                const isEnabled = sound.toggle();
                soundStatus.textContent = isEnabled ? 'AUDIO: [ON]' : 'AUDIO: [OFF]';
                soundBtn.classList.toggle('active', isEnabled);
                if (isEnabled) sound.playUiClick();
            });
        }

        // Replay button
        const replayBtn = document.getElementById('btn-replay-intro');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                sound.playUiClick();
                this.replaySequence();
            });
        }

        // Cursor speed mode button
        const cursorModeBtn = document.getElementById('btn-cursor-mode');
        if (cursorModeBtn) {
            let mode = 0;
            cursorModeBtn.addEventListener('click', () => {
                sound.playUiClick();
                mode = (mode + 1) % 3;
                if (mode === 0) {
                    cursorModeBtn.textContent = 'SWARM: [ROAM]';
                    this.swarm.cursors.forEach(c => { c.baseSpeed = 130; });
                } else if (mode === 1) {
                    cursorModeBtn.textContent = 'SWARM: [TURBO]';
                    this.swarm.cursors.forEach(c => { c.baseSpeed = 380; });
                } else {
                    cursorModeBtn.textContent = 'SWARM: [CALM]';
                    this.swarm.cursors.forEach(c => { c.baseSpeed = 60; });
                }
            });
        }

        // Realtime Clock
        const timeDisplay = document.getElementById('hud-time');
        const updateTime = () => {
            if (timeDisplay) {
                const now = new Date();
                timeDisplay.textContent = now.toTimeString().split(' ')[0] + ' UTC' + (now.getTimezoneOffset() <= 0 ? '+' : '-') + Math.abs(now.getTimezoneOffset() / 60);
            }
        };
        setInterval(updateTime, 1000);
        updateTime();

        // FPS meter
        const fpsDisplay = document.getElementById('hud-fps');
        const calcFps = (timestamp) => {
            this.frameCount++;
            if (timestamp - this.lastFpsTime >= 500) {
                this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.lastFpsTime));
                if (fpsDisplay) fpsDisplay.textContent = `${this.fps} FPS`;
                this.frameCount = 0;
                this.lastFpsTime = timestamp;
            }
            requestAnimationFrame(calcFps);
        };
        requestAnimationFrame(calcFps);

        // Coordinates Tracker
        const coordDisplay = document.getElementById('hud-coords');
        window.addEventListener('mousemove', (e) => {
            if (coordDisplay) {
                coordDisplay.textContent = `X:${String(e.clientX).padStart(4, '0')} Y:${String(e.clientY).padStart(4, '0')}`;
            }
        });
    }

    replaySequence() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            this.runIntroSequence();
        }, 350);
    }

    setupEventListeners() {
        window.addEventListener('replay-intro', () => {
            this.replaySequence();
        });

        window.addEventListener('toggle-matrix', () => {
            this.toggleMatrix();
        });

        const matrixBtn = document.getElementById('btn-matrix-toggle');
        if (matrixBtn) {
            matrixBtn.addEventListener('click', () => {
                sound.playUiClick();
                this.toggleMatrix();
            });
        }

        const filterBtns = document.querySelectorAll('.project-filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sound.playUiClick();
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        card.classList.add('fade-in');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        const contactForm = document.getElementById('contact-form');
        const formFeedback = document.getElementById('form-feedback');
        if (contactForm && formFeedback) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                sound.playCompletion();

                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>TRANSMITTING...</span>';
                submitBtn.disabled = true;

                const nameInput = contactForm.querySelector('input[type="text"]');
                const emailInput = contactForm.querySelector('input[type="email"]');
                const messageInput = contactForm.querySelector('textarea');

                const payload = {
                    name: nameInput ? nameInput.value : '',
                    email: emailInput ? emailInput.value : '',
                    message: messageInput ? messageInput.value : ''
                };

                let receiptId = `TX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

                try {
                    const res = await fetch('http://localhost:5000/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.receipt) receiptId = data.receipt;
                    }
                } catch (err) {}

                submitBtn.innerHTML = '<span>PAYLOAD DELIVERED!</span>';
                formFeedback.classList.remove('hidden');
                formFeedback.innerHTML = `
                    <div class="p-3 bg-neon-green/10 border border-neon-green/40 text-neon-green rounded text-sm font-mono flex items-center gap-2">
                        <span>✓</span> Payload transmitted successfully [Receipt: ${receiptId}]. Manoj will respond to your channel shortly.
                    </div>
                `;
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 4000);
            });
        }
    }

    setupInteractiveCards() {
        const cards = document.querySelectorAll('.spotlight-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    setupMatrixCanvas() {
        this.matrixCanvas = document.getElementById('matrix-canvas');
        if (!this.matrixCanvas) return;

        const resize = () => {
            this.matrixCanvas.width = window.innerWidth;
            this.matrixCanvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();
    }

    toggleMatrix() {
        this.matrixActive = !this.matrixActive;
        const btn = document.getElementById('btn-matrix-toggle');
        if (btn) btn.classList.toggle('active', this.matrixActive);

        if (!this.matrixCanvas) return;

        if (this.matrixActive) {
            this.matrixCanvas.style.opacity = '0.7';
            this.startMatrixRain();
        } else {
            this.matrixCanvas.style.opacity = '0';
            if (this.matrixAnimId) cancelAnimationFrame(this.matrixAnimId);
        }
    }

    startMatrixRain() {
        const ctx = this.matrixCanvas.getContext('2d');
        const chars = '01MANOJCHITRAGARABCDEF<>{}[]/*+=!@#$%^&*~';
        const fontSize = 14;
        const columns = Math.floor(this.matrixCanvas.width / fontSize);
        const drops = Array(columns).fill(1);

        const render = () => {
            ctx.fillStyle = 'rgba(6, 9, 15, 0.08)';
            ctx.fillRect(0, 0, this.matrixCanvas.width, this.matrixCanvas.height);

            ctx.fillStyle = '#ffffff';
            ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > this.matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            if (this.matrixActive) {
                this.matrixAnimId = requestAnimationFrame(render);
            }
        };

        render();
    }
}

// Auto-boot on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init();
        window.__app = app;
    });
} else {
    const app = new App();
    app.init();
    window.__app = app;
}
