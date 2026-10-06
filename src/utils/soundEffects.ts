/**
 * Web Audio API synthesizer for instant tactile sound feedback and ambient lab background music
 * Zero external audio files needed; 100% offline compatible and reliable.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private musicPlaying: boolean = false;
  private musicInterval: number | null = null;
  private masterMusicGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isMusicActive(): boolean {
    return this.musicPlaying;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted && this.musicPlaying) {
      this.stopBackgroundMusic();
    }
    return this.muted;
  }

  public toggleMusic(): boolean {
    if (this.musicPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  public startBackgroundMusic(): void {
    if (this.muted || this.musicPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.musicPlaying = true;

    // Create master music gain
    this.masterMusicGain = ctx.createGain();
    this.masterMusicGain.gain.setValueAtTime(0.04, ctx.currentTime);
    this.masterMusicGain.connect(ctx.destination);

    // Ambient chords notes in Hz (Pentatonic relaxing sci-fi lab progression: Cmaj9, Fmaj7, Am9, Gsus4)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C, E, G, B
      [349.23, 440.00, 523.25, 659.25], // F, A, C, E
      [220.00, 261.63, 329.63, 392.00], // A, C, E, G
      [196.00, 261.63, 293.66, 392.00], // G, C, D, G
    ];

    let chordIndex = 0;

    const playAmbientChord = () => {
      if (!this.musicPlaying || !this.ctx || !this.masterMusicGain) return;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      const now = this.ctx.currentTime;
      currentChord.forEach((freq, idx) => {
        try {
          const osc = this.ctx!.createOscillator();
          const noteGain = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();

          // Warm pad sound
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);

          noteGain.gain.setValueAtTime(0.0001, now + idx * 0.15);
          noteGain.gain.linearRampToValueAtTime(0.025, now + idx * 0.15 + 1.2);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 4.2);

          osc.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(this.masterMusicGain!);

          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 4.5);
        } catch {}
      });
    };

    // Play immediately and repeat softly every 4 seconds
    playAmbientChord();
    this.musicInterval = window.setInterval(playAmbientChord, 4200);
  }

  public stopBackgroundMusic(): void {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.masterMusicGain && this.ctx) {
      try {
        this.masterMusicGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {}
    }
  }

  public playTick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  public playSuccess(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.07, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {}
  }

  public playError(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.3);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playSiren(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.25);
      osc.frequency.linearRampToValueAtTime(600, now + 0.5);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch {}
  }
}

export const sound = new SoundController();
