import { Moon, RotateCw, Sun, X } from 'lucide-react';
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
import { scenarioPose } from '../features/mascot/moods';
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
  // A decision can cover several days, so show the day it was made on.
  const shownDay = outcome ? outcome.run.history.at(-1)!.day : run.day;
  const scenario: Scenario = outcome ? outcome.scenario : currentScenario(mission, run);

  const highlights = outcome ? [] : scenario.mapHighlights;
  const problem = outcome ? undefined : scenario.problem;
  const fixDecision = problem && scenario.decisions.find((d) => d.id === problem.fixDecisionId);
  const fix = fixDecision ? { decision: fixDecision, onChoose: () => choose(fixDecision.id) } : undefined;
  const panel = selected && !outcome && (
    <InspectionPanel id={selected} info={inspect(mission, run, selected)} onSelect={setSelected} onClose={() => setSelected(null)} />
  );

  return (
    <ScreenBackground glow="none" stars={false}>
      <div className="relative min-h-dvh">
        {/* Wide screens: the outpost fills the whole screen behind everything (as in the design). */}
        <OutpostMap
          fit="cover"
          focusX={0.7}
          selected={outcome ? null : selected}
          highlights={highlights}
          problem={problem}
          fix={fix}
          onSelect={setSelected}
          className="absolute inset-0 hidden landscape:block"
        />
        <main className="pointer-events-none relative flex min-h-dvh flex-col gap-4 p-4 max-sm:gap-2 max-sm:p-3 md:p-6 short:gap-1.5 short:safe-x short:py-2 [&>*]:pointer-events-auto">
          <ResourceHud
            lifeSupport={run.resources.lifeSupport}
            power={run.resources.power}
            radiation={radiationPercent(mission, run)}
            stars={stars}
            low={lowResources(mission, run)}
            onPause={() => setPaused(true)}
          />

          <RotateHint />

          {!outcome && <NoticeStack notices={notices} onDismiss={dismissNotice} />}

          {outcome ? (
            <>
              {/* Dims the scene so the fact is the only thing to read. */}
              <div aria-hidden className="pointer-events-none fixed inset-0 bg-space/55" />
              <div className="relative flex flex-1 items-center pt-32 pb-8 max-sm:pt-28 max-sm:pb-4 short:py-1">
                <FeedbackCard outcome={outcome} bigAt={mission.balance.bigEffectThreshold} onContinue={onContinue} />
              </div>
            </>
          ) : (
            // Wide screens: day bar top-left, inspection panel top-right, story card along the bottom foreground.
            // Portrait: day bar, map, panel, then the story card, stacked.
            <div className="pointer-events-none! flex flex-1 flex-col gap-4 max-sm:gap-2 short:gap-1.5">
              <div className="pointer-events-none! flex items-start justify-between gap-4 portrait:contents">
                <div className="pointer-events-auto">
                  <DayChip mission={mission} day={shownDay} />
                </div>
                {panel && <div className="pointer-events-auto portrait:order-3 landscape:w-[22rem] short:w-64">{panel}</div>}
              </div>
              <OutpostMap
                fit="contain"
                selected={selected}
                highlights={highlights}
                problem={problem}
                fix={fix}
                onSelect={setSelected}
                className="pointer-events-auto relative aspect-video w-full rounded-2xl border border-blue-500/30 portrait:order-2 landscape:hidden"
              />
              <DecisionSidebar
                day={shownDay}
                scenario={scenario}
                note={<FlareNote run={run} scenario={scenario} />}
                onChoose={choose}
                mascot={scenarioPose(shownDay, phaseOf(mission, shownDay), scenario, lowResources(mission, run))}
                className="portrait:order-4 landscape:mt-auto"
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
    <div className="flex w-fit flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border-2 border-blue-400/40 bg-slate-950/75 px-4 py-2.5 backdrop-blur-sm max-sm:w-full max-sm:flex-nowrap max-sm:gap-x-3 max-sm:rounded-xl max-sm:border max-sm:px-3 max-sm:py-1.5 short:rounded-xl short:px-3 short:py-1">
      <p className="flex items-center gap-2.5 text-lg font-bold text-white max-sm:shrink-0 max-sm:text-sm short:gap-2 short:text-sm">
        {phase === 'day' ? <Sun aria-hidden className="size-6 text-yellow-300 max-sm:size-5 short:size-4" /> : <Moon aria-hidden className="size-6 text-blue-200 max-sm:size-5 short:size-4" />}
        Day {day} / {mission.balance.durationDays}<span className="max-sm:hidden"> · {phase === 'day' ? 'Lunar Daylight' : 'Lunar Night'}</span>
      </p>
      <DayTrack day={day} total={mission.balance.durationDays} daylightDays={mission.balance.daylightDays} />
    </div>
  );
}

/** Portrait phones: the game is a widescreen picture, so invite the player to turn the phone. */
function RotateHint() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <p className="hidden items-center gap-2 rounded-full border border-blue-400/30 bg-slate-950/70 py-0.5 pr-1 pl-3 text-xs text-blue-100/90 portrait:max-sm:flex">
      <RotateCw aria-hidden className="size-3.5 shrink-0 text-blue-300" />
      <span className="flex-1">Turn sideways for the full view</span>
      <button type="button" onClick={() => setOpen(false)} aria-label="Dismiss" className="grid size-7 place-items-center rounded-full hover:bg-white/10">
        <X aria-hidden className="size-3.5" />
      </button>
    </p>
  );
}

function FlareNote({ run, scenario }: { run: MissionRun; scenario: Scenario }) {
  const flare = scenario.showsFlare ? solarFlares.find((f) => f.id === run.flareId) : undefined;
  if (!flare) return null;
  return (
    <p className="rounded-xl border border-amber-500/50 bg-amber-100 px-3 py-2 text-base leading-5 text-amber-950 landscape:py-1.5 landscape:text-sm short:py-1 short:text-xs short:leading-4">
      This storm is based on a real solar flare: <strong>{formatDate(flare.date)}</strong>, strength <strong>{flare.classType}</strong>. Archived NASA data.
    </p>
  );
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
