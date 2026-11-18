import React from 'react';
import {
  KyrixCaptionPill,
  KyrixCompactNotch,
} from '../KyrixBrand';
import { KyrixChatView, KyrixShellHeader } from '../kyrix/KyrixSurfaces';
import {
  easeOutExpo,
  easeOutQuart,
  rangeProgress,
  springSettle,
} from '../../film/timeline';
import { WindowsDesktopBase } from './WindowsDesktopBase';

interface SceneProps {
  time: number;
}

/**
 * Scene 04 (27-38s): Authentic Voice & Chat Sequence.
 * 27.0-30.4s: Top Listening Notch + User Caption Pill ("Hi").
 * 30.5-33.6s: KYRIX Response Caption Pill ("I'm here. What do you need?").
 * 33.5-38.0s: Expands into the real KYRIX Chat tab preserving the chronological thread.
 */
export const Scene04Voice: React.FC<SceneProps> = ({ time }) => {
  const youPillIn = easeOutQuart(rangeProgress(time, 27.4, 28.0));
  const youPillOut = 1 - easeOutQuart(rangeProgress(time, 30.1, 30.5));
  const kyrixPillIn = easeOutQuart(rangeProgress(time, 30.5, 31.1));
  const kyrixPillOut = 1 - easeOutQuart(rangeProgress(time, 33.2, 33.6));

  const chatExpand = springSettle(rangeProgress(time, 33.4, 34.4));
  const chatContentFade = easeOutQuart(rangeProgress(time, 33.75, 34.35));
  const replyIn = easeOutQuart(rangeProgress(time, 34.5, 35.3));
  const headlineMask = easeOutExpo(rangeProgress(time, 34.1, 35.4));
  const notchFade = 1 - easeOutQuart(rangeProgress(time, 33.4, 33.85));

  const chatMessages =
    replyIn > 0.4
      ? [
          { speaker: 'You' as const, text: 'Hi' },
          { speaker: 'KYRIX' as const, text: "I'm here. What do you need?" },
          {
            speaker: 'You' as const,
            text: 'Translate my afternoon meeting reminder into Japanese.',
          },
          {
            speaker: 'KYRIX' as const,
            text: '「午後のミーティングは14:30からです。」— Ready whenever you are.',
          },
        ]
      : [
          { speaker: 'You' as const, text: 'Hi' },
          { speaker: 'KYRIX' as const, text: "I'm here. What do you need?" },
        ];

  return (
    <WindowsDesktopBase dimmed={0.18 + chatExpand * 0.22} scale={1.0 + chatExpand * 0.015}>
      {notchFade > 0.01 && (
        <KyrixCompactNotch
          time={time}
          mood={time < 30.5 ? 'listening' : 'speaking'}
          widenProgress={1}
          opacity={notchFade}
          waveAmplitude={time < 30.5 ? 15 : 19}
        />
      )}

      {/* Chronological Live Caption Pills matching user screenshots */}
      <div className="pointer-events-none absolute bottom-[78px] left-1/2 z-20 -translate-x-1/2">
        {youPillIn * youPillOut > 0.01 && (
          <KyrixCaptionPill
            speaker="You"
            text="Hi"
            opacity={youPillIn * youPillOut}
            translateY={(1 - youPillIn) * 10}
          />
        )}
        {kyrixPillIn * kyrixPillOut > 0.01 && (
          <KyrixCaptionPill
            speaker="KYRIX"
            text="I'm here. What do you need?"
            opacity={kyrixPillIn * kyrixPillOut}
            translateY={(1 - kyrixPillIn) * 10}
          />
        )}
      </div>

      {/* Expanded Authentic Chat Panel */}
      {chatExpand > 0.01 && (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-between pb-24">
          <div
            className="liquid-glass overflow-hidden rounded-b-[24px] border-t-0"
            style={{
              width: `${(268 + chatExpand * (760 - 268)).toFixed(1)}px`,
              height: `${(52 + chatExpand * (356 - 52)).toFixed(1)}px`,
            }}
          >
            <div
              className="relative left-1/2 top-0 w-[760px] -translate-x-1/2"
              style={{ opacity: chatContentFade }}
            >
              <KyrixShellHeader activeTab="Chat" micActive={true} />
              <KyrixChatView messages={chatMessages} />
            </div>
          </div>

          <div className="overflow-hidden py-1">
            <h2
              className="font-display text-3xl font-semibold tracking-[-0.02em] text-[#FAF8F5] drop-shadow-md"
              style={{
                opacity: headlineMask,
                transform: `translateY(${((1 - headlineMask) * 28).toFixed(1)}px)`,
              }}
            >
              Just speak. KYRIX understands.
            </h2>
          </div>
        </div>
      )}
    </WindowsDesktopBase>
  );
};
