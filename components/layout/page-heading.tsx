import type { ReactNode } from 'react';

export function PageHeading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <h1 className="border-b border-dashed border-primary-light pb-3 text-2xl font-extrabold tracking-[0.04em] text-foreground">
        {title}
      </h1>
      {children}
    </section>
  );
}
