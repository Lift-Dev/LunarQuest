/**
 * Equipment on the Mission 01 outpost map.
 * Phase 2: ids only (used to validate scenario `mapHighlights`).
 * Phase 5 adds positions, cable paths, descriptions and connections.
 */
export const EQUIPMENT_IDS = [
  'solar-array-01',
  'solar-array-02',
  'battery-storage',
  'power-distribution',
  'habitat',
  'life-support',
  'science-lab',
  'comms-antenna',
  'radiation-shelter',
  'rover',
  'sample-area',
] as const;

export type EquipmentId = (typeof EQUIPMENT_IDS)[number];
