import { describe, expect, it } from 'vitest';
import { getMission } from '../data/missions';
import { solarFlares } from '../data/solar-flares';
import {
  applyDecision,
  currentScenario,
  daysSurvived,
  FAST_PARTICLE_FLAG,
  phaseOf,
  radiationPercent,
  resolveEffects,
  startMission,
} from './engine';
import { starsFromScience } from './scoring';
import type { Mission, MissionRun } from './types';

const mission = getMission('mission-01');
const fixedRng = (v: number) => () => v;
const fresh = (rng = fixedRng(0)) => startMission(mission, solarFlares, rng);
const pick = (run: MissionRun, which: 0 | 1) => currentScenario(mission, run).decisions[which].id;
const calm = solarFlares.filter((f) => !f.fastParticles);
const fast = solarFlares.filter((f) => f.fastParticles);

describe('startMission', () => {
  it('starts on day 1 with the balance start values', () => {
    const run = fresh();
    expect(run).toMatchObject({ day: 1, science: 0, status: 'playing', history: [] });
    expect(run.resources).toEqual({ lifeSupport: 100, power: 50, radiation: 0 });
  });

  it('picks a real flare at start and flags storms with >100 MeV protons', () => {
    expect(startMission(mission, fast, fixedRng(0)).flags).toEqual([FAST_PARTICLE_FLAG]);
    expect(startMission(mission, calm, fixedRng(0)).flags).toEqual([]);
    expect(fresh(fixedRng(0.99)).flareId).toBe(solarFlares.at(-1)!.id);
  });
});

describe('applyDecision', () => {
  it('applies the decision, then one tick for each day until the next scenario (day 1, option A)', () => {
    const out = applyDecision(mission, fresh(), pick(fresh(), 0));
    // power −30, science +10; then days 1 and 2: O₂ −4, power +5, radiation +1 each
    expect(out.run.science).toBe(10);
    expect(out.run.resources).toEqual({ lifeSupport: 92, power: 30, radiation: 2 });
    expect(out.dailyChange).toEqual({ lifeSupport: -8, power: 10, radiation: 2 });
    expect(out.run.day).toBe(3);
    expect(out.run.history).toEqual([expect.objectContaining({ day: 1, scenarioId: 'd01-shadowed-panels' })]);
  });

  it('does not mutate the input run', () => {
    const run = fresh();
    const snapshot = structuredClone(run);
    applyDecision(mission, run, pick(run, 0));
    expect(run).toEqual(snapshot);
  });

  it('rejects a decision from another scenario', () => {
    expect(() => applyDecision(mission, fresh(), 'd03-dusty-panels.a')).toThrow();
  });

  it('caps power at the battery maximum', () => {
    const run: MissionRun = { ...fresh(), resources: { lifeSupport: 100, power: 95, radiation: 0 } };
    expect(applyDecision(mission, run, pick(run, 1)).run.resources.power).toBe(100); // +10, then +5 +5, capped
  });

  it('memory flags drain power every day afterwards (dust + backup cable)', () => {
    let run = applyDecision(mission, fresh(), pick(fresh(), 1)).run; // day 1: save power
    let out = applyDecision(mission, run, pick(run, 1)); // day 3: leave the dust
    expect(out.run.flags).toContain('dusty-panels');
    expect(out.dailyChange!.power).toBe(2 * (5 - 5));
    expect(out.dailyNotes).toEqual(['Dusty panels made only half their power.']);
    run = out.run;
    out = applyDecision(mission, run, pick(run, 1)); // day 5: backup cable
    expect(out.dailyChange!.power).toBe(2 * (5 - 5 - 5));
    expect(out.dailyNotes).toHaveLength(2);
  });

  it('a fast-particle storm makes the Day 7 choices far more dangerous', () => {
    const storm = mission.scenariosById.get('d07-solar-storm')!;
    const [shelter, stayOut] = storm.decisions;
    expect(resolveEffects(shelter, []).effects.radiation).toBe(20);
    expect(resolveEffects(shelter, [FAST_PARTICLE_FLAG]).effects.radiation).toBe(70);
    expect(resolveEffects(stayOut, []).effects).toMatchObject({ radiation: 120, science: 10 });
    const fastOut = resolveEffects(stayOut, [FAST_PARTICLE_FLAG]);
    expect(fastOut.effects.radiation).toBeGreaterThanOrEqual(mission.balance.abortAt.radiation);
    expect(fastOut.note).toMatch(/spacesuits/);
  });

  it('a South Pole site has no night phase; a mission with a night still uses night rates', () => {
    expect(phaseOf(mission, 14)).toBe('day');
    const withNight: Mission = { ...mission, balance: { ...mission.balance, daylightDays: 7 } };
    expect(phaseOf(withNight, 8)).toBe('night');
    const run: MissionRun = { ...fresh(), day: 9, resources: { lifeSupport: 100, power: 80, radiation: 0 } };
    expect(applyDecision(withNight, run, pick(run, 1)).dailyChange).toEqual({ lifeSupport: -8, power: -16, radiation: 2 });
  });
});

describe('abort and complete', () => {
  const abort = mission.balance.abortAt;

  it('aborts on the decision itself, before any day passes', () => {
    const run: MissionRun = { ...fresh(), resources: { lifeSupport: 100, power: abort.power + 30, radiation: 0 } };
    const out = applyDecision(mission, run, pick(run, 0)); // day 1A: power −30
    expect(out.run).toMatchObject({ status: 'aborted', abortedBy: 'power', day: 1 });
    expect(out.dailyChange).toBeNull();
    expect(daysSurvived(mission, out.run)).toBe(0);
  });

  it('aborts during the second day a decision covers and counts only the finished days', () => {
    // Day 5 backup cable with dust: power 5 − 5 − 5 = −5 per day.
    const run: MissionRun = { ...fresh(), day: 5, flags: ['dusty-panels'], resources: { lifeSupport: 100, power: abort.power + 6, radiation: 0 } };
    const out = applyDecision(mission, run, pick(run, 1));
    expect(out.run).toMatchObject({ status: 'aborted', abortedBy: 'power', day: 6 });
    expect(daysSurvived(mission, out.run)).toBe(5);
  });

  it('staying outside in a fast-particle storm exceeds the 250 mSv limit', () => {
    const run: MissionRun = { ...startMission(mission, fast), day: 7 };
    const out = applyDecision(mission, run, pick(run, 1));
    expect(out.run).toMatchObject({ status: 'aborted', abortedBy: 'radiation' });
  });

  it('cannot play after the mission is over', () => {
    const run: MissionRun = { ...fresh(), status: 'aborted', abortedBy: 'power' };
    expect(() => applyDecision(mission, run, 'd01-shadowed-panels.a')).toThrow();
  });

  it('completes after day 13 covers days 13 and 14', () => {
    const run: MissionRun = { ...fresh(), day: 13, science: 30, resources: { lifeSupport: 70, power: 60, radiation: 10 } };
    const out = applyDecision(mission, run, pick(run, 1)); // pack up: science +5
    expect(out.run).toMatchObject({ status: 'complete', day: 14 });
    expect(daysSurvived(mission, out.run)).toBe(14);
    expect(starsFromScience(out.run.science, mission.balance.starThresholds)).toBe(4);
  });
});

describe('radiationPercent', () => {
  it('shows 0% at start and 100% at the abort level (250 mSv)', () => {
    const at = (radiation: number) => radiationPercent(mission, { ...fresh(), resources: { lifeSupport: 100, power: 80, radiation } });
    expect(at(0)).toBe(0);
    expect(at(500)).toBe(100);
    expect(at(250)).toBe(50);
  });
});

describe('every path through the mission', () => {
  const walkAll = (start: MissionRun) => {
    const endings = { complete: 0, lifeSupport: 0, power: 0, radiation: 0 };
    let earliestAbortTurn = Infinity;
    const walk = (run: MissionRun, turn: number) => {
      if (run.status !== 'playing') {
        endings[run.status === 'complete' ? 'complete' : run.abortedBy!]++;
        if (run.status === 'aborted') earliestAbortTurn = Math.min(earliestAbortTurn, turn);
        return;
      }
      for (const which of [0, 1] as const) walk(applyDecision(mission, run, pick(run, which)).run, turn + 1);
    };
    walk(start, 0);
    return { endings, earliestAbortTurn };
  };

  it('calm storm: winning paths exist, and power or air can end the mission', () => {
    const { endings, earliestAbortTurn } = walkAll(startMission(mission, calm));
    expect(endings.complete).toBeGreaterThan(0);
    expect(endings.power).toBeGreaterThan(0);
    expect(endings.lifeSupport).toBeGreaterThan(0);
    // Poor choices can end the mission by the 4th scenario.
    expect(earliestAbortTurn).toBeLessThanOrEqual(4);
  });

  it('fast-particle storm: staying outside always ends in a radiation abort', () => {
    const { endings } = walkAll(startMission(mission, fast));
    expect(endings.complete).toBeGreaterThan(0);
    expect(endings.radiation).toBeGreaterThan(0);
  });
});
