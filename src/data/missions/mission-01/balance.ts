/**
 * Mission 01 simulation numbers, and where each one comes from.
 * Full derivation with quotes: docs/SCENARIOS_MISSION_01.md §2. Source ids → src/data/sources.ts.
 *
 * UNITS (the HUD shows each bar as a percentage of its scale)
 * - lifeSupport: 1 point = 0.85 kg of oxygen = what one astronaut breathes in a day
 *   (ISS metabolic usage 0.85 kg/crew/day, nasa-iss-oxygen-ices-2015). Full = 85 kg.
 * - power: % of battery charge. The outpost's battery size and solar output are game assumptions;
 *   only their RATIOS come from NASA (dust halves panel output: nasa-lunar-dust-challenge).
 * - radiation: 1 point = 0.5 mSv. Abort at 500 points = 250 mSv, NASA's limit for a crew's dose
 *   from a solar particle event (NASA-STD-3001 [V1 4031], nasa-std-3001-radiation).
 */
import type { MissionBalance } from '../../../game/types';

export const balance: MissionBalance = {
  durationDays: 14,
  // South Pole site: the Sun skims the horizon, and well-chosen sites "can remain sunlit for long
  // periods of time" with "reduced duration of lunar nights" (nasa-south-pole-region). We assume the
  // outpost sits on such a site, so this 14-day stay has no night phase. Shadows are in the scenarios.
  daylightDays: 14,
  // Day 1: "the battery is only half charged".
  start: { lifeSupport: 100, power: 50, radiation: 0 },
  max: { lifeSupport: 100, power: 100 },
  dailyRates: {
    // lifeSupport −4: a crew of four × 0.85 kg/day.
    // power +5: clean, sunlit panels make ~10/day, outpost uses ~5/day (assumption; dust halves the 10).
    // radiation +1 = 0.5 mSv/day on the lunar surface (nasa-lsah-2023: "on the order of 0.5 mSv/day").
    day: { lifeSupport: -4, power: 5, radiation: 1 },
    // Unused at a South Pole site (daylightDays = durationDays); kept for missions with a lunar night.
    night: { lifeSupport: -4, power: -8, radiation: 1 },
  },
  abortAt: {
    // 20 points = 17 kg of oxygen = about 5 days for four astronauts: the reserve kept for the trip home (assumption).
    lifeSupport: 20,
    // Below 10% the battery can't keep heaters and life support running (assumption).
    power: 10,
    // 250 mSv (NASA-STD-3001 solar particle event limit).
    radiation: 500,
  },
  // UI warning levels only: a few days of margin before each abort level. Radiation warns at 50% of the limit.
  warnAt: { lifeSupport: 35, power: 25, radiation: 250 },
  // Science points: a star option is worth 10 (Day 13 lab: 15, packing samples: 5). Collecting every
  // star option = 45 = 5 stars; skipping one = 4 stars, skipping two = 3 stars.
  starThresholds: [5, 15, 25, 35, 45],
  bigEffectThreshold: 10,
};
