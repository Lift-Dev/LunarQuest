import { cn } from '../../design-system';

/**
 * The whole mission at a glance: one segment per day. Daylight days are gold, night days blue.
 * Days already played are solid, today has a white outline, days to come are faint.
 */
export function DayTrack({ day, total, daylightDays }: { day: number; total: number; daylightDays: number }) {
  return (
    <div
      role="img"
      aria-label={`Day ${day} of ${total}`}
      className="flex gap-1"
    >
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const isDay = n <= daylightDays;
        return (
          <span
            key={n}
            className={cn(
              'h-2 w-3 rounded-full max-sm:w-2 md:w-4',
              n < day && (isDay ? 'bg-yellow-400' : 'bg-blue-400'),
              n === day && cn('ring-2 ring-white', isDay ? 'bg-yellow-400' : 'bg-blue-400'),
              n > day && (isDay ? 'bg-yellow-400/25' : 'bg-blue-400/25'),
            )}
          />
        );
      })}
    </div>
  );
}
