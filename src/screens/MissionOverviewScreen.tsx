import { CalendarDays, Moon, Sun } from 'lucide-react';
import { Navigate, useParams } from 'react-router';
import { routes } from '../app/routes';
import { levels } from '../data/levels';
import { enterImmersive } from '../lib/immersive';
import { Button, NavPill, Panel, ScreenBackground, Mascot } from '../design-system';

/** Mission Overview — matches image-assets/Lunar Outpost Mission Briefing.png */
export function MissionOverviewScreen() {
  const { missionId } = useParams();
  const level = levels.find((l) => l.contentId === missionId);
  // Locked or unknown missions can't be opened by URL (test #12).
  if (!level || level.number > 1) return <Navigate to={routes.levels} replace />;

  return (
    <ScreenBackground scene="outpost">
      <NavPill to={routes.levels}>Back</NavPill>
      <main className="mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-6 px-6 py-24 max-sm:px-4 max-sm:pt-20 max-sm:pb-10 short:safe-x short:[--safe-min:1.5rem] short:gap-3 short:pt-12 short:pb-4 lg:items-end">
        <div className="flex w-full max-w-[1000px] flex-col items-center gap-6 short:gap-3">
          <h1 className="text-center text-[clamp(2rem,3.5vw,2.75rem)] leading-none font-bold text-white uppercase text-glow max-sm:text-[1.75rem] max-sm:leading-tight short:text-2xl">
            Mission 01 — <span className="text-blue-400">{level.title}</span>
          </h1>

          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 rounded-full border-2 border-blue-400/40 bg-slate-950/70 px-8 py-3 text-lg text-white backdrop-blur-sm max-sm:flex-col max-sm:gap-y-1 max-sm:rounded-2xl max-sm:px-5 max-sm:text-base short:gap-x-5 short:py-1 short:text-sm">
            <Fact icon={<CalendarDays aria-hidden className="size-6 text-blue-300" />}>14 Earth Days</Fact>
            <Fact icon={<Sun aria-hidden className="size-6 text-yellow-300" />}>7 Days of Daylight</Fact>
            <Fact icon={<Moon aria-hidden className="size-6 text-blue-200" />}>7 Days of Night</Fact>
          </ul>

          <Panel variant="solid" className="relative mt-4 w-full p-6 pt-9 max-sm:p-4 max-sm:pt-8 short:mt-2 short:p-3 short:pt-7">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-blue-300 bg-blue-600 px-8 py-1 text-lg font-bold tracking-wide whitespace-nowrap text-white uppercase shadow-glow-blue">
              Mission Briefing
            </span>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <img
                src="/assets/briefing/outpost.jpg"
                alt="A lunar outpost with a dome habitat, solar panels and a rover"
                className="size-44 shrink-0 self-center rounded-xl max-sm:size-32 short:size-24 object-cover"
              />
              <div className="space-y-4 text-xl leading-7 text-blue-100 max-sm:space-y-3 max-sm:text-base max-sm:leading-6 short:space-y-1 short:text-sm short:leading-5">
                <p>
                  Your crew has arrived at a lunar outpost for a 14-day mission. Collect samples, gather scientific
                  data, and explore the surrounding environment.
                </p>
                <p>
                  But first, you must keep the crew alive. Manage oxygen, power, and radiation carefully. Every
                  decision matters.
                </p>
              </div>
            </div>
          </Panel>

          <div className="grid w-full gap-4 sm:grid-cols-2 short:gap-2">
            <Goal icon="/assets/overview/survive.png" title="Survive" tone="text-cyan-300">
              Keep the crew safe and the outpost operational for 14 days.
            </Goal>
            <Goal icon="/assets/overview/explore.png" title="Explore" tone="text-yellow-300">
              Collect lunar samples and scientific data.
            </Goal>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-6 max-sm:gap-3 short:mt-0">
            {/* The tap is what lets the browser go full screen and turn sideways on phones. */}
            <Button to={routes.play(missionId!)} variant="primary" size="lg" chevron onClick={() => void enterImmersive()}>
              Begin Mission
            </Button>
            <Mascot pose="determined" height="7rem" say="I'm ready. Are you?" bubble="right" />
          </div>
        </div>
      </main>
    </ScreenBackground>
  );
}

function Fact({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      {icon}
      {children}
    </li>
  );
}

function Goal({ icon, title, tone, children }: { icon: string; title: string; tone: string; children: React.ReactNode }) {
  return (
    <Panel variant="solid" className="flex items-center gap-5 p-5 max-sm:gap-4 max-sm:p-4 short:gap-3 short:p-2.5">
      <img src={icon} alt="" aria-hidden className="h-20 w-auto shrink-0 max-sm:h-14 short:h-12 [mask-image:radial-gradient(closest-side,#000_70%,transparent)]" />
      <div>
        <h2 className={`text-2xl font-bold uppercase short:text-lg ${tone}`}>{title}</h2>
        <p className="mt-1 text-lg leading-6 text-blue-100/90 max-sm:text-base short:mt-0 short:text-sm short:leading-4">{children}</p>
      </div>
    </Panel>
  );
}
