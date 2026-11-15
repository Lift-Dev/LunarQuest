import { create } from 'zustand';
import { getMission } from '../data/missions';
import { solarFlares } from '../data/solar-flares';
import { applyDecision, startMission } from '../game/engine';
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
  start: (missionId: string) => void;
  choose: (decisionId: string) => void;
  /** Dismiss the feedback card. */
  next: () => void;
  clear: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  run: null,
  outcome: null,
  start: (missionId) =>
    set({ run: startMission(getMission(missionId), solarFlares.map((f) => f.id)), outcome: null }),
  choose: (decisionId) => {
    const { run, outcome } = get();
    if (!run || outcome) return; // ignore double taps while feedback is showing
    const result = applyDecision(getMission(run.missionId), run, decisionId);
    set({ run: result.run, outcome: result });
  },
  next: () => set({ outcome: null }),
  clear: () => set({ run: null, outcome: null }),
}));
