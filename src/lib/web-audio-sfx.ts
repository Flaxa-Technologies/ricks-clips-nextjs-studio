'use client';

/**
 * Lightweight Web Audio API Procedural Foley Synthesizer
 * Triggers diegetic sound effects at specific frames during playback in Next.js
 */
class RicksFoleyEngine {
  private ctx: AudioContext | null = null;
  private lastTriggeredFrame = -1;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public triggerFrameSFX(frame: number, muted: boolean) {
    if (muted || frame === this.lastTriggeredFrame) return;
    this.lastTriggeredFrame = frame;

    const ctx = this.ensureContext();
    if (!ctx) return;

    // 1. Metallic Hacksaw Scrape on Beat 1 forward strokes
    if (frame < 58 && frame % 10 === 2) {
      this.playSawScrape(ctx);
    }

    // 2. Whip-pan whoosh at start of Beat 2 (f60)
    if (frame === 60 || frame === 120 || frame === 250) {
      this.playWhoosh(ctx, frame === 250 ? 0.55 : 0.35);
    }

    // 3. Locomotive Whistle & Doppler Roar (f95)
    if (frame === 95) {
      this.playTrainWhistle(ctx);
    }

    // 4. Cash Register Chime on Beat 5 Tycoon reveal (f284)
    if (frame === 284) {
      this.playCashChime(ctx);
    }
  }

  private playSawScrape(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1450, now);
    osc.frequency.exponentialRampToValueAtTime(2300, now + 0.14);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  private playWhoosh(ctx: AudioContext, duration = 0.35) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + duration);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playTrainWhistle(ctx: AudioContext) {
    const now = ctx.currentTime;
    [587.33, 739.99, 880].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 0.92, now + 0.48);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    });
  }

  private playCashChime(ctx: AudioContext) {
    const now = ctx.currentTime;
    [1318.5, 1760, 2637].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.06, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.36);
    });
  }
}

export const foleyEngine = new RicksFoleyEngine();
