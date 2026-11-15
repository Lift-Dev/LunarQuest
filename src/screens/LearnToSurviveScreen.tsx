import { routes } from '../app/routes';
import { Button, Panel, ProgressBar, ScreenBackground, type ResourceTone, Mascot } from '../design-system';

/**
 * Screen 3 — matches image-assets/uxpilot-export-11-14-26 (2).pdf, with the
 * approved change: Radiation shows a DOSE that fills up (docs/SCENARIOS_MISSION_01.md §0).
 */
const RESOURCES: Array<{
  tone: ResourceTone;
  title: string;
  titleClass: string;
  icon: string;
  text: string;
  bar: string;
  value: number;
}> = [
  {
    tone: 'life',
    title: 'Life Support',
    titleClass: 'text-life',
    icon: '/assets/resources/life-support.png',
    text: 'Keep enough oxygen for your crew.',
    bar: 'Oxygen level',
    value: 85,
  },
  {
    tone: 'power',
    title: 'Power',
    titleClass: 'text-power',
    icon: '/assets/resources/power.png',
    text: 'Keep your outpost running.',
    bar: 'Energy core',
    value: 62,
  },
  {
    tone: 'radiation',
    title: 'Radiation',
    titleClass: 'text-radiation',
    icon: '/assets/resources/radiation.png',
    text: 'Protect your crew. Radiation adds up and never goes away.',
    bar: 'Radiation dose',
    value: 6,
  },
];

export function LearnToSurviveScreen() {
  return (
    <ScreenBackground glow="center" stars={false}>
      <main className="flex min-h-dvh flex-col items-center px-6 pt-11 pb-12 text-center">
        <h1 className="text-[clamp(2.25rem,4vw,3rem)] leading-none font-bold text-white uppercase text-glow">
          Three resources. One mission.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-7 text-blue-200">
          Keep an eye on these resources. If any reaches a critical level, your mission will be aborted.
        </p>

        <div className="flex w-full flex-1 items-center py-10">
          <ul className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-3">
            {RESOURCES.map((r) => (
              <li key={r.tone}>
                <Panel variant="card" className="flex h-full flex-col items-center p-8">
                  <img src={r.icon} alt="" aria-hidden className="size-32 object-contain" />
                  <h2 className={`mt-6 text-2xl font-bold uppercase ${r.titleClass}`}>{r.title}</h2>
                  <p className="mt-3 text-base text-blue-100/80">{r.text}</p>
                  <ProgressBar tone={r.tone} label={r.bar} value={r.value} className="mt-5 text-left" />
                </Panel>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-6">
          <Mascot pose="pointing" height="7.5rem" say="Keep all three safe!" bubble="right" />
          <Button to={routes.howToPlay} variant="raised" size="lg">
            Next
          </Button>
        </div>
      </main>
    </ScreenBackground>
  );
}
