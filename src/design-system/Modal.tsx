import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * Centred dialog on a dimmed backdrop (Pause, Settings). The round icon badge sits on the
 * top edge as in the Paused design. Escape calls `onClose`; focus moves into the dialog.
 */
export function Modal({
  title,
  icon: Icon,
  onClose,
  children,
}: {
  title: string;
  icon: LucideIcon;
  onClose?: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-space/70 px-4 backdrop-blur-sm">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative w-full max-w-[540px] rounded-3xl border-2 border-blue-400/60 bg-slate-900/90 px-10 pt-16 pb-10 shadow-glow-panel outline-none"
      >
        <span className="absolute -top-10 left-1/2 grid size-20 -translate-x-1/2 place-items-center rounded-full border-4 border-blue-400/70 bg-slate-900 text-white shadow-glow-blue">
          <Icon aria-hidden className="size-9" strokeWidth={2.5} />
        </span>
        <h2 className="text-center text-4xl font-bold text-white">{title}</h2>
        <div className="mt-6 border-t border-blue-400/30 pt-6">{children}</div>
      </div>
    </div>
  );
}
