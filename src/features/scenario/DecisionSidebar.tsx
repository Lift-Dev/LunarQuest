import { Atom, BatteryCharging, ChevronRight, FlaskConical, TriangleAlert, Wind } from 'lucide-react';
import type { ComponentType } from 'react';
import type { Decision, Effects, Scenario } from '../../game/types';
import { cn } from '../../design-system';
import { EffectChips } from './EffectChips';
import { RichText } from './RichText';

/**
 * Today's situation and the two choices, as a side card (after the Day 1 reference image):
 * cream card, amber title bar with a warning mark, a blue option A and a green option B.
 * Picking an option is final (no confirm step), as decided.
 */
interface Props {
  day: number;
  scenario: Scenario;
  bigAt: number;
  /** Extra note under the story, e.g. the real solar flare on Day 6. */
  note?: React.ReactNode;
  onChoose: (decisionId: string) => void;
  className?: string;
}

const STYLES = [
  { letter: 'A', button: 'from-blue-500 to-blue-600 border-blue-300', ring: 'shadow-[0_4px_0_0_rgb(30_64_175)]' },
  { letter: 'B', button: 'from-green-400 to-green-500 border-green-200', ring: 'shadow-[0_4px_0_0_rgb(21_128_61)]' },
] as const;

export function DecisionSidebar({ day, scenario, bigAt, note, onChoose, className }: Props) {
  return (
    <section aria-label="Today's mission" className={cn('overflow-hidden rounded-2xl border-[3px] border-amber-400 bg-amber-50 shadow-xl', className)}>
      <header className="flex items-center gap-3 bg-gradient-to-b from-amber-300 to-amber-400 px-4 py-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-white bg-orange-500 text-white">
          <TriangleAlert aria-hidden className="size-4" />
        </span>
        <h1 className="text-lg leading-tight font-bold tracking-wide text-slate-900 uppercase">
          Day {day} — {scenario.title}
        </h1>
      </header>

      <div className="space-y-3 p-4">
        <p className="text-lg leading-6 text-slate-800">
          <RichText text={scenario.description} strongClass="text-slate-950" />
        </p>
        {note}

        <div className="space-y-3 pt-1">
          {scenario.decisions.map((d, i) => (
            <OptionButton key={d.id} decision={d} style={STYLES[i]!} bigAt={bigAt} onChoose={() => onChoose(d.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OptionButton({ decision, style, bigAt, onChoose }: { decision: Decision; style: (typeof STYLES)[number]; bigAt: number; onChoose: () => void }) {
  const Icon = iconFor(decision.effects);
  return (
    <button
      type="button"
      onClick={onChoose}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl border-2 bg-gradient-to-b p-3 text-left text-white transition',
        'hover:brightness-110 active:translate-y-0.5 active:shadow-none',
        style.button,
        style.ring,
      )}
    >
      <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/90 text-slate-800">
        <Icon className="size-7" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg leading-tight font-bold">
          <span className="sr-only">Option {style.letter}: </span>
          <span aria-hidden>Option {style.letter}:</span> {decision.title}
        </span>
        <span className="mt-0.5 block text-[0.95rem] leading-5 text-white/95">{decision.explanation}</span>
        <EffectChips effects={decision.effects} bigAt={bigAt} laterHint={decision.laterHint} onColor className="mt-2 gap-1.5 [&_li]:py-0.5 [&_li]:text-sm" />
      </span>
      <ChevronRight aria-hidden className="size-7 shrink-0 transition group-hover:translate-x-0.5" />
    </button>
  );
}

/** A picture for the option: the first thing it gains, else the first thing it changes. */
function iconFor(e: Effects): ComponentType<{ className?: string }> {
  const order: Array<keyof Effects> = ['science', 'power', 'lifeSupport', 'radiation'];
  const key = order.find((k) => (e[k] ?? 0) > 0 && k !== 'radiation') ?? order.find((k) => e[k]) ?? 'science';
  return { science: FlaskConical, power: BatteryCharging, lifeSupport: Wind, radiation: Atom }[key];
}
