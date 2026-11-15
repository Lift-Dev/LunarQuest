import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from './cn';
import { asset } from '../lib/asset';

/**
 * The robot mascot. Poses were cropped from image-assets/mascot-assets/*.png (labels removed)
 * into public/assets/mascot/<pose>.webp. Pick the pose that matches the moment:
 *
 * greeting   waving, happy
 * explaining pointing, curious, thinking, pondering
 * reacting   excited, cheering, surprised, thumbs-up, thumbs-up-wink, proud
 * celebrating celebrating
 * ready      determined
 * danger     alert (red sign), caution (orange sign), worried, confused
 */
export type MascotPose =
  | 'alert'
  | 'caution'
  | 'celebrating'
  | 'cheering'
  | 'confused'
  | 'curious'
  | 'determined'
  | 'excited'
  | 'happy'
  | 'pointing'
  | 'pondering'
  | 'proud'
  | 'surprised'
  | 'thinking'
  | 'thumbs-up'
  | 'thumbs-up-wink'
  | 'waving'
  | 'worried';

export const MASCOT_POSES: readonly MascotPose[] = [
  'alert', 'caution', 'celebrating', 'cheering', 'confused', 'curious', 'determined', 'excited', 'happy',
  'pointing', 'pondering', 'proud', 'surprised', 'thinking', 'thumbs-up', 'thumbs-up-wink', 'waving', 'worried',
];

interface Props {
  pose: MascotPose;
  /** Height in CSS (e.g. "8rem", "clamp(...)"). Width follows the picture. */
  height: string;
  /** Optional short speech bubble. Keep it to a few words. */
  say?: ReactNode;
  /** Which side of the robot the bubble sits on. */
  bubble?: 'left' | 'right' | 'top';
  /** Gentle up-and-down hover. Off for small inline uses. */
  float?: boolean;
  className?: string;
}

export function Mascot({ pose, height, say, bubble = 'left', float = true, className }: Props) {
  return (
    <motion.div
      // Re-pops when the pose changes, so each reaction feels new.
      key={pose}
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className={cn(
        'pointer-events-none flex items-center gap-3 select-none',
        bubble === 'right' && 'flex-row-reverse',
        bubble === 'top' && 'flex-col',
        className,
      )}
    >
      {say && <SpeechBubble side={bubble}>{say}</SpeechBubble>}
      <img
        src={asset(`assets/mascot/${pose}.webp`)}
        alt=""
        aria-hidden
        draggable={false}
        style={{ height }}
        className={cn('w-auto shrink-0 short:max-h-24 drop-shadow-[0_10px_18px_rgb(0_0_0/0.45)]', float && 'animate-float')}
      />
    </motion.div>
  );
}

function SpeechBubble({ side, children }: { side: 'left' | 'right' | 'top'; children: ReactNode }) {
  return (
    <p
      className={cn(
        'relative max-w-[15rem] rounded-2xl bg-white px-4 py-2.5 text-left text-lg leading-6 font-bold max-sm:max-w-[11rem] max-sm:px-3 max-sm:py-2 max-sm:text-base max-sm:leading-5 short:max-w-[11rem] short:px-3 short:py-1.5 short:text-base short:leading-snug text-slate-900 shadow-lg',
        // Little tail pointing at the robot.
        'after:absolute after:size-3.5 after:rotate-45 after:bg-white',
        side === 'left' && 'after:top-1/2 after:-right-1.5 after:-translate-y-1/2',
        side === 'right' && 'after:top-1/2 after:-left-1.5 after:-translate-y-1/2',
        side === 'top' && 'text-center after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2',
      )}
    >
      {children}
    </p>
  );
}
