import { NarrationCue } from '../film/timeline';

export interface NarrationScheduleDecision {
  shouldStopCurrent: boolean;
  cueToStart: NarrationCue | null;
}

export interface NarrationScheduleInput {
  currentTime: number;
  lastTime: number;
  isPlaying: boolean;
  isMuted: boolean;
  narrationEnabled: boolean;
  isCurrentlySpeaking: boolean;
  activeCueId: string | null;
  lastTriggeredCueId: string | null;
  cues: NarrationCue[];
  knownDurationSec?: number | null;
}

/**
 * Pure decision function enforcing two invariants:
 * 1. Strictly at most ONE narration clip can ever play at a time.
 * 2. A cue only starts if it has not already been triggered in this playback pass
 *    and will not overrun past the cue's scene window.
 */
export function evaluateNarrationSchedule(
  input: NarrationScheduleInput,
): NarrationScheduleDecision {
  const {
    currentTime,
    lastTime,
    isPlaying,
    isMuted,
    narrationEnabled,
    isCurrentlySpeaking,
    activeCueId,
    lastTriggeredCueId,
    cues,
    knownDurationSec,
  } = input;

  if (!isPlaying || isMuted || !narrationEnabled) {
    return {
      shouldStopCurrent: isCurrentlySpeaking,
      cueToStart: null,
    };
  }

  // Detect scrubber seek or abrupt timeline jump
  const jumped = currentTime < lastTime - 0.15 || currentTime > lastTime + 1.25;
  if (jumped && isCurrentlySpeaking) {
    return {
      shouldStopCurrent: true,
      cueToStart: null,
    };
  }

  // Never overlap an actively speaking narration clip
  if (isCurrentlySpeaking || activeCueId !== null) {
    return {
      shouldStopCurrent: false,
      cueToStart: null,
    };
  }

  const activeCue = cues.find(
    (c) => currentTime >= c.start && currentTime <= c.end,
  );

  if (!activeCue || activeCue.id === lastTriggeredCueId) {
    return {
      shouldStopCurrent: false,
      cueToStart: null,
    };
  }

  // If user scrubbed late into a cue window, skip starting a clip that would
  // spill into the next scene instead of starting late and getting cut off.
  const remainingWindow = activeCue.end - currentTime;
  const requiredMinRemaining =
    knownDurationSec && knownDurationSec > 0
      ? Math.max(1.5, knownDurationSec - 0.6)
      : Math.max(2.0, (activeCue.end - activeCue.start) * 0.65);

  if (currentTime > activeCue.start + 1.4 && remainingWindow < requiredMinRemaining) {
    return {
      shouldStopCurrent: false,
      cueToStart: null,
    };
  }

  return {
    shouldStopCurrent: false,
    cueToStart: activeCue,
  };
}

export interface SpokenNarrationState {
  cueId: string;
  text: string;
}

/**
 * Ensures displayed narration captions match the narrator's audible voice 1:1:
 * captions appear only while a spoken cue is actively playing (not during silence,
 * muted playback, disabled narration, or ungenerated cues).
 */
export function resolveCaptionForPlayback(
  spoken: SpokenNarrationState | null,
  isPlaying: boolean,
  isMuted: boolean,
  narrationEnabled: boolean,
): SpokenNarrationState | null {
  if (!isPlaying || isMuted || !narrationEnabled || !spoken) {
    return null;
  }
  return spoken;
}
