import type { ReactNode } from 'react';

import { Wordmark } from '@/components/layout/wordmark';

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-1 flex-col items-center px-4 py-12">
      <Wordmark decorated />
      <div className="mt-8 w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-extrabold tracking-[0.04em] text-foreground">
          {title}
        </h1>
        {children}
      </div>
    </section>
  );
}
