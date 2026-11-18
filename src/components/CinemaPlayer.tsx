import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Captions,
  Download,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import {
  SpokenNarrationState,
  resolveCaptionForPlayback,
} from '../audio/narrationScheduler';
import {
  FILM_DURATION,
  FILM_SCENES,
  NARRATION_CUES,
  SOUND_CUES,
  formatTimecode,
  getSceneAtTime,
  getSceneLayersAtTime,
} from '../film/timeline';
import { KyrixLogoMark, KyrixWordmark } from './KyrixBrand';
import { PresentationHeader, PresentationMode } from './PresentationHeader';
import { Scene01Opening } from './scenes/Scene01Opening';
import { Scene02Idea } from './scenes/Scene02Idea';
import { Scene03Reveal } from './scenes/Scene03Reveal';
import { Scene04Voice } from './scenes/Scene04Voice';
import { Scene05Intelligence } from './scenes/Scene05Intelligence';
import { Scene06Assistant } from './scenes/Scene06Assistant';
import { Scene07Future } from './scenes/Scene07Future';
import { Scene08Finale } from './scenes/Scene08Finale';

interface CinemaPlayerProps {
  autostart?: boolean;
  initialTime?: number;
  onChangeMode?: (mode: PresentationMode) => void;
}

export const CinemaPlayer: React.FC<CinemaPlayerProps> = ({
  autostart = false,
  initialTime = 0,
  onChangeMode,
}) => {
  const clampedInitial = Math.max(0, Math.min(FILM_DURATION, initialTime));
  const [currentTime, setCurrentTime] = useState<number>(clampedInitial);
  const [isPlaying, setIsPlaying] = useState<boolean>(autostart);
  const [hasStarted, setHasStarted] = useState<boolean>(autostart || clampedInitial > 0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [narrationEnabled, setNarrationEnabled] = useState<boolean>(true);
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('captions') === '0' || params.has('nocaptions')) {
      return false;
    }
    return true;
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [stageScale, setStageScale] = useState<number>(1);
  const [speakingNarration, setSpeakingNarration] = useState<SpokenNarrationState | null>(() =>
    soundEngine.getSpeakingState(),
  );

  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameMsRef = useRef<number | null>(null);
  const timeRef = useRef<number>(clampedInitial);
  const isMutedRef = useRef<boolean>(isMuted);
  const narrationEnabledRef = useRef<boolean>(narrationEnabled);

  const activeScene = getSceneAtTime(currentTime);
  const sceneLayers = getSceneLayersAtTime(currentTime);
  const activeCaption = resolveCaptionForPlayback(
    speakingNarration,
    isPlaying,
    isMuted,
    narrationEnabled,
  );

  // Proportional 1280x720 16:9 stage scaling for lossless framing on all viewports
  useEffect(() => {
    const el = stageContainerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setStageScale(width / 1280);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keep audio flags current for the 60fps loop without tearing down rAF
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    narrationEnabledRef.current = narrationEnabled;
  }, [narrationEnabled]);

  // Preload Gemini TTS narration clips and subscribe captions to live audible speech
  useEffect(() => {
    soundEngine.preloadNarration(NARRATION_CUES);
    return soundEngine.subscribeSpeakingState(setSpeakingNarration);
  }, []);

  // Track fullscreen status and clean up speech on unmount
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      soundEngine.stopSpeech();
    };
  }, []);

  // Main 60fps animation & audio clock
  useEffect(() => {
    if (!isPlaying) {
      soundEngine.stopSpeech();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameMsRef.current = null;
      return;
    }

    const tick = (nowMs: number) => {
      if (lastFrameMsRef.current === null) {
        lastFrameMsRef.current = nowMs;
      }
      const dt = Math.min(0.1, (nowMs - lastFrameMsRef.current) / 1000);
      lastFrameMsRef.current = nowMs;

      const nextTime = timeRef.current + dt;
      if (nextTime >= FILM_DURATION) {
        timeRef.current = FILM_DURATION;
        setCurrentTime(FILM_DURATION);
        setIsPlaying(false);
        soundEngine.stopSpeech();
        return;
      }

      timeRef.current = nextTime;
      setCurrentTime(nextTime);

      soundEngine.update(
        nextTime,
        true,
        isMutedRef.current,
        narrationEnabledRef.current,
        SOUND_CUES,
        NARRATION_CUES,
      );

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameMsRef.current = null;
    };
  }, [isPlaying]);

  const handleTogglePlay = useCallback(() => {
    soundEngine.unlock();
    soundEngine.preloadNarration(NARRATION_CUES);
    soundEngine.playSoundEffect('soft-click');
    if (timeRef.current >= FILM_DURATION - 0.05) {
      timeRef.current = 0;
      setCurrentTime(0);
      soundEngine.resetTracking(0);
      setHasStarted(true);
      setIsPlaying(true);
      return;
    }
    setHasStarted(true);
    setIsPlaying((prev) => {
      const next = !prev;
      if (!next) soundEngine.stopSpeech();
      return next;
    });
  }, []);

  const handleRestart = useCallback(() => {
    soundEngine.unlock();
    soundEngine.preloadNarration(NARRATION_CUES);
    soundEngine.playSoundEffect('soft-click');
    timeRef.current = 0;
    setCurrentTime(0);
    soundEngine.resetTracking(0);
    setHasStarted(true);
    setIsPlaying(true);
  }, []);

  const handleSeek = useCallback((targetTime: number, autoPlay = false) => {
    soundEngine.unlock();
    soundEngine.preloadNarration(NARRATION_CUES);
    soundEngine.playSoundEffect('soft-click');
    const clamped = Math.max(0, Math.min(FILM_DURATION, targetTime));
    timeRef.current = clamped;
    setCurrentTime(clamped);
    soundEngine.resetTracking(clamped);
    setHasStarted(true);
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    soundEngine.playSoundEffect('soft-click');
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    const container = stageContainerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      container.requestFullscreen?.().catch(() => {});
    }
  }, []);

  // Keyboard shortcuts for cinema playback
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement && e.target.type !== 'range') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      } else if (e.key === 'c' || e.key === 'C') {
        setCaptionsEnabled((v) => !v);
      } else if (e.key === 'ArrowRight') {
        handleSeek(timeRef.current + 5);
      } else if (e.key === 'ArrowLeft') {
        handleSeek(timeRef.current - 5);
      } else if (e.key >= '1' && e.key <= '8') {
        const scene = FILM_SCENES[Number(e.key) - 1];
        if (scene) handleSeek(scene.start + 0.2, true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSeek, handleToggleMute, handleTogglePlay]);

  const primaryLabel =
    currentTime >= FILM_DURATION - 0.1
      ? 'Replay Film'
      : isPlaying
        ? 'Pause Film'
        : hasStarted
          ? 'Resume Film'
          : 'Watch Film';

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0C10] text-[#FAF8F5]">
      <PresentationHeader
        mode="film"
        onChangeMode={onChangeMode ?? (() => {})}
        primaryLabel={primaryLabel}
        onPrimaryAction={handleTogglePlay}
      />

      {/* Main Cinema Theater Stage */}
      <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col justify-center px-4 pb-6 sm:px-6">
        {/* 16:9 Widescreen Video Viewport */}
        <div
          ref={stageContainerRef}
          data-testid="cinema-stage"
          data-scene={activeScene.id}
          data-playing={isPlaying ? 'true' : 'false'}
          data-time={currentTime.toFixed(2)}
          data-narration-cue={activeCaption?.cueId ?? ''}
          className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_32px_90px_-20px_rgba(0,0,0,0.85)]"
        >
          {/* Scaled 1280x720 16:9 Master Canvas */}
          <div
            className="absolute left-0 top-0 h-[720px] w-[1280px] origin-top-left overflow-hidden"
            style={{
              transform: `scale(${stageScale.toFixed(5)})`,
            }}
          >
            {sceneLayers.map(({ scene, opacity }) => (
              <div
                key={scene.id}
                className="absolute inset-0"
                style={{ opacity }}
              >
                {scene.id === 'opening' && <Scene01Opening time={currentTime} />}
                {scene.id === 'idea' && <Scene02Idea time={currentTime} />}
                {scene.id === 'reveal' && <Scene03Reveal time={currentTime} />}
                {scene.id === 'voice' && <Scene04Voice time={currentTime} />}
                {scene.id === 'intelligence' && <Scene05Intelligence time={currentTime} />}
                {scene.id === 'assistant' && <Scene06Assistant time={currentTime} />}
                {scene.id === 'future' && <Scene07Future time={currentTime} />}
                {scene.id === 'finale' && <Scene08Finale time={currentTime} />}
              </div>
            ))}

            {/* Synchronized Narration Subtitles (in-frame only when fullscreen) */}
            {isFullscreen && captionsEnabled && activeCaption && hasStarted && (
              <div
                className="pointer-events-none absolute bottom-16 left-1/2 z-40 -translate-x-1/2 px-6 text-center"
                data-testid="cinema-caption"
              >
                <p className="inline-block max-w-[820px] rounded-xl bg-black/75 px-5 py-2.5 text-lg font-medium leading-snug text-[#FAF8F5] backdrop-blur-md">
                  {activeCaption.text}
                </p>
              </div>
            )}
          </div>

          {/* Initial Poster / Play Overlay before first start */}
          {!hasStarted && !isPlaying && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/55 px-6 text-center backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <KyrixLogoMark size={48} />
                <KyrixWordmark className="text-3xl sm:text-4xl" />
              </div>
              <p className="max-w-md text-sm text-[#FAF8F5]/75 sm:text-base">
                A Customizable Real-Time AI Desktop Agent
              </p>
              <button
                type="button"
                onClick={handleTogglePlay}
                className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-[#FAF8F5] px-6 py-3 text-sm font-semibold text-[#0B0C10] shadow-xl hover:bg-white transition-transform active:scale-[0.98] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Play Launch Film</span>
              </button>
              <div className="mt-3 text-xs text-[#FAF8F5]/55 font-mono-tabular">
                01:28 · 16:9 Widescreen · Original Score &amp; Narration
              </div>
            </div>
          )}

          {/* End-of-Film Replay Overlay */}
          {hasStarted && !isPlaying && currentTime >= FILM_DURATION - 0.05 && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 px-6 text-center">
              <KyrixLogoMark size={52} className="mb-3" />
              <div className="font-display text-2xl font-semibold text-[#FAF8F5]">KYRIX</div>
              <p className="mt-1 text-sm text-[#FAF8F5]/70">
                A Customizable Real-Time AI Agent.
              </p>
              <button
                type="button"
                onClick={handleRestart}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FAF8F5] px-5 py-2.5 text-sm font-semibold text-[#0B0C10] hover:bg-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Replay Film</span>
              </button>
            </div>
          )}
        </div>

        {/* Dedicated Narration Subtitle Strip below the 16:9 frame so film visuals stay unobstructed */}
        {captionsEnabled && (
          <div
            data-testid="cinema-caption"
            className="mt-3 flex min-h-[38px] items-center justify-center rounded-xl border border-white/8 bg-[#12141B]/75 px-4 py-1.5 text-center"
          >
            <p
              className={`text-sm transition-colors duration-150 ${
                hasStarted && activeCaption ? 'text-[#FAF8F5]' : 'text-[#FAF8F5]/55'
              }`}
            >
              {hasStarted && activeCaption
                ? activeCaption.text
                : activeScene.subtitle}
            </p>
          </div>
        )}

        {/* Transport Scrubber & Playback Controls */}
        <section
          aria-label="Video playback controls"
          className="mt-3 rounded-xl border border-white/10 bg-[#12141B] px-4 py-3"
        >
          {/* Scrubber Track */}
          <div className="flex items-center gap-3">
            <span className="font-mono-tabular text-xs text-[#FAF8F5]/75 w-11">
              {formatTimecode(currentTime)}
            </span>
            <div className="relative flex flex-1 items-center">
              <input
                type="range"
                min={0}
                max={FILM_DURATION}
                step={0.05}
                value={currentTime}
                aria-label="Film timeline scrubber"
                onChange={(e) => handleSeek(Number(e.target.value), isPlaying)}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#FF6B5B]"
              />
            </div>
            <span className="font-mono-tabular text-xs text-[#FAF8F5]/55 w-11 text-right">
              {formatTimecode(FILM_DURATION)}
            </span>
          </div>

          {/* Action Row */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause film' : 'Play film'}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-white/10 px-3.5 text-xs font-medium text-[#FAF8F5] hover:bg-white/16 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={handleRestart}
                aria-label="Restart film"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/6 px-3 text-xs font-medium text-[#FAF8F5]/80 hover:bg-white/12 hover:text-[#FAF8F5] transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restart</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 pl-2 text-xs text-[#FAF8F5]/60">
                <span className="font-mono-tabular text-[#FAF8F5]/85">
                  Scene {activeScene.number}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeScene.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMute}
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/6 px-3 text-xs font-medium text-[#FAF8F5]/80 hover:bg-white/12 hover:text-[#FAF8F5] transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5 text-[#FF6B5B]" /> : <Volume2 className="h-3.5 w-3.5 text-[#34D399]" />}
                <span>{isMuted ? 'Muted' : 'Audio On'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playSoundEffect('soft-click');
                  setNarrationEnabled((v) => {
                    const next = !v;
                    if (!next) soundEngine.stopSpeech();
                    return next;
                  });
                }}
                aria-label={narrationEnabled ? 'Disable narration voice' : 'Enable narration voice'}
                aria-pressed={narrationEnabled}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors cursor-pointer ${
                  narrationEnabled
                    ? 'bg-white/16 text-[#FAF8F5]'
                    : 'bg-white/6 text-[#FAF8F5]/65 hover:text-[#FAF8F5]'
                }`}
              >
                {narrationEnabled ? <Mic className="h-3.5 w-3.5 text-[#34D399]" /> : <MicOff className="h-3.5 w-3.5 text-[#FF6B5B]" />}
                <span>Narration</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playSoundEffect('soft-click');
                  setCaptionsEnabled((v) => !v);
                }}
                aria-label={captionsEnabled ? 'Hide captions' : 'Show captions'}
                aria-pressed={captionsEnabled}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors cursor-pointer ${
                  captionsEnabled
                    ? 'bg-white/16 text-[#FAF8F5]'
                    : 'bg-white/6 text-[#FAF8F5]/65 hover:text-[#FAF8F5]'
                }`}
              >
                <Captions className="h-3.5 w-3.5" />
                <span>Captions</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playSoundEffect('soft-click');
                  handleToggleFullscreen();
                }}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/6 px-3 text-xs font-medium text-[#FAF8F5]/80 hover:bg-white/12 hover:text-[#FAF8F5] transition-colors cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Fullscreen</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  soundEngine.playSoundEffect('soft-click');
                  try {
                    const res = await fetch('/kyrix_launch_film_4k_no_captions.mp4');
                    if (!res.ok) throw new Error('Video file not found');
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'kyrix_launch_film_4k_no_captions.mp4';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch {
                    alert('Video file is being prepared. Please try again in a few seconds.');
                  }
                }}
                aria-label="Download 4K MP4 video without captions"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#FF6B5B] to-[#FF944D] px-3.5 text-xs font-semibold text-white shadow hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export 4K MP4 (No Captions)</span>
              </button>
            </div>
          </div>
        </section>

        {/* 8-Scene Chapter Selector Strip */}
        <nav
          aria-label="Scene index"
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8"
        >
          {FILM_SCENES.map((scene) => {
            const isActive = scene.id === activeScene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSeek(scene.start + 0.35, true)}
                className={`group rounded-xl border px-3 py-2 text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'border-white/30 bg-white/12 text-[#FAF8F5]'
                    : 'border-white/8 bg-[#12141B]/70 text-[#FAF8F5]/65 hover:border-white/18 hover:text-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono-tabular opacity-75">
                  <span>{scene.number}</span>
                  <span>{formatTimecode(scene.start)}</span>
                </div>
                <div className="mt-0.5 whitespace-nowrap text-xs font-medium">
                  {scene.shortTitle}
                </div>
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
};
