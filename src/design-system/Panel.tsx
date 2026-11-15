import type { ComponentPropsWithoutRef } from 'react';
import { cn } from './cn';

/**
 * Rounded translucent panels from the designs:
 * - `card`    Learn to Survive resource cards (slate-800/50, white/10 border, 16px radius)
 * - `solid`   Briefing text panel (slate-900/80, blue-500/30 border, 16px radius)
 * - `row`     Locked level row (slate-900/40, white/10 border, 12px radius)
 * - `active`  Highlighted level card (slate-900/80, 2px blue-400 border + soft outer ring)
 */
export type PanelVariant = 'card' | 'solid' | 'row' | 'active';

const variants: Record<PanelVariant, string> = {
  card: 'rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-sm',
  solid: 'rounded-2xl border border-blue-500/30 bg-slate-900/80 backdrop-blur-sm',
  row: 'rounded-xl border border-white/10 bg-slate-900/40',
  active: 'rounded-2xl border-2 border-blue-400 bg-slate-900/80 ring-[6px] ring-blue-500/20 shadow-glow-panel',
};

type Props = ComponentPropsWithoutRef<'div'> & { variant?: PanelVariant };

export function Panel({ variant = 'card', className, ...rest }: Props) {
  return <div {...rest} className={cn(variants[variant], className)} />;
}
