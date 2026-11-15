import { describe, expect, it } from 'vitest';
import { getMission } from '../../data/missions';
import { solarFlares } from '../../data/solar-flares';
import { applyDecision, currentScenario, startMission } from '../../game/engine';
import { completePose, outcomePose, scenarioPose } from './moods';

const mission = getMission('mission-01');
const run0 = startMission(mission, solarFlares, () => 0);
const day1 = currentScenario(mission, run0);
const bigAt = mission.balance.bigEffectThreshold;

describe('mascot moods', () => {
  it('waves on day 1, warns on the flare day and when a resource is low', () => {
    expect(scenarioPose(1, 'day', day1, [])).toBe('waving');
    expect(scenarioPose(1, 'day', day1, ['power'])).toBe('caution');
    expect(scenarioPose(6, 'day', { ...day1, showsFlare: true }, [])).toBe('alert');
    expect(scenarioPose(9, 'night', day1, [])).toBe('pondering');
  });
  it('reacts to big science with excitement and to big costs with surprise', () => {
    const lab = applyDecision(mission, run0, day1.decisions[0].id); // science up, power down a lot
    expect(outcomePose({ ...lab, applied: { science: 12 } }, bigAt)).toBe('excited');
    expect(outcomePose({ ...lab, applied: { power: -10 } }, bigAt)).toBe('surprised');
    expect(outcomePose({ ...lab, applied: { power: -2 } }, bigAt)).toBe('thumbs-up-wink');
    expect(outcomePose({ ...lab, overrideNote: 'shield!' }, bigAt)).toBe('proud');
    expect(outcomePose({ ...lab, run: { ...lab.run, status: 'aborted' } }, bigAt)).toBe('worried');
  });
  it('celebrates harder with more stars', () => {
    expect(completePose(5)).toBe('cheering');
    expect(completePose(3)).toBe('celebrating');
    expect(completePose(1)).toBe('thumbs-up');
  });
});
