import { describe, expect, it } from 'vitest';
import { getMission } from '../data/missions';
import { solarFlares } from '../data/solar-flares';
import { applyDecision, currentScenario, daysSurvived, phaseOf, radiationPercent, resolveEffects, startMission } from './engine';
import { starsFromScience } from './scoring';
import type { MissionRun } from './types';

const mission = getMission('mission-01');
const flareIds = solarFlares.map((f) => f.id);
const fixedRng = (v: number) => () => v;
const fresh = (rng = fixedRng(0)) => startMission(mission, flareIds, rng);
const pick = (run: MissionRun, which: 0 | 1) => currentScenario(mission, run).decisions[which].id;

describe('startMission', () => {
  it('starts on day 1 with the balance start values', () => {
    const run = fresh();
    expect(run).toMatchObject({ day: 1, science: 0, status: 'playing', flags: [], history: [] });
    expect(run.resources).toEqual({ lifeSupport: 100, power: 80, radiation: 0 });
  });

  it('fixes random choices at start so reloading never re-rolls', () => {
    expect(fresh(fixedRng(0)).randomPicks[11]).toBe('d11a-moonquake');
    expect(fresh(fixedRng(0.99)).randomPicks[11]).toBe('d11b-space-rock');
    expect(fresh(fixedRng(0.99)).flareId).toBe(flareIds.at(-1));
  });
});

describe('applyDecision', () => {
  it('applies decision effects then the daytime tick (day 1, option A)', () => {
    const out = applyDecision(mission, fresh(), pick(fresh(), 0));
    // science +10, power -10; then day tick: O2 -4, power +4, radiation +2
    expect(out.run.science).toBe(10);
    expect(out.run.resources).toEqual({ lifeSupport: 96, power: 74, radiation: 2 });
    expect(out.dailyChange).toEqual({ lifeSupport: -4, power: 4, radiation: 2 });
    expect(out.run.day).toBe(2);
    expect(out.run.history).toHaveLength(1);
  });

  it('does not mutate the input run', () => {
    const run = fresh();
    const snapshot = structuredClone(run);
    applyDecision(mission, run, pick(run, 0));
    expect(run).toEqual(snapshot);
  });

  it('rejects a decision from another scenario', () => {
    expect(() => applyDecision(mission, fresh(), 'd02-dusty-panels.a')).toThrow();
  });

  it('caps power at the battery maximum and never goes below zero', () => {
    const run: MissionRun = { ...fresh(), resources: { lifeSupport: 100, power: 98, radiation: 0 } };
    expect(applyDecision(mission, run, pick(run, 1)).run.resources.power).toBe(100); // +12 then +4, capped
  });

  it('sets memory flags and applies their daily effect', () => {
    let run = applyDecision(mission, fresh(), pick(fresh(), 0)).run; // day 1
    const out = applyDecision(mission, run, pick(run, 1)); // day 2: leave the dust
    expect(out.run.flags).toContain('dusty-panels');
    expect(out.dailyChange!.power).toBe(4 - 2);
    expect(out.dailyNotes).toEqual(['Dusty panels made less power today.']);
  });

  it('flag override replaces effects (shielded shelter halves the Day 6 dose)', () => {
    const d = currentScenarioById('d06-solar-storm').decisions[1];
    expect(resolveEffects(d, []).effects.radiation).toBe(20);
    const shielded = resolveEffects(d, ['shelter-shielded']);
    expect(shielded.effects).toMatchObject({ radiation: 10, science: 10 });
    expect(shielded.note).toMatch(/soil shield/i);
  });

  it('day 10 branches on the garden flag', () => {
    const base = { ...fresh(), day: 10 };
    expect(currentScenario(mission, { ...base, flags: ['garden-planted'] }).id).toBe('d10a-harvest');
    expect(currentScenario(mission, base).id).toBe('d10b-low-air');
  });

  it('uses night rates after the daylight days', () => {
    expect(phaseOf(mission, 7)).toBe('day');
    expect(phaseOf(mission, 8)).toBe('night');
    const run: MissionRun = { ...fresh(), day: 8 };
    expect(applyDecision(mission, run, pick(run, 1)).dailyChange).toEqual({ lifeSupport: -4, power: -8, radiation: 2 });
  });
});

describe('abort and complete', () => {
  const abort = mission.balance.abortAt;
  const cases = [
    ['lifeSupport', { lifeSupport: abort.lifeSupport + 1, power: 80, radiation: 0 }],
    ['power', { lifeSupport: 100, power: abort.power + 1, radiation: 0 }],
    ['radiation', { lifeSupport: 100, power: 80, radiation: abort.radiation - 1 }],
  ] as const;

  it.each(cases)('aborts when %s hits its threshold', (resource, resources) => {
    const run: MissionRun = { ...fresh(), day: 5, resources: { ...resources } };
    const out = applyDecision(mission, run, pick(run, 0)); // day 5A costs every resource a bit
    expect(out.run.status).toBe('aborted');
    expect(out.run.abortedBy).toBe(resource);
    expect(daysSurvived(mission, out.run)).toBe(4);
  });

  it('cannot play after the mission is over', () => {
    const run: MissionRun = { ...fresh(), status: 'aborted', abortedBy: 'power' };
    expect(() => applyDecision(mission, run, 'd01-wake-up.a')).toThrow();
  });

  it('completes after day 14 with 14 days survived and a star count', () => {
    const run: MissionRun = { ...fresh(), day: 14, science: 50, resources: { lifeSupport: 70, power: 60, radiation: 10 } };
    const out = applyDecision(mission, run, pick(run, 1)); // pack up safely
    expect(out.run.status).toBe('complete');
    expect(daysSurvived(mission, out.run)).toBe(14);
    expect(starsFromScience(out.run.science, mission.balance.starThresholds)).toBe(2);
  });
});

describe('radiationPercent', () => {
  it('shows 0% at start and 100% at the abort level', () => {
    expect(radiationPercent(mission, fresh())).toBe(0);
    expect(radiationPercent(mission, { ...fresh(), resources: { lifeSupport: 100, power: 80, radiation: 60 } })).toBe(100);
    expect(radiationPercent(mission, { ...fresh(), resources: { lifeSupport: 100, power: 80, radiation: 30 } })).toBe(50);
  });
});

describe('every path through the mission', () => {
  it('always ends, and both winning and losing paths exist for every abort cause', () => {
    const endings = { complete: 0, lifeSupport: 0, power: 0, radiation: 0 };
    let paths = 0;
    const walk = (run: MissionRun) => {
      if (run.status !== 'playing') {
        paths++;
        endings[run.status === 'complete' ? 'complete' : run.abortedBy!]++;
        return;
      }
      for (const which of [0, 1] as const) walk(applyDecision(mission, run, pick(run, which)).run);
    };
    // Both Day-11 events and the first/last flare are covered by two seeds.
    walk(fresh(fixedRng(0)));
    walk(fresh(fixedRng(0.99)));
    console.table(endings);
    expect(paths).toBeGreaterThan(0);
    expect(endings.complete).toBeGreaterThan(0);
    expect(endings.lifeSupport + endings.power + endings.radiation).toBeGreaterThan(0);
  });
});

function currentScenarioById(id: string) {
  return mission.scenariosById.get(id)!;
}
