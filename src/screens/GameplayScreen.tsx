import { Moon, RotateCw, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { routes } from '../app/routes';
import { getMission } from '../data/missions';
import { solarFlares } from '../data/solar-flares';
import { Button, Mascot, ScreenBackground } from '../design-system';
import { enterImmersive, exitImmersive } from '../lib/immersive';
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

  // Each new day eases in: first the scene, then the story card, then the options and the problem
  // (red glow + fix button). Day 1 is slower, as it is the player's first look at the outpost.
  const firstDay = run?.history.length === 0;
  const stage = useRevealStage(`${run?.missionId}:${run?.day}:${outcome ? 'feedback' : 'play'}`, firstDay ? [2200, 4200] : [350, 1100]);

  // Phones: full screen and sideways while playing (the tap on "Begin Mission" already asked for it;
  // this covers a reload or a direct link), and back to normal when leaving the game.
  useEffect(() => {
    void enterImmersive();
    return exitImmersive;
  }, []);

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

  const highlights = outcome || stage < 2 ? [] : scenario.mapHighlights;
  const problem = outcome || stage < 2 ? undefined : scenario.problem;
  const fixDecision = problem && scenario.decisions.find((d) => d.id === problem.fixDecisionId);
  const fix = fixDecision ? { decision: fixDecision, onChoose: () => choose(fixDecision.id) } : undefined;
  const panel = selected && !outcome && (
    <InspectionPanel id={selected} info={inspect(mission, run, selected)} onSelect={setSelected} onClose={() => setSelected(null)} />
  );

  return (
    <ScreenBackground glow="none" stars={false}>
      <RotatePrompt />
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
                stage={stage}
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

/**
 * 0 = just the scene, 1 = the story card, 2 = the options and the problem on the map.
 * Restarts whenever `key` changes (a new day, or coming back from the feedback card).
 */
function useRevealStage(key: string, [storyAt, optionsAt]: [number, number]): number {
  // The stage is stored with the key it belongs to, so a new day reads as 0 on its very first render.
  const [state, setState] = useState({ key, stage: 0 });
  useEffect(() => {
    const a = setTimeout(() => setState({ key, stage: 1 }), storyAt);
    const b = setTimeout(() => setState({ key, stage: 2 }), optionsAt);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
    // The delays only change together with the key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state.key === key ? state.stage : 0;
}

function DayChip({ mission, day }: { mission: Mission; day: number }) {
  const phase = phaseOf(mission, day);
  return (
    <div className="flex w-fit flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border-2 border-blue-400/40 bg-slate-950/75 px-4 py-2.5 backdrop-blur-sm max-sm:w-full max-sm:flex-nowrap max-sm:gap-x-3 max-sm:rounded-xl max-sm:border max-sm:px-3 max-sm:py-1.5 short:rounded-xl short:px-3 short:py-1">
      <p className="flex items-center gap-2.5 text-lg font-bold text-white max-sm:shrink-0 max-sm:text-sm short:gap-2 short:text-base">
        {phase === 'day' ? <Sun aria-hidden className="size-6 text-yellow-300 max-sm:size-5 short:size-4" /> : <Moon aria-hidden className="size-6 text-blue-200 max-sm:size-5 short:size-4" />}
        Day {day} / {mission.balance.durationDays}<span className="max-sm:hidden"> · {phase === 'day' ? 'Lunar Daylight' : 'Lunar Night'}</span>
      </p>
      <DayTrack day={day} total={mission.balance.durationDays} daylightDays={mission.balance.daylightDays} />
    </div>
  );
}

/**
 * Portrait phones: the game is a widescreen picture, so it asks the player to turn the phone.
 * It disappears by itself once the phone is sideways (or the orientation lock did it already).
 * "Play anyway" keeps the stacked portrait layout for anyone whose phone is locked upright.
 */
function RotatePrompt() {
  const [skipped, setSkipped] = useState(false);
  if (skipped) return null;
  return (
    <div
      role="dialog"
      aria-label="Turn your phone sideways"
      className="fixed inset-0 z-50 hidden flex-col items-center justify-center gap-4 bg-space px-8 text-center portrait:max-sm:flex"
    >
      <Mascot pose="curious" height="8rem" />
      <RotateCw aria-hidden className="size-10 animate-spin text-blue-300 [animation-duration:3s]" />
      <h2 className="text-3xl font-bold text-white">Turn your phone sideways</h2>
      <p className="text-lg text-blue-100/80">LunarQuest plays like a movie, in landscape.</p>
      <Button variant="ghost" size="md" onClick={() => setSkipped(true)} className="mt-2">
        Play anyway
      </Button>
    </div>
  );
}

function FlareNote({ run, scenario }: { run: MissionRun; scenario: Scenario }) {
  const flare = scenario.showsFlare ? solarFlares.find((f) => f.id === run.flareId) : undefined;
  if (!flare) return null;
  return (
    <p className="rounded-xl border border-amber-500/50 bg-amber-100 px-3 py-2 text-base leading-5 text-amber-950 landscape:py-1.5 landscape:text-sm short:py-1 short:text-sm short:leading-snug">
      This storm is based on a real solar flare: <strong>{formatDate(flare.date)}</strong>, strength <strong>{flare.classType}</strong>. Archived NASA data.
    </p>
  );
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
