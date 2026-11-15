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
    // 7 scenarios, one every two days: each decision covers two days of the 14-day stay.
    expect(mission.content.days.map((d) => d.day)).toEqual([1, 3, 5, 7, 9, 11, 13]);
    expect(mission.content.scenarios).toHaveLength(7);
    expect(mission.balance.durationDays).toBe(14);
  });

  it('every decision has a visible cost (design rule: no free choice)', () => {
    const free = mission.content.scenarios
      .flatMap(({ decisions: [a, b] }) => [
        [a, b],
        [b, a],
      ])
      .filter(([d, other]) => !decisionHasCost(d!, other))
      .map(([d]) => d!.id);
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

  it('rejects scenario days out of order, not starting on day 1, or past the mission', () => {
    const swapped = clone(content);
    [swapped.days[1], swapped.days[2]] = [swapped.days[2]!, swapped.days[1]!];
    expect(() => loadMission(swapped, balance, known)).toThrow(MissionDataError);
    const late = clone(content);
    late.days[0]!.day = 2;
    expect(() => loadMission(late, balance, known)).toThrow(/start at 1/);
    const past = clone(content);
    past.days.at(-1)!.day = 15;
    expect(() => loadMission(past, balance, known)).toThrow(/within 1..14/);
  });

  it('every source cited by a fact is a checked NASA link', () => {
    for (const s of getMission('mission-01').content.scenarios) {
      for (const id of s.fact.sourceIds) {
        const src = sources.find((x) => x.id === id)!;
        expect(src.verified).toBe(true);
        expect(src.url).toMatch(/^https:\/\/(www\.nasa\.gov|ntrs\.nasa\.gov|ccmc\.gsfc\.nasa\.gov)\//);
      }
    }
  });

  it('rejects an unknown map object', () => {
    const bad = clone(content);
    bad.scenarios[0]!.mapHighlights.push('death-star');
    expect(() => loadMission(bad, balance, known)).toThrow(/death-star/);
  });

  it('rejects a branching day without a fallback', () => {
    const bad = clone(content);
    (bad.days[1]!.options[0] as { requiresFlag?: string }).requiresFlag = 'dusty-panels';
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
