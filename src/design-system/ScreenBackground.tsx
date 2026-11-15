import type { ReactNode } from 'react';
import { cn } from './cn';

/**
 * Deep-space page background (#050b1a) with the soft coloured glows and
 * scattered star dots used across the designs.
 * - `center`  blue glow centre-left + purple glow lower-right (Learn to Survive)
 * - `top`     faint blue glow from the top (Briefing, Levels)
 */
export type GlowPreset = 'none' | 'center' | 'top';

const glows: Record<GlowPreset, string> = {
  none: '',
  center:
    'bg-[radial-gradient(ellipse_45%_45%_at_42%_38%,rgb(30_64_175/0.35),transparent_70%),radial-gradient(ellipse_40%_40%_at_70%_60%,rgb(107_33_168/0.28),transparent_70%)]',
  top: 'bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(30_58_138/0.35),transparent_70%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgb(76_29_149/0.25),transparent_70%)]',
};

/** Fixed star positions (percent) so the sky never jumps between renders. */
const STARS: Array<[x: number, y: number, size: number, color: string]> = [
  [5.6, 3.8, 3, 'bg-white'],
  [88.3, 15, 6, 'bg-blue-400'],
  [33.3, 88.6, 3, 'bg-purple-400'],
  [72, 8, 2, 'bg-white'],
  [14, 62, 2, 'bg-blue-300'],
  [94, 74, 3, 'bg-white'],
];

export function ScreenBackground({
  glow = 'top',
  stars = true,
  className,
  children,
}: {
  glow?: GlowPreset;
  stars?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('relative min-h-dvh overflow-hidden bg-space', glows[glow], className)}>
      {stars && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {STARS.map(([x, y, s, c], i) => (
            <span
              key={i}
              className={cn('absolute animate-twinkle rounded-full', c)}
              style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
