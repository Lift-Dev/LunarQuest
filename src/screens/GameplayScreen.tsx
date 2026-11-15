import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { routes } from '../app/routes';
import { getMission } from '../data/missions';
import { solarFlares } from '../data/solar-flares';
import { ScreenBackground } from '../design-system';
import { currentScenario, daysSurvived, lowResources, phaseOf, radiationPercent } from '../game/engine';
import { starsFromScience } from '../game/scoring';
import type { Mission, MissionRun, Scenario } from '../game/types';
import { DayTrack } from '../features/hud/DayTrack';
import { NoticeStack } from '../features/notices/NoticeStack';
import { ResourceHud } from '../features/hud/ResourceHud';
import { PauseMenu } from '../features/pause/PauseMenu';
import { FeedbackCard } from '../features/scenario/FeedbackCard';
import { DecisionSidebar } from '../features/scenario/DecisionSidebar';
import { InspectionPanel } from '../features/map/InspectionPanel';
import { OutpostMap } from '../features/map/OutpostMap';
import { inspect } from '../features/map/inspect';
import type { EquipmentId } from '../data/maps/outpost-01';
import { useGameStore } from '../store/gameStore';
import type { AbortedResult, CompleteResult } from './MissionResultScreens';

/**
 * Gameplay — follows image-assets/Lunar Base Solar Crisis-3.png (HUD, day card, two decision cards).
 * The outpost map in the middle arrives in Phase 5; the feedback card is a new design, pending approval.
 */
export function GameplayScreen() {
  const { missionId = '' } = useParams();
  const navigate = useNavigate();
  const { run, outcome, notices, start, choose, next, clear, dismissNotice } = useGameStore();
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<EquipmentId | null>(null);

  const known = missionId === 'mission-01';
  // Phase 7 will resume a saved run; until then, opening the screen without a run starts a fresh one.
  useEffect(() => {
    if (known && (!run || run.missionId !== missionId)) start(missionId);
  }, [known, run, missionId, start]);

  // Esc closes the inspection panel.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  if (!known) return <Navigate to={routes.levels} replace />;
  if (!run || run.missionId !== missionId) return null;

  const mission = getMission(missionId);
  const stars = starsFromScience(run.science, mission.balance.starThresholds);

  const onContinue = () => {
    if (run.status === 'aborted') {
      const state: AbortedResult = { days: daysSurvived(mission, run), totalDays: mission.balance.durationDays, cause: run.abortedBy! };
      clear();
      navigate(routes.aborted(missionId), { state, replace: true });
    } else if (run.status === 'complete') {
      const state: CompleteResult = {
        days: daysSurvived(mission, run),
        totalDays: mission.balance.durationDays,
        sciencePoints: run.science,
        stars,
        radiationDose: radiationPercent(mission, run),
      };
      clear();
      navigate(routes.complete(missionId), { state, replace: true });
    } else {
      next();
    }
  };

  // While feedback is showing the engine has already moved on, so the HUD shows the new values.
  const shownDay = outcome ? outcome.run.day - (outcome.run.status === 'playing' ? 1 : 0) : run.day;
  const scenario: Scenario = outcome ? outcome.scenario : currentScenario(mission, run);

  const highlights = outcome ? [] : scenario.mapHighlights;
  const panel = selected && !outcome && (
    <div>
      <InspectionPanel id={selected} info={inspect(mission, run, selected)} onSelect={setSelected} onClose={() => setSelected(null)} />
    </div>
  );

  return (
    <ScreenBackground glow="none" stars={false}>
      <div className="relative min-h-dvh">
        {/* Wide screens: a soft, darkened copy of the scene fills the screen, with the sharp outpost on top. */}
        <img
          src="/assets/backdrop/outpost.jpg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden size-full scale-110 object-cover blur-2xl brightness-50 landscape:block"
        />
        <OutpostMap
          selected={outcome ? null : selected}
          highlights={highlights}
          onSelect={setSelected}
          className="absolute inset-y-0 left-0 right-[24rem] hidden landscape:block"
        />
        <main className="pointer-events-none relative mx-auto flex min-h-dvh max-w-[1440px] flex-col gap-4 p-4 md:p-6 [&>*]:pointer-events-auto">
          <ResourceHud
            lifeSupport={run.resources.lifeSupport}
            power={run.resources.power}
            radiation={radiationPercent(mission, run)}
            stars={stars}
            low={lowResources(mission, run)}
            onPause={() => setPaused(true)}
          />

          {!outcome && <NoticeStack notices={notices} onDismiss={dismissNotice} />}

          {outcome ? (
            <>
              {/* Dims the scene so the fact is the only thing to read. */}
              <div aria-hidden className="pointer-events-none fixed inset-0 bg-space/55" />
              <div className="relative flex flex-1 items-center py-10">
                <FeedbackCard outcome={outcome} bigAt={mission.balance.bigEffectThreshold} onContinue={onContinue} />
              </div>
            </>
          ) : (
            <div className="pointer-events-none! flex flex-1 flex-col gap-4 landscape:flex-row landscape:justify-between">
              <div className="pointer-events-none! flex flex-col gap-4 landscape:w-[22rem] [&>*]:pointer-events-auto">
                <DayChip mission={mission} day={shownDay} />
                {panel}
              </div>
              {/* Portrait tablets: the whole outpost between the day bar and the story. */}
              <OutpostMap
                selected={selected}
                highlights={highlights}
                onSelect={setSelected}
                className="pointer-events-auto relative aspect-video w-full rounded-2xl border border-blue-500/30 landscape:hidden"
              />
              <DecisionSidebar
                day={shownDay}
                scenario={scenario}
                note={<FlareNote run={run} scenario={scenario} />}
                onChoose={choose}
                className="pointer-events-auto landscape:w-[22rem] landscape:self-start"
              />
            </div>
          )}
        </main>
      </div>

      {paused && (
        <PauseMenu
          onResume={() => setPaused(false)}
          onExit={() => {
            clear();
            navigate(routes.levels);
          }}
          onRestart={() => {
            start(missionId);
            setPaused(false);
          }}
          onResetProgress={() => {
            clear();
            navigate(routes.welcome);
          }}
        />
      )}
    </ScreenBackground>
  );
}

function DayChip({ mission, day }: { mission: Mission; day: number }) {
  const phase = phaseOf(mission, day);
  return (
    <div className="flex w-fit flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border-2 border-blue-400/40 bg-slate-950/75 px-4 py-2.5 backdrop-blur-sm">
      <p className="flex items-center gap-2.5 text-lg font-bold text-white">
        {phase === 'day' ? <Sun aria-hidden className="size-6 text-yellow-300" /> : <Moon aria-hidden className="size-6 text-blue-200" />}
        Day {day} / {mission.balance.durationDays} · {phase === 'day' ? 'Lunar Daylight' : 'Lunar Night'}
      </p>
      <DayTrack day={day} total={mission.balance.durationDays} daylightDays={mission.balance.daylightDays} />
    </div>
  );
}

function FlareNote({ run, scenario }: { run: MissionRun; scenario: Scenario }) {
  const flare = scenario.showsFlare ? solarFlares.find((f) => f.id === run.flareId) : undefined;
  if (!flare) return null;
  return (
    <p className="rounded-xl border border-amber-500/50 bg-amber-100 px-3 py-2 text-base leading-5 text-amber-950">
      This storm is based on a real solar flare: <strong>{formatDate(flare.date)}</strong>, strength <strong>{flare.classType}</strong>. Archived NASA data.
    </p>
  );
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
