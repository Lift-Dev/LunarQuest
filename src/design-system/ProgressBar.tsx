import { cn } from './cn';

/** Resource bar from the Learn to Survive cards: label left, value right, 12px track. */
export type ResourceTone = 'life' | 'power' | 'radiation';

const tones: Record<ResourceTone, { label: string; fill: string; glow: string }> = {
  life: { label: 'text-life-soft', fill: 'from-cyan-500 to-cyan-400', glow: 'shadow-[0_0_12px_rgb(34_211_238/0.5)]' },
  power: { label: 'text-power-soft', fill: 'from-yellow-500 to-yellow-400', glow: 'shadow-[0_0_12px_rgb(250_204_21/0.5)]' },
  radiation: { label: 'text-radiation-soft', fill: 'from-purple-500 to-purple-400', glow: 'shadow-[0_0_12px_rgb(192_132_252/0.5)]' },
};

interface Props {
  tone: ResourceTone;
  label: string;
  /** 0–100 */
  value: number;
  className?: string;
}

export function ProgressBar({ tone, label, value, className }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const t = tones[tone];
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('mb-2 flex justify-between text-xs font-bold tracking-wider uppercase', t.label)}>
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-white/10"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-[width] duration-500', t.fill, t.glow)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
