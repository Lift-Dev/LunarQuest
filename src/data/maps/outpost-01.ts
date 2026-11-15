/**
 * Mission 01 outpost map: what can be inspected, where it is on the picture, and what it connects to.
 *
 * Coordinates are in pixels of the backdrop image (public/assets/backdrop/outpost.jpg, 1672×941),
 * so the clickable areas always line up with the picture at any screen size.
 * Inspect only: nothing here changes the game.
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

export type EquipmentIcon =
  | 'solar'
  | 'battery'
  | 'power'
  | 'habitat'
  | 'air'
  | 'lab'
  | 'comms'
  | 'shelter'
  | 'rover'
  | 'samples';

/** x, y, width, height in backdrop pixels. */
export type Rect = readonly [x: number, y: number, w: number, h: number];

export interface Equipment {
  id: EquipmentId;
  name: string;
  icon: EquipmentIcon;
  /** Clickable areas on the picture. The first one is the main body. */
  shapes: readonly Rect[];
  /** Direct links. Links work both ways; the other end is derived by `connectionsOf`. */
  linksTo: readonly EquipmentId[];
}

export const MAP_SIZE = { width: 1672, height: 941 } as const;

export const equipment: readonly Equipment[] = [
  { id: 'habitat', name: 'Habitat', icon: 'habitat', shapes: [[500, 450, 440, 180]], linksTo: ['life-support', 'science-lab', 'radiation-shelter', 'comms-antenna', 'power-distribution', 'rover'] },
  { id: 'science-lab', name: 'Science Lab', icon: 'lab', shapes: [[545, 345, 320, 110]], linksTo: [] },
  { id: 'radiation-shelter', name: 'Radiation Shelter', icon: 'shelter', shapes: [[300, 475, 285, 140]], linksTo: [] },
  { id: 'life-support', name: 'Life Support', icon: 'air', shapes: [[935, 455, 130, 80]], linksTo: [] },
  { id: 'battery-storage', name: 'Battery Storage', icon: 'battery', shapes: [[1118, 575, 392, 165]], linksTo: ['power-distribution', 'solar-array-01', 'solar-array-02'] },
  { id: 'solar-array-01', name: 'Solar Array 01', icon: 'solar', shapes: [[1110, 395, 215, 140]], linksTo: [] },
  { id: 'solar-array-02', name: 'Solar Array 02', icon: 'solar', shapes: [[1320, 400, 330, 145]], linksTo: [] },
  { id: 'power-distribution', name: 'Power Hub', icon: 'power', shapes: [[1015, 538, 95, 60]], linksTo: [] },
  { id: 'comms-antenna', name: 'Comms Antenna', icon: 'comms', shapes: [[940, 310, 115, 150], [840, 155, 75, 295]], linksTo: [] },
  { id: 'rover', name: 'Rover', icon: 'rover', shapes: [[62, 540, 300, 170]], linksTo: ['sample-area'] },
  { id: 'sample-area', name: 'Sample Area', icon: 'samples', shapes: [[780, 672, 130, 60]], linksTo: [] },
];

const byId = new Map(equipment.map((e) => [e.id, e]));

export const getEquipment = (id: EquipmentId): Equipment => {
  const e = byId.get(id);
  if (!e) throw new Error(`Unknown equipment "${id}"`);
  return e;
};

/** Everything directly linked to `id`, in either direction, in map order. */
export function connectionsOf(id: EquipmentId): EquipmentId[] {
  return equipment
    .filter((e) => e.id !== id && (e.linksTo.includes(id) || getEquipment(id).linksTo.includes(e.id)))
    .map((e) => e.id);
}

export const centerOf = (id: EquipmentId): [number, number] => {
  const [x, y, w, h] = getEquipment(id).shapes[0]!;
  return [x + w / 2, y + h / 2];
};
