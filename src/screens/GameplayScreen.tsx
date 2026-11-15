import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { routes } from '../app/routes';
import { getMission } from '../data/missions';
import { solarFlares } from '../data/solar-flares';
import { Button, Panel, ScreenBackground } from '../design-system';
import { currentScenario, daysSurvived, phaseOf, radiationPercent } from '../game/engine';
import { starsFromScience } from '../game/scoring';
import type { Decision, Mission, MissionRun, Scenario } from '../game/types';
import { ResourceHud } from '../features/hud/ResourceHud';
import { PauseMenu } from '../features/pause/PauseMenu';
import { FeedbackCard } from '../features/scenario/FeedbackCard';
import { EffectChips } from '../features/scenario/EffectChips';
import { RichText } from '../features/scenario/RichText';
import { useGameStore } from '../store/gameStore';
import type { AbortedResult, CompleteResult } from './MissionResultScreens';

/**
 * Gameplay — follows image-assets/Lunar Base Solar Crisis-3.png (HUD, day card, two decision cards).
 * The outpost map in the middle arrives in Phase 5; the feedback card is a new design, pending approval.
 */
export function GameplayScreen() {
  const { missionId = '' } = useParams();
  const navigate = useNavigate();
  const { run, outcome, start, choose, next, clear } = useGameStore();
  const [paused, setPaused] = useState(false);

  const known = missionId === 'mission-01';
  // Phase 7 will resume a saved run; until then, opening the screen without a run starts a fresh one.
  useEffect(() => {
    if (known && (!run || run.missionId !== missionId)) start(missionId);
  }, [known, run, missionId, start]);

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

  return (
    <ScreenBackground scene="outpost">
      <main className="mx-auto flex min-h-dvh max-w-[1440px] flex-col gap-4 p-4 md:p-6">
        <ResourceHud
          lifeSupport={run.resources.lifeSupport}
          power={run.resources.power}
          radiation={radiationPercent(mission, run)}
          stars={stars}
          onPause={() => setPaused(true)}
        />

        {outcome ? (
          <>
            {/* Dims the scene so the fact is the only thing to read. */}
            <div aria-hidden className="pointer-events-none fixed inset-0 bg-space/55" />
            <div className="relative flex flex-1 items-center py-10">
              <FeedbackCard outcome={outcome} bigAt={mission.balance.bigEffectThreshold} onContinue={onContinue} />
            </div>
          </>
        ) : (
          <>
            <ScenarioCard mission={mission} run={run} day={shownDay} scenario={scenario} />
            <div className="flex-1" />
            <section aria-label="Choose what to do" className="grid gap-4 md:grid-cols-2">
            {scenario.decisions.map((d) => (
              <DecisionCard key={d.id} decision={d} bigAt={mission.balance.bigEffectThreshold} onChoose={() => choose(d.id)} />
            ))}
            </section>
          </>
        )}
      </main>

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

function ScenarioCard({ mission, run, day, scenario }: { mission: Mission; run: MissionRun; day: number; scenario: Scenario }) {
  const phase = phaseOf(mission, day);
  const flare = scenario.showsFlare ? solarFlares.find((f) => f.id === run.flareId) : undefined;
  return (
    <Panel variant="solid" className="max-w-xl p-5 md:p-6">
      <p className="flex items-center gap-3 border-b border-blue-400/30 pb-3 text-lg font-bold text-white">
        {phase === 'day' ? <Sun aria-hidden className="size-7 text-yellow-300" /> : <Moon aria-hidden className="size-7 text-blue-200" />}
        Day {day} · {phase === 'day' ? 'Lunar Daylight' : 'Lunar Night'}
      </p>
      <h1 className="mt-3 text-3xl leading-tight font-bold text-white">{scenario.title}</h1>
      <p className="mt-2 text-xl leading-7 text-blue-100">
        <RichText text={scenario.description} />
      </p>
      {flare && (
        <p className="mt-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-base leading-6 text-yellow-100">
          This storm is based on a real solar flare: <strong>{formatDate(flare.date)}</strong>, strength{' '}
          <strong>{flare.classType}</strong>. Archived NASA data.
        </p>
      )}
    </Panel>
  );
}

function DecisionCard({ decision, bigAt, onChoose }: { decision: Decision; bigAt: number; onChoose: () => void }) {
  return (
    <Panel variant="solid" className="flex flex-col gap-3 p-5">
      <h2 className="text-2xl font-bold text-white">{decision.title}</h2>
      <p className="text-lg leading-6 text-blue-100/90">{decision.explanation}</p>
      <EffectChips effects={decision.effects} bigAt={bigAt} laterHint={decision.laterHint} />
      <Button variant="pill" size="md" onClick={onChoose} className="mt-auto self-end !rounded-full !px-10 !py-2 !text-xl">
        Choose
      </Button>
    </Panel>
  );
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
