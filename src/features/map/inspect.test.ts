import { describe, expect, it } from 'vitest';
import { EQUIPMENT_IDS, connectionsOf } from '../../data/maps/outpost-01';
import { getMission } from '../../data/missions';
import { startMission } from '../../game/engine';
import { inspect } from './inspect';

const mission = getMission('mission-01');
const fresh = () => startMission(mission);

describe('map links', () => {
  it('every piece of equipment is connected to something, in both directions', () => {
    for (const id of EQUIPMENT_IDS) {
      const c = connectionsOf(id);
      expect(c.length, id).toBeGreaterThan(0);
      for (const other of c) expect(connectionsOf(other)).toContain(id);
    }
  });
  it('battery connects to the solar arrays', () => {
    expect(connectionsOf('battery-storage')).toEqual(expect.arrayContaining(['solar-array-01', 'solar-array-02']));
  });
});

describe('inspect', () => {
  it('starts normal, with the battery charge reading the power level', () => {
    const r = inspect(mission, fresh(), 'battery-storage');
    expect(r.status).toBe('normal');
    expect(r.reading?.percent).toBe(mission.balance.start.power);
  });
  it('battery turns Low, then Critical as power drains', () => {
    const run = fresh();
    expect(inspect(mission, { ...run, resources: { ...run.resources, power: 25 } }, 'battery-storage').status).toBe('warning');
    expect(inspect(mission, { ...run, resources: { ...run.resources, power: 15 } }, 'battery-storage').status).toBe('critical');
  });
  it('solar arrays report dust after the dusty-panels choice, and night later', () => {
    const run = fresh();
    expect(inspect(mission, { ...run, flags: ['dusty-panels'] }, 'solar-array-01').statusLabel).toBe('Dusty');
    expect(inspect(mission, { ...run, day: 9 }, 'solar-array-01').note).toMatch(/Night/);
  });
  it('radiation shelter shows the dose as a high-is-bad reading', () => {
    expect(inspect(mission, fresh(), 'radiation-shelter').reading?.highIsBad).toBe(true);
  });
});
