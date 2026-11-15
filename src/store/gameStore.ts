import { create } from 'zustand';
import { getMission } from '../data/missions';
import { solarFlares } from '../data/solar-flares';
import { applyDecision, startMission } from '../game/engine';
import { noticesBetween } from '../game/notices';
import type { Notice } from '../game/notices';
import type { DecisionOutcome } from '../game/engine';
import type { MissionRun } from '../game/types';

/**
 * Active mission state. All rules live in game/engine.ts; this store only holds the current
 * run and the outcome being shown. Saving to localStorage is added in Phase 7.
 */
interface GameState {
  run: MissionRun | null;
  /** Result of the last decision, shown on the feedback card until the player continues. */
  outcome: DecisionOutcome | null;
  /** Notices for the day that follows the decision; moved to `notices` when the player continues. */
  pendingNotices: Notice[];
  /** Notices currently on screen. */
  notices: Notice[];
  dismissNotice: (id: string) => void;
  start: (missionId: string) => void;
  choose: (decisionId: string) => void;
  /** Dismiss the feedback card. */
  next: () => void;
  clear: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  run: null,
  outcome: null,
  pendingNotices: [],
  notices: [],
  dismissNotice: (id) => set((s) => ({ notices: s.notices.filter((n) => n.id !== id) })),
  start: (missionId) =>
    set({ run: startMission(getMission(missionId), solarFlares.map((f) => f.id)), outcome: null, pendingNotices: [], notices: [] }),
  choose: (decisionId) => {
    const { run, outcome } = get();
    if (!run || outcome) return; // ignore double taps while feedback is showing
    const mission = getMission(run.missionId);
    const result = applyDecision(mission, run, decisionId);
    set({ run: result.run, outcome: result, pendingNotices: noticesBetween(mission, run, result.run) });
  },
  next: () => set((s) => ({ outcome: null, notices: s.pendingNotices, pendingNotices: [] })),
  clear: () => set({ run: null, outcome: null, pendingNotices: [], notices: [] }),
}));
