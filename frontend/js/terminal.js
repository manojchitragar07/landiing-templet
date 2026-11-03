/**
 * Interactive Cyber Terminal Console
 * Allows users to type commands like `help`, `skills`, `projects`, `contact`, `hire`, `clear`, `matrix`
 */

import { sound } from './audio.js';

export class CyberTerminal {
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
GitHub:     <a href="https://github.com" target="_blank" class="text-neon-cyan underline">github.com/manojchitragar</a>
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

        // Initial welcome message
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

        // Check local command first
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
        } catch (e) {
            // Daemon offline, continue to fallback
        }

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

