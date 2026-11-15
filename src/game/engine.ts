/**
 * Pure game engine: no React, no randomness except what is passed in, no side effects.
 * Every function takes a run and returns a NEW run, so state is easy to test, save and replay.
 *
 * Turn order (see docs/SCENARIOS_MISSION_01.md §2):
 *   decision effects → abort check → end-of-day tick (phase rates + flag effects) → abort check,
 *   repeated for every day until the next scenario day → next scenario, or mission complete
 *   after the last day. A scenario does not have to play every day: Mission 01 has one every
 *   two days, so one decision covers two days of the mission.
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

/** What the engine needs to know about each archived solar flare (see src/data/solar-flares.ts). */
export interface FlareChoice {
  id: string;
  /** DONKI recorded >100 MeV protons with this event: the kind that get through a spacesuit. */
  fastParticles: boolean;
}

/** Flag set at mission start when the chosen storm carried >100 MeV protons. Scenarios read it via overrides. */
export const FAST_PARTICLE_FLAG = 'fast-particle-storm';
/** Flags no decision sets; the engine sets them itself. Known to the mission loader. */
export const ENGINE_FLAGS = [FAST_PARTICLE_FLAG] as const;

export function startMission(mission: Mission, flares: readonly FlareChoice[] = [], rng: Rng = Math.random): MissionRun {
  const randomPicks: Record<number, string> = {};
  for (const plan of mission.content.days) {
    if (plan.selection === 'random') {
      randomPicks[plan.day] = plan.options[Math.floor(rng() * plan.options.length)]!.scenarioId;
    }
  }
  const flare = flares.length > 0 ? flares[Math.floor(rng() * flares.length)]! : null;
  return {
    missionId: mission.content.missionId,
    day: mission.content.days[0]!.day,
    resources: { ...mission.balance.start },
    science: 0,
    flags: flare?.fastParticles ? [FAST_PARTICLE_FLAG] : [],
    randomPicks,
    flareId: flare?.id ?? null,
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
  /** Net change from the end-of-day ticks (all days this decision covers); `null` if the mission aborted before them. */
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

  // End-of-day ticks for every day this decision covers (up to the next scenario day).
  const nextPlan = mission.content.days.find((d) => d.day > run.day);
  const lastDay = nextPlan ? nextPlan.day - 1 : balance.durationDays;
  const dailyNotes: string[] = [];
  const start = resources;
  for (let day = run.day; day <= lastDay; day++) {
    const phase = phaseOf(mission, day);
    const rate = balance.dailyRates[phase];
    let tick: Resources = { lifeSupport: rate.lifeSupport, power: rate.power, radiation: rate.radiation };
    for (const fe of mission.content.flagDailyEffects) {
      if (flags.includes(fe.ifFlag) && (fe.phase === 'any' || fe.phase === phase)) {
        tick = {
          lifeSupport: tick.lifeSupport + (fe.effects.lifeSupport ?? 0),
          power: tick.power + (fe.effects.power ?? 0),
          radiation: tick.radiation + (fe.effects.radiation ?? 0),
        };
        if (!dailyNotes.includes(fe.note)) dailyNotes.push(fe.note);
      }
    }
    resources = clamp(balance, {
      lifeSupport: resources.lifeSupport + tick.lifeSupport,
      power: resources.power + tick.power,
      radiation: resources.radiation + tick.radiation,
    });
    const aborted = breached(mission, resources);
    if (aborted) {
      // `day` is the day the crew didn't finish, so daysSurvived() = day - 1.
      const dailyChange = diff(resources, start);
      return { ...result, run: { ...base, resources, day, status: 'aborted', abortedBy: aborted }, dailyChange, dailyNotes };
    }
  }
  const dailyChange = diff(resources, start);
  return {
    ...result,
    run: nextPlan
      ? { ...base, resources, day: nextPlan.day }
      : { ...base, resources, day: balance.durationDays, status: 'complete' },
    dailyChange,
    dailyNotes,
  };
}

function diff(after: Resources, before: Resources): Resources {
  return {
    lifeSupport: after.lifeSupport - before.lifeSupport,
    power: after.power - before.power,
    radiation: after.radiation - before.radiation,
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
