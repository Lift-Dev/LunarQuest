import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';

/** Top-left navigation pill used on every screen after the intro: "← Back" or "⌂ Home". */
export function NavPill({ to, icon = 'back', children }: { to: string; icon?: 'back' | 'home'; children: ReactNode }) {
  const Icon = icon === 'home' ? Home : ArrowLeft;
  return (
    <Link
      to={to}
      className="absolute top-6 left-6 z-10 inline-flex items-center gap-3 rounded-full border-2 border-blue-400/50 bg-slate-950/70 py-2 pr-6 pl-2 text-lg font-bold text-white uppercase backdrop-blur-sm transition hover:bg-slate-900/80"
    >
      <span className="grid size-9 place-items-center rounded-full bg-blue-600 shadow-glow-blue">
        <Icon aria-hidden className="size-5" strokeWidth={2.75} />
      </span>
      {children}
    </Link>
  );
}
