import { Fragment } from 'react';
import { Lock } from 'lucide-react';
import { routes } from '../app/routes';
import { levels } from '../data/levels';
import { Button, Chip, Panel, ScreenBackground, StarRating, cn } from '../design-system';
import type { Level } from '../game/types';

/**
 * Screen 5 "Your Journey" — matches image-assets/uxpilot-export-11-14-26 (5).pdf.
 * Progress (unlocks, stars) comes from the save system in Phase 7; until then
 * only Level 01 is unlocked.
 */
const unlockedThrough = 1;
const starsByLevel: Record<string, number> = {};

export function LevelsScreen() {
  return (
    <ScreenBackground glow="top" stars={false}>
      <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-stretch px-4 pt-11 pb-16">
        <h1 className="text-center text-[clamp(2.25rem,4vw,3rem)] leading-none font-bold text-white uppercase">
          Your journey
        </h1>
        <ol className="mt-12">
          {levels.map((level, i) => (
            <Fragment key={level.id}>
              {i > 0 && <Connector />}
              <li>
                {level.number <= unlockedThrough ? (
                  <NextLevelCard level={level} stars={starsByLevel[level.id] ?? 0} />
                ) : (
                  <LockedLevelRow level={level} />
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </main>
    </ScreenBackground>
  );
}

const pad = (n: number) => String(n).padStart(2, '0');

function NextLevelCard({ level, stars }: { level: Level; stars: number }) {
  return (
    <Panel variant="active" className="flex items-center gap-6 p-6">
      <img src={level.thumbnail} alt="" aria-hidden className="h-36 w-48 shrink-0 rounded-lg object-cover" />
      <div className="flex min-w-0 flex-col items-start">
        <Chip tone="yellow">Level {pad(level.number)} · Next mission</Chip>
        <h2 className="mt-2 text-3xl leading-9 font-bold text-white uppercase">{level.title}</h2>
        <StarRating earned={stars} className="mt-4" />
        <Button to={routes.missionOverview(level.contentId ?? level.id)} variant="pill" size="md" className="mt-6">
          Start
        </Button>
      </div>
    </Panel>
  );
}

function LockedLevelRow({ level }: { level: Level }) {
  return (
    <Panel variant="row" className="flex items-center gap-4 p-4 opacity-80" aria-label={`Level ${level.number}, ${level.title}, locked`}>
      <div className="relative h-27 w-36 shrink-0 overflow-hidden rounded-lg">
        <img src={level.thumbnail} alt="" aria-hidden className="size-full object-cover" />
        <div className="absolute inset-0 grid place-items-center bg-slate-950/50">
          <Lock aria-hidden className="size-5 text-slate-200" strokeWidth={2.5} />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Level {pad(level.number)} · Locked</p>
        <h2 className={cn('mt-0.5 text-2xl font-bold text-slate-300 uppercase')}>{level.title}</h2>
        <StarRating earned={0} size="sm" dim className="mt-2" />
      </div>
    </Panel>
  );
}

function Connector() {
  return (
    <li aria-hidden className="flex h-14 justify-center py-2">
      <span className="border-l-2 border-dashed border-slate-600" />
    </li>
  );
}
