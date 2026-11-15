import { routes } from '../app/routes';
import { Button, Chip, Mascot, Panel, ScreenBackground } from '../design-system';

/** Screen 2 "Your Mission" — matches image-assets/uxpilot-export-11-14-26 (1).pdf */
export function BriefingScreen() {
  return (
    <ScreenBackground glow="none">
      <main className="mx-auto grid min-h-dvh max-w-[1176px] items-center justify-center gap-12 px-6 py-12 max-sm:gap-8 max-sm:py-8 short:grid-cols-[minmax(0,42vh)_minmax(0,1fr)] short:gap-6 short:py-3 short:safe-x short:[--safe-min:1.5rem] lg:grid-cols-[minmax(0,508px)_minmax(0,552px)] lg:gap-[68px]">
        <div className="relative mx-auto w-full max-w-[min(508px,38vh)] overflow-hidden rounded-3xl max-lg:max-w-xl lg:max-w-[508px] short:max-w-none border-4 border-blue-500/20 shadow-glow-panel">
          <img
            src="/assets/briefing/outpost.jpg"
            alt="A lunar outpost with dome habitats, solar panels, a rover and astronauts"
            className="aspect-square w-full rounded-[20px] object-cover max-lg:aspect-[4/3] short:aspect-square"
          />
          {/* Phones/tablets: the picture fades into the page and the title rises over it. */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-space via-space/70 to-transparent lg:hidden short:hidden" />
        </div>

        <div className="relative flex flex-col items-start max-lg:mx-auto max-lg:-mt-32 max-lg:w-full max-lg:max-w-xl max-lg:px-2 short:mx-0 short:mt-0 short:max-w-none short:px-0">
          <Chip tone="blue">Briefing initiated</Chip>
          <h1 className="mt-2.5 text-[clamp(2.75rem,5vw,3.75rem)] leading-none font-bold uppercase max-sm:text-[2.5rem] short:text-4xl">
            <span className="block text-white text-glow">You are the</span>
            <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgb(96_165_250/0.45)]">
              Mission
              <br />
              Commander
            </span>
          </h1>

          <Panel variant="solid" className="mt-10 w-full max-w-[552px] p-8 max-sm:mt-6 max-sm:p-5 short:mt-3 short:p-3">
            <p className="text-2xl leading-8 text-blue-100 max-sm:text-lg max-sm:leading-7 short:text-base short:leading-snug">
              Humanity is preparing to live beyond Earth. Your job is to lead a space crew, manage an outpost, and
              make decisions that keep everyone alive.
            </p>
            <p className="mt-6 border-l-4 border-blue-500 pl-6 text-xl leading-7 max-sm:mt-4 max-sm:pl-4 max-sm:text-base max-sm:leading-6 short:mt-2 short:pl-3 short:text-base short:leading-snug text-blue-200/80 italic">
              Every decision matters. Can you survive and make new discoveries?
            </p>
          </Panel>

          <div className="mt-10 flex flex-wrap items-center gap-6 max-sm:mt-6 max-sm:gap-4 short:mt-3 short:gap-4">
            <Button to={routes.learnToSurvive} variant="primary" size="lg" chevron>
              Continue
            </Button>
            <Mascot pose="excited" height="7.5rem" say="Let's go!" bubble="right" />
          </div>
        </div>
      </main>
    </ScreenBackground>
  );
}
