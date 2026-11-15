/**
 * Turns raw mission data into a validated `Mission`.
 *
 * Two layers of checks:
 * 1. Shape: Zod schemas (field types, required text, kebab-case ids…).
 * 2. References: things a schema can't see, e.g. every flag a scenario reads
 *    must be set by some decision, and every day must resolve to a scenario.
 *
 * All problems are collected and thrown together so a content author sees
 * every issue at once.
 */
import { ENGINE_FLAGS } from './engine';
import { missionBalanceSchema, missionContentSchema } from './schema';
import type { Mission, MissionBalance, MissionContent, Scenario } from './types';

export class MissionDataError extends Error {
  constructor(
    missionId: string,
    readonly problems: string[],
  ) {
    super(`Mission data "${missionId}" is invalid:\n- ${problems.join('\n- ')}`);
    this.name = 'MissionDataError';
  }
}

/** Ids that live outside the mission file and must be cross-checked. */
export interface KnownIds {
  equipmentIds: readonly string[];
  sourceIds: readonly string[];
}

export function loadMission(rawContent: unknown, rawBalance: unknown, known: KnownIds): Mission {
  const contentResult = missionContentSchema.safeParse(rawContent);
  const balanceResult = missionBalanceSchema.safeParse(rawBalance);
  const missionId =
    (rawContent as { missionId?: unknown } | null)?.missionId?.toString() ?? 'unknown';

  const shapeProblems = [
    ...(contentResult.success ? [] : contentResult.error.issues.map((i) => `content.${i.path.join('.')}: ${i.message}`)),
    ...(balanceResult.success ? [] : balanceResult.error.issues.map((i) => `balance.${i.path.join('.')}: ${i.message}`)),
  ];
  if (!contentResult.success || !balanceResult.success) {
    throw new MissionDataError(missionId, shapeProblems);
  }

  const content = contentResult.data;
  const balance = balanceResult.data;
  const problems = findReferenceProblems(content, balance, known);
  if (problems.length > 0) throw new MissionDataError(content.missionId, problems);

  return {
    content,
    balance,
    scenariosById: new Map(content.scenarios.map((s) => [s.id, s])),
  };
}

function findReferenceProblems(content: MissionContent, balance: MissionBalance, known: KnownIds): string[] {
  const problems: string[] = [];
  const scenarioIds = new Set<string>();
  const decisionIds = new Set<string>();
  const flagsSet = new Set<string>(ENGINE_FLAGS);

  for (const s of content.scenarios) {
    if (scenarioIds.has(s.id)) problems.push(`duplicate scenario id "${s.id}"`);
    scenarioIds.add(s.id);
    for (const d of s.decisions) {
      if (decisionIds.has(d.id)) problems.push(`duplicate decision id "${d.id}"`);
      decisionIds.add(d.id);
      d.setsFlags.forEach((f) => flagsSet.add(f));
    }
  }

  const flagsRead: Array<[flag: string, where: string]> = [];

  // Scenario days: start on day 1, strictly ascending, within the mission. Days in between have
  // no scenario; the decision before them covers them (see engine.applyDecision).
  const days = content.days.map((d) => d.day);
  const ascending = days.every((d, i) => i === 0 || d > days[i - 1]!);
  if (days[0] !== 1 || !ascending || days.some((d) => d > balance.durationDays)) {
    problems.push(`days must start at 1, go up, and stay within 1..${balance.durationDays}, got [${days.join(', ')}]`);
  }
  const usedScenarios = new Set<string>();
  for (const plan of content.days) {
    for (const opt of plan.options) {
      usedScenarios.add(opt.scenarioId);
      if (!scenarioIds.has(opt.scenarioId)) problems.push(`day ${plan.day}: unknown scenario "${opt.scenarioId}"`);
      if (opt.requiresFlag) {
        if (plan.selection === 'random') problems.push(`day ${plan.day}: random days can't use requiresFlag`);
        flagsRead.push([opt.requiresFlag, `day ${plan.day}`]);
      }
    }
    // A branching day needs an unconditional fallback, or it could resolve to nothing.
    const last = plan.options[plan.options.length - 1];
    if (plan.selection === 'first-match' && last?.requiresFlag) {
      problems.push(`day ${plan.day}: last option must have no requiresFlag (fallback)`);
    }
  }
  for (const id of scenarioIds) {
    if (!usedScenarios.has(id)) problems.push(`scenario "${id}" is never played on any day`);
  }

  const equipment = new Set(known.equipmentIds);
  const sources = new Set(known.sourceIds);
  for (const s of content.scenarios) {
    for (const eq of s.mapHighlights) {
      if (!equipment.has(eq)) problems.push(`scenario "${s.id}": unknown map object "${eq}"`);
    }
    if (s.problem) {
      for (const eq of s.problem.equipment) {
        if (!equipment.has(eq)) problems.push(`scenario "${s.id}": problem on unknown map object "${eq}"`);
      }
      if (!s.decisions.some((d) => d.id === s.problem!.fixDecisionId)) {
        problems.push(`scenario "${s.id}": fixDecisionId "${s.problem.fixDecisionId}" is not one of its decisions`);
      }
    }
    for (const src of s.fact.sourceIds) {
      if (!sources.has(src)) problems.push(`scenario "${s.id}": unknown source "${src}"`);
    }
    for (const d of s.decisions) {
      d.overrides.forEach((o) => flagsRead.push([o.ifFlag, `decision "${d.id}"`]));
    }
  }
  content.flagDailyEffects.forEach((e) => flagsRead.push([e.ifFlag, 'flagDailyEffects']));

  for (const [flag, where] of flagsRead) {
    if (!flagsSet.has(flag)) problems.push(`${where}: flag "${flag}" is read but no decision sets it`);
  }

  if (balance.daylightDays > balance.durationDays) problems.push('balance: daylightDays > durationDays');
  const t = balance.starThresholds;
  if (t.some((v, i) => i > 0 && v <= t[i - 1]!)) problems.push('balance: starThresholds must be ascending');

  return problems;
}

/**
 * Design rule: no free choice. A decision must cost a resource, carry a ⏳ later-consequence hint,
 * or give up science that the other option earns (the cost of playing safe).
 */
export function decisionHasCost(decision: Scenario['decisions'][number], other?: Scenario['decisions'][number]): boolean {
  const e = decision.effects;
  const givesUpScience = other !== undefined && (e.science ?? 0) < (other.effects.science ?? 0);
  return (e.lifeSupport ?? 0) < 0 || (e.power ?? 0) < 0 || (e.radiation ?? 0) > 0 || decision.laterHint !== undefined || givesUpScience;
}
