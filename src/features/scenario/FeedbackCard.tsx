import { ChevronRight, Lightbulb } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { sources } from '../../data/sources';
import { Button, Mascot } from '../../design-system';
import { outcomePose } from '../mascot/moods';
import type { DecisionOutcome } from '../../game/engine';
import { EffectChips } from './EffectChips';
import { RichText } from './RichText';

/**
 * Shown after a choice. It is deliberately NOT a panel like the option cards: a centred card
 * with a gold lightbulb on its top edge, so the Real Space Fact is the star and the result of
 * the choice is a single quiet line underneath. New design, pending approval.
 */
export function FeedbackCard({
  outcome,
  bigAt,
  onContinue,
}: {
  outcome: DecisionOutcome;
  bigAt: number;
  onContinue: () => void;
}) {
  const { fact } = outcome.scenario;
  const names = fact.sourceIds.map((id) => sources.find((s) => s.id === id)?.name).filter(Boolean);
  const over = outcome.run.status !== 'playing';

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        role="status"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative mx-auto w-full max-w-2xl rounded-3xl border border-yellow-300/40 bg-slate-950/90 px-6 pt-12 pb-6 text-center backdrop-blur-md md:px-10 short:flex short:max-h-[calc(100dvh-4.5rem)] short:max-w-3xl short:items-center short:gap-4 short:overflow-y-auto short:px-4 short:py-3 short:text-left"
      >
        {/* The robot reacts to the choice: excited, surprised, proud, worried… */}
        <Mascot pose={outcomePose(outcome, bigAt)} height="8.5rem" className="absolute -top-28 left-1/2 -translate-x-1/2 short:static short:translate-x-0 short:[&>img]:h-24!" />

        <div className="short:min-w-0 short:flex-1">

        <p className="flex items-center justify-center gap-2 text-sm font-bold tracking-[0.2em] short:justify-start text-yellow-300 uppercase">
          <Lightbulb aria-hidden className="size-4" strokeWidth={2.5} />
          Real Space Fact
        </p>
        <p className="mt-3 text-2xl leading-9 text-white max-sm:text-xl max-sm:leading-8 short:mt-1 short:text-base short:leading-6">
          <RichText text={fact.text} />
        </p>
        {names.length > 0 && <p className="mt-3 text-sm text-blue-200/60">Source: {names.join(', ')}</p>}

        <div className="mt-6 flex flex-col items-center gap-3 border-t border-white/10 pt-5 short:mt-2 short:items-start short:gap-1.5 short:pt-2">
          <p className="text-lg text-blue-100 short:text-sm">
            You chose <strong className="font-bold text-white">{outcome.decision.title}</strong>
          </p>
          <EffectChips effects={outcome.applied} bigAt={bigAt} className="justify-center short:justify-start" />
          {outcome.overrideNote && <p className="text-lg font-bold text-emerald-300">{outcome.overrideNote}</p>}
          {outcome.dailyNotes.map((n) => (
            <p key={n} className="text-base text-blue-100/70">
              {n}
            </p>
          ))}
        </div>

        <Button variant="pill" size="md" onClick={onContinue} className="mt-6 short:mt-2">
          {over ? 'See result' : 'Next day'}
          <ChevronRight aria-hidden className="size-[1em]" strokeWidth={3} />
        </Button>
        </div>
      </motion.section>
    </MotionConfig>
  );
}
