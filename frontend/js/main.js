/**
 * Master Application Orchestrator
 * Restored to original clean dynamic swarm architecture
 */

import { sound } from './audio.js';
import { CursorSwarm } from './cursors.js';
import { TechnicalTypingEngine } from './typing.js';
import { CyberTerminal } from './terminal.js';

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
        // Check Backend daemon status
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
                submitBtn.innerHTML = '<span>TRANSMITTING PAYLOAD...</span>';
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
                } catch (err) {
                    // Backend offline or preview mode - graceful local fallback
                }

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
window.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    window.__app = app;
});
