import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { routes } from '../app/routes';
import { Button, Panel, ScreenBackground } from '../design-system';

/** "How to Play" — matches image-assets/Explore, Decide, Survive_ Moon Mission Tutorial.png */
const steps = [
  { icon: '/assets/how-to-play/observe.png', title: 'Observe', text: 'Read the situation.' },
  { icon: '/assets/how-to-play/investigate.png', title: 'Investigate', text: 'Check the equipment on the map.' },
  { icon: '/assets/how-to-play/decide.png', title: 'Decide & Discover', text: 'Choose between options and make progress.' },
];

export function HowToPlayScreen() {
  return (
    <ScreenBackground scene>
      <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] leading-none font-bold text-white text-glow">
          Explore. Decide. <span className="text-blue-400">Survive.</span>
        </h1>
        <p className="mt-4 text-xl text-blue-100/90">Follow these simple steps to complete your mission.</p>

        <ol className="mt-16 flex w-full flex-col items-stretch gap-6 md:flex-row md:items-center">
          {steps.map((step, i) => (
            <Fragment key={step.title}>
              {i > 0 && <ChevronRight aria-hidden className="hidden size-8 shrink-0 text-blue-400 md:block" strokeWidth={3} />}
              <li className="relative flex-1">
                <span className="absolute -top-5 left-1/2 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-full border-2 border-blue-300 bg-blue-600 text-2xl font-bold text-white shadow-glow-blue">
                  {i + 1}
                </span>
                <Panel variant="solid" className="flex h-full flex-col items-center px-5 pt-9 pb-7">
                  <img
                    src={step.icon}
                    alt=""
                    aria-hidden
                    className="h-24 object-contain [mask-image:radial-gradient(closest-side,#000_70%,transparent)]"
                  />
                  <h2 className="mt-4 text-2xl font-bold text-white">{step.title}</h2>
                  <p className="mt-2 text-lg leading-6 text-blue-100/80">{step.text}</p>
                </Panel>
              </li>
            </Fragment>
          ))}
        </ol>

        <Button to={routes.levels} variant="primary" size="lg" chevron className="mt-14">
          Continue
        </Button>
      </main>
    </ScreenBackground>
  );
}
