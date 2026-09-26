import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function PageHeading({
  title,
  wide = false,
  action,
  children,
}: {
  title: string;
  wide?: boolean;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      className={cn(
        'mx-auto flex w-full flex-col gap-6 px-4 py-8',
        wide ? 'max-w-6xl' : 'max-w-3xl',
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-dashed border-primary-light pb-3">
        <h1 className="text-2xl font-extrabold tracking-[0.04em] text-foreground">
          {title}
        </h1>
        {action}
      </div>
      {children}
    </section>
  );
}
