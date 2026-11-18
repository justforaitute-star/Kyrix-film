import React from 'react';

interface StudioBackdropProps {
  lightOpacity?: number;
  className?: string;
}

/**
 * Clean, restrained obsidian studio backdrop with subtle directional overhead key light.
 * Zero random blobs, zero drifting particles, zero spinning gradients.
 */
export const StudioBackdrop: React.FC<StudioBackdropProps> = ({
  lightOpacity = 1,
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-[#08090C] ${className}`}
      aria-hidden="true"
    >
      {/* Subtle architectural overhead studio key light */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: lightOpacity,
          background:
            'radial-gradient(ellipse 68% 48% at 50% 18%, rgba(148, 173, 206, 0.14) 0%, rgba(56, 68, 92, 0.06) 52%, transparent 82%)',
        }}
      />
      {/* Subtle edge vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55) 100%)',
        }}
      />
    </div>
  );
};
