import { Atom, Pause, Star, TriangleAlert, Wind, Zap } from 'lucide-react';
import type { ComponentType } from 'react';
import { cn } from '../../design-system';

/** Top bar from the Solar Crisis design: Life Support, Power, Radiation, Science Stars, Pause. */
interface Props {
  lifeSupport: number;
  power: number;
  /** 0–100 meter where 100 is the abort level. */
  radiation: number;
  stars: number;
  /** Resources in their warning zone: shown with a red bar and a warning mark. */
  low?: readonly ('lifeSupport' | 'power' | 'radiation')[];
  onPause: () => void;
}

export function ResourceHud({ lifeSupport, power, radiation, stars, low = [], onPause }: Props) {
  return (
    <header className="relative z-10 flex items-center gap-3 short:gap-2">
      <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border-2 border-blue-400/40 bg-slate-950/75 px-5 py-3 backdrop-blur-sm max-sm:grid-cols-4 max-sm:gap-x-3 max-sm:gap-y-0 max-sm:rounded-xl max-sm:border max-sm:px-3 max-sm:py-2 lg:grid-cols-4 short:grid-cols-4 short:gap-x-3 short:rounded-xl short:px-3 short:py-1.5">
        <Meter Icon={Wind} label="Life Support" value={lifeSupport} icon="text-cyan-300" bar="bg-cyan-400" low={low.includes('lifeSupport')} />
        <Meter Icon={Zap} label="Power" value={power} icon="text-yellow-300" bar="bg-yellow-400" low={low.includes('power')} />
        <Meter Icon={Atom} label="Radiation" value={radiation} icon="text-purple-300" bar="bg-purple-400" low={low.includes('radiation')} />
        <div className="flex items-center gap-3 max-sm:items-start max-sm:gap-1.5 short:gap-1.5">
          <Star aria-hidden className="size-8 fill-star text-star max-sm:size-5 short:size-5" />
          <div>
            <p className="text-sm text-blue-100/80 max-sm:hidden short:hidden">Science Stars</p>
            <p className="text-xl leading-none font-bold text-white max-sm:text-base short:text-lg">{stars} / 5</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onPause}
        aria-label="Pause"
        className="grid size-14 shrink-0 max-sm:size-10 short:size-9 place-items-center rounded-full border-2 border-blue-400/60 bg-slate-950/75 text-white backdrop-blur-sm transition hover:bg-slate-900"
      >
        <Pause aria-hidden className="size-6 fill-current short:size-4" />
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
  low,
}: {
  Icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  label: string;
  value: number;
  icon: string;
  bar: string;
  low: boolean;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:content-start max-sm:gap-x-1.5 max-sm:gap-y-1 short:gap-1.5">
      <Icon aria-hidden className={cn('size-8 shrink-0 max-sm:size-5 short:size-5', icon)} />
      <div className="min-w-0 flex-1 max-sm:contents">
        <p className="flex items-baseline justify-between gap-2 text-sm text-blue-100/80 max-sm:flex-1 max-sm:justify-start short:text-sm">
          <span className="max-sm:sr-only short:sr-only">{label}</span>
          <span className={cn('flex items-center gap-1 text-xl leading-none font-bold max-sm:text-base short:text-lg', low ? 'text-red-300' : 'text-white')}>
            {low && <TriangleAlert aria-label="Low" className="size-4" />}
            {pct}%
          </span>
        </p>
        <div
          role="meter"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="mt-1.5 h-2 overflow-hidden max-sm:mt-0 max-sm:h-1.5 max-sm:basis-full short:mt-1 short:h-1.5 rounded-full bg-white/15"
        >
          <div className={cn('h-full rounded-full transition-[width] duration-500', low ? 'bg-red-400' : bar)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
