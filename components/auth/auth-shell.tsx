import type { ReactNode } from 'react';

import { Wordmark } from '@/components/layout/wordmark';

const notes = [
  {
    title: 'What kudos is',
    body: 'Kudos comes from the Greek word for glory. It means praise said in public, not a quiet thank-you. On this wall, one kudos is a short note from you to one teammate, marked with a sticker for the kind of praise it is.',
  },
  {
    title: 'Why you give it',
    body: 'Good work fades if nobody names it. You give kudos so the person, the moment, and the reason stay visible to the team. The note comes from your account. You choose someone else. You cannot give kudos to yourself.',
  },
  {
    title: 'The culture',
    body: 'Recognition is a workplace culture, not a custom of one country. In many teams, praise waits for a manager or a review. This wall is the smaller habit: say it while it is fresh, say it where the team can read it, and leave it with the person who earned it.',
  },
] as const;

export function AuthShell({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-3">
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,22rem)] lg:gap-8">
        <div className="order-1 border-l-[6px] border-l-accent bg-card px-5 py-4 shadow-card lg:order-2">
          <h1 className="text-2xl font-extrabold tracking-[0.04em] text-foreground">
            {title}
          </h1>
          <p className="mt-1 mb-3 max-w-[40ch] text-base leading-relaxed text-foreground">
            {lede}
          </p>
          {children}
        </div>
        <div className="order-2 flex min-w-0 flex-col gap-2 lg:order-1">
          <Wordmark decorated dense />
          <div className="border-l-[6px] border-l-primary bg-card shadow-card">
            {notes.map((note) => (
              <article
                key={note.title}
                className="border-b border-dashed border-primary-light px-4 py-2.5 last:border-b-0"
              >
                <h2 className="text-base font-extrabold tracking-[0.04em] text-foreground">
                  {note.title}
                </h2>
                <p className="mt-1 max-w-[65ch] text-base leading-relaxed text-foreground">
                  {note.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
