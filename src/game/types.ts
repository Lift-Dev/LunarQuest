/**
 * Game types. Content types are inferred from the Zod schemas so the schema
 * and the type can never drift apart. Runtime state types are defined here.
 */
import type { z } from 'zod';
import type {
  dayPlanSchema,
  decisionSchema,
  effectsSchema,
  levelSchema,
  missionBalanceSchema,
  missionContentSchema,
  resourceIdSchema,
  scenarioSchema,
  solarFlareSchema,
  sourceSchema,
} from './schema';

export type ResourceId = z.infer<typeof resourceIdSchema>;
export type Effects = z.infer<typeof effectsSchema>;
export type Decision = z.infer<typeof decisionSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type Problem = NonNullable<Scenario['problem']>;
export type DayPlan = z.infer<typeof dayPlanSchema>;
export type MissionContent = z.infer<typeof missionContentSchema>;
export type MissionBalance = z.infer<typeof missionBalanceSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type SolarFlare = z.infer<typeof solarFlareSchema>;
export type Level = z.infer<typeof levelSchema>;

/** A fully validated, ready-to-play mission. */
export interface Mission {
  content: MissionContent;
  balance: MissionBalance;
  /** Scenarios indexed by id for O(1) lookup. */
  scenariosById: ReadonlyMap<string, Scenario>;
}

export type Resources = Record<ResourceId, number>;

export type DayPhase = 'day' | 'night';

/** One recorded decision, used for the debrief and Mission Complete stats. */
export interface HistoryEntry {
  day: number;
  scenarioId: string;
  decisionId: string;
  /** Effects actually applied (after flag overrides). */
  applied: Effects;
}

export type RunStatus = 'playing' | 'aborted' | 'complete';

/** Everything needed to save and resume an in-progress mission. */
export interface MissionRun {
  missionId: string;
  day: number;
  resources: Resources;
  science: number;
  flags: string[];
  /** Random choices fixed at mission start so reloading never re-rolls them. Key = day. */
  randomPicks: Record<number, string>;
  /** Solar flare shown on the flare scenario, fixed at mission start. */
  flareId: string | null;
  history: HistoryEntry[];
  status: RunStatus;
  abortedBy: ResourceId | null;
}
