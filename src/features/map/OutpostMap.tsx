import { useState } from 'react';
import { MAP_SIZE, centerOf, connectionsOf, equipment, type Equipment, type EquipmentId } from '../../data/maps/outpost-01';
import { cn } from '../../design-system';

/**
 * The outpost picture with clickable equipment on top (inspect only).
 * The picture and the SVG share one coordinate system and the same fit,
 * so hotspots stay on their objects at any screen size. The picture is never cropped (`meet`),
 * so every piece of equipment is always visible; its top and bottom edges fade into the space background.
 */
interface Props {
  selected: EquipmentId | null;
  /** Equipment the current scenario is about: shown with a soft pulsing outline. */
  highlights: readonly string[];
  onSelect: (id: EquipmentId | null) => void;
  className?: string;
}

export function OutpostMap({ selected, highlights, onSelect, className }: Props) {
  const [hover, setHover] = useState<EquipmentId | null>(null);
  const linked = selected ? connectionsOf(selected) : [];

  return (
    <div className={cn('overflow-hidden', className)}>
      <img
        src="/assets/backdrop/outpost.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-contain [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
      />
      <svg
        viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Lunar outpost map. Choose a part to inspect it."
        className="absolute inset-0 size-full"
        onClick={() => onSelect(null)}
      >
        {/* Cables from the selected part to what it is connected to. */}
        {selected &&
          linked.map((id) => (
            <path
              key={id}
              d={cablePath(selected, id)}
              fill="none"
              stroke="#67e8f9"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="12 12"
              className="pointer-events-none animate-flow"
              style={{ filter: 'drop-shadow(0 0 4px rgb(34 211 238 / 0.8))' }}
            />
          ))}

        {equipment.map((e) => {
          const isSel = selected === e.id;
          const isLinked = linked.includes(e.id);
          const isHi = highlights.includes(e.id) && !selected;
          const isHover = hover === e.id;
          return (
            <g
              key={e.id}
              role="button"
              tabIndex={0}
              aria-label={`${e.name}${isSel ? ', selected' : ''}`}
              aria-pressed={isSel}
              className="cursor-pointer outline-none [&:focus-visible_.ring]:stroke-white"
              onClick={(ev) => {
                ev.stopPropagation();
                onSelect(isSel ? null : e.id);
              }}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault();
                  onSelect(isSel ? null : e.id);
                }
              }}
              onMouseEnter={() => setHover(e.id)}
              onMouseLeave={() => setHover(null)}
            >
              {e.shapes.map(([x, y, w, h], i) => (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={26}
                  fill={isHi ? 'rgb(253 224 71 / 0.14)' : 'rgb(255 255 255 / 0.001)'}
                  className={cn('ring', isHi && 'animate-pulse-ring')}
                  stroke={isSel ? '#67e8f9' : isLinked ? '#67e8f9' : isHi ? '#fde047' : isHover ? '#bae6fd' : 'transparent'}
                  strokeWidth={isSel ? 5 : isLinked || isHi || isHover ? 2.5 : 0}
                  strokeDasharray={isLinked && !isSel ? '10 8' : undefined}
                  style={isSel ? { filter: 'drop-shadow(0 0 6px rgb(34 211 238 / 0.9))' } : undefined}
                />
              ))}
            </g>
          );
        })}

        {selected && <Pin equipment={equipment.find((e) => e.id === selected)!} />}
      </svg>
    </div>
  );
}

/** Blue map pin above the selected part (as in the Battery Storage design). */
function Pin({ equipment: e }: { equipment: Equipment }) {
  const [x, y, w] = e.shapes[0]!;
  const cx = x + w / 2;
  const cy = y - 8;
  return (
    <g className="pointer-events-none" transform={`translate(${cx} ${cy})`}>
      <path d="M0 0 C-22 -26 -30 -38 -30 -52 a30 30 0 1 1 60 0 C30 -38 22 -26 0 0 Z" fill="#2563eb" stroke="white" strokeWidth={4} />
      <circle cx={0} cy={-52} r={11} fill="white" />
    </g>
  );
}

/** A gentle curve between the middles of two parts. */
function cablePath(a: EquipmentId, b: EquipmentId): string {
  const [ax, ay] = centerOf(a);
  const [bx, by] = centerOf(b);
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2 + Math.min(80, Math.abs(ax - bx) * 0.12);
  return `M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`;
}
