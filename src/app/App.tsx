import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { routes } from './routes';

const M1 = 'mission-01';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.welcome} element={<PlaceholderScreen title="Welcome" next={{ label: 'Start', to: routes.briefing }} />} />
        <Route path={routes.briefing} element={<PlaceholderScreen title="Your Mission" next={{ label: 'Continue', to: routes.learnToSurvive }} />} />
        <Route path={routes.learnToSurvive} element={<PlaceholderScreen title="Learn to Survive" next={{ label: 'Next', to: routes.howToPlay }} />} />
        <Route path={routes.howToPlay} element={<PlaceholderScreen title="How to Play" next={{ label: 'Next', to: routes.levels }} />} />
        <Route path={routes.levels} element={<PlaceholderScreen title="Your Journey" next={{ label: 'Start', to: routes.missionOverview(M1) }} />} />
        <Route path="/mission/:missionId" element={<PlaceholderScreen title="Mission Overview" next={{ label: 'Begin Mission', to: routes.play(M1) }} />} />
        <Route path="/mission/:missionId/play" element={<PlaceholderScreen title="Gameplay" />} />
        <Route path="/mission/:missionId/aborted" element={<PlaceholderScreen title="Mission Aborted" />} />
        <Route path="/mission/:missionId/complete" element={<PlaceholderScreen title="Mission Complete" />} />
        <Route path={routes.sources} element={<PlaceholderScreen title="Science Sources" />} />
        <Route path="*" element={<Navigate to={routes.welcome} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
