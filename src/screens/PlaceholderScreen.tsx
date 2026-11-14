import { Link } from 'react-router';

interface Props {
  title: string;
  next?: { label: string; to: string };
}

/** Temporary stand-in until each screen is built in Phase 4. */
export function PlaceholderScreen({ title, next }: Props) {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-xs tracking-[0.2em] text-blue-300/70 uppercase">Placeholder · Phase 4</p>
      <h1 className="text-3xl font-bold tracking-wide uppercase">{title}</h1>
      {next && (
        <Link
          to={next.to}
          className="rounded-full bg-blue-600 px-8 py-3 font-bold tracking-wide uppercase hover:bg-blue-500"
        >
          {next.label}
        </Link>
      )}
    </main>
  );
}
