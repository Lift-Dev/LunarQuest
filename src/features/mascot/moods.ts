import type { MascotPose } from '../../design-system/Mascot';
import type { DecisionOutcome } from '../../game/engine';
import type { DayPhase, ResourceId, Scenario } from '../../game/types';

/**
 * Which mascot pose fits each game moment. UI only: these read the game, they never change it.
 */

/** While the player reads today's situation. */
export function scenarioPose(day: number, phase: DayPhase, scenario: Scenario, low: readonly ResourceId[]): MascotPose {
  if (scenario.showsFlare) return 'alert'; // solar storm: red warning sign
  if (low.length > 0) return 'caution'; // something is running low
  if (day === 1) return 'waving'; // first day: hello!
  return phase === 'night' ? 'pondering' : 'thinking';
}

/** Reacting to the choice the player just made (feedback card). */
export function outcomePose(outcome: DecisionOutcome, bigAt: number): MascotPose {
  const { run, applied, overrideNote } = outcome;
  if (run.status === 'aborted') return 'worried';
  if (run.status === 'complete') return 'celebrating';
  if (overrideNote) return 'proud'; // an earlier good choice paid off
  const bigLoss =
    (applied.lifeSupport ?? 0) <= -bigAt || (applied.power ?? 0) <= -bigAt || (applied.radiation ?? 0) >= bigAt;
  if (bigLoss) return 'surprised';
  if ((applied.science ?? 0) >= bigAt) return 'excited';
  return 'thumbs-up-wink';
}

/** Mission Complete, by stars earned. */
export function completePose(stars: number): MascotPose {
  if (stars >= 5) return 'cheering';
  if (stars >= 3) return 'celebrating';
  return 'thumbs-up';
}
