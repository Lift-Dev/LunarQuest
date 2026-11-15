import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { cn } from './cn';

/**
 * Button styles found in the designs (sizes measured at 1440px width):
 * - `pill`    Welcome START (264×80, text 36px) and Levels START (149×56, text 24px)
 * - `primary` Briefing CONTINUE › (blue gradient, glow)
 * - `raised`  Learn to Survive NEXT (blue→indigo gradient, darker bottom edge)
 * - `ghost`   Secondary actions on screens not yet designed (outlined)
 */
export type ButtonVariant = 'pill' | 'primary' | 'raised' | 'ghost';
export type ButtonSize = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-bold tracking-wide text-white uppercase select-none ' +
  'transition duration-150 hover:brightness-110 active:translate-y-px disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  pill: 'rounded-full bg-blue-600 shadow-glow-blue',
  primary: 'rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 shadow-glow-blue',
  raised: 'rounded-xl border-b-4 border-blue-800 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-glow-blue-lg',
  ghost: 'rounded-xl border border-blue-400/40 bg-slate-900/60 text-blue-100 hover:bg-slate-800/80',
};

const sizes: Record<ButtonVariant, Record<ButtonSize, string>> = {
  pill: { md: 'px-10 py-3 text-2xl', lg: 'px-20 py-5 text-4xl' },
  primary: { md: 'px-8 py-3 text-xl', lg: 'px-12 py-5 text-2xl' },
  raised: { md: 'px-12 py-3 text-xl', lg: 'px-20 py-5 text-2xl' },
  ghost: { md: 'px-6 py-3 text-lg', lg: 'px-10 py-4 text-2xl' },
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows the › chevron after the label (Briefing CONTINUE). */
  chevron?: boolean;
  className?: string;
  children: ReactNode;
}

type AsLink = CommonProps & { to: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'to' | 'className' | 'children'>;
type AsButton = CommonProps & { to?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;

export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', size = 'lg', chevron = false, className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[variant][size], className);
  const content = (
    <>
      {children}
      {chevron && <ChevronRight aria-hidden className="size-[1em]" strokeWidth={3} />}
    </>
  );

  if (rest.to !== undefined) {
    return (
      <Link {...(rest as Omit<AsLink, keyof CommonProps>)} className={classes}>
        {content}
      </Link>
    );
  }
  const { type = 'button', ...buttonRest } = rest as Omit<AsButton, keyof CommonProps>;
  return (
    <button type={type} {...buttonRest} className={classes}>
      {content}
    </button>
  );
}
