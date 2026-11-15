import { routes } from '../app/routes';
import { Button } from '../design-system';

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

      <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10 text-center">
        <h1 className="sr-only">LunarQuest</h1>
        <img
          src="/assets/welcome/logo.png"
          alt="LunarQuest"
          className="w-[clamp(240px,41vh,420px)] drop-shadow-[0_8px_32px_rgb(0_0_0/0.35)]"
        />
        <p className="mt-10 text-[clamp(1.75rem,3.5vh,2.25rem)] leading-tight font-bold text-white text-glow">
          Explore. Survive. Discover.
        </p>
        <p className="mt-3 text-xl text-white/90">A new adventure beyond Earth awaits.</p>
        <Button to={routes.briefing} variant="pill" size="lg" className="mt-12">
          Start
        </Button>
      </div>
    </main>
  );
}
