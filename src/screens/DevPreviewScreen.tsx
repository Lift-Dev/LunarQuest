import { useParams } from 'react-router';
import { PauseMenu } from '../features/pause/PauseMenu';
import { ScreenBackground } from '../design-system';
import { AbortedView, CompleteView } from './MissionResultScreens';

/** Dev-only: renders overlays and result screens with sample numbers so they can be checked visually. */
export function DevPreviewScreen() {
  const { name } = useParams();
  if (name === 'complete')
    return <CompleteView missionId="mission-01" result={{ days: 14, totalDays: 14, sciencePoints: 72, stars: 3, radiationDose: 28 }} />;
  if (name === 'aborted') return <AbortedView missionId="mission-01" result={{ days: 8, totalDays: 14, cause: 'power' }} />;
  if (name === 'pause')
    return (
      <ScreenBackground scene>
        <PauseMenu onResume={noop} onExit={noop} onRestart={noop} onResetProgress={noop} />
      </ScreenBackground>
    );
  return null;
}
const noop = () => {};
