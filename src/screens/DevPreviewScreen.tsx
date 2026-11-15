import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { getMission } from '../data/missions';
import { solarFlares } from '../data/solar-flares';
import { applyDecision, currentScenario, startMission } from '../game/engine';
import { routes } from '../app/routes';
import { useGameStore } from '../store/gameStore';
import { PauseMenu } from '../features/pause/PauseMenu';
import { ScreenBackground } from '../design-system';
import { AbortedView, CompleteView } from './MissionResultScreens';

/** Dev-only: renders overlays and result screens with sample numbers so they can be checked visually. */
export function DevPreviewScreen() {
  const { name, day } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (name !== 'play') return;
    // Jump to day N by always taking option A (or B with ?pick=b); ?feedback shows the card after day N's choice.
    const mission = getMission('mission-01');
    const pick = search.get('pick') === 'b' ? 1 : 0;
    let run = startMission(mission, solarFlares.map((f) => f.id), () => 0);
    while (run.day < Number(day)) run = applyDecision(mission, run, currentScenario(mission, run).decisions[pick].id).run;
    const outcome = search.has('feedback') ? applyDecision(mission, run, currentScenario(mission, run).decisions[pick].id) : null;
    useGameStore.setState({ run: outcome ? outcome.run : run, outcome });
    navigate(routes.play('mission-01'), { replace: true });
  }, [name, day, search, navigate]);
  if (name === 'complete')
    return <CompleteView missionId="mission-01" result={{ days: 14, totalDays: 14, sciencePoints: 72, stars: 3, radiationDose: 28 }} />;
  if (name === 'aborted') return <AbortedView missionId="mission-01" result={{ days: 8, totalDays: 14, cause: 'power' }} />;
  if (name === 'pause')
    return (
      <ScreenBackground scene="outpost">
        <PauseMenu onResume={noop} onExit={noop} onRestart={noop} onResetProgress={noop} />
      </ScreenBackground>
    );
  return null;
}
const noop = () => {};
