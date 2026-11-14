/**
 * Registry of playable missions. Adding a mission = add a folder with
 * content.json + balance.ts and register it here. No UI changes needed.
 */
import { loadMission } from '../../game/loadMission';
import type { Mission } from '../../game/types';
import { EQUIPMENT_IDS } from '../maps/outpost-01';
import { sources } from '../sources';
import mission01Content from './mission-01/content.json';
import { balance as mission01Balance } from './mission-01/balance';

const known = {
  equipmentIds: EQUIPMENT_IDS,
  sourceIds: sources.map((s) => s.id),
};

const rawMissions = {
  'mission-01': { content: mission01Content, balance: mission01Balance },
} as const;

export type MissionId = keyof typeof rawMissions;

const cache = new Map<string, Mission>();

/** Validated on first use; throws MissionDataError with every problem found. */
export function getMission(id: string): Mission {
  const cached = cache.get(id);
  if (cached) return cached;
  const raw = rawMissions[id as MissionId];
  if (!raw) throw new Error(`Unknown mission "${id}"`);
  const mission = loadMission(raw.content, raw.balance, known);
  cache.set(id, mission);
  return mission;
}

export const missionIds = Object.keys(rawMissions) as MissionId[];
