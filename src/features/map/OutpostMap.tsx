import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { MAP_SIZE, centerOf, connectionsOf, equipment, type Equipment, type EquipmentId } from '../../data/maps/outpost-01';
import { cn } from '../../design-system';

/**
 * The outpost picture with clickable equipment on top (inspect only).
 * The picture and the SVG sit in one "stage" box with the picture's exact proportions,
 * so hotspots stay on their objects at any screen size.
 * - `cover`   the stage fills the whole container (full-bleed background), cropped around `focusX`
 * - `contain` the whole picture is shown, with soft faded edges (portrait tablets)
 */
interface Props {
  selected: EquipmentId | null;
  /** Equipment the current scenario is about: shown with a soft pulsing outline. */
  highlights: readonly string[];
  onSelect: (id: EquipmentId | null) => void;
  fit: 'cover' | 'contain';
  /** Cover only: which part of the picture stays in view when it is cropped sideways (0 = left, 1 = right). */
  focusX?: number;
  className?: string;
}

export function OutpostMap({ selected, highlights, onSelect, fit, focusX = 0.5, className }: Props) {
  const [hover, setHover] = useState<EquipmentId | null>(null);
  const linked = selected ? connectionsOf(selected) : [];
  const ref = useRef<HTMLDivElement>(null);
  const stage = useCoverStage(ref, fit === 'cover', focusX);

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <div className="absolute" style={fit === 'cover' ? stage : { inset: 0 }}>
      <img
        src="/assets/backdrop/outpost.jpg"
        alt=""
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 size-full',
          fit === 'cover'
            ? 'object-fill'
            : 'object-contain [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent),linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-composite:source-in]',
        )}
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

/** Size and position of a picture-shaped box that covers the container, cropped around `focusX`. */
function useCoverStage(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean, focusX: number): CSSProperties {
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry!.contentRect.width, h: entry!.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, enabled]);
  const scale = Math.max(box.w / MAP_SIZE.width, box.h / MAP_SIZE.height);
  const width = MAP_SIZE.width * scale;
  const height = MAP_SIZE.height * scale;
  return { width, height, left: (box.w - width) * focusX, top: (box.h - height) / 2 };
}
