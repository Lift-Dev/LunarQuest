import { Calendar, FlaskConical, Home, Play, RotateCcw, Radiation } from 'lucide-react';
import type { ReactNode } from 'react';
import { Navigate, useLocation, useParams } from 'react-router';
import { routes } from '../app/routes';
import { Button, Mascot, Panel, ScreenBackground, StarRating } from '../design-system';
import { completePose } from '../features/mascot/moods';
import type { ResourceId } from '../game/types';

/**
 * Mission Complete / Mission Aborted — match image-assets/Lunar Mission Complete Victory Screen.png
 * and Mission Aborted_ Moonbase Outpost (1).png. Numbers come from the finished run (passed in
 * navigation state by the game screen in Phase 6); there are no mock values here.
 */
export interface CompleteResult {
  days: number;
  totalDays: number;
  sciencePoints: number;
  stars: number;
  radiationDose: number;
}

export interface AbortedResult {
  days: number;
  totalDays: number;
  cause: ResourceId;
}

export function MissionCompleteScreen() {
  const { missionId } = useParams();
  const result = useLocation().state as CompleteResult | null;
  if (!result) return <Navigate to={routes.levels} replace />;
  return <CompleteView missionId={missionId!} result={result} />;
}

export function MissionAbortedScreen() {
  const { missionId } = useParams();
  const result = useLocation().state as AbortedResult | null;
  if (!result) return <Navigate to={routes.levels} replace />;
  return <AbortedView missionId={missionId!} result={result} />;
}

export function CompleteView({ missionId, result }: { missionId: string; result: CompleteResult }) {
  return (
    <ResultFrame badge={<Mascot pose={completePose(result.stars)} height="10rem" />} title="Mission Complete!" subtitle="Great job, Commander!">
      <StarRating earned={result.stars} className="mt-6 justify-center [&_svg]:size-10" />
      <Panel variant="solid" className="mt-8 grid grid-cols-3 divide-x divide-blue-400/30 py-5">
        <Stat icon={<Calendar className="text-blue-300" />} value={`${result.days} / ${result.totalDays}`} label="Days Survived" />
        <Stat icon={<FlaskConical className="text-cyan-300" />} value={String(result.sciencePoints)} label="Science Points" />
        <Stat icon={<Radiation className="text-radiation" />} value={`${Math.round(result.radiationDose)}%`} label="Radiation Dose" />
      </Panel>
      <Button to={routes.levels} variant="primary" size="lg" icon={<Play aria-hidden className="size-[1em] fill-current" />} className="mt-8 w-full !rounded-full">
        Continue
      </Button>
      <span className="sr-only">{missionId}</span>
    </ResultFrame>
  );
}

const causeText: Record<ResourceId, string> = {
  lifeSupport: 'The air ran out.',
  power: 'The outpost ran out of power.',
  radiation: 'The crew got too much radiation.',
};

export function AbortedView({ missionId, result }: { missionId: string; result: AbortedResult }) {
  return (
    <ResultFrame
      badge={<Mascot pose="worried" height="10rem" />}
      title="Mission Aborted"
      subtitle="The outpost could not be saved. Try again next time!"
    >
      <p className="mt-4 text-lg font-bold tracking-wide text-red-300 uppercase">{causeText[result.cause]}</p>
      <Panel variant="solid" className="mt-6 flex items-center justify-center gap-6 py-5">
        <Calendar aria-hidden className="size-14 text-blue-300" strokeWidth={1.5} />
        <div className="text-left">
          <p className="text-lg text-blue-100/90">Days Survived</p>
          <p className="text-4xl leading-none font-bold text-white">
            {result.days} / {result.totalDays}
          </p>
        </div>
      </Panel>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Button to={routes.levels} variant="primary" size="lg" icon={<Home aria-hidden className="size-[1em]" />} className="!rounded-full !px-4 !text-xl">
          Return to Menu
        </Button>
        <Button to={routes.play(missionId)} variant="primary" size="lg" icon={<RotateCcw aria-hidden className="size-[1em]" />} className="!rounded-full !px-4 !text-xl">
          Try Again
        </Button>
      </div>
    </ResultFrame>
  );
}

function ResultFrame({ badge, title, subtitle, children }: { badge: ReactNode; title: string; subtitle: string; children: ReactNode }) {
  return (
    <ScreenBackground scene="outpost">
      <main className="grid min-h-dvh place-items-center px-4 pt-36 pb-16">
        <section className="relative w-full max-w-[560px] rounded-3xl border-2 border-blue-400/60 bg-slate-900/85 px-8 pt-16 pb-8 text-center shadow-glow-panel backdrop-blur-sm">
          <div className="absolute -top-28 left-1/2 -translate-x-1/2">{badge}</div>
          <h1 className="text-5xl leading-tight font-bold text-white">{title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-xl leading-7 text-blue-100">{subtitle}</p>
          {children}
        </section>
      </main>
    </ScreenBackground>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 [&_svg]:size-8">
      {icon}
      <p className="text-3xl leading-tight font-bold text-white">{value}</p>
      <p className="text-sm text-blue-100/80">{label}</p>
    </div>
  );
}
