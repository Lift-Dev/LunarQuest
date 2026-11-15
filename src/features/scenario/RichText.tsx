import { Fragment } from 'react';

/** Renders the `**bold**` markers used in scenario text. Nothing else is interpreted. */
export function RichText({ text, strongClass = 'text-white' }: { text: string; strongClass?: string }) {
  return (
    <>
      {text.split('**').map((part, i) => (
        <Fragment key={i}>{i % 2 === 1 ? <strong className={`font-bold ${strongClass}`}>{part}</strong> : part}</Fragment>
      ))}
    </>
  );
}
