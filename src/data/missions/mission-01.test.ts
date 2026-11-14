import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { decisionHasCost, loadMission, MissionDataError } from '../../game/loadMission';
import { EQUIPMENT_IDS } from '../maps/outpost-01';
import { sources } from '../sources';
import { balance } from './mission-01/balance';
import content from './mission-01/content.json';
import { getMission } from './index';

const known = { equipmentIds: EQUIPMENT_IDS, sourceIds: sources.map((s) => s.id) };
const clone = <T>(v: T): T => structuredClone(v);

describe('Mission 01 content', () => {
  const mission = getMission('mission-01');

  it('loads and passes all schema + reference checks', () => {
    expect(mission.content.title).toBe('Survive the Lunar Cycle');
    expect(mission.content.days).toHaveLength(14);
    expect(mission.content.scenarios).toHaveLength(16); // 14 days + 1 branch + 1 random alternative
  });

  it('every decision has a visible cost (design rule: no free choice)', () => {
    const free = mission.content.scenarios
      .flatMap((s) => s.decisions)
      .filter((d) => !decisionHasCost(d))
      .map((d) => d.id);
    expect(free).toEqual([]);
  });

  it('radiation dose never goes down in any effect', () => {
    for (const s of mission.content.scenarios) {
      for (const d of s.decisions) {
        expect(d.effects.radiation ?? 0).toBeGreaterThanOrEqual(0);
      }
    }
  });

  // Test #4 from the brief: scenario text must match the approved script exactly.
  it('all player-facing text matches docs/SCENARIOS_MISSION_01.md word for word', () => {
    const doc = readFileSync(resolve(__dirname, '../../../docs/SCENARIOS_MISSION_01.md'), 'utf8');
    const missing: string[] = [];
    const check = (label: string, text: string) => {
      if (!doc.includes(text)) missing.push(`${label}: "${text}"`);
    };
    for (const s of mission.content.scenarios) {
      check(`${s.id} title`, s.title);
      check(`${s.id} description`, s.description);
      check(`${s.id} fact`, s.fact.text);
      for (const d of s.decisions) {
        check(`${d.id} title`, d.title);
        check(`${d.id} explanation`, d.explanation);
        if (d.laterHint) check(`${d.id} laterHint`, d.laterHint);
        d.overrides.forEach((o) => check(`${d.id} override note`, o.note));
      }
    }
    expect(missing).toEqual([]);
  });
});

describe('loadMission reference checks', () => {
  it('rejects a flag that is read but never set', () => {
    const bad = clone(content);
    bad.flagDailyEffects[0]!.ifFlag = 'no-such-flag';
    expect(() => loadMission(bad, balance, known)).toThrow(/no-such-flag/);
  });

  it('rejects a missing day', () => {
    const bad = clone(content);
    bad.days.splice(4, 1);
    expect(() => loadMission(bad, balance, known)).toThrow(MissionDataError);
  });

  it('rejects an unknown map object', () => {
    const bad = clone(content);
    bad.scenarios[0]!.mapHighlights.push('death-star');
    expect(() => loadMission(bad, balance, known)).toThrow(/death-star/);
  });

  it('rejects a branching day without a fallback', () => {
    const bad = clone(content);
    const day10 = bad.days.find((d) => d.day === 10)!;
    day10.options = [day10.options[0]!];
    expect(() => loadMission(bad, balance, known)).toThrow(/fallback/);
  });

  it('rejects a decision that lowers radiation dose', () => {
    const bad = clone(content);
    (bad.scenarios[0]!.decisions[0]!.effects as Record<string, number>).radiation = -5;
    expect(() => loadMission(bad, balance, known)).toThrow(/never go down/);
  });

  it('reports every problem at once', () => {
    const bad = clone(content);
    bad.scenarios[0]!.mapHighlights.push('x-wing');
    bad.scenarios[1]!.fact.sourceIds.push('wikipedia');
    try {
      loadMission(bad, balance, known);
      expect.unreachable();
    } catch (e) {
      expect((e as MissionDataError).problems).toHaveLength(2);
    }
  });
});
