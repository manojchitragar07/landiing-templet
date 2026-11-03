/**
 * Technical Typing & Decryption Engine
 * Orchestrates letter-by-letter rendering, cipher glyph cycling,
 * coordinate tracking for cursor flocking, and particle bursts.
 */

import { sound } from './audio.js';

export class TechnicalTypingEngine {
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

        // Stage 1: Type Primary Name "Manoj Chitragar"
        await this.typeWithCipher(this.titleElement, primaryText, {
            speed: 85,
            cipherPasses: 3,
            isPrimary: true
        });

        await new Promise(r => setTimeout(r, 380));

        // Stage 2: Type Subtitle
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
