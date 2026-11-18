import React from 'react';
import { KyrixCompactNotch, KyrixMascot, KyrixSilkWave } from '../KyrixBrand';
import { KyrixShellHeader } from '../kyrix/KyrixSurfaces';
import {
  easeOutQuart,
  getMascotMoodAtTime,
  rangeProgress,
  springSettle,
} from '../../film/timeline';
import { DesktopCursor, WindowsDesktopBase } from './WindowsDesktopBase';

interface SceneProps {
  time: number;
}

/**
 * Scene 03 (17-27s): Intentional UI Reveal.
 * 17.0-18.1s: Cursor moves up and clicks the top-center compact notch.
 * 18.1-19.3s: Notch widens horizontally into the real Listening Notch (star + pearl Silk wave).
 * 19.3-20.5s: Expands smoothly downward into the full KYRIX overlay demonstrating Listening -> Thinking -> Speaking.
 */
export const Scene03Reveal: React.FC<SceneProps> = ({ time }) => {
  const mood = getMascotMoodAtTime(time);

  // Beat 1: Cursor clicks top notch
  const cursorApproach = easeOutQuart(rangeProgress(time, 17.1, 17.8));
  const clickT = rangeProgress(time, 17.8, 18.25);
  const cursorFade = 1 - easeOutQuart(rangeProgress(time, 18.4, 19.0));

  // Beat 2: Compact -> Listening Notch horizontal widen (18.1 -> 19.1s)
  const widen = springSettle(rangeProgress(time, 18.1, 19.1));

  // Beat 3: Listening Notch -> Full KYRIX Overlay expand (19.5 -> 20.6s)
  const expand = springSettle(rangeProgress(time, 19.5, 20.6));
  const compactOpacity = 1 - easeOutQuart(rangeProgress(time, 19.5, 20.0));
  const overlayContentOpacity = easeOutQuart(rangeProgress(time, 19.85, 20.45));

  // Container geometry smoothly interpolates from Listening Notch (268x52) to Full Overlay (760x396)
  const width = 268 + expand * (760 - 268);
  const height = 52 + expand * (396 - 52);
  const radius = 18 + expand * 6;

  // Calibrated reflection sweep triggered once on expansion
  const sheenX = -220 + easeOutQuart(rangeProgress(time, 19.6, 21.1)) * 980;

  const moodDescription =
    mood === 'listening'
      ? 'Listening to your voice...'
      : mood === 'thinking'
        ? 'Understanding screen & context...'
        : 'Ready to act across your desktop.';

  return (
    <WindowsDesktopBase dimmed={0.22 + expand * 0.2} scale={1.0 + expand * 0.015}>
      {/* Phase A: Compact -> Widened Listening Notch */}
      {compactOpacity > 0.01 && expand < 0.15 && (
        <KyrixCompactNotch
          time={time}
          mood={widen > 0.25 ? 'listening' : 'idle'}
          widenProgress={widen}
          opacity={compactOpacity}
          waveAmplitude={16}
        />
      )}

      {/* Phase B: Expanding Full Liquid-Glass Overlay */}
      {expand > 0.005 && (
        <div className="relative flex h-full w-full justify-center">
          <div
            className="liquid-glass relative overflow-hidden border-t-0"
            style={{
              width: `${width.toFixed(1)}px`,
              height: `${height.toFixed(1)}px`,
              borderBottomLeftRadius: `${radius.toFixed(1)}px`,
              borderBottomRightRadius: `${radius.toFixed(1)}px`,
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
            }}
          >
            {/* Single subtle reflection sweep on open */}
            <div
              className="pointer-events-none absolute -top-1/2 h-[220%] w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent"
              style={{
                transform: `translateX(${sheenX.toFixed(1)}px) rotate(16deg)`,
              }}
            />

            {/* Fixed-width centered inner stage prevents mid-expansion wrapping */}
            <div
              className="absolute left-1/2 top-0 flex h-[396px] w-[760px] -translate-x-1/2 flex-col justify-between"
              style={{ opacity: overlayContentOpacity }}
            >
              <KyrixShellHeader
                activeTab="Today"
                accentColor="#FF6B5B"
                accentSecondary="#FF944D"
                micActive={mood === 'listening'}
              />

              <div className="flex flex-1 items-center gap-7 px-8 py-4">
                <div className="flex h-[132px] w-[132px] shrink-0 items-center justify-center rounded-[26px] border border-white/12 bg-white/[0.04]">
                  <KyrixMascot mood={mood} time={time} size={102} />
                </div>

                <div className="flex-1 text-left">
                  <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-white/12 bg-black/30 p-1 text-[11px] font-medium">
                    {(['listening', 'thinking', 'speaking'] as const).map((stateKey) => {
                      const active = mood === stateKey;
                      const label =
                        stateKey === 'listening'
                          ? 'Listening'
                          : stateKey === 'thinking'
                            ? 'Thinking'
                            : 'Speaking';
                      return (
                        <span
                          key={stateKey}
                          className={`rounded-full px-3 py-1 transition-colors duration-200 ${
                            active
                              ? 'bg-gradient-to-r from-[#FF6B5B] to-[#FF944D] text-white'
                              : 'text-[#FAF8F5]/50'
                          }`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>

                  <h3 className="font-display text-2xl font-semibold tracking-tight text-[#FAF8F5]">
                    {moodDescription}
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-[#FAF8F5]/72">
                    {mood === 'listening'
                      ? '"Prepare my workspace for the Oslo architecture call."'
                      : mood === 'thinking'
                        ? 'Checking open brief, calendar schedule, and audio routing.'
                        : '"Your Nordic brief is open, focus timer is set, and audio is ready."'}
                  </p>

                  <div className="mt-3.5 h-10 w-full overflow-hidden rounded-xl border border-white/8 bg-black/28 px-3">
                    <KyrixSilkWave
                      time={time}
                      amplitude={mood === 'speaking' ? 15 : mood === 'listening' ? 11 : 4}
                      primaryColor={mood === 'thinking' ? '#8B5CF6' : '#FF6B5B'}
                      secondaryColor={mood === 'listening' ? '#22D3EE' : '#34D399'}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-6 py-2.5 text-xs text-[#FAF8F5]/55">
                <span>Top-Edge Floating Overlay · Liquid Glass</span>
                <span className="font-mono-tabular text-[#FAF8F5]/75">Alt + Space</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cursor interaction clicking the top notch */}
      {cursorFade > 0.01 && (
        <DesktopCursor
          x={740 - cursorApproach * 102}
          y={110 - cursorApproach * 86}
          clickProgress={clickT}
          opacity={cursorFade}
        />
      )}
    </WindowsDesktopBase>
  );
};
