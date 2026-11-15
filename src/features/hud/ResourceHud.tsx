import { Atom, Pause, Star, Wind, Zap } from 'lucide-react';
import type { ComponentType } from 'react';
import { cn } from '../../design-system';

/** Top bar from the Solar Crisis design: Life Support, Power, Radiation, Science Stars, Pause. */
interface Props {
  lifeSupport: number;
  power: number;
  /** 0–100 meter where 100 is the abort level. */
  radiation: number;
  stars: number;
  onPause: () => void;
}

export function ResourceHud({ lifeSupport, power, radiation, stars, onPause }: Props) {
  return (
    <header className="relative z-10 flex items-center gap-3">
      <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border-2 border-blue-400/40 bg-slate-950/75 px-5 py-3 backdrop-blur-sm lg:grid-cols-4">
        <Meter Icon={Wind} label="Life Support" value={lifeSupport} icon="text-cyan-300" bar="bg-cyan-400" />
        <Meter Icon={Zap} label="Power" value={power} icon="text-yellow-300" bar="bg-yellow-400" />
        <Meter Icon={Atom} label="Radiation" value={radiation} icon="text-purple-300" bar="bg-purple-400" />
        <div className="flex items-center gap-3">
          <Star aria-hidden className="size-8 fill-star text-star" />
          <div>
            <p className="text-sm text-blue-100/80">Science Stars</p>
            <p className="text-xl leading-none font-bold text-white">{stars} / 5</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onPause}
        aria-label="Pause"
        className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-blue-400/60 bg-slate-950/75 text-white backdrop-blur-sm transition hover:bg-slate-900"
      >
        <Pause aria-hidden className="size-6 fill-current" />
      </button>
    </header>
  );
}

function Meter({
  Icon,
  label,
  value,
  icon,
  bar,
}: {
  Icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  label: string;
  value: number;
  icon: string;
  bar: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-3">
      <Icon aria-hidden className={cn('size-8 shrink-0', icon)} />
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline justify-between gap-2 text-sm text-blue-100/80">
          {label}
          <span className="text-xl leading-none font-bold text-white">{pct}%</span>
        </p>
        <div
          role="meter"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/15"
        >
          <div className={cn('h-full rounded-full transition-[width] duration-500', bar)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
