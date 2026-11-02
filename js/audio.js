/**
 * Web Audio API Sound Synthesizer for High-Tech Portfolio
 * Zero external audio assets needed; all effects synthesized on-the-fly.
 */
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

    // High-tech mechanical keystroke click
    playKeystroke(pitchVariation = 1) {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            
            // Transient click (click noise burst)
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
        } catch (e) {
            // Audio context safely catches errors
        }
    }

    // High velocity cursor whoosh / laser sweep
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

    // Cipher digital chirp when letters decrypt
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

    // Target lock sound when cursors converge
    playConvergence() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            
            // Dual tone lock chime
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

    // Success / chord complete
    playCompletion() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const chord = [440, 554.37, 659.25, 880]; // A Major 7th shimmer
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

    // UI click
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

export const sound = new SoundEngine();

