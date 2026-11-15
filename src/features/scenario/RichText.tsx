import { Fragment } from 'react';

/** Renders the `**bold**` markers used in scenario text. Nothing else is interpreted. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) => (
        <Fragment key={i}>{i % 2 === 1 ? <strong className="font-bold text-white">{part}</strong> : part}</Fragment>
      ))}
    </>
  );
}
