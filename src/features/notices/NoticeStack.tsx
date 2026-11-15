import { X } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect } from 'react';
import type { Notice } from '../../game/notices';
import { cn } from '../../design-system';

/**
 * Short notices under the HUD: "night has fallen" and "resource is getting low".
 * Sits in the layout under the HUD so it never covers the scenario. Blue = information, red = warning. Each closes by itself after 6 s or with the ✕ button.
 * Text is kept to one title and one sentence, for ages 7–12.
 */
const copy = {
  night: { title: 'Night has fallen', text: 'No sunlight now. Power drops every day.' },
  lifeSupport: { title: 'Air is getting low', text: 'Careful, the crew needs air.' },
  power: { title: 'Power is getting low', text: 'The batteries are running down.' },
  radiation: { title: 'Radiation is getting high', text: 'It only goes up. Protect the crew.' },
} as const;

const SHOW_MS = 6000;

export function NoticeStack({ notices, onDismiss }: { notices: Notice[]; onDismiss: (id: string) => void }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative z-20 flex flex-col items-start gap-3 empty:hidden short:absolute short:top-12 short:left-1/2 short:w-[min(26rem,60vw)] short:-translate-x-1/2 short:gap-1.5">
        <AnimatePresence>
          {notices.map((n) => (
            <NoticeCard key={n.id} notice={n} onDismiss={() => onDismiss(n.id)} />
          ))}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function NoticeCard({ notice, onDismiss }: { notice: Notice; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, SHOW_MS);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const night = notice.kind === 'night';
  const { title, text } = copy[night ? 'night' : notice.resource];

  return (
    <motion.div
      role={night ? 'status' : 'alert'}
      layout
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'flex w-full max-w-md items-center gap-4 rounded-2xl border-2 bg-slate-950/90 py-3 pr-3 pl-4 backdrop-blur-md max-sm:gap-3 short:gap-2 short:py-1.5 short:pl-3',
        night ? 'border-blue-400/60' : 'border-red-400/70',
      )}
    >
      {/* The robot: thoughtful at nightfall, holding a warning sign when something runs low. */}
      <img
        src={`/assets/mascot/${night ? 'pondering' : 'caution'}.webp`}
        alt=""
        aria-hidden
        className="-my-1 h-16 w-auto shrink-0 max-sm:h-12 short:h-10"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xl leading-6 font-bold text-white short:text-base short:leading-5">{title}</p>
        <p className="text-base leading-5 text-blue-100/85 short:text-sm">{text}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Close notice"
        className="grid size-9 shrink-0 place-items-center rounded-full text-blue-200 transition hover:bg-white/10"
      >
        <X aria-hidden className="size-5" />
      </button>
    </motion.div>
  );
}
