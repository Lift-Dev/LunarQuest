import { routes } from '../app/routes';
import { Button, Panel, ProgressBar, ScreenBackground, type ResourceTone, Mascot } from '../design-system';
import { asset } from '../lib/asset';

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
    icon: asset('assets/resources/life-support.png'),
    text: 'Keep enough oxygen for your crew.',
    bar: 'Oxygen level',
    value: 85,
  },
  {
    tone: 'power',
    title: 'Power',
    titleClass: 'text-power',
    icon: asset('assets/resources/power.png'),
    text: 'Keep your outpost running.',
    bar: 'Energy core',
    value: 62,
  },
  {
    tone: 'radiation',
    title: 'Radiation',
    titleClass: 'text-radiation',
    icon: asset('assets/resources/radiation.png'),
    text: 'Protect your crew. Radiation adds up and never goes away.',
    bar: 'Radiation dose',
    value: 6,
  },
];

export function LearnToSurviveScreen() {
  return (
    <ScreenBackground glow="center" stars={false}>
      <main className="flex min-h-dvh flex-col items-center px-6 pt-11 pb-12 text-center max-sm:px-4 max-sm:pt-8 max-sm:pb-8 short:safe-x short:[--safe-min:1.5rem] short:pt-3 short:pb-3">
        <h1 className="text-[clamp(2.25rem,4vw,3rem)] leading-none font-bold text-white uppercase text-glow max-sm:text-[1.75rem] short:text-3xl">
          Three resources. One mission.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-7 text-blue-200 max-sm:mt-4 max-sm:text-base max-sm:leading-6 short:mt-1 short:text-base short:leading-snug">
          Keep an eye on these resources. If any reaches a critical level, your mission will be aborted.
        </p>

        <div className="flex w-full flex-1 items-center py-10 max-sm:py-6 short:py-2">
          <ul className="mx-auto grid w-full max-w-6xl gap-8 max-sm:gap-4 md:grid-cols-3 short:grid-cols-3 short:gap-3">
            {RESOURCES.map((r) => (
              <li key={r.tone}>
                <Panel variant="card" className="flex h-full flex-col items-center p-8 max-sm:p-5 short:p-3">
                  <img src={r.icon} alt="" aria-hidden className="size-32 object-contain max-sm:size-20 short:size-14" />
                  <h2 className={`mt-6 text-2xl font-bold uppercase max-sm:mt-3 short:mt-1 short:text-xl ${r.titleClass}`}>{r.title}</h2>
                  <p className="mt-3 text-base text-blue-100/80 short:mt-1 short:text-base short:leading-snug">{r.text}</p>
                  <ProgressBar tone={r.tone} label={r.bar} value={r.value} className="mt-5 text-left short:mt-2" />
                </Panel>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 max-sm:gap-4">
          <Mascot pose="pointing" height="7.5rem" say="Keep all three safe!" bubble="right" />
          <Button to={routes.howToPlay} variant="raised" size="lg">
            Next
          </Button>
        </div>
      </main>
    </ScreenBackground>
  );
}
