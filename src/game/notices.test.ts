import { describe, expect, it } from 'vitest';
import { getMission } from '../data/missions';
import { lowResources, startMission } from './engine';
import { noticesBetween } from './notices';
import type { MissionRun } from './types';

const mission = getMission('mission-01');
const run = (patch: Partial<MissionRun>): MissionRun => ({ ...startMission(mission), ...patch });

describe('noticesBetween', () => {
  it('announces night once, when day 7 becomes day 8', () => {
    expect(noticesBetween(mission, run({ day: 7 }), run({ day: 8 }))).toEqual([{ id: 'night-8', kind: 'night' }]);
    expect(noticesBetween(mission, run({ day: 3 }), run({ day: 4 }))).toEqual([]);
    expect(noticesBetween(mission, run({ day: 8 }), run({ day: 9 }))).toEqual([]);
  });

  it('warns only when a resource newly crosses its warning level', () => {
    const ok = { lifeSupport: 80, power: 80, radiation: 0 };
    const lowPower = { ...ok, power: mission.balance.warnAt.power };
    expect(noticesBetween(mission, run({ day: 4, resources: ok }), run({ day: 5, resources: lowPower }))).toEqual([
      { id: 'low-power-5', kind: 'low', resource: 'power' },
    ]);
    expect(noticesBetween(mission, run({ day: 5, resources: lowPower }), run({ day: 6, resources: lowPower }))).toEqual([]);
  });

  it('shows nothing when the mission is over', () => {
    expect(noticesBetween(mission, run({ day: 7 }), run({ day: 8, status: 'aborted', abortedBy: 'power' }))).toEqual([]);
  });

  it('warning levels are reached before abort levels', () => {
    const { warnAt, abortAt } = mission.balance;
    expect(warnAt.lifeSupport).toBeGreaterThan(abortAt.lifeSupport);
    expect(warnAt.power).toBeGreaterThan(abortAt.power);
    expect(warnAt.radiation).toBeLessThan(abortAt.radiation);
    expect(lowResources(mission, run({ resources: { lifeSupport: 100, power: 80, radiation: 0 } }))).toEqual([]);
  });
});
