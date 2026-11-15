import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { routes } from './routes';

/*
 * The Welcome screen ships in the main bundle so the first paint is instant. Every other screen
 * is split into its own file and loaded when first visited (the game screen, with the map and
 * animations, is the heaviest).
 */
const BriefingScreen = lazy(() => import('../screens/BriefingScreen').then((m) => ({ default: m.BriefingScreen })));
const LearnToSurviveScreen = lazy(() => import('../screens/LearnToSurviveScreen').then((m) => ({ default: m.LearnToSurviveScreen })));
const HowToPlayScreen = lazy(() => import('../screens/HowToPlayScreen').then((m) => ({ default: m.HowToPlayScreen })));
const LevelsScreen = lazy(() => import('../screens/LevelsScreen').then((m) => ({ default: m.LevelsScreen })));
const MissionOverviewScreen = lazy(() => import('../screens/MissionOverviewScreen').then((m) => ({ default: m.MissionOverviewScreen })));
const GameplayScreen = lazy(() => import('../screens/GameplayScreen').then((m) => ({ default: m.GameplayScreen })));
const MissionAbortedScreen = lazy(() => import('../screens/MissionResultScreens').then((m) => ({ default: m.MissionAbortedScreen })));
const MissionCompleteScreen = lazy(() => import('../screens/MissionResultScreens').then((m) => ({ default: m.MissionCompleteScreen })));
// Development only: removed from the production build.
const DevPreviewScreen = import.meta.env.DEV
  ? lazy(() => import('../screens/DevPreviewScreen').then((m) => ({ default: m.DevPreviewScreen })))
  : null;

export function App() {
  return (
    <BrowserRouter>
      {/* The page is the same dark space colour while a screen loads, so there is no flash. */}
      <Suspense fallback={<div className="min-h-dvh bg-space" />}>
        <Routes>
          <Route path={routes.welcome} element={<WelcomeScreen />} />
          <Route path={routes.briefing} element={<BriefingScreen />} />
          <Route path={routes.learnToSurvive} element={<LearnToSurviveScreen />} />
          <Route path={routes.howToPlay} element={<HowToPlayScreen />} />
          <Route path={routes.levels} element={<LevelsScreen />} />
          <Route path="/mission/:missionId" element={<MissionOverviewScreen />} />
          <Route path="/mission/:missionId/play" element={<GameplayScreen />} />
          <Route path="/mission/:missionId/aborted" element={<MissionAbortedScreen />} />
          <Route path="/mission/:missionId/complete" element={<MissionCompleteScreen />} />
          {DevPreviewScreen && <Route path="/dev/:name/:day?" element={<DevPreviewScreen />} />}
          <Route path={routes.sources} element={<PlaceholderScreen title="Science Sources" />} />
          <Route path="*" element={<Navigate to={routes.welcome} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
