/**
 * Autonomous Collaborative Cursor Swarm Engine
 * Original Dynamic Speed-Ramping & Swarm Architecture
 * Features:
 * - Exponential speed-ramping physics with wide swooping curves
 * - Real-time convergence & collaborative typing orchestration
 * - Wide fluid orbit during typing (never clumping or blocking the text)
 * - Monochromatic luminous glowing pointers with delicate web lines
 * - Smooth post-intro ambient roaming & user mouse interactivity
 */

import { sound } from './audio.js';

export class CursorSwarm {
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
        this.rampDuration = 3000; // ms for initial speed ramp
        this.convergenceDuration = 900; // ms to brake and assemble

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
                // Wide, generous orbit radii to prevent any crowding around the text
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

            // High-speed swooping arcs across the entire screen
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
                    // Fluid, wide flock formation around hero area (no tight clumping)
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
                    // Lead cursor precisely tracks the active caret
                    const destX = this.caretPoint.x + 4;
                    const destY = this.caretPoint.y + 12;
                    c.x += (destX - c.x) * 16 * dt;
                    c.y += (destY - c.y) * 16 * dt;
                } else {
                    // Peer cursors dynamically orbit around the hero container in a wide, fluid perimeter
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

            // Smooth free ambient roaming & mouse interaction
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

        // Draw delicate constellation web lines connecting nearby nodes
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
