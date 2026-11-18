export type SceneId =
  | 'opening'
  | 'idea'
  | 'reveal'
  | 'voice'
  | 'intelligence'
  | 'assistant'
  | 'future'
  | 'finale';

export type MascotMood = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface FilmScene {
  id: SceneId;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  start: number;
  end: number;
  headline?: string;
}

export interface NarrationCue {
  id: string;
  sceneId: SceneId;
  start: number;
  end: number;
  text: string;
  rate?: number;
}

export interface SoundCue {
  id: string;
  time: number;
  kind: 'chime' | 'glass-expand' | 'soft-click' | 'card-float' | 'climax-swell';
}

export const FILM_DURATION = 88; // 88 seconds (within 75-90s specification)

export const FILM_SCENES: FilmScene[] = [
  {
    id: 'opening',
    number: '01',
    title: 'The Opening',
    shortTitle: 'The Opening',
    subtitle: 'Studio reveal & KYRIX mark',
    start: 0,
    end: 8,
    headline: 'Meet KYRIX.',
  },
  {
    id: 'idea',
    number: '02',
    title: 'The Idea',
    shortTitle: 'The Idea',
    subtitle: 'From busy desktop to calm focus',
    start: 8,
    end: 17,
    headline: 'Your computer should understand you.',
  },
  {
    id: 'reveal',
    number: '03',
    title: 'The Reveal',
    shortTitle: 'The Reveal',
    subtitle: 'Notch expansion & mascot states',
    start: 17,
    end: 27,
  },
  {
    id: 'voice',
    number: '04',
    title: 'Voice & Captions',
    shortTitle: 'Voice',
    subtitle: 'Live listening notch & captions',
    start: 27,
    end: 38,
    headline: 'Just speak. KYRIX understands.',
  },
  {
    id: 'intelligence',
    number: '05',
    title: 'Intelligence in Action',
    shortTitle: 'Intelligence',
    subtitle: 'Apps, screen lasso & web cards',
    start: 38,
    end: 52,
  },
  {
    id: 'assistant',
    number: '06',
    title: 'Your Personal Assistant',
    shortTitle: 'Assistant',
    subtitle: 'Today dashboard, timer & tasks',
    start: 52,
    end: 64,
    headline: 'More than an assistant. A smarter way to work.',
  },
  {
    id: 'future',
    number: '07',
    title: 'Customizable Style',
    shortTitle: 'Customize',
    subtitle: 'Live theme styling & collapse',
    start: 64,
    end: 76,
    headline: 'Your computer. Your intelligence. Your way.',
  },
  {
    id: 'finale',
    number: '08',
    title: 'Final Reveal',
    shortTitle: 'Final Reveal',
    subtitle: 'KYRIX desktop agent',
    start: 76,
    end: 88,
    headline: 'A Customizable Real-Time AI Agent.',
  },
];

export const NARRATION_CUES: NarrationCue[] = [
  {
    id: 'n-01',
    sceneId: 'opening',
    start: 1.4,
    end: 7.0,
    text: 'Meet KYRIX. A new presence on your desktop.',
  },
  {
    id: 'n-02',
    sceneId: 'idea',
    start: 8.6,
    end: 16.0,
    text: 'With endless open windows, your computer should simply understand you.',
  },
  {
    id: 'n-03',
    sceneId: 'reveal',
    start: 17.45,
    end: 26.4,
    text: 'Docked quietly at the top edge, KYRIX opens when called—listening, thinking, and responding.',
  },
  {
    id: 'n-04',
    sceneId: 'voice',
    start: 27.6,
    end: 36.8,
    text: 'Speak naturally with live captions and multilingual speech. KYRIX keeps every thread within reach.',
  },
  {
    id: 'n-05',
    sceneId: 'intelligence',
    start: 38.6,
    end: 50.8,
    text: 'Launch applications, capture what is on your screen, and explore visual search results.',
  },
  {
    id: 'n-06',
    sceneId: 'assistant',
    start: 52.6,
    end: 62.8,
    text: 'Your schedule, focus timer, and tasks—organized in one calm workspace.',
  },
  {
    id: 'n-07',
    sceneId: 'future',
    start: 64.6,
    end: 74.8,
    text: 'Customize every colour, glass surface, and voice wave—then tuck it neatly out of sight.',
  },
  {
    id: 'n-08',
    sceneId: 'finale',
    start: 77.0,
    end: 84.8,
    text: 'KYRIX. A customizable, real-time AI agent.',
  },
];

// Positioned strictly in silent breathing spaces between narration cues (never overlapping speech)
export const SOUND_CUES: SoundCue[] = [
  { id: 's-orb', time: 0.45, kind: 'chime' },
  { id: 's-simplify', time: 7.45, kind: 'soft-click' },
  { id: 's-expand', time: 16.55, kind: 'glass-expand' },
  { id: 's-voice', time: 26.85, kind: 'chime' },
  { id: 's-app', time: 37.45, kind: 'soft-click' },
  { id: 's-search', time: 51.45, kind: 'glass-expand' },
  { id: 's-cards', time: 63.45, kind: 'card-float' },
  { id: 's-climax', time: 75.45, kind: 'climax-swell' },
  { id: 's-end', time: 85.45, kind: 'chime' },
];

/**
 * Checks whether a given timestamp sits cleanly outside active narration windows
 * (with optional margin seconds before narration starts).
 */
export function isSoundCueClearOfNarration(
  time: number,
  cues: NarrationCue[] = NARRATION_CUES,
  marginBeforeNarration = 0.5,
): boolean {
  return !cues.some(
    (c) => time >= c.start - marginBeforeNarration && time <= c.end,
  );
}

/**
 * Computes subtle background music gain target (0..1) with automatic vocal ducking
 * so the ambient bed cushions scenes softly without ever masking spoken narration.
 */
export function getMusicDuckLevel(
  time: number,
  isSpeechPlaying: boolean,
  cues: NarrationCue[] = NARRATION_CUES,
): number {
  const inNarrationWindow = cues.some((c) => time >= c.start - 0.2 && time <= c.end + 0.15);
  if (isSpeechPlaying || inNarrationWindow) {
    return 0.032; // Gentle barely-there vocal cushion during speech
  }
  return 0.14; // Subtle warm ambient bloom in silent breathing gaps
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

export function easeOutQuart(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 4);
}

export function easeOutExpo(t: number): number {
  const x = clamp01(t);
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeInOutQuart(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

/**
 * Critically damped studio UI spring settle: crisp initial impulse with smooth settling tail.
 */
export function springSettle(t: number): number {
  const x = clamp01(t);
  if (x === 0) return 0;
  if (x === 1) return 1;
  const raw = 1 - Math.exp(-8.5 * x) * Math.cos(6.2 * x);
  const norm = 1 - Math.exp(-8.5) * Math.cos(6.2);
  return clamp01(raw / norm);
}

export function rangeProgress(time: number, start: number, end: number): number {
  if (end <= start) return time >= end ? 1 : 0;
  return clamp01((time - start) / (end - start));
}

export function getSceneAtTime(time: number): FilmScene {
  const clamped = Math.max(0, Math.min(FILM_DURATION, time));
  for (let i = 0; i < FILM_SCENES.length; i++) {
    const scene = FILM_SCENES[i];
    if (clamped >= scene.start && clamped < scene.end) {
      return scene;
    }
  }
  return FILM_SCENES[FILM_SCENES.length - 1];
}

export function getSceneProgress(time: number, scene: FilmScene): number {
  return rangeProgress(time, scene.start, scene.end);
}

export interface SceneRenderLayer {
  scene: FilmScene;
  opacity: number;
}

/**
 * Returns active scene layer(s) with clean 0.4s studio crossfades at scene transitions.
 */
export function getSceneLayersAtTime(time: number, fadeWindow = 0.42): SceneRenderLayer[] {
  const clamped = Math.max(0, Math.min(FILM_DURATION, time));
  const current = getSceneAtTime(clamped);
  const idx = FILM_SCENES.findIndex((s) => s.id === current.id);

  if (idx > 0) {
    const prev = FILM_SCENES[idx - 1];
    const into = clamped - current.start;
    if (into >= 0 && into < fadeWindow) {
      const alpha = easeInOutCubic(into / fadeWindow);
      return [
        { scene: prev, opacity: 1 - alpha },
        { scene: current, opacity: alpha },
      ];
    }
  }

  return [{ scene: current, opacity: 1 }];
}

export function getActiveCaptionAtTime(time: number): NarrationCue | null {
  for (let i = 0; i < NARRATION_CUES.length; i++) {
    const cue = NARRATION_CUES[i];
    if (time >= cue.start && time <= cue.end) {
      return cue;
    }
  }
  return null;
}

export function getMascotMoodAtTime(time: number): MascotMood {
  // Scene 03 (17-27s): Listening -> Thinking -> Speaking
  if (time >= 17 && time < 27) {
    if (time < 21.2) return 'listening';
    if (time < 24.0) return 'thinking';
    return 'speaking';
  }
  // Scene 04 (27-38s): Listening -> Thinking -> Speaking
  if (time >= 27 && time < 38) {
    if (time < 30.8) return 'listening';
    if (time < 32.0) return 'thinking';
    return 'speaking';
  }
  // Scene 05 (38-52s)
  if (time >= 38 && time < 52) {
    if (time < 42.4) return 'idle';
    if (time < 46.4) return 'thinking';
    return 'speaking';
  }
  // Scene 06 (52-64s)
  if (time >= 52 && time < 64) {
    return time < 59 ? 'speaking' : 'idle';
  }
  return 'idle';
}

export type Scene05Beat = 'apps' | 'screen-awareness' | 'web-results';

export interface ThemeAccentPreset {
  name: string;
  primary: string;
  secondary: string;
  glow: string;
}

export const THEME_ACCENT_PRESETS: ThemeAccentPreset[] = [
  {
    name: 'Coral',
    primary: '#FF6B5B',
    secondary: '#FF944D',
    glow: 'rgba(255, 107, 91, 0.24)',
  },
  {
    name: 'Mint',
    primary: '#34D399',
    secondary: '#22D3EE',
    glow: 'rgba(52, 211, 153, 0.22)',
  },
  {
    name: 'Violet',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    glow: 'rgba(139, 92, 246, 0.24)',
  },
  {
    name: 'Cyan',
    primary: '#22D3EE',
    secondary: '#38BDF8',
    glow: 'rgba(34, 211, 238, 0.24)',
  },
];

export function getScene05BeatAtTime(time: number): Scene05Beat {
  if (time < 42.4) return 'apps';
  if (time < 46.4) return 'screen-awareness';
  return 'web-results';
}

export function getThemeAccentAtTime(time: number): ThemeAccentPreset {
  if (time < 64) return THEME_ACCENT_PRESETS[0];
  const elapsed = Math.max(0, time - 64);
  const idx = Math.min(THEME_ACCENT_PRESETS.length - 1, Math.floor(elapsed / 2.2));
  return THEME_ACCENT_PRESETS[idx];
}

export function formatTimecode(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
