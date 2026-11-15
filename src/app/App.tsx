import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { BriefingScreen } from '../screens/BriefingScreen';
import { LearnToSurviveScreen } from '../screens/LearnToSurviveScreen';
import { LevelsScreen } from '../screens/LevelsScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { routes } from './routes';

const M1 = 'mission-01';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.welcome} element={<WelcomeScreen />} />
        <Route path={routes.briefing} element={<BriefingScreen />} />
        <Route path={routes.learnToSurvive} element={<LearnToSurviveScreen />} />
        <Route path={routes.howToPlay} element={<PlaceholderScreen title="How to Play" next={{ label: 'Next', to: routes.levels }} />} />
        <Route path={routes.levels} element={<LevelsScreen />} />
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
