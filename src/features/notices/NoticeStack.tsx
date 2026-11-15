import { Moon, TriangleAlert, X } from 'lucide-react';
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
      <div className="relative z-20 flex flex-col items-start gap-3 empty:hidden">
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
  const Icon = night ? Moon : TriangleAlert;

  return (
    <motion.div
      role={night ? 'status' : 'alert'}
      layout
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'flex w-full max-w-md items-center gap-4 rounded-2xl border-2 bg-slate-950/90 py-3 pr-3 pl-4 backdrop-blur-md',
        night ? 'border-blue-400/60' : 'border-red-400/70',
      )}
    >
      <span
        className={cn(
          'grid size-12 shrink-0 place-items-center rounded-full',
          night ? 'bg-blue-600 text-white' : 'bg-red-400 text-slate-950',
        )}
      >
        <Icon aria-hidden className="size-6" strokeWidth={2.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xl leading-6 font-bold text-white">{title}</p>
        <p className="text-base leading-5 text-blue-100/85">{text}</p>
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
