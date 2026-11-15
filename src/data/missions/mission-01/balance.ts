/**
 * Mission 01 simulation numbers.
 *
 * ⚠️ TEMPORARY GAME-BALANCING ASSUMPTIONS — NOT SCIENTIFIC MEASUREMENTS.
 * Tuned with scripts/balance-sim.ts (Phase 8). See docs/SCENARIOS_MISSION_01.md §2.
 */
import type { MissionBalance } from '../../../game/types';

export const balance: MissionBalance = {
  durationDays: 14,
  daylightDays: 7,
  start: { lifeSupport: 100, power: 80, radiation: 0 },
  max: { lifeSupport: 100, power: 100 },
  dailyRates: {
    day: { lifeSupport: -4, power: 4, radiation: 2 },
    night: { lifeSupport: -4, power: -8, radiation: 2 },
  },
  abortAt: { lifeSupport: 15, power: 10, radiation: 60 },
  // UI warning levels only (low-air / low-power / high-dose notices); ~25 points before abort.
  warnAt: { lifeSupport: 35, power: 30, radiation: 40 },
  starThresholds: [20, 45, 70, 95, 120],
  bigEffectThreshold: 10,
};
