import { Atom, FlaskConical, Hourglass, Wind, Zap } from 'lucide-react';
import type { ComponentType } from 'react';
import type { Effects } from '../../game/types';
import { cn } from '../../design-system';

/**
 * Effects as arrows, not numbers (SCENARIOS_MISSION_01.md §1): ▲ green = good, ▼ red = bad,
 * radiation ▲ is red because dose is bad, ★ is gold. A double arrow marks a big change.
 */
const items: Array<{
  key: keyof Effects;
  label: string;
  Icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  /** Is a positive number good for the crew? */
  upIsGood: boolean;
}> = [
  { key: 'lifeSupport', label: 'Air', Icon: Wind, upIsGood: true },
  { key: 'power', label: 'Power', Icon: Zap, upIsGood: true },
  { key: 'radiation', label: 'Radiation', Icon: Atom, upIsGood: false },
  { key: 'science', label: 'Science', Icon: FlaskConical, upIsGood: true },
];

export function EffectChips({
  effects,
  bigAt,
  laterHint,
  onColor = false,
  className,
}: {
  effects: Effects;
  bigAt: number;
  laterHint?: string;
  /** White chips for use on a coloured button (the decision sidebar). */
  onColor?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {items.map(({ key, label, Icon, upIsGood }) => {
        const v = effects[key];
        if (!v) return null;
        const up = v > 0;
        const good = key === 'science' ? true : up === upIsGood;
        const arrow = (up ? '▲' : '▼').repeat(Math.abs(v) >= bigAt ? 2 : 1);
        return (
          <li
            key={key}
            aria-label={`${label} ${up ? 'goes up' : 'goes down'}${Math.abs(v) >= bigAt ? ' a lot' : ''}`}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-base font-bold',
              onColor
                ? cn('border-white bg-white', key === 'science' ? 'text-amber-600' : good ? 'text-emerald-700' : 'text-red-600')
                : key === 'science'
                  ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-300'
                  : good
                    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                    : 'border-red-400/40 bg-red-400/10 text-red-300',
            )}
          >
            <Icon aria-hidden className="size-4" />
            <span aria-hidden>{arrow}</span>
          </li>
        );
      })}
      {laterHint && (
        <li
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-base font-bold',
            onColor ? 'border-white bg-white text-blue-700' : 'border-blue-400/40 bg-blue-400/10 text-blue-300',
          )}
        >
          <Hourglass aria-hidden className="size-4" />
          <span>{laterHint}</span>
        </li>
      )}
    </ul>
  );
}
