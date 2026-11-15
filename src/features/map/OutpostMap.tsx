import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Wrench } from 'lucide-react';
import { MAP_SIZE, centerOf, connectionsOf, equipment, getEquipment, type Equipment, type EquipmentId } from '../../data/maps/outpost-01';
import { cn } from '../../design-system';
import type { Decision, Problem } from '../../game/types';
import { ProblemFx } from './ProblemFx';

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
  /** What is going wrong right now: glows red with an animation, and its fix sits next to it. */
  problem?: Problem;
  /** The decision that fixes `problem`. Choosing it from here is the same as choosing it anywhere. */
  fix?: { decision: Decision; onChoose: () => void };
  /** Cover only: which part of the picture stays in view when it is cropped sideways (0 = left, 1 = right). */
  focusX?: number;
  className?: string;
}

export function OutpostMap({ selected, highlights, onSelect, fit, problem, fix, focusX = 0.5, className }: Props) {
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
          const isHi = highlights.includes(e.id) && !selected && !problem?.equipment.includes(e.id);
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

        {problem && <ProblemFx problem={problem} />}
        {selected && <Pin equipment={equipment.find((e) => e.id === selected)!} />}
      </svg>
      {problem && fix && <FixButton problem={problem} decision={fix.decision} onChoose={fix.onChoose} />}
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

/** The fix, floating just above the problem like a repair job to walk up to. Positioned in picture percentages. */
function FixButton({ problem, decision, onChoose }: { problem: Problem; decision: Decision; onChoose: () => void }) {
  const rects = problem.equipment.map((id) => getEquipment(id as EquipmentId).shapes[0]!);
  const left = Math.min(...rects.map((r) => r[0]));
  const right = Math.max(...rects.map((r) => r[0] + r[2]));
  const top = Math.min(...rects.map((r) => r[1]));
  return (
    <div
      className="absolute z-10"
      style={{ left: `${(((left + right) / 2) / MAP_SIZE.width) * 100}%`, top: `${(top / MAP_SIZE.height) * 100}%` }}
    >
      <div className="-translate-x-1/2 -translate-y-full pb-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChoose();
          }}
          className="group relative flex w-56 animate-float max-sm:w-44 short:w-44 items-center gap-2.5 rounded-2xl border-2 border-green-200 bg-gradient-to-b from-green-400 to-green-500 px-3 py-2 text-left text-white shadow-[0_4px_0_0_rgb(21_128_61)] transition hover:brightness-110 active:translate-y-0.5 active:shadow-none"
        >
          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/90 text-green-700">
            <Wrench className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-base leading-tight font-bold short:text-sm">{decision.title}</span>
            <span className="block text-xs leading-4 text-white/95">{decision.explanation}</span>
          </span>
          {/* Little tail pointing down at the problem. */}
          <span aria-hidden className="absolute -bottom-2 left-1/2 size-3.5 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-green-200 bg-green-500" />
        </button>
      </div>
    </div>
  );
}
