import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Code2, Eye, Layers, Monitor, RotateCcw, Sparkles } from 'lucide-react';
import { KEYNOTE_SLIDES, getSlideByNumber } from '../slides/deckData';
import {
  KyrixCaptionPill,
  KyrixCompactNotch,
  KyrixLogoMark,
  KyrixMascot,
  KyrixSilkWave,
  KyrixTabId,
  KyrixWordmark,
} from './KyrixBrand';
import {
  KyrixAppsView,
  KyrixChatView,
  KyrixShellHeader,
  KyrixStatsView,
  KyrixStyleSubTab,
  KyrixStyleView,
  KyrixTasksView,
  KyrixTodayView,
  KyrixWallpaperView,
  KyrixWebResultsCard,
} from './kyrix/KyrixSurfaces';
import { StudioBackdrop } from './scenes/StudioBackdrop';
import { WindowsDesktopBase } from './scenes/WindowsDesktopBase';
import { PresentationHeader, PresentationMode } from './PresentationHeader';

interface KeynoteDeckProps {
  initialSlide?: number;
  onChangeMode?: (mode: PresentationMode) => void;
}

const DEMO_RESULTS = [
  {
    title: 'Fjord Timber Pavilion',
    source: 'Oslo Architectural Review · 4 min read',
    image: '/src/assets/images/search_nordic_pavilion_1794851685561.jpg',
  },
  {
    title: 'Koffee Mameya, Shibuya',
    source: 'Tokyo Roasters · Open until 18:00',
    image: '/src/assets/images/search_kyoto_cafe_1794851685534.jpg',
  },
  {
    title: 'Studio Over-Ear',
    source: 'Acoustic Lab · Matte Silver',
    image: '/src/assets/images/search_studio_headphones_1794851687106.jpg',
  },
];

export const KeynoteDeck: React.FC<KeynoteDeckProps> = ({
  initialSlide = 5,
  onChangeMode,
}) => {
  const clampedInitial = Math.max(1, Math.min(KEYNOTE_SLIDES.length, initialSlide));
  const [slideNumber, setSlideNumber] = useState<number>(clampedInitial);
  const [stageScale, setStageScale] = useState<number>(1);
  const [animTime, setAnimTime] = useState<number>(0);

  // Interactive controls inside slides
  const [slide6Expanded, setSlide6Expanded] = useState<boolean>(true);
  const [slide6Tab, setSlide6Tab] = useState<KyrixTabId>('Today');
  const [slide9ShowModal, setSlide9ShowModal] = useState<boolean>(true);
  const [slide9EditMode, setSlide9EditMode] = useState<boolean>(false);
  const [slide12ShowTasks, setSlide12ShowTasks] = useState<boolean>(false);
  const [slide14Step, setSlide14Step] = useState<number>(0);
  const [slide16SubTab, setSlide16SubTab] = useState<KyrixStyleSubTab>('Look');
  const [slide16Wallpaper, setSlide16Wallpaper] = useState<string>('kyrix');

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const activeSlide = getSlideByNumber(slideNumber);

  // Proportional 1280x720 scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth > 0) setStageScale(el.clientWidth / 1280);
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Gentle live clock for waveform & mascot blink
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      setAnimTime((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keyboard arrow navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSlideNumber((n) => Math.min(KEYNOTE_SLIDES.length, n + 1));
      } else if (e.key === 'ArrowLeft') {
        setSlideNumber((n) => Math.max(1, n - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Auto-advance Slide 14 demonstration steps cleanly when viewing Slide 14
  useEffect(() => {
    if (slideNumber !== 14) return;
    setSlide14Step(0);
    const id = window.setInterval(() => {
      setSlide14Step((s) => (s + 1) % 5);
    }, 2200);
    return () => window.clearInterval(id);
  }, [slideNumber]);

  const renderSlideCanvas = () => {
    switch (activeSlide.number) {
      case 1:
        return (
          <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#08090C] px-12 text-center">
            <StudioBackdrop />
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-5 flex items-center gap-4">
                <KyrixLogoMark size={70} />
                <KyrixWordmark className="text-5xl" />
              </div>
              <p className="font-display text-2xl font-medium tracking-[-0.02em] text-[#FAF8F5]/85">
                A Customizable Real-Time AI Desktop Agent
              </p>
              <div className="mt-6 text-xs uppercase tracking-[0.2em] text-[#FAF8F5]/45">
                Product Keynote · Slides 01–18
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <WindowsDesktopBase dimmed={0.18}>
            <div className="relative flex h-full w-full flex-col justify-between p-12 pb-24">
              <div className="max-w-xl text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#38BDF8]">
                  Slide 02 · The Problem
                </div>
                <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[#FAF8F5]">
                  Constant window switching breaks focus.
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="liquid-glass rounded-2xl p-5 text-left">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#38BDF8]">
                    <Code2 className="h-4 w-4" />
                    <span>Code Editor</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#CBD5E1]/75">
                    Deep work interrupted by quick lookups, status checks, and utility toggles.
                  </p>
                </div>
                <div className="liquid-glass rounded-2xl p-5 text-left">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#FF944D]">
                    <Layers className="h-4 w-4" />
                    <span>Multiple Open Tabs</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#CBD5E1]/75">
                    Searching in a full browser pulls you away from your active document.
                  </p>
                </div>
                <div className="liquid-glass rounded-2xl p-5 text-left">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#34D399]">
                    <Monitor className="h-4 w-4" />
                    <span>Separate Utilities</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#CBD5E1]/75">
                    Timers, system stats, media controls, and notes scattered across windows.
                  </p>
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 3:
        return (
          <WindowsDesktopBase dimmed={0.28}>
            <KyrixCompactNotch time={animTime} mood="idle" widenProgress={0} />
            <div className="flex h-full w-full flex-col items-center justify-center px-12 text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#38BDF8]">
                Slide 03 · Always Within Reach
              </div>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-[#FAF8F5]">
                Anchored quietly at 0 px along the top edge.
              </h2>
              <p className="mt-3 max-w-lg text-sm text-[#CBD5E1]/80">
                When resting, KYRIX stays tucked into a compact translucent notch—leaving 100% of your desktop clear until needed.
              </p>
            </div>
          </WindowsDesktopBase>
        );

      case 4:
        return (
          <div className="relative flex h-full w-full flex-col justify-between bg-[#0B0D12] p-12 text-left">
            <StudioBackdrop />
            <div className="relative z-10">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E05A2B]">
                Slide 04 · Design Philosophy
              </div>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[#FAF8F5]">
                Built for calm, everyday desktop utility.
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-5">
              <div className="liquid-glass rounded-2xl p-6">
                <div className="text-base font-semibold text-[#FAF8F5]">Compact Footprint</div>
                <p className="mt-2 text-xs leading-relaxed text-[#CBD5E1]/75">
                  Expands downward from the top notch only when called, then returns cleanly out of the way.
                </p>
              </div>
              <div className="liquid-glass rounded-2xl p-6">
                <div className="text-base font-semibold text-[#FAF8F5]">Restrained Liquid Glass</div>
                <p className="mt-2 text-xs leading-relaxed text-[#CBD5E1]/75">
                  Configurable blur, opacity, glare, thickness, and corner radius controlled directly in Style.
                </p>
              </div>
              <div className="liquid-glass rounded-2xl p-6">
                <div className="text-base font-semibold text-[#FAF8F5]">Honest Controls</div>
                <p className="mt-2 text-xs leading-relaxed text-[#CBD5E1]/75">
                  Real switches for private mode, offline mode, click guides, and idle bar visibility.
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <WindowsDesktopBase dimmed={0.28}>
            <KyrixCompactNotch time={animTime} mood="idle" widenProgress={0} />
            <div className="grid h-full w-full grid-cols-12 items-center gap-8 px-12 pb-16 pt-12">
              <div className="col-span-5 text-left">
                <div className="mb-4 flex items-center gap-3">
                  <KyrixLogoMark size={40} />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E05A2B]">
                    Slide 05 · Meet KYRIX
                  </span>
                </div>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-[#FAF8F5]">
                  A floating AI assistant built into Windows.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]/80">
                  KYRIX pairs a friendly top-edge assistant presence with an organized workspace overlay for voice, tasks, apps, system stats, and inline search.
                </p>
              </div>

              <div className="col-span-7 flex justify-end">
                <div className="liquid-glass w-full max-w-[680px] overflow-hidden rounded-[22px]">
                  <KyrixShellHeader activeTab="Today" />
                  <KyrixTodayView />
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 6:
        return (
          <WindowsDesktopBase dimmed={0.3}>
            <div className="flex h-full w-full flex-col items-center justify-between pb-24">
              {!slide6Expanded ? (
                <KyrixCompactNotch time={animTime} mood="idle" widenProgress={0} />
              ) : (
                <div className="liquid-glass w-[740px] overflow-hidden rounded-b-[24px] border-t-0">
                  <KyrixShellHeader activeTab={slide6Tab} onSelectTab={setSlide6Tab} />
                  {slide6Tab === 'Today' && <KyrixTodayView />}
                  {slide6Tab === 'Tasks' && <KyrixTasksView mode="empty" />}
                  {slide6Tab === 'Chat' && <KyrixChatView messages={[]} />}
                  {slide6Tab === 'Apps' && <KyrixAppsView />}
                  {slide6Tab === 'Wallpaper' && <KyrixWallpaperView />}
                  {slide6Tab === 'Stats' && <KyrixStatsView />}
                  {slide6Tab === 'Style' && <KyrixStyleView time={animTime} />}
                </div>
              )}

              <div className="mt-auto flex flex-col items-center gap-3 px-8 text-center">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSlide6Expanded((v) => !v)}
                    className="rounded-lg border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-white/18 cursor-pointer"
                  >
                    {slide6Expanded ? 'Collapse to Compact Notch' : 'Expand Dashboard Overlay'}
                  </button>
                </div>
                <h2 className="font-display text-2xl font-semibold text-[#FAF8F5]">
                  Slide 06 · The Interface — Compact Notch &amp; 7-Tab Navigation
                </h2>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 7:
        return (
          <WindowsDesktopBase dimmed={0.18}>
            {/* Step 1 at top center: Listening Notch from screenshot */}
            <KyrixCompactNotch time={animTime} mood="listening" widenProgress={1} waveAmplitude={16} />

            <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-12 pb-20 pt-14">
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#38BDF8]">
                  Slide 07 · Voice-First Experience
                </div>
                <h2 className="mt-2 font-display text-3xl font-semibold text-[#FAF8F5]">
                  Natural spoken conversation in chronological order.
                </h2>
              </div>

              {/* Exact 3 Conversation References in Chronological Order */}
              <div className="grid w-full max-w-[1060px] grid-cols-3 gap-5">
                <div className="liquid-glass flex flex-col items-center justify-between rounded-2xl p-5 text-center">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBD5E1]/65">
                    01 · Listening Notch
                  </span>
                  <div className="my-4 flex h-[50px] w-[240px] items-center justify-between rounded-b-[16px] border border-t-0 border-white/20 bg-[#3B485B]/90 px-3.5 shadow-lg">
                    <KyrixMascot mood="listening" time={animTime} size={30} />
                    <KyrixSilkWave time={animTime} variant="pearl" amplitude={15} className="h-8 w-[160px]" />
                  </div>
                  <p className="text-xs text-[#CBD5E1]/75">
                    Notch widens horizontally with the mascot and live pearl waveform.
                  </p>
                </div>

                <div className="liquid-glass flex flex-col items-center justify-between rounded-2xl p-5 text-center">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBD5E1]/65">
                    02 · User Live Caption
                  </span>
                  <div className="my-4 whitespace-nowrap">
                    <KyrixCaptionPill speaker="You" text="Hi" />
                  </div>
                  <p className="text-xs text-[#CBD5E1]/75">
                    User speech renders cleanly in a light frosted caption pill above the taskbar.
                  </p>
                </div>

                <div className="liquid-glass flex flex-col items-center justify-between rounded-2xl p-5 text-center">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBD5E1]/65">
                    03 · KYRIX Response
                  </span>
                  <div className="my-4 whitespace-nowrap">
                    <KyrixCaptionPill speaker="KYRIX" text="I'm here. What do you need?" />
                  </div>
                  <p className="text-xs text-[#CBD5E1]/75">
                    KYRIX responds immediately in a dark slate caption pill with cyan label.
                  </p>
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 8:
        return (
          <WindowsDesktopBase dimmed={0.3}>
            <div className="grid h-full w-full grid-cols-12 items-center gap-8 px-12 pb-16">
              <div className="col-span-5 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#34D399]">
                  Slide 08 · Multilingual Intelligence
                </div>
                <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[#FAF8F5]">
                  Speak or type naturally — every thread stays in Chat.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]/80">
                  Voice interactions and typed messages live together inside KYRIX&apos;s persistent Chat tab, with one-click clearing when you want a fresh slate.
                </p>
              </div>

              <div className="col-span-7">
                <div className="liquid-glass overflow-hidden rounded-[22px]">
                  <KyrixShellHeader activeTab="Chat" micActive={true} />
                  <KyrixChatView
                    messages={[
                      { speaker: 'You', text: 'Hi' },
                      { speaker: 'KYRIX', text: "I'm here. What do you need?" },
                      {
                        speaker: 'You',
                        text: 'Translate my afternoon meeting reminder into Japanese.',
                      },
                      {
                        speaker: 'KYRIX',
                        text: '「午後のミーティングは14:30からです。」— Ready whenever you are.',
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 9:
        return (
          <WindowsDesktopBase dimmed={0.28}>
            <div className="grid h-full w-full grid-cols-12 items-start gap-8 px-12 pb-20 pt-14">
              <div className="col-span-4 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#38BDF8]">
                  Slide 09 · PC Control
                </div>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#FAF8F5]">
                  Launch apps &amp; create custom shortcuts.
                </h2>
                <p className="mt-2.5 text-xs leading-relaxed text-[#CBD5E1]/80">
                  Open Chrome, VS Code, Spotify, Discord, Notepad, Calculator, Terminal, or Files—edit tiles directly, or add any app, file, folder, command, or web URL.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSlide9ShowModal((v) => !v)}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/18 cursor-pointer"
                  >
                    {slide9ShowModal ? 'Hide Add App Dialog' : 'Open "+ Add app" Dialog'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSlide9EditMode((v) => !v);
                      setSlide9ShowModal(false);
                    }}
                    className="rounded-lg border border-white/16 bg-white/6 px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:bg-white/12 cursor-pointer"
                  >
                    {slide9EditMode ? 'Exit Edit Mode' : 'Toggle Edit Mode'}
                  </button>
                </div>
              </div>

              <div className="col-span-8 flex justify-end">
                <div className="liquid-glass w-full max-w-[700px] overflow-visible rounded-[22px]">
                  <KyrixShellHeader activeTab="Apps" />
                  <KyrixAppsView
                    editMode={slide9EditMode}
                    showAddModal={slide9ShowModal}
                    activeAppNames={['VS Code', 'Spotify', 'Files']}
                  />
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 10:
        return (
          <WindowsDesktopBase dimmed={0.2}>
            <KyrixCompactNotch time={animTime} mood="thinking" widenProgress={0} lookX={-0.3} lookY={0.4} />
            <div className="grid h-full w-full grid-cols-12 items-center gap-8 px-12 pb-16 pt-12">
              <div className="col-span-6 relative">
                <div className="liquid-glass relative rounded-2xl p-6 text-left">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Selected Screen Region</span>
                    <span className="flex items-center gap-1.5 text-[#34D399]">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Screen awareness: ON</span>
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#CBD5E1]/80">
                    Draw a freeform mint selection anywhere on your monitor to capture visual context directly for KYRIX.
                  </p>
                  <svg viewBox="0 0 420 140" className="pointer-events-none mt-3 h-28 w-full">
                    <path
                      d="M 40 24 L 365 20 Q 385 78 340 120 Q 175 134 36 112 Q 14 68 40 24 Z"
                      fill="rgba(96, 165, 250, 0.24)"
                      stroke="#34D399"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="col-span-6 space-y-4 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#34D399]">
                  Slide 10 · Real-Time Screen Awareness
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#FAF8F5]">
                  Honest boundary between today&apos;s capture &amp; future roadmap.
                </h2>
                <div className="rounded-xl border border-[#34D399]/35 bg-[#34D399]/10 p-3.5">
                  <div className="text-xs font-semibold text-[#34D399]">Demonstrated Today</div>
                  <p className="mt-1 text-xs text-[#E2E8F0]/85">
                    User-triggered freeform region selection toggleable in Style &rarr; Toggles (with optional Privacy &amp; Screenshot exclusions).
                  </p>
                </div>
                <div className="rounded-xl border border-white/14 bg-white/[0.04] p-3.5">
                  <div className="text-xs font-semibold text-[#CBD5E1]">Future Capability</div>
                  <p className="mt-1 text-xs text-[#CBD5E1]/70">
                    Deeper multi-window workflow continuity across desktop applications over time.
                  </p>
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 11:
        return (
          <WindowsDesktopBase dimmed={0.22}>
            <KyrixCompactNotch time={animTime} mood="speaking" widenProgress={0} tint="mint" lookY={0.45} />
            <div className="flex h-full w-full flex-col items-center justify-between px-12 pb-24 pt-16">
              <KyrixWebResultsCard
                query="Nordic timber pavilion · Shibuya coffee bar · studio headphones"
                activeFilter="Images"
                results={DEMO_RESULTS}
              />
              <h2 className="font-display text-2xl font-semibold text-[#FAF8F5]">
                Slide 11 · Intelligent Search — Results open as a card, not in a browser.
              </h2>
            </div>
          </WindowsDesktopBase>
        );

      case 12:
        return (
          <WindowsDesktopBase dimmed={0.28}>
            <div className="flex h-full w-full flex-col items-center justify-between px-12 pb-24 pt-6">
              <div className="liquid-glass w-[760px] overflow-hidden rounded-[22px]">
                <KyrixShellHeader
                  activeTab={slide12ShowTasks ? 'Tasks' : 'Today'}
                  onSelectTab={(t) => setSlide12ShowTasks(t === 'Tasks')}
                />
                {slide12ShowTasks ? <KyrixTasksView mode="empty" /> : <KyrixTodayView />}
              </div>

              <div className="flex flex-col items-center gap-2.5 text-center">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSlide12ShowTasks(false)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium cursor-pointer ${
                      !slide12ShowTasks ? 'bg-[#E05A2B] text-white' : 'bg-white/10 text-[#CBD5E1]'
                    }`}
                  >
                    Today Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlide12ShowTasks(true)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium cursor-pointer ${
                      slide12ShowTasks ? 'bg-[#E05A2B] text-white' : 'bg-white/10 text-[#CBD5E1]'
                    }`}
                  >
                    Tasks Tab
                  </button>
                </div>
                <h2 className="font-display text-2xl font-semibold text-[#FAF8F5]">
                  Slide 12 · Personal Assistant — Clock, Music, Timer, OBS, Ready &amp; Tasks
                </h2>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 13:
        return (
          <WindowsDesktopBase dimmed={0.28}>
            <KyrixCompactNotch time={animTime} mood="idle" widenProgress={0} />
            <div className="grid h-full w-full grid-cols-12 items-center gap-8 px-12 pb-16 pt-12">
              <div className="col-span-5 space-y-4 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4ADE80]">
                  Slide 13 · The Mascot
                </div>
                <h2 className="font-display text-4xl font-semibold text-[#FAF8F5]">
                  Expressive, compact, and customizable.
                </h2>
                <div className="grid grid-cols-4 gap-2.5 pt-2">
                  {(['idle', 'listening', 'thinking', 'speaking'] as const).map((m) => (
                    <div
                      key={m}
                      className="flex flex-col items-center rounded-xl border border-white/12 bg-black/30 p-3"
                    >
                      <KyrixMascot mood={m} time={animTime} size={46} />
                      <span className="mt-2 text-[10px] capitalize text-[#CBD5E1]">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-7">
                <div className="liquid-glass overflow-hidden rounded-[22px]">
                  <KyrixShellHeader activeTab="Style" accentColor="#22C55E" accentSecondary="#15803D" />
                  <KyrixStyleView
                    subTab="Mascot"
                    accentColor="#22C55E"
                    accentSecondary="#15803D"
                    tint="mint"
                    time={animTime}
                  />
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 14: {
        const steps = [
          '1. Compact Notch Idle',
          '2. Listening Waveform',
          '3. User: "Hi"',
          '4. KYRIX: "I\'m here. What do you need?"',
          '5. Expanded Chat Thread',
        ];
        return (
          <WindowsDesktopBase dimmed={0.22}>
            {slide14Step < 4 ? (
              <KyrixCompactNotch
                time={animTime}
                mood={slide14Step === 0 ? 'idle' : slide14Step === 1 ? 'listening' : 'speaking'}
                widenProgress={slide14Step >= 1 ? 1 : 0}
                waveAmplitude={slide14Step === 1 ? 15 : 18}
              />
            ) : (
              <div className="mx-auto w-[740px]">
                <div className="liquid-glass overflow-hidden rounded-b-[24px] border-t-0">
                  <KyrixShellHeader activeTab="Chat" micActive={true} />
                  <KyrixChatView
                    messages={[
                      { speaker: 'You', text: 'Hi' },
                      { speaker: 'KYRIX', text: "I'm here. What do you need?" },
                    ]}
                  />
                </div>
              </div>
            )}

            {slide14Step === 2 && (
              <div className="absolute bottom-[82px] left-1/2 -translate-x-1/2">
                <KyrixCaptionPill speaker="You" text="Hi" />
              </div>
            )}
            {slide14Step === 3 && (
              <div className="absolute bottom-[82px] left-1/2 -translate-x-1/2">
                <KyrixCaptionPill speaker="KYRIX" text="I'm here. What do you need?" />
              </div>
            )}

            <div className="pointer-events-auto absolute bottom-24 left-12 right-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {steps.map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSlide14Step(idx)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                      slide14Step === idx
                        ? 'bg-[#38BDF8] text-[#090B10]'
                        : 'bg-black/45 text-[#CBD5E1] border border-white/12'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSlide14Step(0)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/16 bg-black/50 px-3 py-1 text-[11px] text-white cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Replay Sequence</span>
              </button>
            </div>
          </WindowsDesktopBase>
        );
      }

      case 15:
        return (
          <WindowsDesktopBase dimmed={0.34}>
            <div className="grid h-full w-full grid-cols-12 items-center gap-8 px-12 pb-16">
              <div className="col-span-5 space-y-3 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E05A2B]">
                  Slide 15 · Technology
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#FAF8F5]">
                  Lightweight desktop architecture with live system visibility.
                </h2>
                <p className="text-xs leading-relaxed text-[#CBD5E1]/80">
                  KYRIX runs as a lightweight Windows overlay—combining voice capture, customizable rendering, local application launching, inline web cards, and built-in CPU/Memory/Disk/Network monitoring.
                </p>
              </div>

              <div className="col-span-7">
                <div className="liquid-glass overflow-hidden rounded-[22px]">
                  <KyrixShellHeader activeTab="Stats" />
                  <KyrixStatsView />
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 16:
        return (
          <WindowsDesktopBase dimmed={0.28}>
            <div className="grid h-full w-full grid-cols-12 items-start gap-6 px-10 pb-20 pt-8">
              <div className="col-span-7">
                <div className="liquid-glass overflow-hidden rounded-[22px]">
                  <KyrixShellHeader
                    activeTab="Style"
                    accentColor="#22C55E"
                    accentSecondary="#15803D"
                  />
                  <KyrixStyleView
                    subTab={slide16SubTab}
                    onSelectSubTab={setSlide16SubTab}
                    accentColor="#22C55E"
                    accentSecondary="#15803D"
                    tint="mint"
                    time={animTime}
                  />
                </div>
              </div>

              <div className="col-span-5 space-y-4">
                <div className="relative h-[222px] w-[490px] overflow-visible">
                  <div
                    className="liquid-glass w-[680px] origin-top-left overflow-hidden rounded-[22px]"
                    style={{ transform: 'scale(0.72)' }}
                  >
                    <KyrixShellHeader
                      activeTab="Wallpaper"
                      accentColor="#E05A2B"
                      accentSecondary="#B83E1B"
                    />
                    <KyrixWallpaperView selectedId={slide16Wallpaper} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/12 bg-black/45 px-4 py-2.5 text-left">
                  <span className="text-xs text-[#CBD5E1]">
                    Click any Style sub-tab (Look · Glass · Layout · Motion · Mascot · Voice · Toggles)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSlide16Wallpaper((w) => (w === 'kyrix' ? 'ribbon' : 'kyrix'))
                    }
                    className="rounded-lg bg-white/12 px-2.5 py-1 text-[11px] font-medium text-white cursor-pointer whitespace-nowrap"
                  >
                    Cycle Wallpaper
                  </button>
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      case 17:
        return (
          <WindowsDesktopBase dimmed={0.3}>
            <div className="flex h-full w-full flex-col justify-between px-10 pb-24 pt-8">
              <div className="text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#34D399]">
                  Slide 17 · Real-World Applications
                </div>
                <h2 className="mt-1 font-display text-3xl font-semibold text-[#FAF8F5]">
                  Today, Apps, Tasks &amp; Visual Search in everyday desktop flow.
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="liquid-glass overflow-hidden rounded-2xl">
                  <KyrixShellHeader activeTab="Today" />
                  <KyrixTodayView timerDisplay="14:20" timerActive={true} />
                </div>
                <div className="liquid-glass overflow-hidden rounded-2xl">
                  <KyrixShellHeader activeTab="Apps" />
                  <KyrixAppsView activeAppNames={['VS Code', 'Spotify', 'Chrome']} />
                </div>
              </div>
            </div>
          </WindowsDesktopBase>
        );

      default:
        return (
          <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#08090C] px-12 text-center">
            <StudioBackdrop />
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-5 flex items-center gap-4">
                <KyrixLogoMark size={72} />
                <KyrixMascot mood="idle" time={animTime} size={66} />
              </div>
              <KyrixWordmark className="text-5xl" />
              <p className="mt-3 font-display text-xl font-medium text-[#FAF8F5]/82">
                Your computer. Your intelligence. Your way.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0C10] text-[#FAF8F5]">
      <PresentationHeader
        mode="slides"
        onChangeMode={onChangeMode ?? (() => {})}
        primaryLabel="Watch Launch Film"
        onPrimaryAction={() => onChangeMode?.('film')}
      />

      <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col justify-center px-4 pb-6 sm:px-6">
        {/* 16:9 Scaled Keynote Slide Viewport matching CinemaPlayer */}
        <div
          ref={containerRef}
          data-testid="keynote-stage"
          data-slide={activeSlide.number}
          className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/12 bg-[#08090C] shadow-[0_32px_90px_-20px_rgba(0,0,0,0.85)]"
        >
          <div
            className="absolute left-0 top-0 h-[720px] w-[1280px] origin-top-left overflow-hidden"
            style={{ transform: `scale(${stageScale.toFixed(5)})` }}
          >
            {renderSlideCanvas()}
          </div>
        </div>

        {/* Slide Caption Strip */}
        <div className="mt-3 flex min-h-[38px] items-center justify-between gap-4 rounded-xl border border-white/8 bg-[#12141B]/75 px-4 py-1.5">
          <div className="flex items-center gap-2 text-xs text-[#FAF8F5]/85">
            <Sparkles className="h-3.5 w-3.5 text-[#E05A2B]" />
            <span className="font-mono-tabular text-[#FAF8F5]/65">
              Slide {activeSlide.code} / 18
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold">{activeSlide.title}</span>
          </div>
          <p className="hidden truncate text-xs text-[#FAF8F5]/70 sm:block">
            {activeSlide.summary}
          </p>
        </div>

        {/* Slide Controls */}
        <section
          aria-label="Keynote slide controls"
          className="mt-3 rounded-xl border border-white/10 bg-[#12141B] px-4 py-3"
        >
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setSlideNumber((n) => Math.max(1, n - 1))}
              disabled={slideNumber === 1}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/10 px-3.5 text-xs font-medium text-[#FAF8F5] hover:bg-white/16 disabled:opacity-40 cursor-pointer whitespace-nowrap"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <div className="text-xs text-[#FAF8F5]/65 font-mono-tabular">
              {activeSlide.section} · Slide {activeSlide.code} of 18
            </div>

            <button
              type="button"
              onClick={() => setSlideNumber((n) => Math.min(KEYNOTE_SLIDES.length, n + 1))}
              disabled={slideNumber === KEYNOTE_SLIDES.length}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#FAF8F5] px-3.5 text-xs font-semibold text-[#0B0C10] hover:bg-white disabled:opacity-40 cursor-pointer whitespace-nowrap"
            >
              <span>Next Slide</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 18-Slide Thumbnail Index Grid */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6 lg:grid-cols-9">
            {KEYNOTE_SLIDES.map((s) => {
              const active = s.number === slideNumber;
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => setSlideNumber(s.number)}
                  className={`rounded-lg border px-2.5 py-1.5 text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-white/35 bg-white/14 text-[#FAF8F5]'
                      : 'border-white/8 bg-white/[0.03] text-[#FAF8F5]/65 hover:border-white/20 hover:text-[#FAF8F5]'
                  }`}
                >
                  <div className="font-mono-tabular text-[10px] opacity-65">{s.code}</div>
                  <div className="truncate text-[11px] font-medium">{s.title}</div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
