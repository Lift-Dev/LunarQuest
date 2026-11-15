import { Lock, Trophy } from 'lucide-react';
import { routes } from '../app/routes';
import { levels } from '../data/levels';
import { Button, NavPill, Panel, ScreenBackground, StarRating, cn, Mascot } from '../design-system';
import type { Level } from '../game/types';

/**
 * "Your Journey" — matches image-assets/Your Journey_ Lunar Mission Map.png.
 * The row scrolls sideways (all 15 levels) and snaps card by card.
 * Progress (unlocks, stars) comes from the save system in Phase 7; until then only Level 01 is unlocked.
 */
const unlockedThrough = 1;
const starsByLevel: Record<string, number> = {};

const pad = (n: number) => String(n).padStart(2, '0');

export function LevelsScreen() {
  return (
    <ScreenBackground scene>
      <NavPill to={routes.welcome} icon="home">
        Home
      </NavPill>
      <main className="flex min-h-dvh flex-col items-center justify-center py-20 short:py-2">
        <h1 className="text-center text-[clamp(2.25rem,4vw,3.5rem)] leading-none font-bold text-white uppercase text-glow max-sm:text-3xl short:text-4xl">
          Your <span className="text-blue-400">Journey</span>
        </h1>
        <p className="mt-3 px-4 text-center text-xl text-blue-100/90 max-sm:text-base short:hidden">Complete missions to explore, survive and discover!</p>

        <ol
          className="mt-14 max-sm:mt-8 short:mt-3 flex w-full snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-1240px)/2))] py-10 max-sm:px-6 max-sm:py-8 short:py-6"
          aria-label="Missions"
        >
          {levels.map((level) => (
            <li key={level.id} className="shrink-0 snap-center first:snap-start">
              <LevelCard level={level} unlocked={level.number <= unlockedThrough} stars={starsByLevel[level.id] ?? 0} />
            </li>
          ))}
        </ol>

        <div className="mt-4 flex items-center gap-4 max-sm:px-4 short:hidden">
          <Mascot pose="thumbs-up" height="6rem" />
          <Panel variant="row" className="flex items-center gap-3 px-5 py-3 backdrop-blur-sm">
            <Trophy aria-hidden className="size-6 text-star" />
            <p className="text-lg text-blue-100 max-sm:text-base">Complete missions to earn science stars!</p>
          </Panel>
        </div>
      </main>
    </ScreenBackground>
  );
}

function LevelCard({ level, unlocked, stars }: { level: Level; unlocked: boolean; stars: number }) {
  const playable = unlocked && level.contentId !== null;
  return (
    <Panel
      variant={unlocked ? 'active' : 'row'}
      aria-label={`Mission ${level.number}, ${level.title}${unlocked ? '' : ', locked'}`}
      className={cn(
        'relative flex w-[200px] flex-col items-center px-3 pt-8 pb-4 text-center',
        unlocked ? 'w-[240px]' : 'bg-slate-900/60 opacity-90',
        'short:w-[170px]',
      )}
    >
      <span
        className={cn(
          'absolute -top-4 rounded-full border-2 px-4 py-0.5 text-sm font-bold tracking-wider whitespace-nowrap text-white uppercase',
          unlocked ? 'border-blue-300 bg-blue-600 shadow-glow-blue' : 'border-blue-400/40 bg-slate-900',
        )}
      >
        Mission {pad(level.number)}
      </span>
      <div className="relative w-full overflow-hidden rounded-lg">
        <img
          src={level.thumbnail}
          alt=""
          aria-hidden
          className={cn('aspect-[4/3] w-full object-cover', !unlocked && 'brightness-75')}
        />
        {!unlocked && (
          <div className="absolute inset-0 grid place-items-center">
            <Lock aria-hidden className="size-9 text-slate-100 drop-shadow-lg" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <h2 className={cn('mt-3 flex min-h-12 items-center text-lg leading-5 font-bold uppercase short:mt-2 short:min-h-9 short:text-base short:leading-snug', unlocked ? 'text-white' : 'text-slate-300')}>
        {level.title}
      </h2>
      <StarRating earned={stars} size="sm" dim={!unlocked} className="mt-2" />
      {unlocked && (
        <Button
          to={playable ? routes.missionOverview(level.contentId!) : routes.levels}
          variant="pill"
          size="md"
          chevron
          className="mt-4 w-full !px-4 !py-2 !text-xl short:mt-2 short:!py-1.5 short:!text-lg"
        >
          Start
        </Button>
      )}
    </Panel>
  );
}
