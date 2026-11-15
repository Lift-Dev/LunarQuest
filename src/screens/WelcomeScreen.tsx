import { routes } from '../app/routes';
import { Button, Mascot } from '../design-system';

/** Screen 1 — matches image-assets/uxpilot-export-11-14-26.pdf */
export function WelcomeScreen() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-space">
      <img
        src="/assets/welcome/background.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover object-[60%_center]"
      />
      {/* Darkens the lower half so the white text stays readable, as in the design. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-space/10 to-space/80" />

      <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10 text-center short:py-2">
        <h1 className="sr-only">LunarQuest</h1>
        <img
          src="/assets/welcome/logo.png"
          alt="LunarQuest"
          className="w-[clamp(240px,41vh,420px)] max-sm:w-[min(80vw,320px)] short:w-[clamp(150px,34vh,300px)] drop-shadow-[0_8px_32px_rgb(0_0_0/0.35)]"
        />
        <p className="mt-10 short:mt-2 text-[clamp(1.75rem,3.5vh,2.25rem)] leading-tight font-bold text-white text-glow">
          Explore. Survive. Discover.
        </p>
        <p className="mt-3 text-xl text-white/90 short:mt-1 short:text-base">A new adventure beyond Earth awaits.</p>
        <Button to={routes.briefing} variant="pill" size="lg" className="mt-12 short:mt-3">
          Start
        </Button>
        {/* Phones in portrait: the robot sits under the button. From sm up it stands in the corner, as in the design. */}
        <Mascot
          pose="waving"
          height="clamp(9rem, 24vh, 14rem)"
          say="Hi, Commander!"
          className="mt-8 sm:absolute sm:right-[4vw] sm:bottom-[4vh] sm:mt-0"
        />
      </div>
    </main>
  );
}
