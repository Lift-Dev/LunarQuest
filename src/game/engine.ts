/**
 * Pure game engine: no React, no randomness except what is passed in, no side effects.
 * Every function takes a run and returns a NEW run, so state is easy to test, save and replay.
 *
 * Turn order (see docs/SCENARIOS_MISSION_01.md §2):
 *   decision effects → abort check → end-of-day tick (phase rates + flag effects) → abort check
 *   → next day, or mission complete after the last day.
 */
import type {
  DayPhase,
  Decision,
  Effects,
  HistoryEntry,
  Mission,
  MissionRun,
  ResourceId,
  Resources,
  Scenario,
} from './types';

const RESOURCE_ORDER: readonly ResourceId[] = ['lifeSupport', 'power', 'radiation'];

/** Picks a random index in [0, n). Injected so tests (and saved runs) are deterministic. */
export type Rng = () => number;

export function startMission(mission: Mission, flareIds: readonly string[] = [], rng: Rng = Math.random): MissionRun {
  const randomPicks: Record<number, string> = {};
  for (const plan of mission.content.days) {
    if (plan.selection === 'random') {
      randomPicks[plan.day] = plan.options[Math.floor(rng() * plan.options.length)]!.scenarioId;
    }
  }
  return {
    missionId: mission.content.missionId,
    day: 1,
    resources: { ...mission.balance.start },
    science: 0,
    flags: [],
    randomPicks,
    flareId: flareIds.length > 0 ? flareIds[Math.floor(rng() * flareIds.length)]! : null,
    history: [],
    status: 'playing',
    abortedBy: null,
  };
}

export function phaseOf(mission: Mission, day: number): DayPhase {
  return day <= mission.balance.daylightDays ? 'day' : 'night';
}

/** The scenario the player faces on the run's current day. */
export function currentScenario(mission: Mission, run: MissionRun): Scenario {
  const plan = mission.content.days.find((d) => d.day === run.day);
  if (!plan) throw new Error(`No plan for day ${run.day}`);

  let scenarioId: string | undefined;
  if (plan.selection === 'random') {
    scenarioId = run.randomPicks[run.day];
  } else {
    scenarioId = plan.options.find((o) => !o.requiresFlag || run.flags.includes(o.requiresFlag))?.scenarioId;
  }
  const scenario = scenarioId ? mission.scenariosById.get(scenarioId) : undefined;
  if (!scenario) throw new Error(`Day ${run.day} resolved to no scenario`);
  return scenario;
}

/** Effects a decision really has, given the player's flags. An override REPLACES the listed keys. */
export function resolveEffects(decision: Decision, flags: readonly string[]): { effects: Effects; note?: string } {
  let effects: Effects = { ...decision.effects };
  let note: string | undefined;
  for (const o of decision.overrides) {
    if (flags.includes(o.ifFlag)) {
      effects = { ...effects, ...o.effects };
      note = o.note;
    }
  }
  return { effects, note };
}

export interface DecisionOutcome {
  run: MissionRun;
  scenario: Scenario;
  decision: Decision;
  /** Effects of the decision itself. */
  applied: Effects;
  /** Friendly note when a flag changed the effects (e.g. "Your soil shield cut the radiation in half!"). */
  overrideNote?: string;
  /** Net change from the end-of-day tick; `null` if the mission aborted before it. */
  dailyChange: Resources | null;
  /** Notes from flag-driven daily effects (e.g. "Dusty panels made less power today."). */
  dailyNotes: string[];
}

export function applyDecision(mission: Mission, run: MissionRun, decisionId: string): DecisionOutcome {
  if (run.status !== 'playing') throw new Error('Mission is already over');
  const scenario = currentScenario(mission, run);
  const decision = scenario.decisions.find((d) => d.id === decisionId);
  if (!decision) throw new Error(`"${decisionId}" is not a decision of "${scenario.id}"`);

  const { balance } = mission;
  const { effects, note } = resolveEffects(decision, run.flags);
  const flags = [...new Set([...run.flags, ...decision.setsFlags])];
  const history: HistoryEntry[] = [...run.history, { day: run.day, scenarioId: scenario.id, decisionId, applied: effects }];

  let resources = clamp(balance, {
    lifeSupport: run.resources.lifeSupport + (effects.lifeSupport ?? 0),
    power: run.resources.power + (effects.power ?? 0),
    radiation: run.resources.radiation + (effects.radiation ?? 0),
  });
  const science = run.science + (effects.science ?? 0);
  const base = { ...run, resources, science, flags, history };
  const result = { scenario, decision, applied: effects, overrideNote: note };

  const abortedAfterDecision = breached(mission, resources);
  if (abortedAfterDecision) {
    return { ...result, run: { ...base, status: 'aborted', abortedBy: abortedAfterDecision }, dailyChange: null, dailyNotes: [] };
  }

  // End-of-day tick.
  const phase = phaseOf(mission, run.day);
  const rate = balance.dailyRates[phase];
  const dailyNotes: string[] = [];
  let tick: Resources = { lifeSupport: rate.lifeSupport, power: rate.power, radiation: rate.radiation };
  for (const fe of mission.content.flagDailyEffects) {
    if (flags.includes(fe.ifFlag) && (fe.phase === 'any' || fe.phase === phase)) {
      tick = {
        lifeSupport: tick.lifeSupport + (fe.effects.lifeSupport ?? 0),
        power: tick.power + (fe.effects.power ?? 0),
        radiation: tick.radiation + (fe.effects.radiation ?? 0),
      };
      dailyNotes.push(fe.note);
    }
  }
  const before = resources;
  resources = clamp(balance, {
    lifeSupport: before.lifeSupport + tick.lifeSupport,
    power: before.power + tick.power,
    radiation: before.radiation + tick.radiation,
  });
  const dailyChange: Resources = {
    lifeSupport: resources.lifeSupport - before.lifeSupport,
    power: resources.power - before.power,
    radiation: resources.radiation - before.radiation,
  };

  const abortedAfterTick = breached(mission, resources);
  if (abortedAfterTick) {
    return { ...result, run: { ...base, resources, status: 'aborted', abortedBy: abortedAfterTick }, dailyChange, dailyNotes };
  }
  const finished = run.day >= balance.durationDays;
  return {
    ...result,
    run: { ...base, resources, day: finished ? run.day : run.day + 1, status: finished ? 'complete' : 'playing' },
    dailyChange,
    dailyNotes,
  };
}

/** Which resource caused the abort, or null if the crew is fine. Life support is checked first. */
function breached(mission: Mission, r: Resources): ResourceId | null {
  const a = mission.balance.abortAt;
  for (const id of RESOURCE_ORDER) {
    if (id === 'radiation' ? r.radiation >= a.radiation : r[id] <= a[id]) return id;
  }
  return null;
}

/** Life support and power stay within 0..max. Radiation can't go below 0 (and has no upper cap before abort). */
function clamp(balance: Mission['balance'], r: Resources): Resources {
  return {
    lifeSupport: Math.max(0, Math.min(balance.max.lifeSupport, r.lifeSupport)),
    power: Math.max(0, Math.min(balance.max.power, r.power)),
    radiation: Math.max(0, r.radiation),
  };
}

/** Whole days the crew completed. An aborted day doesn't count. */
export function daysSurvived(mission: Mission, run: MissionRun): number {
  if (run.status === 'complete') return mission.balance.durationDays;
  return run.day - 1;
}

/** Radiation as a 0–100 meter where 100 is the abort level (the HUD shows this, never the raw number). */
export function radiationPercent(mission: Mission, run: MissionRun): number {
  return Math.min(100, Math.round((run.resources.radiation / mission.balance.abortAt.radiation) * 100));
}

/** Resources close to their abort level, for the red "low" state and warning notices. UI only. */
export function lowResources(mission: Mission, run: MissionRun): ResourceId[] {
  const w = mission.balance.warnAt;
  return RESOURCE_ORDER.filter((id) => (id === 'radiation' ? run.resources.radiation >= w.radiation : run.resources[id] <= w[id]));
}
