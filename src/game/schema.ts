/**
 * Zod schemas for all game content (missions, scenarios, balance).
 *
 * Content lives in `src/data/` as plain data. These schemas are the single
 * definition of its shape: TypeScript types are inferred from them (see
 * types.ts), and `loadMission()` validates the data at startup so a typo in a
 * content file fails loudly instead of breaking the game mid-play.
 */
import { z } from 'zod';

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids must be kebab-case');

/** The three survival resources. Science is tracked separately. */
export const RESOURCE_IDS = ['lifeSupport', 'power', 'radiation'] as const;
export const resourceIdSchema = z.enum(RESOURCE_IDS);

/** Change applied to the mission state. Positive radiation is BAD (dose goes up). */
export const effectsSchema = z
  .object({
    lifeSupport: z.number().int(),
    power: z.number().int(),
    radiation: z.number().int().min(0, 'radiation dose can never go down'),
    science: z.number().int().min(0),
  })
  .partial()
  .strict();

/** A short, true fact shown after the player decides. */
export const factSchema = z.object({
  text: z.string().min(1),
  sourceIds: z.array(id).min(1),
});

/**
 * When `ifFlag` is set, the listed effect keys REPLACE the decision's base
 * values (not added to them). Used e.g. on Day 6: shielded shelter halves dose.
 */
export const effectOverrideSchema = z.object({
  ifFlag: id,
  effects: effectsSchema,
  note: z.string().min(1),
});

export const decisionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  explanation: z.string().min(1),
  image: z.string().optional(),
  effects: effectsSchema,
  overrides: z.array(effectOverrideSchema).default([]),
  setsFlags: z.array(id).default([]),
  /** Text for the ⏳ "matters later" badge on the decision card. */
  laterHint: z.string().optional(),
});

/** How a problem looks on the map (each kind has its own animation). */
export const PROBLEM_KINDS = ['shadow', 'dust', 'damage', 'storm', 'air'] as const;

/**
 * The thing that is going wrong on the map. It glows red with an animation, and the decision that
 * fixes it appears right next to it, so the player "goes there" to fix it.
 */
export const problemSchema = z.object({
  kind: z.enum(PROBLEM_KINDS),
  equipment: z.array(id).min(1),
  fixDecisionId: z.string().min(1),
});

export const scenarioSchema = z.object({
  id,
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  /** Equipment ids on the outpost map to highlight. Empty = no highlight. */
  mapHighlights: z.array(id).default([]),
  /** Shows the real solar-flare card (Day 6). */
  showsFlare: z.boolean().default(false),
  problem: problemSchema.optional(),
  decisions: z.tuple([decisionSchema, decisionSchema]),
  fact: factSchema,
});

/**
 * Which scenario plays on a given day.
 * - `first-match`: the first option whose flag conditions pass (branching).
 * - `random`: one option picked when the mission starts (replayability).
 */
export const dayPlanSchema = z.object({
  day: z.number().int().min(1),
  selection: z.enum(['first-match', 'random']).default('first-match'),
  options: z
    .array(
      z.object({
        scenarioId: id,
        requiresFlag: id.optional(),
      }),
    )
    .min(1),
});

/** Ongoing daily change caused by a flag (e.g. dusty panels charge slower). */
export const flagDailyEffectSchema = z.object({
  ifFlag: id,
  phase: z.enum(['day', 'night', 'any']),
  effects: effectsSchema,
  note: z.string().min(1),
});

export const missionContentSchema = z.object({
  missionId: id,
  title: z.string().min(1),
  location: z.string().min(1),
  days: z.array(dayPlanSchema).min(1),
  scenarios: z.array(scenarioSchema).min(1),
  flagDailyEffects: z.array(flagDailyEffectSchema).default([]),
  /** Shown on the Mission Aborted debrief, one per resource. */
  debriefTips: z.object({
    lifeSupport: z.string(),
    power: z.string(),
    radiation: z.string(),
  }),
});

const dailyRateSchema = z.object({
  lifeSupport: z.number().int(),
  power: z.number().int(),
  radiation: z.number().int().min(0),
});

/**
 * All numbers that drive the simulation for one mission.
 * Each value is derived from a NASA source where one exists; the derivation of every number is in
 * docs/SCENARIOS_MISSION_01.md §2 and in the mission's balance.ts.
 */
export const missionBalanceSchema = z.object({
  durationDays: z.number().int().min(1),
  daylightDays: z.number().int().min(0),
  start: z.object({
    lifeSupport: z.number(),
    power: z.number(),
    radiation: z.number(),
  }),
  max: z.object({
    lifeSupport: z.number(),
    power: z.number(),
  }),
  /** Applied at the end of each day, by phase. */
  dailyRates: z.object({ day: dailyRateSchema, night: dailyRateSchema }),
  /** Mission is aborted when lifeSupport/power drop to these values or below, or radiation reaches its value or above. */
  abortAt: z.object({
    lifeSupport: z.number(),
    power: z.number(),
    radiation: z.number(),
  }),
  /**
   * UI only: a resource is shown as "low" (red bar + warning notice) at or past these values.
   * Same direction as abortAt. Does not change any game rule.
   */
  warnAt: z.object({
    lifeSupport: z.number(),
    power: z.number(),
    radiation: z.number(),
  }),
  /** Science points needed for 1…5 stars, ascending. */
  starThresholds: z.tuple([z.number(), z.number(), z.number(), z.number(), z.number()]),
  /** |effect| at or above this shows a double arrow on decision cards. */
  bigEffectThreshold: z.number().int().min(1),
});

export const sourceSchema = z.object({
  id,
  name: z.string().min(1),
  /** null until a real URL has been checked by a human. */
  url: z.string().url().nullable(),
  verified: z.boolean(),
});

export const solarFlareSchema = z.object({
  id,
  /** ISO date, UTC. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  classType: z.string().regex(/^[ABCMX]\d+(\.\d)?$/),
  note: z.string().optional(),
  /** DONKI flrID once confirmed against the database. */
  donkiId: z.string().nullable(),
  /** DONKI sepIDs of the solar energetic particle events linked to this flare. */
  sepIds: z.array(z.string()).default([]),
  /** True when one of those SEP events was recorded at >100 MeV (GOES), the protons that get through spacesuits. */
  fastParticles: z.boolean(),
  verified: z.boolean(),
});

export const levelSchema = z.object({
  number: z.number().int().min(1),
  id,
  title: z.string().min(1),
  thumbnail: z.string().optional(),
  /** null = level has no content yet ("Coming soon" even when unlocked). */
  contentId: id.nullable(),
});
