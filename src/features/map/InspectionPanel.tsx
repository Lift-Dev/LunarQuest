import {
  BatteryCharging,
  CircleAlert,
  CircleCheck,
  Cpu,
  FlaskConical,
  Gem,
  House,
  Network,
  RadioTower,
  ShieldHalf,
  SunMedium,
  Truck,
  Wind,
  X,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { connectionsOf, getEquipment, type EquipmentIcon, type EquipmentId } from '../../data/maps/outpost-01';
import { cn } from '../../design-system';
import type { Inspection } from './inspect';

const ICONS: Record<EquipmentIcon, ComponentType<{ className?: string }>> = {
  solar: SunMedium,
  battery: BatteryCharging,
  power: Cpu,
  habitat: House,
  air: Wind,
  lab: FlaskConical,
  comms: RadioTower,
  shelter: ShieldHalf,
  rover: Truck,
  samples: Gem,
};

const TONE = {
  normal: { text: 'text-green-400', bar: 'bg-green-500', Icon: CircleCheck },
  warning: { text: 'text-yellow-300', bar: 'bg-yellow-400', Icon: CircleAlert },
  critical: { text: 'text-red-400', bar: 'bg-red-500', Icon: CircleAlert },
} as const;

/** Floating panel from the Battery Storage design: name, status, one reading, "Connected to". */
export function InspectionPanel({
  id,
  info,
  onSelect,
  onClose,
}: {
  id: EquipmentId;
  info: Inspection;
  onSelect: (id: EquipmentId) => void;
  onClose: () => void;
}) {
  const eq = getEquipment(id);
  const Icon = ICONS[eq.icon];
  const tone = TONE[info.status];
  const StatusIcon = tone.Icon;
  const r = info.reading;
  // Radiation dose is bad when high, so its bar is purple and never "green".
  const barColor = r ? (r.highIsBad ? 'bg-purple-400' : tone.bar) : '';

  return (
    <section
      aria-label={`${eq.name} details`}
      className="w-full rounded-3xl border-2 border-cyan-400/70 bg-slate-950/90 px-5 py-4 text-white shadow-glow-panel backdrop-blur-md short:max-h-[calc(100dvh-6.5rem)] short:overflow-y-auto short:rounded-2xl short:px-3 short:py-2"
    >
      <div className="flex items-center gap-3 border-b border-blue-400/40 pb-3 short:gap-2 short:pb-2">
        <Icon className="size-10 shrink-0 text-blue-200 short:size-6" />
        <h2 className="flex-1 text-xl leading-tight font-bold short:text-base">{eq.name}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-10 shrink-0 place-items-center rounded-full short:size-8 border-2 border-white/70 bg-blue-600 transition hover:bg-blue-500"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>

      <div className="space-y-2 border-b border-blue-400/40 py-3 short:space-y-1 short:py-2 short:text-sm">
        <p className="flex items-center gap-3 text-lg short:gap-2 short:text-sm">
          <StatusIcon aria-hidden className={cn('size-8 shrink-0 short:size-5', tone.text)} />
          <span>
            Status: <strong className={cn('font-semibold', tone.text)}>{info.statusLabel}</strong>
          </span>
        </p>
        {r && (
          <div>
            <p className="text-lg short:text-sm">
              {r.label}: <strong className="font-semibold">{r.percent}%</strong>
            </p>
            <div
              role="meter"
              aria-label={r.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={r.percent}
              className="mt-1.5 h-3.5 overflow-hidden short:h-2.5 rounded-full border border-white/30 bg-slate-800"
            >
              <div className={cn('h-full rounded-full', barColor)} style={{ width: `${r.percent}%` }} />
            </div>
          </div>
        )}
        {info.note && <p className="text-lg leading-6 text-blue-100/90 short:text-sm short:leading-5">{info.note}</p>}
      </div>

      <div className="pt-3 short:pt-2">
        <p className="flex items-center gap-3 text-lg short:text-sm">
          <Network aria-hidden className="size-7 shrink-0 text-blue-300" />
          Connected to:
        </p>
        <ul className="mt-2 space-y-1 short:mt-1 short:flex short:flex-wrap short:gap-x-4 short:space-y-0">
          {connectionsOf(id).map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => onSelect(c)}
                className="flex w-full items-center gap-3 rounded-lg py-0.5 pl-10 text-left text-lg text-blue-100 transition hover:text-white short:pl-0 short:text-sm"
              >
                <span aria-hidden className="size-3 rounded-full bg-blue-500" />
                {getEquipment(c).name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
