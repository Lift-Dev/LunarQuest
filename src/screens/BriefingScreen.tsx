import { routes } from '../app/routes';
import { Button, Chip, Mascot, Panel, ScreenBackground } from '../design-system';

/** Screen 2 "Your Mission" — matches image-assets/uxpilot-export-11-14-26 (1).pdf */
export function BriefingScreen() {
  return (
    <ScreenBackground glow="none">
      <main className="mx-auto grid min-h-dvh max-w-[1176px] items-center justify-center gap-12 px-6 py-12 lg:grid-cols-[minmax(0,508px)_minmax(0,552px)] lg:gap-[68px]">
        <div className="mx-auto w-full max-w-[min(508px,38vh)] rounded-3xl lg:max-w-[508px] border-4 border-blue-500/20 shadow-glow-panel">
          <img
            src="/assets/briefing/outpost.jpg"
            alt="A lunar outpost with dome habitats, solar panels, a rover and astronauts"
            className="aspect-square w-full rounded-[20px] object-cover"
          />
        </div>

        <div className="flex flex-col items-start">
          <Chip tone="blue">Briefing initiated</Chip>
          <h1 className="mt-2.5 text-[clamp(2.75rem,5vw,3.75rem)] leading-none font-bold uppercase">
            <span className="block text-white text-glow">You are the</span>
            <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgb(96_165_250/0.45)]">
              Mission
              <br />
              Commander
            </span>
          </h1>

          <Panel variant="solid" className="mt-10 w-full max-w-[552px] p-8">
            <p className="text-2xl leading-8 text-blue-100">
              Humanity is preparing to live beyond Earth. Your job is to lead a space crew, manage an outpost, and
              make decisions that keep everyone alive.
            </p>
            <p className="mt-6 border-l-4 border-blue-500 pl-6 text-xl leading-7 text-blue-200/80 italic">
              Every decision matters. Can you survive and make new discoveries?
            </p>
          </Panel>

          <div className="mt-10 flex items-center gap-6">
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
