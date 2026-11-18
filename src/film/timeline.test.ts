import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FILM_DURATION,
  FILM_SCENES,
  NARRATION_CUES,
  SOUND_CUES,
  THEME_ACCENT_PRESETS,
  clamp01,
  easeInOutCubic,
  easeInOutQuart,
  easeOutCubic,
  easeOutExpo,
  easeOutQuart,
  formatTimecode,
  getActiveCaptionAtTime,
  getMascotMoodAtTime,
  getMusicDuckLevel,
  getScene05BeatAtTime,
  getSceneAtTime,
  getSceneLayersAtTime,
  getSceneProgress,
  getThemeAccentAtTime,
  isSoundCueClearOfNarration,
  rangeProgress,
  springSettle,
} from './timeline';
import {
  evaluateNarrationSchedule,
  resolveCaptionForPlayback,
} from '../audio/narrationScheduler';

test('film duration is within 75-90s and scenes partition 0..FILM_DURATION cleanly', () => {
  assert.ok(FILM_DURATION >= 75 && FILM_DURATION <= 90);
  assert.equal(FILM_SCENES.length, 8);
  assert.equal(FILM_SCENES[0].start, 0);
  assert.equal(FILM_SCENES[FILM_SCENES.length - 1].end, FILM_DURATION);

  for (let i = 1; i < FILM_SCENES.length; i++) {
    assert.equal(
      FILM_SCENES[i].start,
      FILM_SCENES[i - 1].end,
      `Scene ${FILM_SCENES[i].id} should start where previous ended`,
    );
  }
});

test('getSceneAtTime returns expected scenes at boundary and mid-scene timestamps', () => {
  assert.equal(getSceneAtTime(0).id, 'opening');
  assert.equal(getSceneAtTime(7.9).id, 'opening');
  assert.equal(getSceneAtTime(8.0).id, 'idea');
  assert.equal(getSceneAtTime(17.5).id, 'reveal');
  assert.equal(getSceneAtTime(30).id, 'voice');
  assert.equal(getSceneAtTime(45).id, 'intelligence');
  assert.equal(getSceneAtTime(58).id, 'assistant');
  assert.equal(getSceneAtTime(70).id, 'future');
  assert.equal(getSceneAtTime(88).id, 'finale');
  assert.equal(getSceneAtTime(999).id, 'finale');
});

test('math and studio easing curves clamp and settle cleanly', () => {
  assert.equal(clamp01(-0.4), 0);
  assert.equal(clamp01(1.8), 1);
  assert.equal(clamp01(Number.NaN), 0);
  assert.equal(rangeProgress(10, 8, 12), 0.5);
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.ok(easeOutQuart(0.5) > 0.5);
  assert.ok(easeOutExpo(0.5) > 0.9);
  assert.equal(easeInOutCubic(0.5), 0.5);
  assert.equal(easeInOutQuart(0.5), 0.5);
  assert.equal(springSettle(0), 0);
  assert.equal(springSettle(1), 1);
  assert.ok(springSettle(0.5) > 0.8);
});

test('getSceneLayersAtTime provides smooth overlap during transition windows', () => {
  const midScene = getSceneLayersAtTime(12.0);
  assert.equal(midScene.length, 1);
  assert.equal(midScene[0].scene.id, 'idea');
  assert.equal(midScene[0].opacity, 1);

  const boundary = getSceneLayersAtTime(8.2);
  assert.equal(boundary.length, 2);
  assert.equal(boundary[0].scene.id, 'opening');
  assert.equal(boundary[1].scene.id, 'idea');
  assert.ok(Math.abs(boundary[0].opacity + boundary[1].opacity - 1) < 1e-6);
});

test('Scene 03 cycles mascot through listening, thinking, and speaking', () => {
  assert.equal(getMascotMoodAtTime(19), 'listening');
  assert.equal(getMascotMoodAtTime(22), 'thinking');
  assert.equal(getMascotMoodAtTime(25), 'speaking');
});

test('Scene 05 transitions cleanly across apps, screen-awareness, and web-results', () => {
  assert.equal(getScene05BeatAtTime(39.5), 'apps');
  assert.equal(getScene05BeatAtTime(44.0), 'screen-awareness');
  assert.equal(getScene05BeatAtTime(49.0), 'web-results');
});

test('Scene 07 cycles through customization theme accent presets', () => {
  assert.equal(getThemeAccentAtTime(10).name, THEME_ACCENT_PRESETS[0].name);
  assert.equal(getThemeAccentAtTime(64.5).name, 'Coral');
  assert.equal(getThemeAccentAtTime(66.5).name, 'Mint');
  assert.equal(getThemeAccentAtTime(69.0).name, 'Violet');
  assert.equal(getThemeAccentAtTime(71.5).name, 'Cyan');
});

test('captions and timecode formatting work accurately', () => {
  assert.equal(formatTimecode(0), '00:00');
  assert.equal(formatTimecode(88), '01:28');
  assert.equal(formatTimecode(65.9), '01:05');

  const openingCue = getActiveCaptionAtTime(3.0);
  assert.ok(openingCue !== null);
  assert.equal(openingCue.sceneId, 'opening');
  assert.equal(getActiveCaptionAtTime(0.2), null);
  assert.equal(NARRATION_CUES.length, 8);
});

test('getSceneProgress computes 0..1 progress within a scene', () => {
  const scene02 = FILM_SCENES[1];
  assert.equal(getSceneProgress(8, scene02), 0);
  assert.equal(getSceneProgress(12.5, scene02), 0.5);
  assert.equal(getSceneProgress(17, scene02), 1);
});

test('all SOUND_CUES occur strictly outside active NARRATION_CUES windows', () => {
  assert.ok(SOUND_CUES.length > 0);
  for (const cue of SOUND_CUES) {
    assert.equal(
      isSoundCueClearOfNarration(cue.time, NARRATION_CUES, 0.5),
      true,
      `Sound cue ${cue.id} at ${cue.time}s should not overlap or crowd narration`,
    );
  }
});

test('getMusicDuckLevel lowers background bed during narration and recovers in gaps', () => {
  const quietGap = getMusicDuckLevel(0.6, false, NARRATION_CUES);
  const duringCueWindow = getMusicDuckLevel(3.0, false, NARRATION_CUES);
  const whileAudioSpeaking = getMusicDuckLevel(0.6, true, NARRATION_CUES);

  assert.ok(duringCueWindow < quietGap);
  assert.ok(whileAudioSpeaking < quietGap);
  assert.equal(duringCueWindow, whileAudioSpeaking);
});

test('every NARRATION_CUE sits strictly within its scene with sequential gaps >= 1.0s', () => {
  for (let i = 0; i < NARRATION_CUES.length; i++) {
    const cue = NARRATION_CUES[i];
    const scene = FILM_SCENES.find((s) => s.id === cue.sceneId);
    assert.ok(scene, `Scene ${cue.sceneId} must exist for ${cue.id}`);
    assert.ok(
      cue.start >= scene.start + 0.4,
      `${cue.id} start (${cue.start}s) should leave >=0.4s post-cut buffer after ${scene.start}s`,
    );
    assert.ok(
      cue.end <= scene.end - 0.5,
      `${cue.id} end (${cue.end}s) should finish >=0.5s before scene end ${scene.end}s`,
    );
    assert.ok(cue.end > cue.start, `${cue.id} must have positive duration`);

    if (i > 0) {
      const prev = NARRATION_CUES[i - 1];
      assert.ok(
        cue.start - prev.end >= 1.0,
        `Gap between ${prev.id} (${prev.end}s) and ${cue.id} (${cue.start}s) must be >= 1.0s`,
      );
    }
  }
});

test('evaluateNarrationSchedule guarantees strictly one narration plays at a time', () => {
  const first = evaluateNarrationSchedule({
    currentTime: 1.5,
    lastTime: 1.48,
    isPlaying: true,
    isMuted: false,
    narrationEnabled: true,
    isCurrentlySpeaking: false,
    activeCueId: null,
    lastTriggeredCueId: null,
    cues: NARRATION_CUES,
    knownDurationSec: 5.0,
  });
  assert.equal(first.shouldStopCurrent, false);
  assert.equal(first.cueToStart?.id, 'n-01');

  // While n-01 is still speaking, no second cue can ever start
  const duringSpeech = evaluateNarrationSchedule({
    currentTime: 8.8,
    lastTime: 8.78,
    isPlaying: true,
    isMuted: false,
    narrationEnabled: true,
    isCurrentlySpeaking: true,
    activeCueId: 'n-01',
    lastTriggeredCueId: 'n-01',
    cues: NARRATION_CUES,
    knownDurationSec: 5.0,
  });
  assert.equal(duringSpeech.shouldStopCurrent, false);
  assert.equal(duringSpeech.cueToStart, null);

  // Toggling narration off immediately stops current narration
  const disabled = evaluateNarrationSchedule({
    currentTime: 2.5,
    lastTime: 2.48,
    isPlaying: true,
    isMuted: false,
    narrationEnabled: false,
    isCurrentlySpeaking: true,
    activeCueId: 'n-01',
    lastTriggeredCueId: 'n-01',
    cues: NARRATION_CUES,
  });
  assert.equal(disabled.shouldStopCurrent, true);
  assert.equal(disabled.cueToStart, null);

  // Scrubbing late into a cue window where audio would spill past scene end is skipped
  const lateSeek = evaluateNarrationSchedule({
    currentTime: 6.2,
    lastTime: 6.18,
    isPlaying: true,
    isMuted: false,
    narrationEnabled: true,
    isCurrentlySpeaking: false,
    activeCueId: null,
    lastTriggeredCueId: null,
    cues: NARRATION_CUES,
    knownDurationSec: 5.0,
  });
  assert.equal(lateSeek.cueToStart, null);
});

test('resolveCaptionForPlayback matches spoken narrator voice 1:1 and clears when silent', () => {
  const spoken = {
    cueId: 'n-01',
    text: 'Meet KYRIX. A new presence on your desktop.',
  };

  assert.deepEqual(resolveCaptionForPlayback(spoken, true, false, true), spoken);
  assert.equal(resolveCaptionForPlayback(null, true, false, true), null);
  assert.equal(resolveCaptionForPlayback(spoken, false, false, true), null);
  assert.equal(resolveCaptionForPlayback(spoken, true, true, true), null);
  assert.equal(resolveCaptionForPlayback(spoken, true, false, false), null);
});

