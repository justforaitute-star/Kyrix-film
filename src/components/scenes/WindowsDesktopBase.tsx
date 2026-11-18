import React from 'react';
import { Folder, Globe, Mail, Music, Search, StickyNote } from 'lucide-react';
import { KyrixLogoMark } from '../KyrixBrand';

interface WindowsDesktopBaseProps {
  dimmed?: number;
  scale?: number;
  showKyrixInTaskbar?: boolean;
  children?: React.ReactNode;
}

/**
 * Architectural studio steel-slate Windows 11 desktop canvas matching the real KYRIX desktop
 * environment. Clean brushed slate gradient with realistic frosted taskbar.
 */
export const WindowsDesktopBase: React.FC<WindowsDesktopBaseProps> = ({
  dimmed = 0,
  scale = 1,
  showKyrixInTaskbar = true,
  children,
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1D2632]">
      {/* Calm studio brushed steel-slate desktop surface with restrained scale transform */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${scale.toFixed(4)})`,
          background:
            'radial-gradient(ellipse 95% 80% at 50% 24%, #647B94 0%, #3E4F63 48%, #1E2733 100%)',
        }}
      >
        {/* Ultra-subtle architectural light gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 45%, rgba(0,0,0,0.28) 100%)',
          }}
        />
        <div
          className="absolute inset-0 bg-[#0A0D12]"
          style={{ opacity: dimmed }}
        />
      </div>

      {/* Desktop stage contents */}
      <div className="relative z-10 h-full w-full">{children}</div>

      {/* Realistic centered Windows 11 frosted taskbar */}
      <div
        className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/16 bg-[#171C24]/82 px-3.5 py-2 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
        aria-hidden="true"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/8 text-[#38BDF8]">
          <div className="grid grid-cols-2 gap-[1.5px]">
            <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
            <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
            <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
            <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
          </div>
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#FAF8F5]/75">
          <Search className="h-3.5 w-3.5" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/6 text-[#FAF8F5]/85">
          <Folder className="h-3.5 w-3.5 text-[#FF944D]" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#FAF8F5]/85">
          <Globe className="h-3.5 w-3.5 text-[#22D3EE]" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#FAF8F5]/85">
          <StickyNote className="h-3.5 w-3.5 text-[#FAF8F5]/85" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#FAF8F5]/85">
          <Mail className="h-3.5 w-3.5 text-[#8B5CF6]" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#FAF8F5]/85">
          <Music className="h-3.5 w-3.5 text-[#34D399]" />
        </div>

        {showKyrixInTaskbar && (
          <>
            <div className="mx-0.5 h-4 w-px bg-white/15" />
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0B0D12]/90 ring-1 ring-white/25">
              <KyrixLogoMark size={16} />
            </div>
          </>
        )}

        <div className="ml-2 border-l border-white/12 pl-2.5 text-right text-[10px] leading-tight text-[#FAF8F5]/78 tabular-nums">
          <div>09:42</div>
          <div className="text-[9px] text-[#FAF8F5]/50">Mon</div>
        </div>
      </div>
    </div>
  );
};

interface DesktopCursorProps {
  x: number;
  y: number;
  clickProgress?: number; // 0 = idle, 0..1 = active click ripple & press
  opacity?: number;
}

/**
 * Crisp Windows-style hardware cursor with calibrated click feedback.
 */
export const DesktopCursor: React.FC<DesktopCursorProps> = ({
  x,
  y,
  clickProgress = 0,
  opacity = 1,
}) => {
  const isClicking = clickProgress > 0 && clickProgress < 1;
  const pressScale = isClicking ? 1 - Math.sin(clickProgress * Math.PI) * 0.14 : 1;

  return (
    <div
      className="pointer-events-none absolute z-40"
      style={{
        left: `${x.toFixed(1)}px`,
        top: `${y.toFixed(1)}px`,
        opacity,
        transform: `scale(${pressScale.toFixed(3)})`,
      }}
      aria-hidden="true"
    >
      {isClicking && (
        <span
          className="absolute -left-2.5 -top-2.5 h-6 w-6 rounded-full border border-white/75"
          style={{
            opacity: 1 - clickProgress,
            transform: `scale(${(0.45 + clickProgress * 1.15).toFixed(2)})`,
          }}
        />
      )}
      <svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.48)]"
      >
        <path
          d="M2.2 1.8L17.2 10.6L10.3 12.1L13.5 18.6L11.1 19.8L7.9 13.3L3.1 17.5V1.8Z"
          fill="#FFFFFF"
          stroke="#111827"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
