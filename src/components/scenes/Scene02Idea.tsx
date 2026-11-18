import React from 'react';
import { Calendar, Code2, FileText } from 'lucide-react';
import { KyrixCompactNotch } from '../KyrixBrand';
import {
  easeInOutQuart,
  easeOutExpo,
  easeOutQuart,
  rangeProgress,
  springSettle,
} from '../../film/timeline';
import { DesktopCursor, WindowsDesktopBase } from './WindowsDesktopBase';

interface SceneProps {
  time: number;
}

/**
 * Scene 02 (8-17s): Modern desktop workspace with cursor interaction.
 * At 11.8s windows smoothly dim & scale back with subtle depth parallax
 * as the compact KYRIX top-edge notch glides cleanly into view.
 */
export const Scene02Idea: React.FC<SceneProps> = ({ time }) => {
  const enter = easeOutQuart(rangeProgress(time, 8.0, 9.2));
  const simplify = easeInOutQuart(rangeProgress(time, 11.8, 14.8));
  const notchDrop = springSettle(rangeProgress(time, 12.1, 13.3));
  const headlineMask = easeOutExpo(rangeProgress(time, 13.0, 14.5));

  // Purposeful cursor glide from VS Code (left) to Nordic Studio Brief (right)
  const moveT = easeInOutQuart(rangeProgress(time, 8.6, 11.5));
  const cursorX = 290 + moveT * 610;
  const cursorY = 235 - moveT * 45;
  const clickT = rangeProgress(time, 11.5, 12.0);

  const briefFocused = moveT > 0.88;

  return (
    <WindowsDesktopBase
      dimmed={0.08 + simplify * 0.42}
      scale={1.0 + (1 - simplify) * 0.015}
      showKyrixInTaskbar={notchDrop > 0.3}
    >
      {/* Top-center compact KYRIX notch sliding smoothly from top bezel */}
      <KyrixCompactNotch
        time={time}
        mood="idle"
        widenProgress={0}
        opacity={notchDrop}
        translateY={(1 - notchDrop) * -54}
        lookX={cursorX > 640 ? 0.35 : -0.35}
        lookY={0.25}
      />

      {/* Realistic Workspace Windows with subtle depth parallax */}
      <div
        className="relative h-full w-full"
        style={{
          opacity: enter * (1 - simplify * 0.72),
          transform: `scale(${(1 - simplify * 0.045).toFixed(4)})`,
        }}
      >
        {/* Window 1: Code Editor */}
        <div
          className="liquid-glass absolute left-14 top-16 w-[370px] rounded-2xl p-4 text-left"
          style={{
            transform: `translate3d(${(moveT * -8).toFixed(1)}px, 0, 0)`,
          }}
        >
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-[#FAF8F5]/88">
              <Code2 className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>VS Code — workspace.tsx</span>
            </div>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="space-y-1.5 font-mono-tabular text-[11px] text-[#FAF8F5]/65">
            <div><span className="text-[#A78BFA]">export</span> function syncContext() &#123;</div>
            <div className="pl-3 text-[#34D399]">return desktopAgent.observe(activeTab);</div>
            <div className="pl-3 text-[#FAF8F5]/45">Idle · waiting for input</div>
            <div>&#125;</div>
          </div>
        </div>

        {/* Window 2: Design Brief (becomes active on cursor click) */}
        <div
          className="liquid-glass-light absolute right-14 top-16 w-[350px] rounded-2xl p-4 text-[#14161F] transition-shadow duration-200"
          style={{
            transform: `translate3d(${(moveT * 8).toFixed(1)}px, ${(briefFocused ? -3 : 0).toFixed(1)}px, 0)`,
            boxShadow: briefFocused
              ? '0 24px 50px -12px rgba(10,14,24,0.48), 0 0 0 1.5px rgba(56,189,248,0.6)'
              : undefined,
          }}
        >
          <div className="mb-2.5 flex items-center gap-2 border-b border-black/10 pb-2 text-xs font-semibold">
            <FileText className="h-3.5 w-3.5 text-[#FF6B5B]" />
            <span>Nordic Studio Brief</span>
          </div>
          <p className="text-xs leading-relaxed text-[#14161F]/80">
            Finalize timber pavilion specs, compare acoustic materials, and send Tokyo schedule before 15:00.
          </p>
        </div>

        {/* Window 3: Calendar Schedule */}
        <div
          className="liquid-glass absolute bottom-24 left-[26%] w-[340px] rounded-2xl p-4"
          style={{
            transform: `translate3d(0, ${(moveT * 6).toFixed(1)}px, 0)`,
          }}
        >
          <div className="mb-2.5 flex items-center gap-2 text-xs font-medium text-[#FAF8F5]/88">
            <Calendar className="h-3.5 w-3.5 text-[#FF944D]" />
            <span>Today · 3 Upcoming</span>
          </div>
          <div className="space-y-2 text-[11px] text-[#FAF8F5]/80">
            <div className="flex justify-between rounded-lg bg-white/8 px-2.5 py-1.5">
              <span>Product Design Review</span>
              <span className="font-mono-tabular text-[#FAF8F5]/60">11:00</span>
            </div>
            <div className="flex justify-between rounded-lg bg-white/8 px-2.5 py-1.5">
              <span>Engineering Sync</span>
              <span className="font-mono-tabular text-[#FAF8F5]/60">14:30</span>
            </div>
          </div>
        </div>

        <DesktopCursor
          x={cursorX}
          y={cursorY}
          clickProgress={clickT}
          opacity={1 - simplify}
        />
      </div>

      {/* Centered Masked Headline */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8 text-center">
        <div className="overflow-hidden py-2">
          <h2
            className="max-w-2xl font-display text-4xl font-semibold tracking-[-0.025em] text-[#FAF8F5] drop-shadow-md"
            style={{
              opacity: headlineMask,
              transform: `translateY(${((1 - headlineMask) * 34).toFixed(1)}px)`,
            }}
          >
            Your computer should understand you.
          </h2>
        </div>
      </div>
    </WindowsDesktopBase>
  );
};
