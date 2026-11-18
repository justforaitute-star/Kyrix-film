import React from 'react';
import { Code2, Eye, Music } from 'lucide-react';
import { KyrixCompactNotch, KyrixMascot } from '../KyrixBrand';
import {
  KyrixAppsView,
  KyrixShellHeader,
  KyrixWebResultsCard,
} from '../kyrix/KyrixSurfaces';
import {
  easeInOutQuart,
  easeOutExpo,
  easeOutQuart,
  getScene05BeatAtTime,
  rangeProgress,
  springSettle,
} from '../../film/timeline';
import { DesktopCursor, WindowsDesktopBase } from './WindowsDesktopBase';

interface SceneProps {
  time: number;
}

const SEARCH_RESULTS = [
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

/**
 * Scene 05 (38-52s): Intelligence in Action using authentic KYRIX screens:
 * Beat A (38-42.4s): Real Apps grid + "+ Add app" creation modal -> launched desktop windows.
 * Beat B (42.4-46.4s): Real Screen Awareness mint lasso capture.
 * Beat C (46.4-52s): Exact KYRIX web results card below mint star notch.
 */
export const Scene05Intelligence: React.FC<SceneProps> = ({ time }) => {
  const beat = getScene05BeatAtTime(time);

  // Beat A: Apps + "+ Add app" dialog
  const appsIn = springSettle(rangeProgress(time, 38.0, 38.7));
  const moveToAddApp = easeInOutQuart(rangeProgress(time, 38.5, 39.0));
  const clickAddApp = rangeProgress(time, 39.0, 39.35);
  const showAddModal = time >= 39.2 && time < 40.8;
  const vsCodeLaunched = springSettle(rangeProgress(time, 40.9, 41.5));
  const spotifyLaunched = springSettle(rangeProgress(time, 41.2, 41.8));

  const beatACursorX = 520 + moveToAddApp * 200;
  const beatACursorY = 180 - moveToAddApp * 105;

  // Beat B: Screen Awareness
  const contextIn = easeOutQuart(rangeProgress(time, 42.4, 43.1));
  const lassoDraw = easeInOutQuart(rangeProgress(time, 42.85, 44.5));
  const insightIn = easeOutExpo(rangeProgress(time, 44.2, 45.1));

  // Beat C: Web Results
  const cardIn = springSettle(rangeProgress(time, 46.4, 47.2));

  return (
    <WindowsDesktopBase dimmed={beat === 'screen-awareness' ? 0.16 : 0.28} scale={1.01}>
      <div className="relative flex h-full w-full flex-col items-center">
        {beat === 'apps' && (
          <>
            {vsCodeLaunched > 0.01 && (
              <div
                className="liquid-glass absolute bottom-20 left-12 w-[310px] rounded-2xl p-3.5 text-left"
                style={{
                  opacity: vsCodeLaunched,
                  transform: `translateY(${((1 - vsCodeLaunched) * 20).toFixed(1)}px)`,
                }}
              >
                <div className="mb-1.5 flex items-center gap-2 border-b border-white/10 pb-1.5 text-[11px] font-medium text-[#FAF8F5]">
                  <Code2 className="h-3.5 w-3.5 text-[#38BDF8]" />
                  <span>VS Code — workspace.ts</span>
                </div>
                <div className="font-mono-tabular text-[10px] text-[#FAF8F5]/65">
                  const agentReady = true;
                </div>
              </div>
            )}

            {spotifyLaunched > 0.01 && (
              <div
                className="liquid-glass absolute bottom-20 right-12 w-[290px] rounded-2xl p-3.5 text-left"
                style={{
                  opacity: spotifyLaunched,
                  transform: `translateY(${((1 - spotifyLaunched) * 20).toFixed(1)}px)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22C55E] text-white">
                    <Music className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#FAF8F5]">Focus Ambient</div>
                    <div className="text-[10px] text-[#34D399]">Now playing · Spotify</div>
                  </div>
                </div>
              </div>
            )}

            <div
              className="liquid-glass w-[740px] overflow-visible rounded-b-[24px] border-t-0"
              style={{
                opacity: appsIn,
                transform: `translateY(${((1 - appsIn) * -18).toFixed(1)}px)`,
              }}
            >
              <KyrixShellHeader activeTab="Apps" />
              <KyrixAppsView
                showAddModal={showAddModal}
                activeAppNames={
                  time >= 40.8 ? ['VS Code', 'Spotify', 'Files'] : ['Files']
                }
              />
            </div>

            {time < 40.9 && (
              <DesktopCursor
                x={beatACursorX}
                y={beatACursorY}
                clickProgress={clickAddApp}
              />
            )}
          </>
        )}

        {beat === 'screen-awareness' && (
          <>
            <KyrixCompactNotch
              time={time}
              mood="thinking"
              widenProgress={0}
              lookX={-0.35 + lassoDraw * 0.45}
              lookY={0.4}
            />

            <div
              className="relative mt-24 flex w-full max-w-[920px] items-center justify-center gap-8 px-10"
              style={{ opacity: contextIn }}
            >
              <div className="liquid-glass relative w-[480px] rounded-2xl p-6 text-left">
                <div className="mb-3 flex items-center justify-between border-b border-white/12 pb-2.5 text-xs">
                  <span className="font-semibold text-[#FAF8F5]">Nordic-Pavilion-Brief.pdf</span>
                  <span className="flex items-center gap-1.5 font-medium text-[#34D399]">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Screen Awareness</span>
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-[#FAF8F5]">
                  Timber &amp; Acoustic Studio Specification
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#FAF8F5]/78">
                  Birch lakefront pavilion requires matte silver studio headphones for spatial audio check, plus Kyoto cedar coffee bar lighting precedent.
                </p>

                <svg
                  viewBox="0 0 480 210"
                  className="pointer-events-none absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)]"
                  aria-hidden="true"
                >
                  <path
                    d="M 42 52 L 420 46 Q 445 120 398 182 Q 210 202 36 174 Q 10 112 42 52 Z"
                    fill="rgba(96, 165, 250, 0.16)"
                    stroke="#34D399"
                    strokeWidth="2.2"
                    strokeDasharray="1200"
                    strokeDashoffset={(1200 * (1 - lassoDraw)).toFixed(0)}
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div
                className="liquid-glass w-[300px] rounded-2xl p-5 text-left"
                style={{
                  opacity: insightIn,
                  transform: `translateX(${((1 - insightIn) * 16).toFixed(1)}px)`,
                }}
              >
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#34D399]">
                  <KyrixMascot mood="thinking" time={time} size={26} />
                  <span>Context Captured</span>
                </div>
                <p className="text-sm font-medium text-[#FAF8F5]">
                  3 visual references identified on screen
                </p>
                <p className="mt-1.5 text-xs text-[#FAF8F5]/68">
                  Fetching Nordic pavilion, Shibuya roaster, and studio headphones directly in KYRIX.
                </p>
              </div>
            </div>
          </>
        )}

        {beat === 'web-results' && (
          <>
            <KyrixCompactNotch
              time={time}
              mood="speaking"
              widenProgress={0}
              tint="mint"
              lookY={0.45}
            />

            <div
              className="mt-16"
              style={{
                opacity: cardIn,
                transform: `translateY(${((1 - cardIn) * 16).toFixed(1)}px)`,
              }}
            >
              <KyrixWebResultsCard
                query="Nordic timber pavilion · Shibuya coffee bar · studio headphones"
                activeFilter="Images"
                results={SEARCH_RESULTS}
              />
            </div>
          </>
        )}
      </div>
    </WindowsDesktopBase>
  );
};
