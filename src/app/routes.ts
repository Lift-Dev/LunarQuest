/** Every URL in the app, in one place. Screens navigate with these helpers, never string literals. */
export const routes = {
  welcome: '/',
  briefing: '/briefing',
  learnToSurvive: '/learn-to-survive',
  howToPlay: '/how-to-play',
  levels: '/levels',
  missionOverview: (missionId: string) => `/mission/${missionId}`,
  play: (missionId: string) => `/mission/${missionId}/play`,
  aborted: (missionId: string) => `/mission/${missionId}/aborted`,
  complete: (missionId: string) => `/mission/${missionId}/complete`,
  sources: '/sources',
} as const;
