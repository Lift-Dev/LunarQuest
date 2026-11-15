import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { routes } from '../app/routes';
import { Button, Mascot, Panel, ScreenBackground } from '../design-system';

/** "How to Play" — matches image-assets/Explore, Decide, Survive_ Moon Mission Tutorial.png */
const steps = [
  { icon: '/assets/how-to-play/observe.png', title: 'Observe', text: 'Read the situation.' },
  { icon: '/assets/how-to-play/investigate.png', title: 'Investigate', text: 'Check the equipment on the map.' },
  { icon: '/assets/how-to-play/decide.png', title: 'Decide & Discover', text: 'Choose between options and make progress.' },
];

export function HowToPlayScreen() {
  return (
    <ScreenBackground scene>
      <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-6 py-12 text-center max-sm:px-4 max-sm:py-10 short:safe-x short:[--safe-min:1.5rem] short:py-3">
        <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] leading-none font-bold text-white text-glow max-sm:text-[2rem] short:text-4xl">
          Explore. Decide. <span className="text-blue-400">Survive.</span>
        </h1>
        <p className="mt-4 text-xl text-blue-100/90 max-sm:text-base short:mt-1 short:text-base">Follow these simple steps to complete your mission.</p>

        <ol className="mt-16 flex w-full flex-col items-stretch gap-6 max-sm:mt-12 max-sm:gap-8 md:flex-row md:items-center short:mt-8 short:flex-row short:items-center short:gap-3">
          {steps.map((step, i) => (
            <Fragment key={step.title}>
              {i > 0 && <ChevronRight aria-hidden className="hidden size-8 shrink-0 text-blue-400 md:block short:block short:size-5" strokeWidth={3} />}
              <li className="relative flex-1">
                <span className="absolute -top-5 left-1/2 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-full border-2 border-blue-300 bg-blue-600 text-2xl font-bold text-white shadow-glow-blue">
                  {i + 1}
                </span>
                <Panel variant="solid" className="flex h-full flex-col items-center px-5 pt-9 pb-7 short:px-3 short:pt-7 short:pb-3">
                  <img
                    src={step.icon}
                    alt=""
                    aria-hidden
                    className="h-24 object-contain short:h-12 [mask-image:radial-gradient(closest-side,#000_70%,transparent)]"
                  />
                  <h2 className="mt-4 text-2xl font-bold text-white short:mt-1 short:text-xl">{step.title}</h2>
                  <p className="mt-2 text-lg leading-6 text-blue-100/80 short:mt-0.5 short:text-base short:leading-snug">{step.text}</p>
                </Panel>
              </li>
            </Fragment>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 max-sm:mt-8 max-sm:gap-4 short:mt-4">
          <Mascot pose="curious" height="7.5rem" say="Tip: tap the outpost to explore it!" bubble="right" />
          <Button to={routes.levels} variant="primary" size="lg" chevron>
            Continue
          </Button>
        </div>
      </main>
    </ScreenBackground>
  );
}
