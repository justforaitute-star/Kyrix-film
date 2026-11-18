import React from 'react';
import { KyrixLogoMark, KyrixMascot, KyrixWordmark } from '../KyrixBrand';
import { easeInOutQuart, easeOutExpo, easeOutQuart, rangeProgress } from '../../film/timeline';
import { StudioBackdrop } from './StudioBackdrop';

interface SceneProps {
  time: number;
}

/**
 * Scene 08 (76-88s): Restrained Apple-keynote style Final Reveal.
 * Calm obsidian studio stage with static overhead lighting (zero spinning conic gradients),
 * crisp emblem + mascot + wordmark reveal, and smooth fade to true black at 85.6-88s.
 */
export const Scene08Finale: React.FC<SceneProps> = ({ time }) => {
  const logoIn = easeOutExpo(rangeProgress(time, 76.4, 78.1));
  const subtitleIn = easeOutQuart(rangeProgress(time, 78.2, 79.8));
  const fadeToBlack = easeInOutQuart(rangeProgress(time, 85.6, 88.0));

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#08090C]">
      <StudioBackdrop lightOpacity={logoIn * (1 - fadeToBlack)} />

      <div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{
          opacity: logoIn * (1 - fadeToBlack),
          transform: `scale(${(0.95 + logoIn * 0.05).toFixed(4)})`,
        }}
      >
        <div className="mb-5 flex items-center gap-4">
          <KyrixLogoMark size={72} />
          <KyrixMascot mood="idle" time={time} size={66} />
        </div>

        <h1 className="font-display text-5xl font-semibold tracking-[-0.03em] text-[#FAF8F5] sm:text-6xl">
          <KyrixWordmark />
        </h1>

        <div className="mt-3 overflow-hidden py-1">
          <p
            className="font-display text-lg font-medium tracking-[-0.01em] text-[#FAF8F5]/82 sm:text-xl"
            style={{
              opacity: subtitleIn,
              transform: `translateY(${((1 - subtitleIn) * 22).toFixed(1)}px)`,
            }}
          >
            A Customizable Real-Time AI Agent.
          </p>
        </div>
      </div>

      {/* Clean fade to true black at end of 88s film */}
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-black"
        style={{ opacity: fadeToBlack }}
      />
    </div>
  );
};
