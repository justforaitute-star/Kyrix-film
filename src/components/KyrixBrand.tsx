import React from 'react';
import { Mic, Power, Search } from 'lucide-react';
import { MascotMood } from '../film/timeline';

interface KyrixLogoProps {
  size?: number;
  className?: string;
}

/**
 * Official KYRIX emblem rendered directly from the brand logo asset.
 * Uses contrast-calibrated screen blending so the pure black ground disappears cleanly on dark studio surfaces.
 */
export const KyrixLogoMark: React.FC<KyrixLogoProps> = ({ size = 44, className = '' }) => {
  return (
    <img
      src="/assets/aistudio/image_adf24599.png"
      alt="KYRIX logo"
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      className={`shrink-0 select-none object-contain ${className}`}
      style={{
        width: size,
        height: size,
        mixBlendMode: 'screen',
        filter: 'contrast(1.2)',
      }}
    />
  );
};

export const KyrixWordmark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`font-display font-semibold tracking-[-0.03em] text-[#FAF8F5] ${className}`}>
    KYRIX
  </span>
);

function buildPuffyStarPath(cx: number, cy: number, outerR: number, innerR: number): string {
  const points = 12;
  const coords: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < points; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 6;
    const r = i % 2 === 0 ? outerR : innerR;
    coords.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    });
  }

  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const firstMid = mid(coords[coords.length - 1], coords[0]);
  let d = `M ${firstMid.x.toFixed(2)} ${firstMid.y.toFixed(2)}`;
  for (let i = 0; i < coords.length; i++) {
    const curr = coords[i];
    const next = coords[(i + 1) % coords.length];
    const nextMid = mid(curr, next);
    d += ` Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} ${nextMid.x.toFixed(2)} ${nextMid.y.toFixed(2)}`;
  }
  d += ' Z';
  return d;
}

const PUFFY_STAR_PATH = buildPuffyStarPath(60, 60, 48, 30);

interface KyrixMascotProps {
  mood: MascotMood;
  time: number;
  size?: number;
  lookX?: number;
  lookY?: number;
  tint?: 'pearl' | 'mint' | 'coral' | 'violet' | 'cyan';
  className?: string;
}

/**
 * Authentic KYRIX white-grey 6-pointed puffy star mascot.
 * Restrained, purposeful micro-motion: steady in idle, attentive gaze tracking,
 * subtle rhythmic breathing only while actively speaking/listening. Zero glow blobs.
 */
export const KyrixMascot: React.FC<KyrixMascotProps> = ({
  mood,
  time,
  size = 92,
  lookX = 0,
  lookY = 0,
  tint = 'pearl',
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const blinkCycle = time % 4.4;
  const isBlinking = blinkCycle > 4.24 && blinkCycle < 4.35;

  const tiltDeg =
    mood === 'listening'
      ? -2.5
      : mood === 'thinking'
        ? 4.0
        : mood === 'speaking'
          ? Math.sin(time * 4.5) * 1.4
          : 0;

  const eyeScaleY = isBlinking ? 0.14 : mood === 'listening' ? 1.1 : mood === 'speaking' ? 0.96 : 1;
  const eyeOffsetX =
    mood === 'thinking' ? Math.sin(time * 2.4) * 3.2 : lookX * 4.0;
  const eyeOffsetY =
    mood === 'thinking' ? -2.4 : mood === 'listening' ? -0.6 : lookY * 3.0;

  const shellPalette =
    tint === 'mint'
      ? { top: '#F0FDF4', mid: '#A7F3D0', bot: '#34D399' }
      : tint === 'coral'
        ? { top: '#FFF5F3', mid: '#FDBAAB', bot: '#FF6B5B' }
        : tint === 'violet'
          ? { top: '#F5F3FF', mid: '#DDD6FE', bot: '#8B5CF6' }
          : tint === 'cyan'
            ? { top: '#ECFEFF', mid: '#BAE6FD', bot: '#22D3EE' }
            : { top: '#FFFFFF', mid: '#E4E8F0', bot: '#B6C0CE' };

  const breatheScale =
    mood === 'speaking'
      ? 1 + Math.sin(time * 9.0) * 0.02
      : mood === 'listening'
        ? 1 + Math.sin(time * 3.2) * 0.012
        : 1;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${tiltDeg.toFixed(2)}deg) scale(${breatheScale.toFixed(3)})`,
        transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      aria-label={`KYRIX star mascot (${mood})`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 overflow-visible"
      >
        <defs>
          <radialGradient id={`star-body-${uid}`} cx="38%" cy="28%" r="74%">
            <stop offset="0%" stopColor={shellPalette.top} />
            <stop offset="58%" stopColor={shellPalette.mid} />
            <stop offset="100%" stopColor={shellPalette.bot} />
          </radialGradient>
          <linearGradient id={`star-sheen-${uid}`} x1="36" y1="18" x2="72" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id={`star-drop-${uid}`} x="-20%" y="-20%" width="140%" height="145%">
            <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#07090E" floodOpacity="0.38" />
          </filter>
        </defs>

        <path
          d={PUFFY_STAR_PATH}
          fill={`url(#star-body-${uid})`}
          stroke="rgba(255,255,255,0.86)"
          strokeWidth="1.3"
          filter={`url(#star-drop-${uid})`}
        />

        <ellipse
          cx="54"
          cy="38"
          rx="15"
          ry="7.5"
          fill={`url(#star-sheen-${uid})`}
          transform="rotate(-14 54 38)"
        />

        <g transform={`translate(${eyeOffsetX.toFixed(2)}, ${eyeOffsetY.toFixed(2)})`}>
          {/* Left eye */}
          <g transform={`translate(51.5, 58) scale(1, ${eyeScaleY.toFixed(3)})`}>
            {mood === 'speaking' && !isBlinking ? (
              <path
                d="M-3.5 1.5C-2.8 -3.2 2.8 -3.2 3.5 1.5"
                stroke="#151822"
                strokeWidth="3.1"
                strokeLinecap="round"
              />
            ) : (
              <>
                <rect x="-3.4" y="-6.0" width="6.8" height="12.0" rx="3.4" fill="#151822" />
                {!isBlinking && <circle cx="-1.1" cy="-2.7" r="1.15" fill="#FFFFFF" opacity="0.86" />}
              </>
            )}
          </g>

          {/* Right eye */}
          <g transform={`translate(68.5, 58) scale(1, ${eyeScaleY.toFixed(3)})`}>
            {mood === 'speaking' && !isBlinking ? (
              <path
                d="M-3.5 1.5C-2.8 -3.2 2.8 -3.2 3.5 1.5"
                stroke="#151822"
                strokeWidth="3.1"
                strokeLinecap="round"
              />
            ) : (
              <>
                <rect x="-3.4" y="-6.0" width="6.8" height="12.0" rx="3.4" fill="#151822" />
                {!isBlinking && <circle cx="-1.1" cy="-2.7" r="1.15" fill="#FFFFFF" opacity="0.86" />}
              </>
            )}
          </g>
        </g>

        {mood === 'listening' && (
          <circle cx="60" cy="74" r="2.1" fill="#0EA5E9" opacity="0.85" />
        )}
        {mood === 'thinking' && (
          <g opacity="0.88">
            {[0, 1, 2].map((idx) => (
              <circle
                key={idx}
                cx={54 + idx * 6}
                cy={74}
                r="1.4"
                fill="#7C3AED"
                opacity={0.35 + 0.65 * Math.max(0, Math.sin(time * 4.8 - idx * 1.1))}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};

interface KyrixSilkWaveProps {
  time: number;
  variant?: 'accent' | 'pearl';
  primaryColor?: string;
  secondaryColor?: string;
  amplitude?: number;
  className?: string;
}

/**
 * Translucent Silk ribbon voice waveform.
 * Supports both 'pearl' (fine white woven mesh in the top Listening Notch)
 * and 'accent' (themed silk ribbon in the expanded Style / Chat UI).
 */
export const KyrixSilkWave: React.FC<KyrixSilkWaveProps> = ({
  time,
  variant = 'accent',
  primaryColor = '#FF6B5B',
  secondaryColor = '#22D3EE',
  amplitude = 18,
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');

  const buildRibbon = (amp: number, freq: number, phase: number, drift: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= 420; x += 8) {
      const norm = x / 420;
      const env = Math.pow(Math.sin(norm * Math.PI), 1.35);
      const y =
        38 +
        Math.sin(norm * freq * Math.PI * 2 + time * 4.2 + phase) * amp * env +
        Math.cos(norm * freq * 1.45 * Math.PI - time * 2.8 + drift) * (amp * 0.34) * env;
      pts.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  if (variant === 'pearl') {
    const strands = [0, 1, 2, 3, 4, 5, 6];
    return (
      <svg viewBox="0 0 420 76" className={className} aria-hidden="true">
        <defs>
          <linearGradient id={`silk-pearl-${uid}`} x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.06" />
            <stop offset="32%" stopColor="#F8FAFC" stopOpacity="0.68" />
            <stop offset="72%" stopColor="#E2E8F0" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        {strands.map((i) => (
          <path
            key={i}
            d={buildRibbon(
              amplitude * (1 - i * 0.09),
              1.6 + i * 0.18,
              i * 0.32,
              i * 0.45,
            )}
            fill="none"
            stroke={`url(#silk-pearl-${uid})`}
            strokeWidth={i === 0 ? 1.8 : 1.0}
            strokeLinecap="round"
            opacity={0.78 - i * 0.08}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 420 76" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`silk-a-${uid}`} x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.1" />
          <stop offset="28%" stopColor={primaryColor} stopOpacity="0.92" />
          <stop offset="72%" stopColor="#8B5CF6" stopOpacity="0.88" />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={`silk-b-${uid}`} x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.1" />
          <stop offset="45%" stopColor={secondaryColor} stopOpacity="0.88" />
          <stop offset="85%" stopColor="#34D399" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={buildRibbon(amplitude * (1 - i * 0.14), 2.1 + i * 0.35, i * 0.65, i * 0.9)}
          fill="none"
          stroke={i % 2 === 0 ? `url(#silk-a-${uid})` : `url(#silk-b-${uid})`}
          strokeWidth={i === 0 ? 2.8 : 1.5}
          strokeLinecap="round"
          opacity={0.9 - i * 0.16}
        />
      ))}

      <path
        d={buildRibbon(amplitude * 0.55, 3.2, 1.9, 0.5)}
        fill="none"
        stroke="#FAF8F5"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.52"
      />
    </svg>
  );
};

interface KyrixCompactNotchProps {
  time: number;
  mood: MascotMood;
  /** 0 = compact idle (154px), 1 = widened listening notch (268px) */
  widenProgress?: number;
  tint?: 'pearl' | 'mint' | 'coral' | 'violet' | 'cyan';
  lookX?: number;
  lookY?: number;
  waveAmplitude?: number;
  opacity?: number;
  translateY?: number;
}

/**
 * Real KYRIX top-center Windows notch matching both the compact idle pill
 * and the widened Listening Notch (star mascot left + pearl white Silk wave right).
 */
export const KyrixCompactNotch: React.FC<KyrixCompactNotchProps> = ({
  time,
  mood,
  widenProgress = 0,
  tint = 'pearl',
  lookX = 0,
  lookY = 0,
  waveAmplitude = 19,
  opacity = 1,
  translateY = 0,
}) => {
  const w = 154 + widenProgress * (268 - 154);
  const h = 50 + widenProgress * 2;
  const mascotOffset = widenProgress * -86;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-0 z-30 flex items-center justify-center overflow-hidden rounded-b-[18px] border border-t-0 border-white/22 shadow-[0_14px_32px_-8px_rgba(0,0,0,0.52)]"
      style={{
        width: `${w.toFixed(1)}px`,
        height: `${h.toFixed(1)}px`,
        opacity,
        transform: `translate(-50%, ${translateY.toFixed(1)}px)`,
        background:
          'linear-gradient(175deg, rgba(62, 74, 94, 0.84) 0%, rgba(42, 52, 68, 0.90) 100%)',
        backdropFilter: 'blur(22px) saturate(130%)',
        WebkitBackdropFilter: 'blur(22px) saturate(130%)',
      }}
    >
      {/* Top specular highlight */}
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white/25" />

      {/* Star Mascot: centered when compact, smoothly glides left when widening to listen */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          transform: `translateX(${mascotOffset.toFixed(1)}px)`,
        }}
      >
        <KyrixMascot mood={mood} time={time} size={34} tint={tint} lookX={lookX} lookY={lookY} />
      </div>

      {/* Pearl Silk Waveform visible inside widened Listening Notch */}
      {widenProgress > 0.05 && (
        <div
          className="absolute right-3 top-1/2 h-9 w-[178px] -translate-y-1/2 overflow-hidden"
          style={{
            opacity: Math.max(0, (widenProgress - 0.15) / 0.85),
          }}
        >
          <KyrixSilkWave
            time={time}
            variant="pearl"
            amplitude={waveAmplitude}
            className="h-full w-full"
          />
        </div>
      )}
    </div>
  );
};

interface KyrixCaptionPillProps {
  speaker: 'You' | 'KYRIX';
  text: string;
  opacity?: number;
  translateY?: number;
}

/**
 * Exact frosted bottom-center live caption pill matching KYRIX's real Windows overlay.
 * - "You": Light frosted glass capsule with muted label and crisp dark speech text.
 * - "KYRIX": Dark frosted slate capsule with cyan brand label and crisp white speech text.
 */
export const KyrixCaptionPill: React.FC<KyrixCaptionPillProps> = ({
  speaker,
  text,
  opacity = 1,
  translateY = 0,
}) => {
  const isUser = speaker === 'You';
  return (
    <div
      className="pointer-events-none inline-flex max-w-[660px] items-center gap-3 rounded-full px-5 py-2.5 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.45)]"
      style={{
        opacity,
        transform: `translateY(${translateY.toFixed(1)}px)`,
        background: isUser
          ? 'linear-gradient(155deg, rgba(226, 232, 240, 0.82) 0%, rgba(203, 213, 225, 0.74) 100%)'
          : 'linear-gradient(155deg, rgba(44, 57, 78, 0.90) 0%, rgba(30, 39, 54, 0.94) 100%)',
        border: isUser
          ? '1px solid rgba(30, 41, 59, 0.28)'
          : '1px solid rgba(255, 255, 255, 0.20)',
        boxShadow: isUser
          ? '0 12px 28px -8px rgba(15, 23, 42, 0.3), inset 0 1px 0 rgba(255,255,255,0.6)'
          : '0 16px 34px -8px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255,255,255,0.22)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <span
        className="text-xs font-bold tracking-[0.01em] whitespace-nowrap"
        style={{ color: isUser ? '#475569' : '#38BDF8' }}
      >
        {speaker}
      </span>
      <span
        className="text-[15px] font-medium tracking-[-0.01em]"
        style={{ color: isUser ? '#0F172A' : '#FAF8F5' }}
      >
        {text}
      </span>
    </div>
  );
};

export type KyrixTabId = 'Today' | 'Tasks' | 'Chat' | 'Apps' | 'Wallpaper' | 'Stats' | 'Style';

const KYRIX_TABS: KyrixTabId[] = ['Today', 'Tasks', 'Chat', 'Apps', 'Wallpaper', 'Stats', 'Style'];

interface KyrixOverlayHeaderProps {
  activeTab: KyrixTabId;
  accentColor?: string;
  accentSecondary?: string;
  micActive?: boolean;
  searchActive?: boolean;
  time: number;
  mood?: MascotMood;
}

/**
 * Authentic KYRIX top-docked dashboard header bar matching the real Windows desktop agent.
 */
export const KyrixOverlayHeader: React.FC<KyrixOverlayHeaderProps> = ({
  activeTab,
  accentColor = '#FF6B5B',
  accentSecondary = '#FF944D',
  micActive = false,
  searchActive = false,
  time,
  mood = 'idle',
}) => {
  return (
    <div className="flex items-center justify-between border-b border-white/12 bg-white/[0.03] px-4 py-2.5">
      <div className="flex items-center gap-1">
        {KYRIX_TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <span
              key={tab}
              className="rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap transition-colors duration-200"
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${accentColor}, ${accentSecondary})`,
                      color: '#FFFFFF',
                    }
                  : { color: 'rgba(250,248,245,0.72)' }
              }
            >
              {tab}
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20"
          style={{
            background: `linear-gradient(135deg, ${accentColor}77, ${accentSecondary}44)`,
          }}
        >
          <KyrixMascot mood={mood} time={time} size={22} />
        </div>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/16 text-[#FAF8F5]/85"
          style={{
            background: searchActive ? `${accentColor}55` : 'rgba(255,255,255,0.07)',
          }}
        >
          <Search className="h-3.5 w-3.5" />
        </div>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/16 text-[#FAF8F5]/90"
          style={{
            background: micActive
              ? `linear-gradient(135deg, ${accentColor}, ${accentSecondary})`
              : 'rgba(255,255,255,0.07)',
          }}
        >
          <Mic className="h-3.5 w-3.5" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/16 bg-white/[0.08] text-[#FAF8F5]/80">
          <Power className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};
