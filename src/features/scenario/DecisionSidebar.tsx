import { Atom, BatteryCharging, ChevronRight, FlaskConical, Wind, Wrench } from 'lucide-react';
import type { ComponentType } from 'react';
import type { Decision, Effects, Scenario } from '../../game/types';
import { Mascot, cn, type MascotPose } from '../../design-system';
import { RichText } from './RichText';

/**
 * Today's situation and the two choices (styled after the Day 1 reference image):
 * cream card, amber title bar with a warning mark, a blue option A and a green option B.
 * Picking an option is final (no confirm step), as decided.
 */
interface Props {
  day: number;
  scenario: Scenario;
  /** Extra note under the story, e.g. the real solar flare on Day 6. */
  note?: React.ReactNode;
  onChoose: (decisionId: string) => void;
  /** The robot standing on the card, reacting to today's situation. */
  mascot: MascotPose;
  className?: string;
}

const ACCENT = ['border-l-blue-400', 'border-l-green-400'] as const;

export function DecisionSidebar({ day, scenario, note, onChoose, mascot, className }: Props) {
  // The decision that fixes the problem lives on the map, next to the problem. Only the rest stay here.
  const fixId = scenario.problem?.fixDecisionId;
  const here = scenario.decisions.map((d, i) => ({ d, i })).filter(({ d }) => d.id !== fixId);
  return (
    // Top padding leaves room for the robot standing on the card's top-left corner.
    <div className={cn('pointer-events-none relative flex flex-col gap-2 pt-14 landscape:w-[26rem] landscape:max-w-[36vw] short:grid short:w-full short:max-w-none short:grid-cols-[1.15fr_1fr] short:items-end short:gap-2 short:pt-0', className)}>
      <Mascot pose={mascot} height="6.5rem" className="absolute top-0 left-3 z-10 short:hidden" />
      <section aria-label="Today's mission" className="pointer-events-auto overflow-hidden rounded-2xl border-[3px] border-amber-400 bg-amber-50 shadow-xl">
        <header className="flex items-center gap-3 bg-gradient-to-b from-amber-300 to-amber-400 py-2 pr-4 pl-28 short:py-1 short:pl-3">
          <h1 className="text-base leading-tight font-bold tracking-wide text-slate-900 uppercase short:text-sm">
            Day {day} — {scenario.title}
          </h1>
        </header>
        <div className="space-y-2 p-3.5 short:space-y-1 short:p-2.5">
          <p className="text-base leading-[1.35rem] text-slate-800 short:text-sm short:leading-5">
            <RichText text={scenario.description} strongClass="text-slate-950" />
          </p>
          {note}
          {scenario.problem && (
            <p className="flex items-center gap-2 text-sm font-bold text-red-700 short:text-xs">
              <Wrench aria-hidden className="size-4" /> Fix it on the map: tap the green button by the red glow.
            </p>
          )}
        </div>
      </section>

      {/* Minimal option buttons, same width as the story bar, so the picture stays visible. */}
      <div className="contents short:flex short:flex-col short:gap-1.5">
        {here.map(({ d, i }) => (
          <OptionButton key={d.id} decision={d} accent={ACCENT[i]!} onChoose={() => onChoose(d.id)} />
        ))}
      </div>
    </div>
  );
}

function OptionButton({ decision, accent, onChoose }: { decision: Decision; accent: string; onChoose: () => void }) {
  const Icon = iconFor(decision.effects);
  return (
    <button
      type="button"
      onClick={onChoose}
      className={cn(
        'group pointer-events-auto flex w-full items-center gap-3 rounded-xl border border-l-4 border-white/15 bg-slate-950/80 px-3 py-2 text-left text-white backdrop-blur-sm transition short:gap-2 short:py-1.5',
        'hover:bg-slate-900/90 active:translate-y-0.5',
        accent,
      )}
    >
      <Icon aria-hidden className="size-5 shrink-0 text-white/85 short:size-4" />
      <span className="min-w-0 flex-1">
        <span className="block text-base leading-tight font-bold short:text-sm">{decision.title}</span>
        <span className="block text-sm leading-[1.15rem] text-white/80 short:text-xs short:leading-4">{decision.explanation}</span>
      </span>
      <ChevronRight aria-hidden className="size-5 shrink-0 transition group-hover:translate-x-0.5" />
    </button>
  );
}

/** A picture for the option: the first thing it gains, else the first thing it changes. */
function iconFor(e: Effects): ComponentType<{ className?: string }> {
  const order: Array<keyof Effects> = ['science', 'power', 'lifeSupport', 'radiation'];
  const key = order.find((k) => (e[k] ?? 0) > 0 && k !== 'radiation') ?? order.find((k) => e[k]) ?? 'science';
  return { science: FlaskConical, power: BatteryCharging, lifeSupport: Wind, radiation: Atom }[key];
}
