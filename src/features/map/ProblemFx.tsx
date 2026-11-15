import { getEquipment, type EquipmentId, type Rect } from '../../data/maps/outpost-01';
import type { Problem } from '../../game/types';

/**
 * What a problem looks like on the map: a red alarm outline plus an animation that fits the problem
 * (shadow sweeping over panels, dust drifting, electric sparks, radiation streaks, CO₂ puffs).
 * Drawn inside the map's SVG, in backdrop pixels. Purely decorative.
 */
const FX_BOX = { pointerEvents: 'none' } as const;

export function ProblemFx({ problem }: { problem: Problem }) {
  const shapes = problem.equipment.map((id) => getEquipment(id as EquipmentId).shapes[0]!);
  return (
    <g style={FX_BOX} aria-hidden>
      {shapes.map((r, i) => (
        <g key={i}>
          <rect
            x={r[0]}
            y={r[1]}
            width={r[2]}
            height={r[3]}
            rx={26}
            fill="#ef4444"
            stroke="#ef4444"
            strokeWidth={5}
            className="animate-alarm"
            style={{ filter: 'drop-shadow(0 0 10px rgb(239 68 68 / 0.9))' }}
          />
          <Fx kind={problem.kind} rect={r} index={i} />
        </g>
      ))}
    </g>
  );
}

const delay = (s: number) => ({ animationDelay: `${s}s` });
const still = { transformBox: 'fill-box', transformOrigin: 'center' } as const;

function Fx({ kind, rect, index }: { kind: Problem['kind']; rect: Rect; index: number }) {
  const [x, y, w, h] = rect;
  const clip = `fx-clip-${index}-${x}-${y}`;
  const pts = (n: number) => Array.from({ length: n }, (_, i) => i);

  if (kind === 'shadow') {
    // A dark ridge shadow slides across the panels.
    return (
      <>
        <clipPath id={clip}>
          <rect x={x} y={y} width={w} height={h} rx={26} />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          <rect x={x - w * 0.1} y={y} width={w * 0.55} height={h} fill="#020617" fillOpacity={0.6} className="animate-sweep" style={still} />
        </g>
      </>
    );
  }

  if (kind === 'dust') {
    return (
      <>
        {pts(9).map((i) => (
          <circle
            key={i}
            cx={x + ((i * 0.37 + 0.08) % 1) * w}
            cy={y + h * (0.35 + ((i * 0.53) % 0.6))}
            r={6 + (i % 3) * 3}
            fill="#d6c3a1"
            className="animate-dust"
            style={{ ...still, ...delay(i * 0.35) }}
          />
        ))}
      </>
    );
  }

  if (kind === 'damage') {
    // A broken cable: flickering electric arc plus flying sparks.
    const cx = x + w / 2;
    const cy = y + h / 2;
    return (
      <>
        <polyline
          points={`${cx - 46},${cy} ${cx - 20},${cy - 22} ${cx - 4},${cy + 14} ${cx + 14},${cy - 18} ${cx + 46},${cy + 4}`}
          fill="none"
          stroke="#fde047"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-arc"
          style={{ filter: 'drop-shadow(0 0 8px #fde047)' }}
        />
        {pts(6).map((i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={4}
            fill="#fef08a"
            className="animate-spark"
            style={{ ...still, ...delay(i * 0.2), ['--dx' as string]: `${Math.cos(i * 1.05) * 60}px`, ['--dy' as string]: `${Math.sin(i * 1.05) * 50 - 14}px` }}
          />
        ))}
      </>
    );
  }

  if (kind === 'storm') {
    // Fast particles streaking down over the people outside.
    return (
      <>
        {pts(10).map((i) => (
          <line
            key={i}
            x1={x - 60 + i * ((w + 120) / 10)}
            y1={y - 90}
            x2={x - 60 + i * ((w + 120) / 10) + 18}
            y2={y - 62}
            stroke="#e879f9"
            strokeWidth={5}
            strokeLinecap="round"
            className="animate-streak"
            style={{ ...delay((i * 0.37) % 1.1), filter: 'drop-shadow(0 0 5px #e879f9)' }}
          />
        ))}
      </>
    );
  }

  // air: stale CO₂ puffs rising from the machine.
  return (
    <>
      {pts(5).map((i) => (
        <circle
          key={i}
          cx={x + w * (0.2 + i * 0.15)}
          cy={y + 6}
          r={11 + (i % 2) * 5}
          fill="#cbd5e1"
          className="animate-puff"
          style={{ ...still, ...delay(i * 0.6) }}
        />
      ))}
    </>
  );
}
