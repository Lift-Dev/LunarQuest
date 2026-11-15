import { Star } from 'lucide-react';
import { cn } from './cn';

/** 0–5 science stars. Outline stars match the Levels design; earned stars are filled gold. */
interface Props {
  earned: number;
  size?: 'sm' | 'md';
  /** Locked levels use a darker outline (slate-600 instead of slate-500). */
  dim?: boolean;
  className?: string;
}

export function StarRating({ earned, size = 'md', dim = false, className }: Props) {
  const px = size === 'md' ? 'size-6' : 'size-[18px]';
  return (
    <div className={cn('flex gap-1', className)} role="img" aria-label={`${earned} of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) =>
        i < earned ? (
          <Star key={i} aria-hidden className={cn(px, 'fill-star text-star')} strokeWidth={1.5} />
        ) : (
          <Star key={i} aria-hidden className={cn(px, dim ? 'text-slate-600' : 'text-slate-500')} strokeWidth={1.75} />
        ),
      )}
    </div>
  );
}
