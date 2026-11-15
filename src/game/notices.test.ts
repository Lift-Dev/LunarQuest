import { describe, expect, it } from 'vitest';
import { getMission } from '../data/missions';
import { lowResources, startMission } from './engine';
import { noticesBetween } from './notices';
import type { Mission, MissionRun } from './types';

const mission = getMission('mission-01');
// Mission 01 is at a South Pole site with no night, so test the night notice on a variant that has one.
const withNight: Mission = { ...mission, balance: { ...mission.balance, daylightDays: 7 } };
const run = (patch: Partial<MissionRun>): MissionRun => ({ ...startMission(mission), ...patch });

describe('noticesBetween', () => {
  it('announces night once, when the last daylight day ends', () => {
    expect(noticesBetween(withNight, run({ day: 7 }), run({ day: 9 }))).toEqual([{ id: 'night-9', kind: 'night' }]);
    expect(noticesBetween(withNight, run({ day: 3 }), run({ day: 5 }))).toEqual([]);
    expect(noticesBetween(withNight, run({ day: 9 }), run({ day: 11 }))).toEqual([]);
    expect(noticesBetween(mission, run({ day: 7 }), run({ day: 9 }))).toEqual([]);
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
