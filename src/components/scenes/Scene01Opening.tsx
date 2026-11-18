import React from 'react';
import { KyrixLogoMark, KyrixWordmark } from '../KyrixBrand';
import { easeOutExpo, easeOutQuart, rangeProgress } from '../../film/timeline';
import { StudioBackdrop } from './StudioBackdrop';

interface SceneProps {
  time: number;
}

/**
 * Scene 01 (0-8s): Apple-keynote style restrained studio opening.
 * Directional key light reveals the sculpted KYRIX emblem & wordmark
 * with masked vertical typography and calibrated letter-spacing settle.
 */
export const Scene01Opening: React.FC<SceneProps> = ({ time }) => {
  const lightIn = easeOutQuart(rangeProgress(time, 0.2, 2.2));
  const markReveal = easeOutExpo(rangeProgress(time, 1.1, 2.7));
  const wordmarkReveal = easeOutExpo(rangeProgress(time, 1.6, 3.2));
  const lineReveal = easeOutQuart(rangeProgress(time, 3.0, 4.3));
  const subtlePush = easeOutQuart(rangeProgress(time, 0.5, 8.0));

  const letterSpacing = 0.04 - wordmarkReveal * 0.07; // settles cleanly to -0.03em

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#08090C]">
      <StudioBackdrop lightOpacity={lightIn} />

      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          transform: `scale(${(0.96 + subtlePush * 0.04).toFixed(4)})`,
        }}
      >
        {/* Emblem + Wordmark Lockup */}
        <div className="mb-5 flex items-center gap-4">
          <div
            style={{
              opacity: markReveal,
              transform: `scale(${(0.86 + markReveal * 0.14).toFixed(3)})`,
            }}
          >
            <KyrixLogoMark size={62} />
          </div>

          {/* Masked horizontal/vertical wordmark reveal */}
          <div className="overflow-hidden py-1">
            <div
              style={{
                opacity: wordmarkReveal,
                transform: `translateY(${((1 - wordmarkReveal) * 32).toFixed(1)}px)`,
                letterSpacing: `${letterSpacing.toFixed(3)}em`,
              }}
            >
              <KyrixWordmark className="text-5xl font-semibold tracking-normal" />
            </div>
          </div>
        </div>

        {/* Masked kinetic phrase reveal */}
        <div className="overflow-hidden py-1">
          <h1
            className="font-display text-3xl font-medium tracking-[-0.02em] text-[#FAF8F5]/92"
            style={{
              opacity: lineReveal,
              transform: `translateY(${((1 - lineReveal) * 28).toFixed(1)}px)`,
            }}
          >
            Meet KYRIX.
          </h1>
        </div>
      </div>
    </div>
  );
};
