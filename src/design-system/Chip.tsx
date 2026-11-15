import type { ReactNode } from 'react';
import { cn } from './cn';

/** Small rounded label, e.g. "BRIEFING INITIATED" (blue) or "LEVEL 01 · NEXT MISSION" (yellow). */
export type ChipTone = 'blue' | 'yellow';

const tones: Record<ChipTone, string> = {
  blue: 'border-blue-400/30 bg-blue-600/20 text-blue-300 text-sm px-4 py-1',
  yellow: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300 text-xs px-3 py-0.5',
};

export function Chip({ tone = 'blue', className, children }: { tone?: ChipTone; className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-block rounded-full border font-bold tracking-wider uppercase', tones[tone], className)}>
      {children}
    </span>
  );
}
