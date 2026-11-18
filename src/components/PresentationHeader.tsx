import React from 'react';
import { KyrixLogoMark } from './KyrixBrand';

export type PresentationMode = 'film' | 'slides';

interface PresentationHeaderProps {
  mode: PresentationMode;
  onChangeMode: (mode: PresentationMode) => void;
  primaryLabel: string;
  onPrimaryAction: () => void;
}

/**
 * Shared 3-zone top bar across both the 88s Launch Film and the 18-Slide Keynote Deck.
 * Keeps identical geometry and zero layout jump when switching modes.
 */
export const PresentationHeader: React.FC<PresentationHeaderProps> = ({
  mode,
  onChangeMode,
  primaryLabel,
  onPrimaryAction,
}) => {
  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
      <a
        href="#top"
        className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-[#FAF8F5] whitespace-nowrap shrink-0"
      >
        <KyrixLogoMark size={22} />
        <span>KYRIX</span>
      </a>

      <div
        role="tablist"
        aria-label="Presentation mode"
        className="inline-flex items-center gap-1 rounded-xl border border-white/12 bg-[#12141B] p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'film'}
          onClick={() => onChangeMode('film')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            mode === 'film'
              ? 'bg-white/14 text-[#FAF8F5] shadow-sm'
              : 'text-[#FAF8F5]/60 hover:text-[#FAF8F5]'
          }`}
        >
          Launch Film
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'slides'}
          onClick={() => onChangeMode('slides')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            mode === 'slides'
              ? 'bg-white/14 text-[#FAF8F5] shadow-sm'
              : 'text-[#FAF8F5]/60 hover:text-[#FAF8F5]'
          }`}
        >
          Keynote Slides
        </button>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onPrimaryAction}
          className="rounded-lg bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#0B0C10] hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {primaryLabel}
        </button>
      </div>
    </header>
  );
};
