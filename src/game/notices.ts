import { lowResources, phaseOf } from './engine';
import type { Mission, MissionRun, ResourceId } from './types';

/** Something to tell the player at the start of a new day. Text lives in the UI layer. */
export type Notice = { id: string; kind: 'night' } | { id: string; kind: 'low'; resource: ResourceId };

/**
 * Notices for the move from `before` (the day just played) to `after` (the next day).
 * - `night`: the first night day begins.
 * - `low`: a resource just crossed into its warning zone (not repeated every day).
 * Nothing is shown when the mission ended.
 */
export function noticesBetween(mission: Mission, before: MissionRun, after: MissionRun): Notice[] {
  if (after.status !== 'playing') return [];
  const out: Notice[] = [];
  if (phaseOf(mission, before.day) === 'day' && phaseOf(mission, after.day) === 'night') {
    out.push({ id: `night-${after.day}`, kind: 'night' });
  }
  const wasLow = new Set(lowResources(mission, before));
  for (const resource of lowResources(mission, after)) {
    if (!wasLow.has(resource)) out.push({ id: `low-${resource}-${after.day}`, kind: 'low', resource });
  }
  return out;
}
