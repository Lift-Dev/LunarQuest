import type { EquipmentId } from '../../data/maps/outpost-01';
import { getEquipment } from '../../data/maps/outpost-01';
import { phaseOf, radiationPercent } from '../../game/engine';
import type { Mission, MissionRun, ResourceId } from '../../game/types';

export type EquipmentStatus = 'normal' | 'warning' | 'critical';

export interface Inspection {
  status: EquipmentStatus;
  /** Short word after "Status:" */
  statusLabel: string;
  /** Resource bar, when the equipment has one. */
  reading?: { label: string; percent: number; /** high is bad (radiation dose) */ highIsBad: boolean };
  /** One short extra line. */
  note?: string;
}

/** Which resource each piece of equipment depends on. Used to colour its status. */
const DEPENDS_ON: Partial<Record<EquipmentId, ResourceId>> = {
  'battery-storage': 'power',
  'power-distribution': 'power',
  'science-lab': 'power',
  'comms-antenna': 'power',
  'life-support': 'lifeSupport',
  habitat: 'lifeSupport',
  'radiation-shelter': 'radiation',
};

/** "Critical" starts this many raw points before the abort level. */
const CRITICAL_MARGIN = 10;

function levelOf(mission: Mission, run: MissionRun, res: ResourceId): EquipmentStatus {
  const { abortAt, warnAt } = mission.balance;
  const v = run.resources[res];
  if (res === 'radiation') return v >= abortAt.radiation - CRITICAL_MARGIN ? 'critical' : v >= warnAt.radiation ? 'warning' : 'normal';
  return v <= abortAt[res] + CRITICAL_MARGIN ? 'critical' : v <= warnAt[res] ? 'warning' : 'normal';
}

const LABEL: Record<EquipmentStatus, string> = { normal: 'Normal', warning: 'Low', critical: 'Critical' };

/** Reads the current run and describes one piece of equipment. Pure: never changes the game. */
export function inspect(mission: Mission, run: MissionRun, id: EquipmentId): Inspection {
  const eq = getEquipment(id);
  const res = DEPENDS_ON[id];
  let status: EquipmentStatus = res ? levelOf(mission, run, res) : 'normal';
  let statusLabel = LABEL[status];
  let reading: Inspection['reading'];
  let note: string | undefined;

  if (eq.icon === 'solar') {
    const day = phaseOf(mission, run.day) === 'day';
    if (!day) {
      note = 'Night: no sunlight, no power.';
    } else if (run.flags.includes('dusty-panels')) {
      status = 'warning';
      statusLabel = 'Dusty';
      note = 'Dust makes less power.';
    } else {
      note = 'Sunlight: making power.';
    }
  }

  if (id === 'battery-storage') reading = { label: 'Charge', percent: run.resources.power, highIsBad: false };
  if (id === 'life-support') reading = { label: 'Air', percent: run.resources.lifeSupport, highIsBad: false };
  if (id === 'radiation-shelter') reading = { label: 'Radiation dose', percent: radiationPercent(mission, run), highIsBad: true };

  return { status, statusLabel, reading, note };
}
