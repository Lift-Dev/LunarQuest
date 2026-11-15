import { ChevronRight, Lightbulb } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { sources } from '../../data/sources';
import { Button } from '../../design-system';
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
        className="relative mx-auto w-full max-w-2xl rounded-3xl border border-yellow-300/40 bg-slate-950/90 px-6 pt-14 pb-6 text-center backdrop-blur-md md:px-10"
      >
        <motion.span
          initial={{ scale: 0.6, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 14 }}
          className="absolute -top-9 left-1/2 grid size-[72px] -translate-x-1/2 place-items-center rounded-full border-4 border-slate-950 bg-yellow-400 text-slate-950"
        >
          <Lightbulb aria-hidden className="size-9" strokeWidth={2.25} />
        </motion.span>

        <p className="text-sm font-bold tracking-[0.2em] text-yellow-300 uppercase">Real Space Fact</p>
        <p className="mt-3 text-2xl leading-9 text-white">
          <RichText text={fact.text} />
        </p>
        {names.length > 0 && <p className="mt-3 text-sm text-blue-200/60">Source: {names.join(', ')}</p>}

        <div className="mt-6 flex flex-col items-center gap-3 border-t border-white/10 pt-5">
          <p className="text-lg text-blue-100">
            You chose <strong className="font-bold text-white">{outcome.decision.title}</strong>
          </p>
          <EffectChips effects={outcome.applied} bigAt={bigAt} className="justify-center" />
          {outcome.overrideNote && <p className="text-lg font-bold text-emerald-300">{outcome.overrideNote}</p>}
          {outcome.dailyNotes.map((n) => (
            <p key={n} className="text-base text-blue-100/70">
              {n}
            </p>
          ))}
        </div>

        <Button variant="pill" size="md" onClick={onContinue} className="mt-6">
          {over ? 'See result' : 'Next day'}
          <ChevronRight aria-hidden className="size-[1em]" strokeWidth={3} />
        </Button>
      </motion.section>
    </MotionConfig>
  );
}
