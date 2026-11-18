import { NarrationCue, SoundCue, getMusicDuckLevel } from '../film/timeline';
import {
  SpokenNarrationState,
  evaluateNarrationSchedule,
} from './narrationScheduler';

// Frequencies for C major 9 / A minor 9 / F major 7 cinematic progression
const CHORD_PROGRESSIONS: Record<string, number[]> = {
  opening: [130.81, 196.0, 246.94, 293.66, 329.63], // Cmaj9
  idea: [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9
  reveal: [220.0, 261.63, 329.63, 392.0, 493.88], // Am9
  voice: [196.0, 246.94, 293.66, 349.23, 440.0], // G6/9
  intelligence: [130.81, 196.0, 261.63, 329.63, 392.0], // Cmaj
  assistant: [174.61, 220.0, 261.63, 329.63, 440.0], // Fmaj7/13
  future: [220.0, 261.63, 329.63, 493.88, 523.25], // Am9 high
  finale: [130.81, 196.0, 246.94, 329.63, 392.0], // Cmaj9 warm resolve
};

const BASS_ROOTS: Record<string, number> = {
  opening: 65.41, // C2
  idea: 87.31, // F2
  reveal: 55.0, // A1
  voice: 98.0, // G2
  intelligence: 65.41, // C2
  assistant: 87.31, // F2
  future: 55.0, // A1
  finale: 65.41, // C2
};

interface CachedNarrationAudio {
  url: string;
  durationSec: number;
}

function decodeBase64WavToObjectUrl(base64Audio: string): CachedNarrationAudio {
  const binary = atob(base64Audio);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  let durationSec = 0;
  if (bytes.byteLength > 44) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const byteRate = view.getUint32(28, true);
    if (byteRate > 0) {
      durationSec = (bytes.byteLength - 44) / byteRate;
    }
  }

  const blob = new Blob([bytes], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  return { url, durationSec };
}

class KyrixSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private lastStep = -1;
  private lastTriggeredCueId: string | null = null;
  private activeCueId: string | null = null;
  private triggeredSoundIds = new Set<string>();
  private lastTime = 0;

  private audioCache = new Map<string, CachedNarrationAudio>();
  private inFlightCacheFetches = new Map<string, Promise<CachedNarrationAudio | null>>();
  private preloadStarted = false;

  private currentAudio: HTMLAudioElement | null = null;
  private speechInFlight = false;
  private speechGeneration = 0;
  private activeFetchController: AbortController | null = null;
  private muted = false;
  private speakingState: SpokenNarrationState | null = null;
  private narrationListeners = new Set<(state: SpokenNarrationState | null) => void>();

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      try {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.muted ? 0 : 1;
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.14;
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.5;
        this.sfxGain.connect(this.masterGain);
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    this.ensureContext();
  }

  public isNarrationActive(): boolean {
    return this.speechInFlight || this.currentAudio !== null || this.activeCueId !== null;
  }

  public getActiveNarrationCueId(): string | null {
    return this.activeCueId;
  }

  public getSpeakingState(): SpokenNarrationState | null {
    return this.speakingState;
  }

  public subscribeSpeakingState(
    listener: (state: SpokenNarrationState | null) => void,
  ): () => void {
    this.narrationListeners.add(listener);
    listener(this.speakingState);
    return () => {
      this.narrationListeners.delete(listener);
    };
  }

  private setSpeakingState(next: SpokenNarrationState | null): void {
    if (
      this.speakingState?.cueId === next?.cueId &&
      this.speakingState?.text === next?.text
    ) {
      return;
    }
    this.speakingState = next;
    for (const listener of this.narrationListeners) {
      listener(next);
    }
  }

  public resetTracking(time = 0): void {
    this.lastStep = -1;
    this.lastTriggeredCueId = null;
    this.triggeredSoundIds.clear();
    this.lastTime = time;
    this.stopSpeech();
  }

  public stopSpeech(): void {
    this.speechGeneration += 1;
    this.speechInFlight = false;
    this.activeCueId = null;
    this.setSpeakingState(null);

    if (this.activeFetchController) {
      this.activeFetchController.abort();
      this.activeFetchController = null;
    }

    if (this.currentAudio) {
      const audio = this.currentAudio;
      this.currentAudio = null;
      audio.onplaying = null;
      audio.onpause = null;
      audio.onended = null;
      audio.onerror = null;
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute('src');
        audio.load();
      } catch {
        // Ignore media teardown errors
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore speech cancellation errors in sandboxed browsers
      }
    }
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.06);
    }
    if (this.currentAudio) {
      this.currentAudio.muted = muted;
    }
    if (muted) {
      this.stopSpeech();
    }
  }

  private quotaExhausted = false;

  /**
   * Sequentially warms the Gemini TTS cache so every scene cue plays immediately
   * at its exact cue.start timestamp with zero network fetch delay.
   */
  public preloadNarration(cues: NarrationCue[]): void {
    if (typeof window === 'undefined' || this.preloadStarted) return;
    this.preloadStarted = true;

    void (async () => {
      for (const cue of cues) {
        if (this.quotaExhausted) break;
        if (!this.audioCache.has(cue.text)) {
          await this.fetchAndCacheAudio(cue.text);
        }
      }
    })();
  }

  private async fetchAndCacheAudio(
    text: string,
    signal?: AbortSignal,
  ): Promise<CachedNarrationAudio | null> {
    const cached = this.audioCache.get(text);
    if (cached) return cached;

    const existing = this.inFlightCacheFetches.get(text);
    if (existing) {
      return existing;
    }

    const promise = (async (): Promise<CachedNarrationAudio | null> => {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voiceName: 'Zephyr' }),
          signal,
        });
        if (!res.ok) {
          if (res.status === 429) {
            this.quotaExhausted = true;
          }
          return null;
        }
        const data = (await res.json()) as { audio?: string };
        if (!data?.audio) return null;

        const decoded = decodeBase64WavToObjectUrl(data.audio);
        this.audioCache.set(text, decoded);
        return decoded;
      } catch {
        return null;
      } finally {
        this.inFlightCacheFetches.delete(text);
      }
    })();

    this.inFlightCacheFetches.set(text, promise);
    return promise;
  }

  private getSceneKey(t: number): string {
    if (t < 8) return 'opening';
    if (t < 17) return 'idea';
    if (t < 27) return 'reveal';
    if (t < 38) return 'voice';
    if (t < 52) return 'intelligence';
    if (t < 64) return 'assistant';
    if (t < 76) return 'future';
    return 'finale';
  }

  public update(
    currentTime: number,
    isPlaying: boolean,
    isMuted: boolean,
    narrationEnabled: boolean,
    soundCues: SoundCue[],
    narrationCues: NarrationCue[],
  ): void {
    this.muted = isMuted;

    if (!isPlaying || isMuted) {
      if (this.isNarrationActive()) {
        this.stopSpeech();
      }
      this.lastTime = currentTime;
      return;
    }

    const ctx = this.ensureContext();

    // Detect seek backwards or timeline jump
    const jumped =
      currentTime < this.lastTime - 0.15 || currentTime > this.lastTime + 1.25;
    if (jumped) {
      this.triggeredSoundIds.clear();
      this.lastTriggeredCueId = null;
      this.stopSpeech();
    }

    // Trigger subtle SFX cues crossed in silent gaps
    for (const cue of soundCues) {
      if (
        !this.triggeredSoundIds.has(cue.id) &&
        currentTime >= cue.time &&
        currentTime <= cue.time + 0.45
      ) {
        this.triggeredSoundIds.add(cue.id);
        if (ctx) this.playSoundEffect(cue.kind);
      }
    }

    // Strict single-narration scheduling
    const candidateCue = narrationCues.find(
      (c) => currentTime >= c.start && currentTime <= c.end,
    );
    const knownDuration = candidateCue
      ? this.audioCache.get(candidateCue.text)?.durationSec ?? null
      : null;

    const decision = evaluateNarrationSchedule({
      currentTime,
      lastTime: this.lastTime,
      isPlaying,
      isMuted,
      narrationEnabled,
      isCurrentlySpeaking: this.isNarrationActive(),
      activeCueId: this.activeCueId,
      lastTriggeredCueId: this.lastTriggeredCueId,
      cues: narrationCues,
      knownDurationSec: knownDuration,
    });

    if (decision.shouldStopCurrent) {
      if (!narrationEnabled) {
        this.lastTriggeredCueId = null;
      }
      this.stopSpeech();
    }

    if (decision.cueToStart) {
      this.lastTriggeredCueId = decision.cueToStart.id;
      void this.speakCue(decision.cueToStart);
    }

    // Smoothly duck subtle background music under speech
    if (ctx && this.musicGain) {
      const duckTarget = getMusicDuckLevel(
        currentTime,
        this.isNarrationActive(),
        narrationCues,
      );
      this.musicGain.gain.setTargetAtTime(duckTarget, ctx.currentTime, 0.18);
    }

    // Musical sequencer at 108 BPM (eighth-note steps)
    if (ctx && this.musicGain) {
      const stepDuration = 60 / 108 / 2; // ~0.277s per 8th note
      const stepIndex = Math.floor(currentTime / stepDuration);
      if (stepIndex !== this.lastStep) {
        this.lastStep = stepIndex;
        this.playMusicStep(currentTime, stepIndex);
      }
    }

    this.lastTime = currentTime;
  }

  private async speakCue(cue: NarrationCue): Promise<void> {
    if (typeof window === 'undefined') return;

    // Cancel any residual audio or fetch before starting the single active narration
    this.stopSpeech();

    const gen = this.speechGeneration;
    this.speechInFlight = true;
    this.activeCueId = cue.id;

    const controller = new AbortController();
    this.activeFetchController = controller;

    try {
      const cached =
        this.audioCache.get(cue.text) ??
        (await this.fetchAndCacheAudio(cue.text, controller.signal));

      if (this.activeFetchController === controller) {
        this.activeFetchController = null;
      }

      // Abort if user paused, muted, seeked, or a newer cue took ownership
      if (gen !== this.speechGeneration || this.muted || !cached) {
        if (gen === this.speechGeneration) {
          this.speechInFlight = false;
          this.activeCueId = null;
        }
        return;
      }

      const audio = new Audio(cached.url);
      audio.volume = 0.96;
      audio.muted = this.muted;
      this.currentAudio = audio;
      this.speechInFlight = false;

      const clearIfOwner = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
        if (gen === this.speechGeneration) {
          this.activeCueId = null;
          this.setSpeakingState(null);
        }
      };

      audio.onplaying = () => {
        if (gen === this.speechGeneration && this.currentAudio === audio && !this.muted) {
          this.setSpeakingState({ cueId: cue.id, text: cue.text });
        }
      };
      audio.onpause = () => {
        if (gen === this.speechGeneration && audio.ended === false) {
          this.setSpeakingState(null);
        }
      };
      audio.onended = clearIfOwner;
      audio.onerror = clearIfOwner;

      await audio.play();
      if (
        gen === this.speechGeneration &&
        this.currentAudio === audio &&
        !this.muted &&
        !audio.paused &&
        !audio.ended
      ) {
        this.setSpeakingState({ cueId: cue.id, text: cue.text });
      }
    } catch {
      if (gen === this.speechGeneration) {
        this.speechInFlight = false;
        this.activeCueId = null;
        this.currentAudio = null;
        this.setSpeakingState(null);
      }
    }
  }

  private playMusicStep(t: number, step: number): void {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    const scene = this.getSceneKey(t);
    const chord = CHORD_PROGRESSIONS[scene];
    const bassFreq = BASS_ROOTS[scene];

    // Master fade out in finale (82s - 88s)
    const endFade = t > 82 ? Math.max(0.02, 1 - (t - 82) / 6) : 1;

    // 1. Warm ambient pad every 8 steps (bar downbeat)
    if (step % 8 === 0) {
      const padNotes = scene === 'future' ? chord : chord.slice(0, 4);
      padNotes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const filter = this.ctx!.createBiquadFilter();
        const gain = this.ctx!.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(scene === 'future' ? 1600 : 880, now);

        const peak = (scene === 'future' ? 0.12 : 0.085) * endFade;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + 0.55);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain!);
        osc.start(now);
        osc.stop(now + 2.45);
      });

      // Sub-bass anchor
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(bassFreq, now);
      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.exponentialRampToValueAtTime(0.24 * endFade, now + 0.18);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
      subOsc.connect(subGain);
      subGain.connect(this.musicGain);
      subOsc.start(now);
      subOsc.stop(now + 2.25);
    }

    // 2. Gentle plucked arpeggio from Scene 02 through Scene 07
    if (t >= 8 && t < 78) {
      const noteFreq =
        chord[step % chord.length] * (scene === 'future' && step % 4 === 0 ? 2 : 1);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);

      const arpVol = (scene === 'future' ? 0.11 : 0.08) * endFade;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(arpVol, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + 0.4);
    }

    // 3. Soft rhythmic kick & brushed hi-hat from Scene 03 through Scene 07
    if (t >= 17 && t < 75.5) {
      if (step % 4 === 0 || (scene === 'intelligence' && step % 8 === 6)) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(100, now);
        kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.12);
        kickGain.gain.setValueAtTime(0.22 * endFade, now);
        kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.24);
      }

      if (step % 2 === 1 && t >= 27) {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(6500, now);
        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime((scene === 'future' ? 0.08 : 0.05) * endFade, now);
        noise.connect(hp);
        hp.connect(hatGain);
        hatGain.connect(this.musicGain);
        noise.start(now);
      }
    }
  }

  public playSoundEffect(kind: SoundCue['kind']): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    if (kind === 'chime') {
      [523.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.0001, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.06, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.7);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.75);
      });
    } else if (kind === 'glass-expand') {
      [392.0, 587.33, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * 0.92, now + i * 0.03);
        osc.frequency.exponentialRampToValueAtTime(freq, now + i * 0.03 + 0.25);
        gain.gain.setValueAtTime(0.0001, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.045, now + i * 0.03 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.03 + 0.55);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.6);
      });
    } else if (kind === 'soft-click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.035);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (kind === 'card-float') {
      [659.25, 783.99, 987.77].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.0001, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.045, now + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.5);
      });
    } else if (kind === 'climax-swell') {
      [261.63, 392.0, 523.25, 659.25].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now);
        osc.stop(now + 2.15);
      });
    }
  }
}

export const soundEngine = new KyrixSoundEngine();
