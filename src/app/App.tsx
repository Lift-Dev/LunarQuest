import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { BriefingScreen } from '../screens/BriefingScreen';
import { LearnToSurviveScreen } from '../screens/LearnToSurviveScreen';
import { LevelsScreen } from '../screens/LevelsScreen';
import { HowToPlayScreen } from '../screens/HowToPlayScreen';
import { DevPreviewScreen } from '../screens/DevPreviewScreen';
import { MissionOverviewScreen } from '../screens/MissionOverviewScreen';
import { MissionAbortedScreen, MissionCompleteScreen } from '../screens/MissionResultScreens';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { routes } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.welcome} element={<WelcomeScreen />} />
        <Route path={routes.briefing} element={<BriefingScreen />} />
        <Route path={routes.learnToSurvive} element={<LearnToSurviveScreen />} />
        <Route path={routes.howToPlay} element={<HowToPlayScreen />} />
        <Route path={routes.levels} element={<LevelsScreen />} />
        <Route path="/mission/:missionId" element={<MissionOverviewScreen />} />
        <Route path="/mission/:missionId/play" element={<PlaceholderScreen title="Gameplay" />} />
        <Route path="/mission/:missionId/aborted" element={<MissionAbortedScreen />} />
        <Route path="/mission/:missionId/complete" element={<MissionCompleteScreen />} />
        {import.meta.env.DEV && <Route path="/dev/:name" element={<DevPreviewScreen />} />}
        <Route path={routes.sources} element={<PlaceholderScreen title="Science Sources" />} />
        <Route path="*" element={<Navigate to={routes.welcome} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
